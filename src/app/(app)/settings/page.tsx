import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted text-sm mt-1">Kelola profil dan preferensi akun Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Pemilik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input defaultValue="Andi Pratama" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="andi@kopisenja.com" type="email" />
            </div>
          </div>
          <Button>Simpan Profil</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Bisnis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Bisnis</label>
              <Input defaultValue="Kopi Senja" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Usaha</label>
              <Input defaultValue="Coffee Shop" />
            </div>
          </div>
          <Button>Simpan Informasi Bisnis</Button>
        </CardContent>
      </Card>
      
      <div className="pt-4">
        <Button variant="critical">Logout</Button>
      </div>
    </div>
  )
}
