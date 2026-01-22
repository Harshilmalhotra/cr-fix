import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CR Tracker",
  description: "Offline-first class representative utility",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-zinc-50 text-zinc-950 antialiased")}>
        <main className="mx-auto max-w-md min-h-screen bg-white shadow-2xl safe-area-bottom pb-20 relative overflow-hidden">
           {/* Mobile Container Emulator */}
          <div className="h-full min-h-screen flex flex-col">
            {children}
          </div>
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
