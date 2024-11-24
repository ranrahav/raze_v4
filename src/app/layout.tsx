import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "@/components/AuthProvider"
import { UserNav } from "@/components/UserNav"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Raze - Global Relocation Platform",
  description: "Your journey to a new life starts here",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-white">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/" className="font-bold text-xl">Raze</Link>
                  <nav className="hidden md:flex gap-6">
                    <Link href="#" className="text-sm font-medium hover:text-primary">How it Works</Link>
                    <Link href="#" className="text-sm font-medium hover:text-primary">Destinations</Link>
                    <Link href="#" className="text-sm font-medium hover:text-primary">About Us</Link>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <Link href="#" className="text-sm font-medium hover:text-primary">Become a Service Provider</Link>
                  <UserNav />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
