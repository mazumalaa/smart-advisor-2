# Dokumentasi Integrasi Mobile

Dokumen ini menjelaskan kontrak data untuk aplikasi kasir mobile agar dapat berintegrasi dengan sistem backend UMKM Smart Advisor.

## 1. Format QR Code (Versi 2)
Payload QR code harus berupa JSON dengan struktur berikut:

```json
{
  "t": "p",
  "v": 2,
  "id": "<product_id>",
  "b": "<business_id>",
  "n": "<nama_produk>",
  "p": <harga_produk>,
  "c": "<nama_kategori>"
}
```

- `t`: Type (hanya "p" untuk produk).
- `v`: Version (harus >= 2).
- `id`: UUID produk.
- `b`: UUID bisnis (business_id).
- `n`: Nama produk (string).
- `p`: Harga (number).
- `c`: Kategori (string).

## 2. Alur Validasi di Aplikasi Mobile
Aplikasi mobile wajib melakukan langkah berikut sebelum memproses transaksi:

1.  **Otentikasi:** Login menggunakan Supabase Auth.
2.  **Identifikasi Bisnis:** Ambil `business_id` dari profil user yang login dengan melakukan query ke tabel `businesses` dimana `created_by = auth.uid()`.
3.  **Scanning:**
    - Parse JSON dari QR code.
    - Validasi `v >= 2` dan `t === "p"`.
    - **PENTING:** Verifikasi bahwa `b === business_id` user yang login.
    - Jika `b` tidak cocok dengan `business_id` user, tolak transaksi dan tampilkan pesan kesalahan "Produk tidak berasal dari toko ini".
4.  **Transaksi:** Jika valid, proses transaksi sesuai fitur aplikasi kasir.

## 3. Kompatibilitas
QR code versi lama (v1) tidak memiliki `business_id` (`b`) dan harus **ditolak** oleh aplikasi mobile untuk keamanan multi-tenant. Pengguna harus mencetak ulang QR code dari dashboard web jika masih menggunakan v1.
