import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center">Buat Akun</h1>
          <p className="text-muted text-sm mt-2 text-center">Daftar untuk mengelola bisnis Anda dengan AI</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
            <Input type="text" placeholder="Andi Pratama" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama UMKM</label>
            <Input type="text" placeholder="Kopi Senja" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="nama@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Link href="/dashboard" className="block mt-6">
            <Button className="w-full">Buat Akun</Button>
          </Link>
        </form>
        
        <p className="mt-6 text-center text-sm text-muted">
          Sudah punya akun? <Link href="/login" className="text-primary font-medium hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  )
}
