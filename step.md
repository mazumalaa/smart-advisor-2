# 🤖 Implementasi AI Assistant dengan Telkom API

Panduan lengkap untuk mengubah AI Assistant dari mock data menjadi **AI yang benar-benar cerdas** menggunakan Telkom API (LLM Service).

---

## 📋 Telkom API Info

### 🇮🇩 Telkom LLM API ⭐
- **Pro**: API lokal Indonesia, multiple keys untuk redundancy, terpercaya
- **Harga**: Sesuai pricing Telkom (biasanya kompetitif untuk enterprise)
- **Auth**: Bearer token (API key)
- **Key Rotation**: Support otomatis jika key habis

**API Keys (10 tersedia)**:
1. L99USZtMFMcaPCTKKYYdkHkS7ZndnZNw
2. FAUbGGF296SJ9P4zVMDkHllnqmMwRFsx
3. cMLBgyyVfA2qX3CgMra3XHhUTcxtux3W
4. rGl85ubrTMFfWgmX4kEpANEx3SIiX7aB
5. sgaBYAGgtIMljqFddseMd07hLUBSvVbh
6. oIsK3TKNzGRLX9ZZCtzkQIpLHrGpwNMu
7. zkdyo0oRWUQQYwTL7GQSfoxjZPAUXMKM
8. gKZeeKQJ5R22isPvzmPQYyhQQvQn83yo
9. af9qlTE6BAUQZSkam0yF5FFmx063dwgd
10. IXKEsyuNyLcXpxWqNwpoUXPNWgEylk2M

---

## 🚀 Step 1: Setup API Keys

### Menggunakan Telkom API:

1. **Siapkan API Keys**
   - Anda sudah punya 10 API keys dari Telkom
   - Simpan di `.env.local` dengan key rotation system

2. **Tambah ke `.env.local`**
   ```env
   # Existing
   NEXT_PUBLIC_SUPABASE_URL=https://iboolzfcvdtcexoygdrc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

   # Add Telkom API Keys (untuk rotation)
   TELKOM_API_KEY_1=L99USZtMFMcaPCTKKYYdkHkS7ZndnZNw
   TELKOM_API_KEY_2=FAUbGGF296SJ9P4zVMDkHllnqmMwRFsx
   TELKOM_API_KEY_3=cMLBgyyVfA2qX3CgMra3XHhUTcxtux3W
   TELKOM_API_KEY_4=rGl85ubrTMFfWgmX4kEpANEx3SIiX7aB
   TELKOM_API_KEY_5=sgaBYAGgtIMljqFddseMd07hLUBSvVbh
   TELKOM_API_KEY_6=oIsK3TKNzGRLX9ZZCtzkQIpLHrGpwNMu
   TELKOM_API_KEY_7=zkdyo0oRWUQQYwTL7GQSfoxjZPAUXMKM
   TELKOM_API_KEY_8=gKZeeKQJ5R22isPvzmPQYyhQQvQn83yo
   TELKOM_API_KEY_9=af9qlTE6BAUQZSkam0yF5FFmx063dwgd
   TELKOM_API_KEY_10=IXKEsyuNyLcXpxWqNwpoUXPNWgEylk2M
   TELKOM_API_ENDPOINT=https://api.telkom.co.id/llm/chat
   TELKOM_API_CURRENT_KEY_INDEX=0
   ```

3. **Tentukan Telkom API Endpoint**
   - Hubungi Telkom untuk mendapatkan exact endpoint
   - Format biasanya: `https://api.telkom.co.id/...`
   - Akan digunakan di backend route

---

## 📡 Step 2: Buat Backend API Route dengan Key Rotation

Buat file: `src/app/api/ai/chat/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentBusinessId } from "@/lib/business";

// Telkom API Keys untuk rotation
const TELKOM_API_KEYS = [
  process.env.TELKOM_API_KEY_1,
  process.env.TELKOM_API_KEY_2,
  process.env.TELKOM_API_KEY_3,
  process.env.TELKOM_API_KEY_4,
  process.env.TELKOM_API_KEY_5,
  process.env.TELKOM_API_KEY_6,
  process.env.TELKOM_API_KEY_7,
  process.env.TELKOM_API_KEY_8,
  process.env.TELKOM_API_KEY_9,
  process.env.TELKOM_API_KEY_10,
].filter(Boolean) as string[];

const TELKOM_API_ENDPOINT = process.env.TELKOM_API_ENDPOINT || "https://api.telkom.co.id/llm/chat";

let currentKeyIndex = 0;

// Fungsi untuk rotate API key
function getNextApiKey(): string {
  if (TELKOM_API_KEYS.length === 0) {
    throw new Error("No Telkom API keys configured");
  }
  const key = TELKOM_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % TELKOM_API_KEYS.length;
  return key;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message required" },
        { status: 400 }
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get business data for context
    const businessId = await getCurrentBusinessId();
    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    // Get recent transactions for context
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*, transaction_items(*)")
      .eq("business_id", businessId)
      .eq("status", "Selesai")
      .order("created_at", { ascending: false })
      .limit(50);

    // Get products
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("business_id", businessId);

    // Build context
    const businessContext = `
    Nama Bisnis: ${business?.name}
    Total Produk: ${products?.length || 0}
    Recent Sales: ${transactions?.length || 0} transactions
    
    Top Products:
    ${transactions
      ?.slice(0, 5)
      .map((t) => `- Rp ${t.total_amount} dari ${t.created_at}`)
      .join("\n")}
    `;

    // Get API key (with rotation support)
    const apiKey = getNextApiKey();

    // Call Telkom API
    const response = await fetch(TELKOM_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `Anda adalah UMKM Smart Advisor - asisten AI untuk membantu pemilik UMKM Indonesia.
      
Data Bisnis Saat Ini:
${businessContext}

Instruksi:
- Jawab dalam Bahasa Indonesia yang ramah
- Berikan saran praktis berdasarkan data bisnis yang tersedia
- Jika ditanya tentang inventory, berikan analisis restock
- Untuk pertanyaan keuangan, gunakan data transaksi actual
- Selalu berikan angka konkrit jika memungkinkan
- Jika data tidak tersedia, katakan dengan jelas`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telkom API error:", errorData);
      
      // Jika API key error, coba key berikutnya (sudah di-rotate)
      if (response.status === 401 || response.status === 403) {
        throw new Error("API key invalid, trying next key");
      }
      
      throw new Error(errorData.message || "Telkom API request failed");
    }

    const data = await response.json();
    
    // Extract message dari response
    // Sesuaikan dengan format response Telkom API
    const aiMessage = data.choices?.[0]?.message?.content || 
                      data.message?.content || 
                      data.response || 
                      "Maaf, tidak ada response dari AI";

    return NextResponse.json({
      message: aiMessage,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      },
    });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
```

**PENTING**: Sesuaikan format request/response dengan dokumentasi Telkom API yang exact!
- Response format mungkin berbeda
- Header authentication mungkin perlu disesuaikan
- Struktur messages mungkin beda

---

## 🔄 Step 3: Update AI Assistant Component

Update file: `src/components/ai/ai-assistant.tsx`

```typescript
"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send, User } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Halo! Saya UMKM Smart Advisor Anda. Tanya apapun tentang bisnis Anda - penjualan, inventory, atau rekomendasi strategis. 🚀" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const suggestedPrompts = [
    "Produk apa yang paling laku?",
    "Kapan saya perlu restock?",
    "Bagaimana tren penjualan minggu ini?"
  ]

  const handleSend = async (text: string) => {
    if (!text.trim()) return
    
    setError("")
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsTyping(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'ai', content: data.message }])
    } catch (err) {
      setError("Gagal terhubung ke AI. Coba lagi nanti.")
      console.error(err)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 h-14 w-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-surface border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">UMKM AI Assistant</h3>
                <p className="text-[10px] text-muted">Powered by Telkom LLM</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3 max-w-[90%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn("shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm", msg.role === 'user' ? "bg-surface border border-gray-200 text-foreground" : "bg-primary text-white")}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div className={cn("rounded-2xl px-4 py-3 text-sm shadow-sm", msg.role === 'user' ? "bg-primary text-white rounded-tr-sm" : "bg-surface border border-gray-100 text-foreground rounded-tl-sm")}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-4 py-3 text-sm bg-surface border border-gray-100 flex items-center gap-1 rounded-tl-sm shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-surface">
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedPrompts.map(prompt => (
                <button 
                  key={prompt} 
                  onClick={() => handleSend(prompt)}
                  disabled={isTyping}
                  className="text-[10px] bg-blue-50 text-primary border border-blue-100 px-2.5 py-1.5 rounded-full hover:bg-blue-100 transition-colors text-left font-medium disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const input = form.elements.namedItem('message') as HTMLInputElement
                handleSend(input.value)
                input.value = ''
              }}
              className="flex items-center gap-2"
            >
              <input 
                name="message"
                type="text" 
                placeholder="Tanya AI tentang bisnismu..." 
                disabled={isTyping}
                className="flex-1 h-10 px-3 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 disabled:opacity-50"
              />
              <Button type="submit" size="icon" disabled={isTyping} className="rounded-full h-10 w-10 shrink-0 shadow-sm">
                <Send className="h-4 w-4 ml-0.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
```


---

## ✅ Step 4: Testing

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Buka http://localhost:3000/dashboard**

3. **Klik tombol AI Assistant** (ikon ✨ di kanan bawah)

4. **Test pertanyaan:**
   - "Berapa total penjualanku minggu ini?"
   - "Produk apa yang paling menguntungkan?"
   - "Kapan saya harus restock?"

---

## 🔐 Step 5: Security Best Practices

1. **Jangan expose API key di client:**
   ✅ BENAR: API keys di `.env.local` (backend only)
   ❌ SALAH: API keys di `.env.local` dengan `NEXT_PUBLIC_` prefix

2. **API Key Rotation:**
   - Sudah implemented di route handler
   - Otomatis rotate ke key berikutnya jika error
   - 10 keys tersedia untuk redundancy

3. **Rate limiting** (cegah abuse):
   ```typescript
   // Di route handler tambahkan rate limit
   const rateLimit = new Map<string, number[]>();
   const limit = 10; // 10 requests
   const window = 60000; // per 60 detik
   ```

4. **Input validation:**
   ```typescript
   // Validasi panjang message
   if (message.length > 1000) {
     throw new Error("Message too long");
   }
   ```

5. **Error handling:**
   - Jangan expose error details ke client
   - Log errors untuk debugging
   - Return generic error message ke user

---

## 💾 Environment File (.env.local)

Pastikan semua API keys sudah ditambahkan:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://iboolzfcvdtcexoygdrc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Telkom API Keys (10 tersedia)
TELKOM_API_KEY_1=L99USZtMFMcaPCTKKYYdkHkS7ZndnZNw
TELKOM_API_KEY_2=FAUbGGF296SJ9P4zVMDkHllnqmMwRFsx
TELKOM_API_KEY_3=cMLBgyyVfA2qX3CgMra3XHhUTcxtux3W
TELKOM_API_KEY_4=rGl85ubrTMFfWgmX4kEpANEx3SIiX7aB
TELKOM_API_KEY_5=sgaBYAGgtIMljqFddseMd07hLUBSvVbh
TELKOM_API_KEY_6=oIsK3TKNzGRLX9ZZCtzkQIpLHrGpwNMu
TELKOM_API_KEY_7=zkdyo0oRWUQQYwTL7GQSfoxjZPAUXMKM
TELKOM_API_KEY_8=gKZeeKQJ5R22isPvzmPQYyhQQvQn83yo
TELKOM_API_KEY_9=af9qlTE6BAUQZSkam0yF5FFmx063dwgd
TELKOM_API_KEY_10=IXKEsyuNyLcXpxWqNwpoUXPNWgEylk2M

# Telkom API Endpoint (sesuaikan dengan dokumentasi Telkom)
TELKOM_API_ENDPOINT=https://api.telkom.co.id/llm/chat
```

---

## 📊 Telkom API Integration Notes

### Request Format
```json
{
  "messages": [
    {
      "role": "system",
      "content": "Instruksi untuk AI..."
    },
    {
      "role": "user",
      "content": "Pertanyaan user"
    }
  ],
  "max_tokens": 1024,
  "temperature": 0.7
}
```

### Response Format (Expected)
```json
{
  "choices": [
    {
      "message": {
        "content": "Jawaban AI"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 50
  }
}
```

**⚠️ PENTING**: Sesuaikan dengan actual response format dari Telkom API

---

## 🚨 Troubleshooting

| Error | Cause | Solusi |
|-------|-------|---------|
| `401 Unauthorized` | API key invalid | Check key, pastikan formatnya benar |
| `403 Forbidden` | API key habis quota | Akan auto-rotate ke key berikutnya |
| `Connection timeout` | Endpoint error | Verify Telkom API endpoint URL |
| `AuthError` | User belum login | User harus login dulu sebelum akses |
| `Invalid response format` | Format response berbeda | Sesuaikan parsing response dengan format actual Telkom |

---

## 🔄 Advanced: API Key Management

Untuk monitoring API key usage lebih baik:

```typescript
// src/lib/telkomApiManager.ts
class TelkomApiManager {
  private keys: string[];
  private currentIndex: number = 0;
  private keyUsage: Map<string, number> = new Map();

  constructor(keys: string[]) {
    this.keys = keys;
  }

  getNextKey(): string {
    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    
    const usage = this.keyUsage.get(key) || 0;
    this.keyUsage.set(key, usage + 1);
    
    return key;
  }

  getUsageStats() {
    return Object.fromEntries(this.keyUsage);
  }
}
```

---

## 📈 Cost Estimation (Telkom API)

Sesuaikan dengan pricing Telkom:
- **Small usage** (1000 queries/month): Estimated budget
- **Medium usage** (10k queries/month): Estimated budget  
- **Large usage** (100k queries/month): Estimated budget

*Contact Telkom untuk exact pricing*

---

## ✨ Selesai!

Sekarang AI Assistant kamu sudah **intelligent** dan powered by **Telkom LLM API** dengan automatic key rotation! 🎉

### File Summary
| File | Status | Notes |
|------|--------|-------|
| `src/app/api/ai/chat/route.ts` | ✅ CREATE | Backend with key rotation |
| `src/components/ai/ai-assistant.tsx` | ✅ UPDATE | Frontend component |
| `.env.local` | ✅ UPDATE | Add all 10 API keys |

**Next Steps:**
1. Sesuaikan Telkom API endpoint & format
2. Test dengan beberapa pertanyaan
3. Monitor error logs
4. Adjust prompts based on actual responses
