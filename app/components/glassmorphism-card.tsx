"use client"

import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface GlassmorphismCardProps {
  children: ReactNode
  isDark: boolean
  className?: string
}

export function GlassmorphismCard({ children, isDark, className = "" }: GlassmorphismCardProps) {
  return (
    <Card
      className={`
        backdrop-blur-md 
        ${
          isDark
            ? "bg-white/10 border-white/20 shadow-2xl shadow-black/20"
            : "bg-black/5 border-black/10 shadow-2xl shadow-black/10"
        }
        transition-all duration-500 
        hover:shadow-3xl 
        hover:scale-[1.02]
        ${className}
      `}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
          : "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {children}
    </Card>
  )
}
