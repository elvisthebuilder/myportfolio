"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import {
  Moon,
  Sun,
  Terminal,
  ExternalLink,
  Layers,
  Github,
  Code,
  Sparkles,
  Smartphone,
  BoxIcon as Box3D,
  Zap,
  Shield,
  Cloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { SubtleParticles } from "./components/subtle-particles"
import { TerminalInterface } from "./components/terminal-interface"
import { SocialNodesScene } from "./components/social-nodes-scene" // Updated import

export default function Portfolio() {
  const [isDark, setIsDark] = useState(true)
  const [isTerminal, setIsTerminal] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState("")
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const [showSocialReveal, setShowSocialReveal] = useState(false) // State for 3D social scene
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const terminalInputRef = useRef<HTMLInputElement>(null)
  const terminalContentRef = useRef<HTMLDivElement>(null)

  const skills = [
    "Next.js",
    "TypeScript",
    "Supabase",
    "Linux",
    "AI",
    "React Native",
    "Three.js",
    "GSAP",
    "Python",
    "Cybersecurity",
    "Docker",
    "AWS",
  ]

  // Mapping skills to Lucide React icons
  const skillIcons: { [key: string]: React.ElementType } = {
    "Next.js": Layers, // Using Layers as a generic web icon
    TypeScript: Code,
    Supabase: Github, // Using Github as a generic database/platform icon
    Linux: Terminal,
    AI: Sparkles, // Using Sparkles for AI
    "React Native": Smartphone,
    "Three.js": Box3D, // Using Box3D for 3D
    GSAP: Zap, // Using Zap for animation
    Python: Code,
    Cybersecurity: Shield,
    Docker: Layers, // Using Layers for containerization
    AWS: Cloud, // Using Cloud for AWS
  }

  const projects = [
    {
      name: "Voidline",
      description:
        "A powerful command-line tool for red team operations, streamlining reconnaissance and exploitation.",
      link: "#",
    },
    {
      name: "CampusConnect",
      description:
        "A mobile platform for students to exchange skills, collaborate on projects, and build a campus community.",
      link: "#",
    },
    {
      name: "NuroDesk",
      description: "An AI-powered SaaS that automates customer support workflows, learning from every interaction.",
      link: "#",
    },
  ]

  const terminalCommands = {
    whoami: "Elvis Baidoo - Developer & Hacker\nAlso known as: Noctyx\nStatus: Available for collaboration",
    about:
      "With a hacker's mindset and a developer's precision, I craft digital\nexperiences that are both secure and seamless. My journey through\nfull-stack development, ethical hacking, and SaaS creation is fueled\nby an insatiable curiosity and a passion for solving complex problems.",
    stack: "[ Next.js, TypeScript, Supabase, Linux, AI, React Native, Three.js, GSAP ]",
    projects:
      "1. Voidline - Red team operations tool\n2. CampusConnect - Student collaboration platform\n3. NuroDesk - AI-powered customer support SaaS",
    contact:
      "📧 Email: elvis@noctyx.dev\n🐙 GitHub: github.com/noctyx\n🌐 Portfolio: noctyx.dev\n💼 LinkedIn: linkedin.com/in/elvisnoctyx",
    help: "Available commands: whoami, about, stack, projects, contact, clear, exit",
    clear: "",
    exit: "Returning to GUI mode...",
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  useEffect(() => {
    if (isTerminal && terminalInputRef.current) {
      terminalInputRef.current.focus()
      if (terminalOutput === "") {
        setTerminalOutput("Welcome to Noctyx Terminal\nType 'help' for available commands\n\n")
      }
    }
  }, [isTerminal])

  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight
    }
  }, [terminalOutput])

  const executeCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim()
    if (cmd === "") return

    setCommandHistory((prev) => [...prev.filter((c) => c !== command), command])
    setHistoryIndex(-1)
    setTerminalOutput((prev) => prev + `noctyx@portfolio:~$ ${command}\n`)

    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (cmd === "clear") {
      setTerminalOutput("")
    } else if (cmd === "exit") {
      setTerminalOutput((prev) => prev + terminalCommands.exit + "\n\n")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsTerminal(false)
      setTerminalOutput("")
    } else {
      const output =
        terminalCommands[cmd as keyof typeof terminalCommands] ||
        `Command not found: ${command}\nType 'help' for available commands.`
      setTerminalOutput((prev) => prev + output + "\n\n")
    }

    setIsTyping(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(currentInput)
      setCurrentInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    }
  }

  if (isTerminal) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-green-400 terminal-font relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <TerminalInterface />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 p-4 min-h-screen flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex-1">
            <div className="flex justify-between items-center mb-4 bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-[#21262d]">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-green-300 text-sm">Noctyx Terminal</div>
              </div>
              <Button
                onClick={() => setIsTerminal(false)}
                variant="ghost"
                size="sm"
                className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
              >
                Exit
              </Button>
            </div>

            <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-[#21262d] flex-1 flex flex-col min-h-[70vh]">
              <div
                ref={terminalContentRef}
                className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/30"
              >
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{terminalOutput}</pre>
                <div className="flex items-center">
                  <span className="text-cyan-400">noctyx@portfolio</span>
                  <span className="text-white">:</span>
                  <span className="text-purple-400">~</span>
                  <span className="text-white">$ </span>
                  <span className="ml-1">{currentInput}</span>
                  <span className="animate-pulse ml-1">█</span>
                </div>
              </div>

              <input
                ref={terminalInputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute opacity-0 pointer-events-none"
                autoComplete="off"
                disabled={isTyping}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-[#0d1117] text-[#e6edf3] overflow-x-hidden">
      {/* Subtle Background Particles */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <SubtleParticles isDark={isDark} />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Grid Background */}
      <div
        className={`absolute inset-0 bg-[url('data:image/svg+xml,${encodeURIComponent(
          '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fill="#374151" fillOpacity="0.1"><circle cx="30" cy="30" r="1.5"/></g></g></svg>',
        )}')] opacity-40`}
      ></div>

      <div className="layout-container flex h-full grow flex-col relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-[#21262d] px-4 md:px-10 py-4 bg-[rgba(22,27,34,0.6)] backdrop-blur-md">
          <div className="flex items-center gap-4 text-[#e6edf3]">
            <div className="size-6 text-[#4195f6]">
              <Layers className="animate-pulse" />
            </div>
            <h2 className="text-xl font-bold tracking-tighter terminal-font">NOCTYX_</h2>
          </div>

          <div className="hidden md:flex flex-1 justify-center gap-8">
            <a
              className="text-[#7d8590] hover:text-[#4195f6] transition-colors duration-300 text-sm font-medium"
              href="#about"
            >
              /about
            </a>
            <a
              className="text-[#7d8590] hover:text-[#4195f6] transition-colors duration-300 text-sm font-medium"
              href="#skills"
            >
              /skills
            </a>
            <a
              className="text-[#7d8590] hover:text-[#4195f6] transition-colors duration-300 text-sm font-medium"
              href="#projects"
            >
              /projects
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="h-10 rounded-full border border-[#4195f6] bg-transparent px-4 text-sm font-bold text-[#4195f6] transition-all duration-300 hover:bg-[#4195f6] hover:text-[#0d1117] hover:shadow-[0_0_15px_#4195f6]"
              onClick={() => setShowSocialReveal(true)} // Open reveal
            >
              Contact Me
            </Button>
            <Button
              onClick={() => setIsTerminal(true)}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
            >
              <Terminal size={20} />
            </Button>
            <Button
              onClick={() => setIsDark(!isDark)}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        </header>

        <main className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-10">
          <div className="layout-content-container flex flex-col max-w-5xl flex-1 gap-16">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-20 relative">
              <h1 className="text-5xl md:text-7xl font-bold text-[#e6edf3] tracking-tighter drop-shadow-[0_0_10px_rgba(65,149,246,0.5)]">
                Elvis Baidoo (Noctyx)
              </h1>
              <p className="mt-4 text-lg md:text-xl text-[#7d8590] terminal-font">
                Web & Mobile Developer • Ethical Hacker • SaaS Builder
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="min-w-[140px] h-12 rounded-full bg-[#4195f6] px-6 text-base font-bold text-[#0d1117] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_#4195f6]"
                  onClick={() => setShowSocialReveal(true)} // Open reveal
                >
                  Contact Me
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[140px] h-12 rounded-full border border-[#21262d] bg-[#161b22] px-6 text-base font-bold text-[#e6edf3] transition-all duration-300 hover:border-[#4195f6] hover:text-[#4195f6] hover:scale-105"
                  onClick={() => window.open("https://github.com/noctyx", "_blank")}
                >
                  GitHub
                </Button>
              </div>
            </section>

            {/* About Section */}
            <section className="scroll-mt-20" id="about">
              <div className="bg-[rgba(22,27,34,0.6)] backdrop-blur-md border border-[#21262d] rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-[#4195f6] tracking-tight mb-4 terminal-font">[ about_me ]</h2>
                <p className="text-[#7d8590] text-lg leading-relaxed">
                  With a hacker's mindset and a developer's precision, I craft digital experiences that are both secure
                  and seamless. My journey through full-stack development, ethical hacking, and SaaS creation is fueled
                  by an insatiable curiosity and a passion for solving complex problems. I thrive at the intersection of
                  code and creativity, building solutions that are not only functional but also elegantly designed.
                </p>
              </div>
            </section>

            {/* Skills Section */}
            <section className="scroll-mt-20" id="skills">
              <h2 className="text-3xl font-bold text-[#4195f6] tracking-tight mb-6 terminal-font text-center">
                [ tech_stack ]
              </h2>
              <div className="flex gap-3 p-4 flex-wrap justify-center">
                {skills.map((skill) => {
                  const Icon = skillIcons[skill]
                  return (
                    <Badge
                      key={skill}
                      className="relative h-10 w-28 overflow-hidden rounded-full border border-[#21262d] bg-[#161b22] px-4 text-sm font-medium text-[#e6edf3] transition-all duration-300 hover:border-[#4195f6] hover:text-[#4195f6] cursor-pointer group"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${
                          hoveredSkill === skill ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
                        }`}
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {skill}
                      </div>
                      <div
                        className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${
                          hoveredSkill === skill ? "rotate-y-0 opacity-100" : "-rotate-y-180 opacity-0"
                        }`}
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                      </div>
                    </Badge>
                  )
                })}
              </div>
            </section>

            {/* Projects Section */}
            <section className="scroll-mt-20" id="projects">
              <h2 className="text-3xl font-bold text-[#4195f6] tracking-tight mb-8 terminal-font text-center">
                [ projects ]
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.name}
                    className="group flex flex-col justify-between rounded-xl bg-[rgba(22,27,34,0.6)] backdrop-blur-md border border-[#21262d] overflow-hidden transition-all duration-300 hover:border-[#4195f6] hover:shadow-2xl hover:shadow-[#4195f6]/10 hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#e6edf3]">{project.name}</h3>
                      <p className="text-[#7d8590] mt-2 text-sm">{project.description}</p>
                    </div>
                    <div className="p-6 pt-0">
                      <a
                        className="inline-flex items-center text-sm font-semibold text-[#4195f6] transition-all duration-300 group-hover:underline"
                        href={project.link}
                      >
                        View Project
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Terminal Preview Section */}
            <section className="scroll-mt-20" id="terminal-mode">
              <div className="p-6 bg-[rgba(22,27,34,0.6)] backdrop-blur-md border border-[#21262d] rounded-2xl terminal-font">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-green-400">
                  <p>
                    <span className="text-cyan-400">noctyx@portfolio</span>:<span className="text-purple-400">~</span>$
                    whoami
                  </p>
                  <p className="ml-2">Elvis Baidoo - Developer & Hacker</p>
                  <p className="mt-2">
                    <span className="text-cyan-400">noctyx@portfolio</span>:<span className="text-purple-400">~</span>$
                    stack
                  </p>
                  <p className="ml-2">[ Next.js, TypeScript, Supabase, Linux, AI ]</p>
                  <p className="mt-2">
                    <span className="text-cyan-400">noctyx@portfolio</span>:<span className="text-purple-400">~</span>$
                    <span className="animate-ping">_</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="flex flex-col items-center gap-6 py-10 text-center border-t border-[#21262d]">
              <a
                className="text-[#4195f6] text-lg font-semibold leading-normal px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_0_5px_#4195f6,0_0_10px_#4195f6,0_0_15px_#4195f6] hover:text-[#4195f6]"
                href="mailto:elvis@noctyx.dev"
              >
                Let's build something legendary
              </a>
              <p className="text-[#7d8590] text-sm font-normal">
                Made with <span className="text-red-500 animate-pulse">❤️</span> by Elvis Baidoo
              </p>
            </footer>
          </div>
        </main>
      </div>
      <SocialNodesScene isOpen={showSocialReveal} onClose={() => setShowSocialReveal(false)} />
    </div>
  )
}
