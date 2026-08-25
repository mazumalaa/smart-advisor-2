import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center">Masuk ke Akun Anda</h1>
          <p className="text-muted text-sm mt-2 text-center">Masuk untuk melihat performa bisnis Anda</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="nama@email.com" defaultValue="andi@kopisenja.com" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              <a href="#" className="text-sm text-primary hover:underline">Lupa password?</a>
            </div>
            <Input type="password" placeholder="••••••••" defaultValue="password123" />
          </div>
          <Link href="/dashboard" className="block mt-6">
            <Button className="w-full">Masuk</Button>
          </Link>
        </form>
        
        <p className="mt-6 text-center text-sm text-muted">
          Belum punya akun? <Link href="/register" className="text-primary font-medium hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  )
}
