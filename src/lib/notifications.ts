import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/lib/types";

export type NotificationPriority = "high" | "medium" | "low";
export type NotificationCategory = "inventory" | "sales" | "transaction" | "system" | "payment" | "recommendation";

interface CreateNotificationParams {
  businessId: string;
  userId: string;
  title: string;
  description: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
}

async function createNotification({
  businessId,
  userId,
  title,
  description,
  category,
  priority = "medium",
}: CreateNotificationParams) {
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle || !trimmedDescription) return false;

  const { data: existing } = await supabase
    .from("notifications")
    .select("id")
    .eq("business_id", businessId)
    .eq("user_id", userId)
    .eq("title", trimmedTitle)
    .gte("created_at", new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString())
    .limit(1);

  if (existing && existing.length > 0) {
    return false;
  }

  const { error } = await supabase.from("notifications").insert({
    business_id: businessId,
    user_id: userId,
    title: trimmedTitle,
    description: trimmedDescription,
    category,
    priority,
    is_read: false,
  });

  if (error) {
    console.error("Notification insert failed:", error.message);
    return false;
  }

  return true;
}

export async function createSystemNotification(
  businessId: string,
  userId: string,
  title: string,
  description: string,
  priority: NotificationPriority = "medium"
) {
  return createNotification({
    businessId,
    userId,
    title,
    description,
    category: "system",
    priority,
  });
}

export async function createPaymentNotification(
  businessId: string,
  userId: string,
  paymentMethod: string,
  totalAmount: number,
  status: "success" | "pending" = "success"
) {
  const title = status === "success"
    ? `Pembayaran ${paymentMethod} berhasil`
    : `Pembayaran ${paymentMethod} menunggu konfirmasi`;

  const description = status === "success"
    ? `Transaksi dengan metode ${paymentMethod} sebesar Rp ${totalAmount.toLocaleString("id-ID")} telah berhasil diproses.`
    : `Transaksi dengan metode ${paymentMethod} sebesar Rp ${totalAmount.toLocaleString("id-ID")} masih menunggu konfirmasi.`;

  return createNotification({
    businessId,
    userId,
    title,
    description,
    category: "payment",
    priority: status === "success" ? "medium" : "high",
  });
}

export async function createTransactionNotification(
  businessId: string,
  userId: string,
  transactionId: string,
  totalAmount: number,
  paymentMethod: string,
  productName?: string
) {
  const title = productName
    ? `Transaksi baru: ${productName}`
    : "Transaksi baru berhasil dibuat";

  const description = productName
    ? `Transaksi ${transactionId.slice(0, 8).toUpperCase()} untuk ${productName} senilai Rp ${totalAmount.toLocaleString("id-ID")} melalui ${paymentMethod} berhasil dicatat.`
    : `Transaksi ${transactionId.slice(0, 8).toUpperCase()} senilai Rp ${totalAmount.toLocaleString("id-ID")} melalui ${paymentMethod} berhasil dicatat.`;

  return createNotification({
    businessId,
    userId,
    title,
    description,
    category: "transaction",
    priority: "medium",
  });
}

export async function ensureProductLowStockNotification(
  product: Pick<Product, "id" | "name" | "stock" | "min_stock" | "business_id">,
  userId: string
) {
  if (product.stock > product.min_stock) return;

  const isOutOfStock = product.stock <= 0;
  const title = isOutOfStock
    ? `Stok habis: ${product.name}`
    : `Stok rendah: ${product.name}`;
  const description = isOutOfStock
    ? `Stok ${product.name} sudah habis. Segera lakukan restock untuk menjaga layanan tetap lancar.`
    : `Stok ${product.name} tersisa ${product.stock} unit, di bawah minimum ${product.min_stock}. Segera lakukan restock.`;

  await createNotification({
    businessId: product.business_id,
    userId,
    title,
    description,
    category: "inventory",
    priority: isOutOfStock ? "high" : "medium",
  });

  const recommendedQty = Math.max(product.min_stock - product.stock + 1, 1);
  await createNotification({
    businessId: product.business_id,
    userId,
    title: `Rekomendasi restock: ${product.name}`,
    description: `Disarankan menambah stok ${product.name} sekitar ${recommendedQty} unit agar kembali di atas minimum ${product.min_stock}.`,
    category: "recommendation",
    priority: isOutOfStock ? "high" : "medium",
  });
}

export async function ensureSalesTrendNotification(businessId: string, userId: string) {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - 6);
  currentStart.setHours(0, 0, 0, 0);

  const previousStart = new Date(now);
  previousStart.setDate(now.getDate() - 13);
  previousStart.setHours(0, 0, 0, 0);

  const previousEnd = new Date(now);
  previousEnd.setDate(now.getDate() - 7);
  previousEnd.setHours(0, 0, 0, 0);

  const { data: currentData } = await supabase
    .from("transactions")
    .select("total_amount, created_at")
    .eq("business_id", businessId)
    .eq("status", "Selesai")
    .gte("created_at", currentStart.toISOString())
    .lte("created_at", now.toISOString());

  const { data: previousData } = await supabase
    .from("transactions")
    .select("total_amount, created_at")
    .eq("business_id", businessId)
    .eq("status", "Selesai")
    .gte("created_at", previousStart.toISOString())
    .lt("created_at", previousEnd.toISOString());

  const currentSales = (currentData ?? []).reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0);
  const previousSales = (previousData ?? []).reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0);

  const hasIncreased = previousSales > 0 ? currentSales > previousSales * 1.2 : currentSales > 0;

  if (!hasIncreased || currentSales < 500000) {
    return false;
  }

  const title = "Penjualan naik signifikan";
  const description = `Penjualan 7 hari terakhir mencapai Rp ${currentSales.toLocaleString("id-ID")}, naik dari periode sebelumnya sebesar ${previousSales > 0 ? ((currentSales - previousSales) / previousSales * 100).toFixed(1) : "100"}% .`;

  return createNotification({
    businessId,
    userId,
    title,
    description,
    category: "sales",
    priority: "high",
  });
}
