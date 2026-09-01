"use client"
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentBusinessId } from "@/lib/business";
import type { Product, ProductCategory, ProductWithCategory } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ensureProductLowStockNotification } from "@/lib/notifications";

function getProductStatus(stock: number, minStock: number) {
  if (stock <= 0) return "Out of Stock" as const;
  if (stock <= minStock) return "Low Stock" as const;
  return "Available" as const;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState(searchParams.get("search") ?? "");
  const [feedback, setFeedback] = useState("");
  const [savedProduct, setSavedProduct] = useState<ProductWithCategory | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const SEARCH_DEBOUNCE_MS = 1000;

  useEffect(() => {
    setProductSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    minStock: "",
  });

  const resetProductForm = () => {
    setNewProduct({ name: "", categoryId: "", price: "", stock: "", minStock: "" });
    setCategorySearch("");
  };

  const getProductFormValues = (product: ProductWithCategory) => ({
    name: product.name,
    categoryId: product.category_id || product.product_categories?.id || "",
    price: String(product.price),
    stock: String(product.stock),
    minStock: String(product.min_stock),
  });

  const openCreateProductModal = () => {
    resetProductForm();
    setIsAddModalOpen(true);
  };

  const openEditProductModal = (product: ProductWithCategory) => {
    setEditingProduct(product);
    setNewProduct(getProductFormValues(product));
    setCategorySearch("");
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: catData } = await supabase
        .from("product_categories")
        .select("*")
        .order("name");
      setCategories(catData ?? []);

      const businessId = await getCurrentBusinessId();
      if (!businessId) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("*, product_categories(*)")
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      const rows = (data ?? []) as (Product & { product_categories: ProductCategory })[];

      setProducts(rows.map((p) => ({ ...p, status: getProductStatus(p.stock, p.min_stock) })));
      setLoading(false);
    };
    loadData();
  }, [searchParams]);

  const handleSaveProduct = async () => {
    const businessId = await getCurrentBusinessId();
    if (!businessId) {
      setFeedback("Bisnis tidak ditemukan. Perbarui profil bisnis Anda terlebih dahulu.");
      return;
    }

    const validated = {
      name: newProduct.name.trim() || "Produk Baru",
      categoryId: newProduct.categoryId || categories[0]?.id || "",
      price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0,
      minStock: Number(newProduct.minStock) || 0,
    };

    if (!validated.categoryId) {
      setFeedback("Pilih kategori produk terlebih dahulu.");
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        business_id: businessId,
        category_id: validated.categoryId,
        name: validated.name,
        price: validated.price,
        stock: validated.stock,
        min_stock: validated.minStock,
      })
      .select("*, product_categories(*)")
      .single();

    if (error) {
      setFeedback(`Gagal menyimpan: ${error.message}`);
      return;
    }

    const category = categories.find((c) => c.id === validated.categoryId);
    const saved: ProductWithCategory = {
      ...(data as Product),
      product_categories: category ?? { id: "", name: "", created_at: "" },
      status: getProductStatus(data.stock, data.min_stock),
    };

    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await ensureProductLowStockNotification(
        {
          id: data.id,
          name: data.name,
          stock: data.stock,
          min_stock: data.min_stock,
          business_id: businessId,
        },
        authData.user.id
      );
    }

    setProducts((prev) => [saved, ...prev]);
    setSavedProduct(saved);
    setIsAddModalOpen(false);
    setIsQRModalOpen(true);
    resetProductForm();
    setFeedback("Produk berhasil ditambahkan.");
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    const businessId = await getCurrentBusinessId();
    if (!businessId) {
      setFeedback("Bisnis tidak ditemukan. Perbarui profil bisnis Anda terlebih dahulu.");
      return;
    }

    const validated = {
      name: newProduct.name.trim() || editingProduct.name,
      categoryId: newProduct.categoryId || editingProduct.category_id || categories[0]?.id || "",
      price: Number(newProduct.price) || editingProduct.price,
      stock: Number(newProduct.stock) || editingProduct.stock,
      minStock: Number(newProduct.minStock) || editingProduct.min_stock,
    };

    if (!validated.categoryId) {
      setFeedback("Pilih kategori produk terlebih dahulu.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: validated.name,
        category_id: validated.categoryId,
        price: validated.price,
        stock: validated.stock,
        min_stock: validated.minStock,
      })
      .eq("id", editingProduct.id);

    if (error) {
      setFeedback(`Gagal update: ${error.message}`);
      return;
    }

    const category = categories.find((c) => c.id === validated.categoryId) ?? editingProduct.product_categories;
    const updatedProduct: ProductWithCategory = {
      ...editingProduct,
      name: validated.name,
      category_id: validated.categoryId,
      price: validated.price,
      stock: validated.stock,
      min_stock: validated.minStock,
      product_categories: category,
      status: getProductStatus(validated.stock, validated.minStock),
    };

    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await ensureProductLowStockNotification(
        {
          id: editingProduct.id,
          name: validated.name,
          stock: validated.stock,
          min_stock: validated.minStock,
          business_id: businessId,
        },
        authData.user.id
      );
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
    );
    setIsEditModalOpen(false);
    setEditingProduct(null);
    resetProductForm();
    setFeedback("Produk berhasil diperbarui.");
  };

  const columns = [
    { key: "id", header: "ID Produk", render: (item: ProductWithCategory) => shortId(item.id) },
    { key: "name", header: "Produk" },
    { key: "categoryName", header: "Kategori", render: (item: ProductWithCategory) => item.product_categories?.name ?? "-" },
    { key: "price", header: "Harga", render: (item: ProductWithCategory) => `Rp ${Number(item.price).toLocaleString('id-ID')}` },
    { key: "stock", header: "Stok" },
    { key: "min_stock", header: "Stok Minimum", render: (item: ProductWithCategory) => item.min_stock ?? "-" },
    {
      key: "status",
      header: "Status",
      render: (item: ProductWithCategory) => (
        <Badge variant={item.status === "Available" ? "success" : item.status === "Low Stock" ? "warning" : "critical"}>
          {item.status}
        </Badge>
      )
    },
    {
      key: "actions",
      header: "Aksi",
      render: (item: ProductWithCategory) => (
        <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => openEditProductModal(item)}>
          Edit
        </Button>
      )
    }
  ];

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (productSearch.trim()) {
        params.set("search", productSearch.trim());
      } else {
        params.delete("search");
      }

      const nextUrl = params.toString() ? `/products?${params.toString()}` : "/products";
      const currentValue = searchParams.get("search") ?? "";

      if (currentValue !== productSearch.trim()) {
        router.replace(nextUrl);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [productSearch, router, searchParams]);

  const handleProductSearch = (value: string) => {
    setProductSearch(value);
  };

  const getProductSearchValue = (product: ProductWithCategory) => {
    return [
      shortId(product.id),
      product.name,
      product.product_categories?.name ?? "",
      Number(product.price).toString(),
      String(product.stock),
      String(product.min_stock),
      product.status,
    ].join(" ").toLowerCase();
  };

  const visibleProducts = products.filter((product) => {
    const term = productSearch.trim().toLowerCase();
    if (!term) return true;
    return getProductSearchValue(product).includes(term);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produk</h1>
          <p className="text-muted text-sm mt-1">Kelola data produk Anda di sini.</p>
        </div>
        <Button onClick={openCreateProductModal}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Produk
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <Input
            placeholder="Cari produk..."
            className="pl-10"
            value={productSearch}
            onChange={(event) => handleProductSearch(event.target.value)}
          />
        </div>
      </div>

      {feedback && <p className="text-sm text-success" role="status">{feedback}</p>}

      {loading ? (
        <p className="text-muted text-sm">Memuat produk...</p>
      ) : (
        <DataTable data={visibleProducts} columns={columns} />
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetProductForm();
        }}
        title="Tambah Produk Baru"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              resetProductForm();
            }}>Batal</Button>
            <Button onClick={handleSaveProduct}>Simpan Produk</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <Input
              placeholder="e.g. Kopi Vanilla"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <Input
                type="number"
                placeholder="20000"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <Input
                placeholder="Cari kategori..."
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                aria-label="Cari kategori"
              />
              <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200" role="listbox" aria-label="Daftar kategori">
                <div className="flex flex-col">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      role="option"
                      aria-selected={newProduct.categoryId === category.id}
                      onClick={() => setNewProduct({ ...newProduct, categoryId: category.id })}
                      className={`w-full px-4 py-3 text-sm font-medium text-left transition-colors border-b last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${newProduct.categoryId === category.id ? "bg-primary/10 text-primary border-primary" : "hover:bg-gray-50 border-gray-200"}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                {filteredCategories.length === 0 && (
                  <p className="px-2 py-3 text-center text-sm text-muted">Kategori tidak ditemukan.</p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stok Saat Ini</label>
              <Input
                type="number"
                placeholder="50"
                value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stok Minimum</label>
              <Input
                type="number"
                placeholder="10"
                value={newProduct.minStock}
                onChange={e => setNewProduct({ ...newProduct, minStock: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
          resetProductForm();
        }}
        title="Edit Produk"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setEditingProduct(null);
              resetProductForm();
            }}>Batal</Button>
            <Button onClick={handleEditProduct}>Simpan Perubahan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Produk</label>
            <Input
              placeholder="e.g. Kopi Vanilla"
              value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <Input
                type="number"
                placeholder="20000"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <Input
                placeholder="Cari kategori..."
                value={categorySearch}
                onChange={e => setCategorySearch(e.target.value)}
                aria-label="Cari kategori"
              />
              <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200" role="listbox" aria-label="Daftar kategori">
                <div className="flex flex-col">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      role="option"
                      aria-selected={newProduct.categoryId === category.id}
                      onClick={() => setNewProduct({ ...newProduct, categoryId: category.id })}
                      className={`w-full px-4 py-3 text-sm font-medium text-left transition-colors border-b last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${newProduct.categoryId === category.id ? "bg-primary/10 text-primary border-primary" : "hover:bg-gray-50 border-gray-200"}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                {filteredCategories.length === 0 && (
                  <p className="px-2 py-3 text-center text-sm text-muted">Kategori tidak ditemukan.</p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stok Saat Ini</label>
              <Input
                type="number"
                placeholder="50"
                value={newProduct.stock}
                onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stok Minimum</label>
              <Input
                type="number"
                placeholder="10"
                value={newProduct.minStock}
                onChange={e => setNewProduct({ ...newProduct, minStock: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        title="Produk Berhasil Ditambahkan"
        footer={
          <Button onClick={() => setIsQRModalOpen(false)}>Tutup</Button>
        }
      >
        <div className="flex flex-col items-center gap-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            {savedProduct && (
              <QRCodeCanvas
                value={JSON.stringify({
                  id: savedProduct.id,
                  name: savedProduct.name,
                })}
                size={200}
              />
            )}
          </div>
          <div className="w-full space-y-2 text-center">
            <h3 className="font-semibold text-lg">{savedProduct?.name}</h3>
            <p className="text-sm text-muted">ID: {savedProduct?.id}</p>
            <p className="text-sm text-muted">Kategori: {savedProduct?.product_categories?.name}</p>
            <p className="text-sm font-medium">Harga: Rp {Number(savedProduct?.price ?? 0).toLocaleString('id-ID')}</p>
            <p className="text-sm text-muted">Stok: {savedProduct?.stock} unit</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}