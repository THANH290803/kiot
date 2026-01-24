import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Cấu hình IBM Plex Serif và IBM Plex Mono
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-serif",
})
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-mono",
})

export const metadata: Metadata = {
  title: "KiotV0 - Phần mềm quản lý bán hàng",
  description: "Hệ thống quản lý bán hàng chuyên nghiệp",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${ibmPlexSerif.variable} ${ibmPlexMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
