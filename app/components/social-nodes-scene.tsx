"use client"

import React from "react"

import type { ReactElement } from "react"
import { useRef, useState, Suspense, useCallback, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Html, Line, Environment, Float, Circle } from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Linkedin, Twitter, Instagram, DiscIcon as Discord, Github, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocialNodesSceneProps {
  isOpen: boolean
  onClose: () => void
}

interface SocialLinkNodeProps {
  link: {
    name: string
    icon: ReactElement
    href: string
    description: string
  }
  position: [number, number, number]
  onNodeHover: (name: string | null) => void
  isCurrentlyHovered: boolean
  onMeshReady: (name: string, mesh: THREE.Mesh) => void // Callback to register mesh
}

function SocialLinkNode({ link, position, onNodeHover, isCurrentlyHovered, onMeshReady }: SocialLinkNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (meshRef.current) {
      onMeshReady(link.name, meshRef.current)
    }
  }, [link.name, onMeshReady])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  const handlePointerOver = useCallback(() => {
    onNodeHover(link.name)
  }, [link.name, onNodeHover])

  const handlePointerOut = useCallback(() => {
    onNodeHover(null)
  }, [onNodeHover])

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={() => window.open(link.href, "_blank")}
        scale={isCurrentlyHovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#4195f6"
          emissive="#4195f6"
          emissiveIntensity={isCurrentlyHovered ? 0.8 : 0.4}
          transparent
          opacity={0.8}
        />
        <Html center position={[0, 0, 0.3]}>
          <div className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-[#21262d] text-[#e6edf3] flex items-center justify-center transition-all duration-200 group-hover:scale-110">
            {link.icon}
          </div>
        </Html>
      </mesh>
    </Float>
  )
}

export function SocialNodesScene({ isOpen, onClose }: SocialNodesSceneProps) {
  const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null)
  const [progressLineEndPosition, setProgressLineEndPosition] = useState<THREE.Vector3 | null>(null)
  const [socialNodeMeshes, setSocialNodeMeshes] = useState<Map<string, THREE.Mesh>>(new Map())

  const centralNodePosition: [number, number, number] = [0, 0, 0] // Avatar will be at the center

  const socialLinks = [
    {
      name: "Email",
      icon: <Mail className="w-6 h-6 text-[#4195f6]" />,
      href: "mailto:elvis@noctyx.dev",
      description: "Send me an email",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-6 h-6 text-[#4195f6]" />,
      href: "https://linkedin.com/in/elvisnoctyx",
      description: "Connect professionally",
    },
    {
      name: "X (Twitter)",
      icon: <Twitter className="w-6 h-6 text-[#4195f6]" />,
      href: "https://twitter.com/noctyx_dev",
      description: "Follow my dev journey",
    },
    {
      name: "GitHub",
      icon: <Github className="w-6 h-6 text-[#4195f6]" />,
      href: "https://github.com/noctyx",
      description: "Explore my code",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-6 h-6 text-[#4195f6]" />,
      href: "https://instagram.com/noctyx_dev",
      description: "See my creative side",
    },
    {
      name: "Discord",
      icon: <Discord className="w-6 h-6 text-[#4195f6]" />,
      href: "https://discord.gg/your-invite",
      description: "Chat with me live",
    },
  ]

  const handleNodeHover = useCallback((name: string | null) => {
    setHoveredNodeName(name)
  }, [])

  const handleMeshReady = useCallback((name: string, mesh: THREE.Mesh) => {
    setSocialNodeMeshes((prev) => new Map(prev).set(name, mesh))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100]" // No background, no blur
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 75 }}
            dpr={[1, 2]}
            gl={{ alpha: true }} // Enable transparent background for the canvas
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#4195f6" />
              <Environment preset="night" />

              {/* Central Avatar Node */}
              <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                <Circle position={centralNodePosition} args={[0.7, 32]}>
                  <meshBasicMaterial transparent opacity={0} /> {/* Invisible material */}
                  <Html center position={[0, 0, 0.05]}>
                    {" "}
                    {/* Offset slightly forward */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#4195f6] shadow-lg">
                      <img
                        src="/placeholder.svg?height=100&width=100"
                        alt="Elvis Baidoo (Noctyx) Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Html>
                </Circle>
              </Float>

              {/* Social Link Nodes and Always Connected Lines */}
              {socialLinks.map((link, index) => {
                const angle = (index / socialLinks.length) * Math.PI * 2
                const radius = 3.5 // Adjust radius to spread them out
                const z = (index % 2 === 0 ? 1 : -1) * 0.5 // Fixed Z variation for stability
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                const nodePosition: [number, number, number] = [x, y, z]

                return (
                  <React.Fragment key={link.name}>
                    <SocialLinkNode
                      link={link}
                      position={nodePosition}
                      onNodeHover={handleNodeHover}
                      isCurrentlyHovered={hoveredNodeName === link.name}
                      onMeshReady={handleMeshReady}
                    />
                    {/* Always connected subtle lines */}
                    <Line
                      points={[centralNodePosition, nodePosition]}
                      color="#21262d" // Subtle color
                      lineWidth={1}
                      transparent
                      opacity={0.5}
                    />
                  </React.Fragment>
                )
              })}

              {/* Pointer Tracking Progress Line */}
              <TrackPointerProgress
                socialNodeMeshes={Array.from(socialNodeMeshes.values())} // Pass actual mesh objects
                centralNodePosition={centralNodePosition}
                setProgressLineEndPosition={setProgressLineEndPosition}
                setHoveredNodeName={setHoveredNodeName}
              />

              {progressLineEndPosition && (
                <Line
                  points={[centralNodePosition, progressLineEndPosition.toArray()]}
                  color="#10b981" // Bright color for progress
                  lineWidth={4}
                  dashed={false}
                  transparent
                  opacity={0.9}
                />
              )}

              {/* Hovered Node Name Display */}
              {hoveredNodeName && (
                <Html position={[0, -2, 0]} center>
                  <motion.div
                    className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-mono border border-green-500/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {hoveredNodeName}
                  </motion.div>
                </Html>
              )}
            </Suspense>
          </Canvas>

          {/* Close Button (HTML overlay) */}
          <div className="absolute top-4 right-4 z-[101]">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Helper component to track mouse and update progress line
function TrackPointerProgress({
  socialNodeMeshes,
  centralNodePosition,
  setProgressLineEndPosition,
  setHoveredNodeName,
}: {
  socialNodeMeshes: THREE.Mesh[]
  centralNodePosition: [number, number, number]
  setProgressLineEndPosition: React.Dispatch<React.SetStateAction<THREE.Vector3 | null>>
  setHoveredNodeName: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const { camera, raycaster, gl } = useThree()
  const mouse = useRef(new THREE.Vector2())

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.current.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1
      mouse.current.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1
    },
    [gl.domElement.clientWidth, gl.domElement.clientHeight],
  )

  useEffect(() => {
    gl.domElement.addEventListener("mousemove", onMouseMove)
    return () => {
      gl.domElement.removeEventListener("mousemove", onMouseMove)
    }
  }, [gl.domElement, onMouseMove])

  useFrame(() => {
    if (socialNodeMeshes.length === 0) return

    raycaster.setFromCamera(mouse.current, camera)
    const intersects = raycaster.intersectObjects(socialNodeMeshes)

    if (intersects.length > 0) {
      const firstIntersect = intersects[0]
      const intersectedObject = firstIntersect.object as THREE.Mesh
      const nodeName = (intersectedObject.parent?.parent as any)?.link?.name || "Unknown" // Access name from prop

      // Calculate proximity factor based on distance from ray origin to intersection point
      // This makes the line extend as the mouse gets closer to the object
      const distanceToIntersection = firstIntersect.distance
      const maxInteractionDistance = 5 // Adjust this value based on your scene scale and desired sensitivity
      const proximityFactor = Math.max(0, 1 - distanceToIntersection / maxInteractionDistance)

      if (proximityFactor > 0.1) {
        // Only show progress line if close enough
        setHoveredNodeName(nodeName)
        const avatarVec = new THREE.Vector3(...centralNodePosition)
        const targetVec = intersectedObject.position // Use the actual animated position of the mesh
        const progressEndPoint = new THREE.Vector3().lerpVectors(avatarVec, targetVec, proximityFactor)
        setProgressLineEndPosition(progressEndPoint)
      } else {
        setProgressLineEndPosition(null)
        setHoveredNodeName(null)
      }
    } else {
      setProgressLineEndPosition(null)
      setHoveredNodeName(null)
    }
  })

  return null // This component doesn't render anything directly
}
