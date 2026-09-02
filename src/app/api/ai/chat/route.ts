import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
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

// Correct endpoint: base URL + /llm/chat/completions
const TELKOM_API_BASE = process.env.TELKOM_API_ENDPOINT || "http://telkom-ai-dag.api.apilogy.id/Telkom-LLM/0.0.4";
const TELKOM_API_ENDPOINT = `${TELKOM_API_BASE}/llm/chat/completions`;

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

    // Get server-side Supabase client (has access to request cookies)
    const supabase = await createSupabaseServerClient();

    // Get current user from session
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
    
    console.log("\n=== TELKOM API REQUEST ===");
    console.log("URL:", TELKOM_API_ENDPOINT);
    console.log("API Key (first 10 chars):", apiKey.substring(0, 10) + "...");
    console.log("Headers:", {
      "Content-Type": "application/json",
      "x-api-key": apiKey.substring(0, 10) + "...",
    });

    // Call Telkom API with correct format (matching ChatRequest schema from swagger)
    const requestBody = {
      model: "telkom-ai",
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
      stream: false,
    };

    console.log("Request body structure:", {
      model: requestBody.model,
      messageCount: requestBody.messages.length,
      maxTokens: requestBody.max_tokens,
    });

    const response = await fetch(TELKOM_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,  // Lowercase x-api-key as per swagger spec
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", {
      "content-type": response.headers.get("content-type"),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("\n=== TELKOM API ERROR ===");
      console.error("Status:", response.status);
      console.error("Error response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        console.error("Parsed error:", errorData);
      } catch {
        console.error("Could not parse error as JSON");
      }
      throw new Error(
        `Telkom API failed with ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Telkom API response:", JSON.stringify(data, null, 2));

    // Extract message dari response - format per swagger: choices[0].message.content
    let aiMessage = "";

    if (data.choices?.[0]?.message?.content) {
      aiMessage = data.choices[0].message.content;
    } else if (data.message?.content) {
      aiMessage = data.message.content;
    } else if (data.response) {
      aiMessage = data.response;
    } else if (data.data?.result) {
      aiMessage = data.data.result;
    } else if (data.result) {
      aiMessage = data.result;
    } else if (data.text) {
      aiMessage = data.text;
    } else if (typeof data === "string") {
      aiMessage = data;
    } else {
      console.warn("Could not extract message from response:", data);
      aiMessage = "Maaf, tidak ada response dari AI";
    }

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
