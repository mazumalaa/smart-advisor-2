"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { notifications } from "@/data/mockData"
import { Bell, CheckCheck, Clock3, Inbox, Trash2 } from "lucide-react"

const categoryLabels = {
  all: "Semua",
  inventory: "Inventori",
  sales: "Penjualan",
  transaction: "Transaksi",
  system: "Sistem",
  payment: "Pembayaran",
  recommendation: "Rekomendasi",
} as const

type CategoryFilter = keyof typeof categoryLabels

export default function NotificationsPage() {
  const [filter, setFilter] = useState<CategoryFilter>("all")
  const [items, setItems] = useState(notifications)

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter)
  const unreadCount = items.filter((item) => !item.isRead).length

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)))
  }

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })))
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi</h1>
          <p className="text-muted text-sm mt-1">
            Pantau update penting, aktivitas bisnis, dan pemberitahuan sistem.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleMarkAllRead} type="button">
          <CheckCheck className="h-4 w-4" />
          Tandai semua dibaca
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Total</p>
                <p className="mt-2 text-2xl font-bold">{items.length}</p>
              </div>
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Belum dibaca</p>
                <p className="mt-2 text-2xl font-bold">{unreadCount}</p>
              </div>
              <Inbox className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Prioritas</p>
                <p className="mt-2 text-2xl font-bold">{items.filter((item) => item.priority === "high").length}</p>
              </div>
              <Clock3 className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Daftar Notifikasi</CardTitle>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={filter === value ? "default" : "outline"}
                onClick={() => setFilter(value)}
              >
                {categoryLabels[value]}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
              <p className="font-medium">Tidak ada notifikasi</p>
              <p className="mt-1 text-sm text-muted">Semua pemberitahuan baru akan muncul di sini.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between ${
                  item.isRead ? "border-gray-200 bg-white" : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {categoryLabels[item.category as keyof typeof categoryLabels]}
                    </span>
                    {!item.isRead && (
                      <span className="inline-flex rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-white">
                        Baru
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted">{item.description}</p>
                  </div>

                  <p className="text-xs text-muted">{new Date(item.createdAt).toLocaleString("id-ID")}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium uppercase text-muted">
                    {item.priority}
                  </span>
                  {!item.isRead ? (
                    <Button size="sm" onClick={() => handleMarkRead(item.id)} type="button">
                      Baca
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} type="button" className="gap-1 text-muted hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
