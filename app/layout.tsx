import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Chakra_Petch } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-chakra-petch",
})

export const metadata: Metadata = {
  title: "Elvis Baidoo (Noctyx) - Developer Portfolio",
  description: "Web & Mobile Developer, Ethical Hacker, and SaaS Builder",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${chakraPetch.variable} scroll-smooth`}
    >
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  )
}
