"use client"

import { createContext, useContext, useEffect, useState } from "react"

export const themes = [
  { id: "base", name: "Base", primary: "#1e3a8a" },
  { id: "dark", name: "Dark", primary: "#60a5fa" },
  { id: "navy-gold", name: "Navy + Gold", primary: "#c9952e" },
  { id: "indigo-mint", name: "Indigo + Mint", primary: "#10b981" },
  { id: "coral-turquoise", name: "Coral + Tosca", primary: "#e76f51" },
] as const

export type ThemeId = (typeof themes)[number]["id"]

export const backgroundPresets = [
  {
    id: "preset-dots",
    name: "Matrix Dot",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><circle cx="5" cy="5" r="2.5" fill="%2364748b" opacity="0.35"/></svg>`,
  },
  {
    id: "preset-grid",
    name: "Blueprint Grid",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><path d="0 0h40v40H0z" fill="none"/><path d="M0 40h40M40 0v40" stroke="%2364748b" stroke-width="1.2" stroke-opacity="0.25"/></svg>`,
  },
  {
    id: "preset-waves",
    name: "Flow Waves",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="24" viewBox="0 0 100 24"><path d="M0 12 Q 25 0 50 12 T 100 12" fill="none" stroke="%2364748b" stroke-width="2" stroke-opacity="0.3"/></svg>`,
  },
  {
    id: "preset-hex",
    name: "Honeycomb",
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="100" viewBox="0 0 56 100"><path d="M28 66L0 50V18L28 2l28 16v32zM28 0L0 16v32l28 16 28-16V16z" fill="none" stroke="%2364748b" stroke-width="1.5" stroke-opacity="0.25"/></svg>`,
  },
] as const

export type BackgroundConfig = {
  enabled: boolean
  type: "none" | "preset" | "custom"
  url: string
  opacity: number
  blur: number
  presetId: string | null
}

const defaultBackgroundConfig: BackgroundConfig = {
  enabled: false,
  type: "none",
  url: "",
  opacity: 0.15,
  blur: 0,
  presetId: null,
}

type AppearanceContextValue = {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  background: BackgroundConfig
  setBackground: React.Dispatch<React.SetStateAction<BackgroundConfig>>
  setPresetBackground: (presetId: string) => void
  uploadCustomBackground: (file: File) => Promise<void>
  updateOpacity: (opacity: number) => void
  updateBlur: (blur: number) => void
  clearBackground: () => void
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>("base")
  const [background, setBackground] = useState<BackgroundConfig>(defaultBackgroundConfig)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("smart-advisor-theme") as ThemeId | null
    const storedBgConfig = window.localStorage.getItem("smart-advisor-background-config")

    if (storedTheme && themes.some((item) => item.id === storedTheme)) {
      setTheme(storedTheme)
    }

    if (storedBgConfig) {
      try {
        const parsed = JSON.parse(storedBgConfig) as BackgroundConfig
        if (parsed && typeof parsed === "object") {
          setBackground({
            enabled: Boolean(parsed.enabled),
            type: parsed.type || "none",
            url: parsed.url || "",
            opacity: typeof parsed.opacity === "number" ? parsed.opacity : 0.15,
            blur: typeof parsed.blur === "number" ? parsed.blur : 0,
            presetId: parsed.presetId || null,
          })
        }
      } catch (e) {
        console.error("Failed to parse background configuration:", e)
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("smart-advisor-theme", theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    if (background.enabled && background.url) {
      root.style.setProperty("--bg-custom-image", `url("${background.url}")`)
      root.style.setProperty("--bg-custom-opacity", `${background.opacity}`)
      root.style.setProperty("--bg-custom-blur", `${background.blur}px`)
      root.dataset.customBg = "true"
    } else {
      root.style.setProperty("--bg-custom-image", "none")
      root.style.setProperty("--bg-custom-opacity", "0")
      root.style.setProperty("--bg-custom-blur", "0px")
      delete root.dataset.customBg
    }

    window.localStorage.setItem("smart-advisor-background-config", JSON.stringify(background))
  }, [background])

  const setPresetBackground = (presetId: string) => {
    const preset = backgroundPresets.find((p) => p.id === presetId)
    if (!preset) return
    setBackground((prev) => ({
      ...prev,
      enabled: true,
      type: "preset",
      presetId: preset.id,
      url: preset.url,
    }))
  }

  const uploadCustomBackground = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Mohon unggah file gambar yang valid (.png, .jpg, .webp, .svg)"))
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          // Compress via Canvas to avoid memory issues with large files
          const maxDim = 1600
          let width = img.width
          let height = img.height

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            } else {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }

          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            const compressedUrl = canvas.toDataURL("image/jpeg", 0.85)
            setBackground((prev) => ({
              ...prev,
              enabled: true,
              type: "custom",
              presetId: null,
              url: compressedUrl,
            }))
            resolve()
          } else {
            // Fallback to raw data URL
            const rawUrl = event.target?.result as string
            setBackground((prev) => ({
              ...prev,
              enabled: true,
              type: "custom",
              presetId: null,
              url: rawUrl,
            }))
            resolve()
          }
        }
        img.onerror = () => reject(new Error("Gagal membaca file gambar"))
        img.src = event.target?.result as string
      }
      reader.onerror = () => reject(new Error("Gagal membaca file"))
      reader.readAsDataURL(file)
    })
  }

  const updateOpacity = (opacity: number) => {
    setBackground((prev) => ({ ...prev, opacity }))
  }

  const updateBlur = (blur: number) => {
    setBackground((prev) => ({ ...prev, blur }))
  }

  const clearBackground = () => {
    setBackground(defaultBackgroundConfig)
  }

  return (
    <AppearanceContext.Provider
      value={{
        theme,
        setTheme,
        background,
        setBackground,
        setPresetBackground,
        uploadCustomBackground,
        updateOpacity,
        updateBlur,
        clearBackground,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const context = useContext(AppearanceContext)

  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider")
  }

  return context
}