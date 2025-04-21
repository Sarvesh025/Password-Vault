import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast-provider"
import { getServerSession } from "next-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Password Manager",
  description: "Secure your passwords with SecureVault",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'