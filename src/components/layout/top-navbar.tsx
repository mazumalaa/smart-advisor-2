"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Bell, Search, Menu, X, LayoutDashboard, Package, Receipt, BarChart3, TrendingUp, Lightbulb, Archive, Settings, UserCircle2, LogOut } from "@/components/ui/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { supabase } from "@/lib/supabaseClient"

interface TopNavbarProps {
  userName: string
  businessName: string
  avatarUrl: string | null
}

const GLOBAL_SEARCH_SUGGESTIONS = [
  { title: "Dashboard", path: "/dashboard", keywords: ["dashboard", "beranda", "home", "overview", "ringkasan"], description: "Ringkasan performa bisnis" },
  { title: "Produk", path: "/products", keywords: ["produk", "product", "barang", "item", "catalog", "stok"], description: "Kelola data produk dan stok" },
  { title: "Transaksi", path: "/transactions", keywords: ["transaksi", "penjualan", "sales", "order", "payment", "invoice"], description: "Lihat riwayat penjualan" },
  { title: "Inventori", path: "/inventory", keywords: ["inventori", "inventory", "stock", "restock", "persediaan"], description: "Pantau persediaan barang" },
  { title: "Analitik", path: "/analytics", keywords: ["analitik", "analytics", "report", "laporan", "chart", "grafik"], description: "Analisa kinerja bisnis" },
  { title: "AI Forecast", path: "/forecast", keywords: ["forecast", "prediksi", "ai forecast", "ramalan", "trend"], description: "Prediksi penjualan dan tren" },
  { title: "Rekomendasi", path: "/recommendations", keywords: ["rekomendasi", "recommendation", "saran", "tips"], description: "Rekomendasi strategi bisnis" },
  { title: "Profil", path: "/profile", keywords: ["profil", "profile", "akun", "user", "owner"], description: "Data bisnis dan profil akun" },
  { title: "Notifikasi", path: "/notifications", keywords: ["notifikasi", "notification", "alert", "pesan"], description: "Pemberitahuan penting" },
  { title: "Pengaturan", path: "/settings", keywords: ["pengaturan", "settings", "config", "konfigurasi"], description: "Pengaturan aplikasi" },
]

type GlobalSearchSuggestion = (typeof GLOBAL_SEARCH_SUGGESTIONS)[number]

export function TopNavbar({ userName, businessName, avatarUrl }: TopNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [globalSearch, setGlobalSearch] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<GlobalSearchSuggestion[]>([])
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const SEARCH_DEBOUNCE_MS = 1000

  useEffect(() => {
    if (!globalSearch.trim()) {
      setSearchSuggestions([])
      setIsSearchModalOpen(false)
      return
    }

    const timeout = window.setTimeout(() => {
      const query = globalSearch.trim().toLowerCase()
      const suggestions = GLOBAL_SEARCH_SUGGESTIONS.filter((item) => {
        const searchableText = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase()
        return searchableText.includes(query)
      })

      setSearchSuggestions(suggestions)
      setIsSearchModalOpen(suggestions.length > 0)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [globalSearch])

  const matchedPage = useMemo(() => {
    const query = globalSearch.trim().toLowerCase()
    if (!query) return null

    return GLOBAL_SEARCH_SUGGESTIONS.find((item) => {
      const searchableText = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase()
      return searchableText.includes(query)
    }) ?? null
  }, [globalSearch])

  const handleGlobalSearchSubmit = () => {
    if (!globalSearch.trim()) {
      setIsSearchModalOpen(false)
      return
    }

    if (matchedPage) {
      router.push(matchedPage.path)
      setIsSearchModalOpen(false)
      return
    }

    const suggestions = GLOBAL_SEARCH_SUGGESTIONS.filter((item) => {
      const searchableText = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase()
      return searchableText.includes(globalSearch.trim().toLowerCase())
    })

    setSearchSuggestions(suggestions)
    setIsSearchModalOpen(suggestions.length > 0)
  }

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);
      setUnreadCount(count ?? 0);
    };
    fetchUnreadCount();
  }, [pathname]);

  const handleLogout = async () => {
    setIsLogoutConfirmOpen(false)

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error)
      return
    }

    setIsMenuOpen(false)
    router.push("/login")
    router.refresh()
  }

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Produk", href: "/products", icon: Package },
    { title: "Transaksi", href: "/transactions", icon: Receipt },
    { title: "Inventori", href: "/inventory", icon: Archive },
    { title: "Analitik", href: "/analytics", icon: BarChart3 },
    { title: "AI Forecast", href: "/forecast", icon: TrendingUp },
    { title: "Rekomendasi", href: "/recommendations", icon: Lightbulb },
    { title: "Profil", href: "/profile", icon: UserCircle2 },
    { title: "Notifikasi", href: "/notifications", icon: Bell },
    { title: "Pengaturan", href: "/settings", icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-surface px-4 lg:px-8">
      <div className="flex items-center gap-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={isMenuOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold text-lg text-primary">Smart Advisor</span>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu navigasi">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Tutup menu navigasi"
          />
          <nav className="relative h-full w-72 max-w-[85vw] overflow-y-auto bg-surface p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-lg text-primary">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} aria-label="Tutup menu navigasi">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${pathname === item.href ? "bg-primary text-white" : "text-muted hover:bg-gray-100 hover:text-foreground"}`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                )
              })}
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-critical hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
                Keluar
              </button>
            </div>
          </nav>
        </div>
      )}

      <Modal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        title="Konfirmasi logout"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsLogoutConfirmOpen(false)}>
              Batal
            </Button>
            <Button variant="critical" onClick={handleLogout}>
              Ya, keluar
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-muted">
            Anda yakin ingin keluar dari akun ini?
          </p>
          <p className="text-sm text-muted">
            Anda akan diarahkan kembali ke halaman login.
          </p>
        </div>
      </Modal>

      <div className="hidden lg:flex items-center flex-1 max-w-md ml-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <input
            type="text"
            value={globalSearch}
            onChange={(event) => setGlobalSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleGlobalSearchSubmit()
              }
            }}
            placeholder="Cari global: dashboard, produk, transaksi..."
            className="h-9 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Halaman yang cocok"
      >
        <div className="space-y-3">
          {searchSuggestions.length === 0 ? (
            <p className="text-sm text-muted">Tidak ada halaman yang cocok untuk pencarian ini.</p>
          ) : (
            searchSuggestions.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  router.push(item.path)
                  setIsSearchModalOpen(false)
                  setGlobalSearch("")
                }}
                className="flex w-full items-start justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100"
              >
                <div>
                  <div className="font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted">{item.description}</div>
                </div>
                <span className="text-xs font-medium text-primary">Buka</span>
              </button>
            ))
          )}
        </div>
      </Modal>

      <div className="flex items-center gap-4 ml-auto">
        <Link href="/notifications" className="relative" aria-label="Buka notifikasi">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5 text-muted" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-critical text-[8px] text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>
        <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted">{businessName}</p>
          </div>
          <Avatar>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
            <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}