# 🔍 Implementation Plan: Global Search Functionality

Panduan lengkap untuk membuat search bar di halaman dashboard menjadi **fully functional** untuk mencari produk dan transaksi.

---

## 📊 Current State

**File**: `src/components/layout/top-navbar.tsx` (lines 116-125)

**Problem**: Search input ada tetapi tidak berfungsi
- ❌ Tidak ada state management
- ❌ Tidak ada search logic
- ❌ Tidak ada hasil display
- ❌ Tidak terhubung ke database

---

## 🎯 Goals

✅ User bisa mengetik query di search bar  
✅ Real-time results dari database (products + transactions)  
✅ Navigasi ke halaman detail dari hasil search  
✅ Mobile-friendly dengan modal/drawer  
✅ Loading state & error handling  

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│  Top Navbar (Search Input)              │
│  [Search Bar]                           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Search Results Modal/Drawer            │
│  ├─ Products (3-5 results)             │
│  ├─ Transactions (3-5 results)         │
│  └─ View All Results Link              │
└──────────────┬──────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  /products page      │
    │  /transactions page  │
    │  /products/[id]      │
    │  /transactions/[id]  │
    └──────────────────────┘
```

---

## 📋 Implementation Steps

### Step 1: Create Search Context Hook
**File**: `src/lib/hooks/useGlobalSearch.ts` (NEW)

```typescript
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentBusinessId } from "@/lib/business";

export interface SearchResult {
  id: string;
  type: "product" | "transaction";
  title: string;
  subtitle: string;
  value?: string;
  icon?: string;
  href: string;
}

export function useGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const businessId = await getCurrentBusinessId();
      if (!businessId) {
        setError("Business tidak ditemukan");
        setIsLoading(false);
        return;
      }

      // Search Products
      const { data: products, error: prodError } = await supabase
        .from("products")
        .select("id, name, price, stock")
        .eq("business_id", businessId)
        .ilike("name", `%${searchQuery}%`)
        .limit(5);

      if (prodError) throw prodError;

      // Search Transactions
      const { data: transactions, error: transError } = await supabase
        .from("transactions")
        .select("id, created_at, total_amount, status")
        .eq("business_id", businessId)
        .ilike("notes", `%${searchQuery}%`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (transError) throw transError;

      // Format results
      const formattedResults: SearchResult[] = [
        ...(products ?? []).map((p) => ({
          id: p.id,
          type: "product" as const,
          title: p.name,
          subtitle: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
          value: `${p.stock} tersedia`,
          href: `/products?productId=${p.id}`,
        })),
        ...(transactions ?? []).map((t) => ({
          id: t.id,
          type: "transaction" as const,
          title: `Transaksi #${t.id.slice(0, 8)}`,
          subtitle: new Date(t.created_at).toLocaleDateString("id-ID"),
          value: `Rp ${Number(t.total_amount).toLocaleString("id-ID")}`,
          href: `/transactions?transactionId=${t.id}`,
        })),
      ];

      setResults(formattedResults);
    } catch (err) {
      console.error("Search error:", err);
      setError("Gagal melakukan pencarian");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setError("");
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    search,
    clearSearch,
  };
}
```

---

### Step 2: Create Search Results Component
**File**: `src/components/layout/search-results.tsx` (NEW)

```typescript
"use client"

import { X, Package, Receipt, ArrowRight } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SearchResult } from "@/lib/hooks/useGlobalSearch"

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  error: string
  query: string
  onClose: () => void
}

export function SearchResults({
  results,
  isLoading,
  error,
  query,
  onClose,
}: SearchResultsProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-label="Tutup pencarian"
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-20 max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 bg-surface shadow-xl sm:inset-x-auto sm:w-96 sm:left-4 lg:left-auto lg:right-8">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
          <h2 className="text-sm font-semibold">Hasil Pencarian</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Tutup">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading && (
            <div className="space-y-2">
              <p className="text-xs text-muted">Mencari "{query}"...</p>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && results.length === 0 && query && (
            <div className="text-center py-8">
              <p className="text-sm text-muted">Tidak ada hasil untuk "{query}"</p>
              <p className="text-xs text-muted mt-1">Coba kata kunci lain</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5 p-2 rounded-lg bg-blue-50 text-primary group-hover:bg-blue-100">
                      {result.type === "product" ? (
                        <Package className="h-4 w-4" />
                      ) : (
                        <Receipt className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {result.title}
                      </p>
                      <p className="text-xs text-muted">{result.subtitle}</p>
                      {result.value && (
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {result.value}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary flex-shrink-0" />
                </Link>
              ))}

              {results.length > 0 && (
                <Link
                  href={`/products?search=${query}`}
                  className="block text-center py-2 text-xs font-medium text-primary hover:underline"
                >
                  Lihat semua hasil →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

### Step 3: Update Top Navbar Component
**File**: `src/components/layout/top-navbar.tsx`

**Replace** the search section (lines 116-125) dengan:

```typescript
const [isSearchOpen, setIsSearchOpen] = useState(false)
const { query, setQuery, results, isLoading, error, search, clearSearch } =
  useGlobalSearch()

const handleSearchChange = (value: string) => {
  setQuery(value)
  if (value.trim()) {
    search(value)
    setIsSearchOpen(true)
  } else {
    clearSearch()
  }
}

// ... dalam JSX section, ganti:
<div className="hidden lg:flex items-center flex-1 max-w-md ml-4">
  <div className="relative w-full">
    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
    <input
      type="text"
      placeholder="Cari transaksi, produk..."
      value={query}
      onChange={(e) => handleSearchChange(e.target.value)}
      onFocus={() => query && setIsSearchOpen(true)}
      className="h-9 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  </div>
</div>

{isSearchOpen && (
  <SearchResults
    results={results}
    isLoading={isLoading}
    error={error}
    query={query}
    onClose={() => {
      setIsSearchOpen(false)
      clearSearch()
    }}
  />
)}
```

---

### Step 4: Add Imports to Top Navbar
**File**: `src/components/layout/top-navbar.tsx` (line 1-10)

```typescript
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell, Search, Menu, X, LayoutDashboard, Package, Receipt, BarChart3, TrendingUp, Lightbulb, Archive, Settings, UserCircle2, LogOut, ArrowRight } from "@/components/ui/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"
import { useGlobalSearch } from "@/lib/hooks/useGlobalSearch"
import { SearchResults } from "./search-results"
```

---

## 🎨 Advanced Features (Optional)

### Feature 1: Search Debouncing
Untuk mencegah terlalu banyak database queries, tambahkan debounce:

```typescript
import { useDebouncedCallback } from "use-debounce"

// Di dalam useGlobalSearch hook
const debouncedSearch = useDebouncedCallback(async (query: string) => {
  await search(query)
}, 300) // Wait 300ms after user stops typing
```

Install: `npm install use-debounce`

### Feature 2: Search History
Simpan search history di localStorage:

```typescript
const [searchHistory, setSearchHistory] = useState<string[]>([])

const addToHistory = (query: string) => {
  const updated = [query, ...searchHistory].slice(0, 5)
  setSearchHistory(updated)
  localStorage.setItem("searchHistory", JSON.stringify(updated))
}

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem("searchHistory")
  if (saved) setSearchHistory(JSON.parse(saved))
}, [])
```

### Feature 3: Search Filters
Tambahkan tab untuk filter hasil:

```typescript
const [activeTab, setActiveTab] = useState<"all" | "products" | "transactions">("all")

const filteredResults = results.filter(r =>
  activeTab === "all" ? true : r.type === activeTab
)
```

---

## 🗄️ Database Query Optimization

Untuk search yang lebih baik, pastikan ada indexes di database:

```sql
-- Di Supabase SQL Editor
CREATE INDEX idx_products_name ON products USING GIN(name gin_trgm_ops);
CREATE INDEX idx_products_business_id ON products(business_id);
CREATE INDEX idx_transactions_notes ON transactions USING GIN(notes gin_trgm_ops);
CREATE INDEX idx_transactions_business_id ON transactions(business_id);
```

---

## 🧪 Testing Checklist

- [ ] Search dengan product name
- [ ] Search dengan transaction ID atau notes
- [ ] Empty search (no results)
- [ ] Click result navigates correctly
- [ ] Close modal dengan X button
- [ ] Close modal dengan backdrop click
- [ ] Mobile view (search accessible)
- [ ] Error handling (network down)
- [ ] Loading state visible
- [ ] Case-insensitive search

---

## 📱 Mobile Implementation

Untuk mobile, gunakan modal dropdown instead of sidebar:

```typescript
// Mobile search (dalam top navbar)
<Button
  variant="ghost"
  size="icon"
  className="lg:hidden"
  onClick={() => setIsSearchOpen(true)}
>
  <Search className="h-5 w-5" />
</Button>
```

---

## 💾 File Structure (Summary)

```
src/
├── lib/
│   └── hooks/
│       └── useGlobalSearch.ts          (NEW)
├── components/
│   └── layout/
│       ├── top-navbar.tsx              (UPDATE)
│       └── search-results.tsx          (NEW)
```

---

## 🚀 Quick Implementation Timeline

| Step | Duration | Task |
|------|----------|------|
| 1 | 15 min | Create `useGlobalSearch.ts` hook |
| 2 | 20 min | Create `search-results.tsx` component |
| 3 | 10 min | Update `top-navbar.tsx` imports & logic |
| 4 | 10 min | Test & debug |
| 5 | 5 min | Deploy |

**Total**: ~60 minutes untuk fully functional search!

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Results tidak muncul | Query kosong atau RLS | Check business_id, ensure user authenticated |
| Search lambat | No database index | Create GIN indexes pada kolom name/notes |
| Modal tidak close | Event listener issue | Check onClick handlers |
| Mobile search hidden | CSS responsive issue | Add `lg:hidden` class untuk mobile button |

---

## 📈 Future Enhancements

- 🔎 **Advanced Search**: Filter by date, status, price range
- 📊 **Search Analytics**: Track popular searches
- 🏷️ **Autocomplete**: Suggest search terms
- 🌍 **Global Search**: Add categories, inventory, etc.
- ⚡ **Keyboard Shortcuts**: Cmd+K untuk open search

---

## ✨ Selesai!

Dengan langkah-langkah ini, search bar di dashboard kamu akan **fully functional** dan siap digunakan! 🎉
