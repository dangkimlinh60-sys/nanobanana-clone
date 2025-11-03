import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Remove next/font Google import to avoid network fetch during build

export const metadata: Metadata = {
  title: "Nano Banana - AI Image Editor",
  description:
    "Transform any image with simple text prompts. Advanced AI model for consistent character editing and scene preservation.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
