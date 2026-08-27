"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profileData, businessData } from "@/data/mockData"
import { Mail, MapPin, Phone, Building2, Pencil, CheckCircle2, Save, X } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(profileData)
  const [business, setBusiness] = useState(businessData)
  const [savedMessage, setSavedMessage] = useState("")

  const handleProfileChange = (field: keyof typeof profileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleBusinessChange = (field: keyof typeof businessData, value: string) => {
    setBusiness((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    setSavedMessage("Perubahan profil berhasil disimpan.")
    setTimeout(() => setSavedMessage(""), 2500)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setProfile((prev) => ({ ...prev, profilePhoto: previewUrl }))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profil</h1>
          <p className="text-muted text-sm mt-1">
            Kelola informasi pemilik dan bisnis Anda.
          </p>
        </div>

        {!isEditing ? (
          <Button className="gap-2" onClick={() => setIsEditing(true)} type="button">
            <Pencil className="h-4 w-4" />
            Edit Profil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setIsEditing(false)} type="button">
              <X className="h-4 w-4" />
              Batal
            </Button>
            <Button className="gap-2" onClick={handleSave} type="button">
              <Save className="h-4 w-4" />
              Simpan
            </Button>
          </div>
        )}
      </div>

      {savedMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {savedMessage}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-primary/10">
                  <AvatarImage src={profile.profilePhoto} alt={profile.fullName} />
                  <AvatarFallback>{profile.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90">
                    <Pencil className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{profile.fullName}</h2>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted">{business.businessName}</p>
                <p className="text-xs text-muted mt-1">Status akun aktif</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" />
              Verified owner
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Nama Lengkap</label>
                  <Input
                    value={profile.fullName}
                    onChange={(event) => handleProfileChange("fullName", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Email</label>
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-surface px-3">
                    <Mail className="h-4 w-4 text-muted" />
                    <Input
                      value={profile.email}
                      onChange={(event) => handleProfileChange("email", event.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Nomor Telepon</label>
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-surface px-3">
                    <Phone className="h-4 w-4 text-muted" />
                    <Input
                      value={profile.phone}
                      onChange={(event) => handleProfileChange("phone", event.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Alamat</label>
                  <div className="flex items-start gap-2 rounded-md border border-gray-200 bg-surface px-3 py-2">
                    <MapPin className="mt-2 h-4 w-4 text-muted" />
                    <Input
                      value={profile.address}
                      onChange={(event) => handleProfileChange("address", event.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Nama Lengkap</label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium">
                    {profile.fullName}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Email</label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <Mail className="h-4 w-4 text-muted" />
                    <span>{profile.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Nomor Telepon</label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <Phone className="h-4 w-4 text-muted" />
                    <span>{profile.phone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Alamat</label>
                  <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted" />
                    <span>{profile.address}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Bisnis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Nama Bisnis</label>
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-surface px-3">
                    <Building2 className="h-4 w-4 text-muted" />
                    <Input
                      value={business.businessName}
                      onChange={(event) => handleBusinessChange("businessName", event.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Jenis Usaha</label>
                  <Input
                    value={business.businessType}
                    onChange={(event) => handleBusinessChange("businessType", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Alamat Bisnis</label>
                  <div className="flex items-start gap-2 rounded-md border border-gray-200 bg-surface px-3 py-2">
                    <MapPin className="mt-2 h-4 w-4 text-muted" />
                    <Input
                      value={business.businessAddress}
                      onChange={(event) => handleBusinessChange("businessAddress", event.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Pemilik</label>
                  <Input
                    value={business.ownerName}
                    onChange={(event) => handleBusinessChange("ownerName", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Kontak Bisnis</label>
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-surface px-3">
                    <Phone className="h-4 w-4 text-muted" />
                    <Input
                      value={business.businessPhone}
                      onChange={(event) => handleBusinessChange("businessPhone", event.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Email Bisnis</label>
                  <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-surface px-3">
                    <Mail className="h-4 w-4 text-muted" />
                    <Input
                      value={business.businessEmail}
                      onChange={(event) => handleBusinessChange("businessEmail", event.target.value)}
                      className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Nama Bisnis</label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted" />
                    <span>{business.businessName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Jenis Usaha</label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium">
                    {business.businessType}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Alamat Bisnis</label>
                  <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted" />
                    <span>{business.businessAddress}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Pemilik</label>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium">
                    {business.ownerName}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Kontak Bisnis</label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <Phone className="h-4 w-4 text-muted" />
                    <span>{business.businessPhone}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Email Bisnis</label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    <Mail className="h-4 w-4 text-muted" />
                    <span>{business.businessEmail}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
