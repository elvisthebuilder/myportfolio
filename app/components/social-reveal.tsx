"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mail, Linkedin, Twitter, Instagram, DiscIcon as Discord, Github, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocialRevealProps {
  isOpen: boolean
  onClose: () => void
}

export function SocialReveal({ isOpen, onClose }: SocialRevealProps) {
  const socialLinks = [
    {
      name: "Email",
      icon: Mail,
      href: "mailto:elvis@noctyx.dev",
      description: "Send me an email",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/elvisnoctyx",
      description: "Connect professionally",
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      href: "https://twitter.com/noctyx_dev",
      description: "Follow my dev journey",
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/noctyx",
      description: "Explore my code",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/noctyx_dev",
      description: "See my creative side",
    },
    {
      name: "Discord",
      icon: Discord,
      href: "https://discord.gg/your-invite", // Replace with actual Discord invite
      description: "Chat with me live",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.8 },
    visible: { y: 0, opacity: 1, scale: 1 },
    exit: { y: 20, opacity: 0, scale: 0.8 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <motion.div
            className="relative bg-[rgba(22,27,34,0.8)] backdrop-blur-md border border-[#21262d] rounded-2xl p-6 shadow-2xl max-w-md w-[90vw] pointer-events-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-[#7d8590] hover:text-[#4195f6] hover:bg-transparent"
            >
              <X className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold text-[#4195f6] terminal-font mb-4">[ get_in_touch ]</h2>
            <p className="text-[#7d8590] text-base mb-6">Choose your preferred platform to connect with me.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#161b22] border border-[#21262d] hover:border-[#4195f6] hover:shadow-[0_0_10px_#4195f6]/20 transition-all duration-300 group"
                    variants={itemVariants}
                  >
                    <Icon className="w-6 h-6 text-[#4195f6] group-hover:scale-110 transition-transform duration-200" />
                    <div>
                      <div className="font-semibold text-[#e6edf3]">{link.name}</div>
                      <div className="text-xs text-[#7d8590]">{link.description}</div>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
