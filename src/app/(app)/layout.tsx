import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AIAssistant } from "@/components/ai/ai-assistant";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <div id="app-custom-background" aria-hidden="true" />
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64 w-full h-full relative z-10">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
      <AIAssistant />
    </div>
  )
}
