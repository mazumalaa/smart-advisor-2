"use client"
import { useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import type { ProductWithCategory } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "@/components/ui/icons";

export function encodeProductQr(product: ProductWithCategory): string {
  return JSON.stringify({
    t: "p",
    v: 1,
    id: product.id,
    n: product.name,
    p: Number(product.price),
    c: product.product_categories?.name ?? "",
  });
}

interface ProductQrModalProps {
  product: ProductWithCategory | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductQrModal({ product, open, onClose }: ProductQrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!product) return null;

  const value = encodeProductQr(product);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png", 1.0);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${product.name.replace(/[^\w\-]+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <div className="print:hidden">
        <Modal
          isOpen={open}
          onClose={onClose}
          title="QR Code Produk"
          footer={
            <>
              <Button variant="outline" onClick={downloadPng}>
                <Download className="h-4 w-4 mr-2" /> Unduh PNG
              </Button>
              <Button onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" /> Cetak QR
              </Button>
            </>
          }
        >
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <QRCodeCanvas
                ref={canvasRef}
                value={value}
                size={256}
                marginSize={2}
                includeMargin
                level="M"
              />
            </div>
            <div className="w-full space-y-2 text-center">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted">ID: {product.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm text-muted">Kategori: {product.product_categories?.name ?? "-"}</p>
              <p className="text-sm font-medium">
                Harga: Rp {Number(product.price ?? 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </Modal>
      </div>

      <div id="qr-print-area" className="hidden bg-white">
        <div className="flex flex-col items-center gap-4 p-6">
          <QRCodeSVG
            value={value}
            size={512}
            marginSize={2}
            includeMargin
            level="M"
          />
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-xl">{product.name}</h3>
            <p className="text-sm text-gray-600">
              Rp {Number(product.price ?? 0).toLocaleString("id-ID")}
            </p>
            <p className="text-sm text-gray-600">
              ID: {product.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">
              Scan untuk transaksi kasir mobile · {product.product_categories?.name ?? ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
