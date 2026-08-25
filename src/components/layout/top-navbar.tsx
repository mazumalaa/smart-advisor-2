import { Bell, Search, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-surface px-4 lg:px-8">
      <div className="flex items-center gap-4 lg:hidden">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold text-lg text-primary">Smart Advisor</span>
      </div>

      <div className="hidden lg:flex items-center flex-1 max-w-md ml-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Cari transaksi, produk..."
            className="h-9 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-muted" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-critical"></span>
        </Button>
        <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="text-right">
            <p className="text-sm font-medium">Andi Pratama</p>
            <p className="text-xs text-muted">Kopi Senja</p>
          </div>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Andi" alt="Andi" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
