"use client"
import type React from "react"
import type { ReactElement } from "react"
import { useRef, useState, Suspense, useCallback, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Html, Line, Environment, Circle } from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { FaLinkedin, FaTwitter, FaInstagram, FaDiscord, FaEnvelope } from "react-icons/fa"
import { FaGithub } from "react-icons/fa6"
import { Button } from "@/components/ui/button"

interface SocialNodesSceneProps {
  isOpen: boolean
  onClose: () => void
}

interface SocialPlanetProps {
  link: {
    name: string
    icon: ReactElement
    href: string
    description: string
    color: string
    size: number // This size is now primarily for the raycast circle, not HTML div
  }
  orbitRadius: number
  orbitSpeed: number
  onNodeHover: (name: string | null) => void
  isCurrentlyHovered: boolean
  onMeshReady: (name: string, mesh: THREE.Mesh) => void
  index: number
  totalCount: number
  rotationOffset: number
  isDockMode: boolean
  dockPosition: "top" | "bottom"
  dockProgress: number
  isCircleMode: boolean // New prop for circle mode
  circleProgress: number // New prop for circle transition progress
}

function SocialPlanet({
  link,
  orbitRadius,
  orbitSpeed,
  onNodeHover,
  onMeshReady,
  index,
  totalCount,
  rotationOffset,
  isDockMode,
  dockPosition,
  dockProgress,
  isCircleMode,
  circleProgress,
}: SocialPlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)

  // Calculate arc position
  const baseStartAngle = -Math.PI / 2.5
  const baseEndAngle = Math.PI / 2.5
  const totalAngle = baseEndAngle - baseStartAngle
  const baseAngle = baseStartAngle + (index / (totalCount - 1)) * totalAngle
  const arcAngle = baseAngle + rotationOffset
  const arcX = Math.cos(arcAngle) * orbitRadius
  const arcY = Math.sin(arcAngle) * orbitRadius

  // Calculate arc rotation (icons facing outwards from the center)
  const arcRotation = arcAngle + Math.PI / 2

  // Define dock rotation (icons upright)
  const dockRotation = 0

  // Full Circle calculations
  const circleAngle = (index / totalCount) * (2 * Math.PI) // Evenly spaced
  const circleX = Math.cos(circleAngle) * ((link as any).circleRadius || 2.5)
  const circleY = Math.sin(circleAngle) * ((link as any).circleRadius || 2.5)
  const circleRotation = circleAngle + Math.PI / 2 // Face outwards

  let currentX: number, currentY: number, currentRotation: number

  if (isDockMode && dockProgress > 0) {
    const spacing = (link as any).dockSpacing || 1.0
    const totalWidth = (totalCount - 1) * spacing
    const startX = -totalWidth / 2

    let dockX: number
    let staggerDelay: number
    const baseStagger = 0.08 // Base delay for each icon

    if (dockPosition === "bottom") {
      // Bottom dock: Email leftmost, Discord rightmost. Animation: Right to Left (Discord first)
      dockX = startX + index * spacing
      staggerDelay = (totalCount - 1 - index) * baseStagger
    } else {
      // Top dock: Discord leftmost, Email rightmost. Animation: Left to Right (Discord first)
      dockX = startX + (totalCount - 1 - index) * spacing // Reverse the order for top dock
      staggerDelay = index * baseStagger // Stagger from left to right based on the new reversed order
    }

    const dockY = dockPosition === "top" ? ((link as any).dockY || 2.0) : -((link as any).dockY || 2.0)

    const staggeredProgress = Math.max(0, Math.min((dockProgress - staggerDelay) / (1 - staggerDelay), 1))

    currentX = arcX + (dockX - arcX) * staggeredProgress
    currentY = arcY + (dockY - arcY) * dockProgress
    currentRotation = arcRotation + (dockRotation - arcRotation) * staggeredProgress
  } else if (isCircleMode && circleProgress > 0) {
    // Interpolate from arc to circle
    currentX = arcX + (circleX - arcX) * circleProgress
    currentY = arcY + (circleY - arcY) * circleProgress
    currentRotation = arcRotation + (circleRotation - arcRotation) * circleProgress
  } else {
    // Arc layout: original orbital positioning
    currentX = arcX
    currentY = arcY
    currentRotation = arcRotation
  }

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(currentX, currentY, 0)
      groupRef.current.rotation.z = currentRotation // Apply rotation
    }
  }, [currentX, currentY, currentRotation])

  useEffect(() => {
    if (meshRef.current) {
      onMeshReady(link.name, meshRef.current)
    }
  }, [link.name, onMeshReady, meshRef])

  return (
    <group ref={groupRef}>
      {/* Invisible mesh for raycasting */}
      <Circle
        ref={meshRef}
        args={[0.15, 32]} // Fixed size for raycasting, adjust as needed to match HTML div visual size
        position={[0, 0, -0.01]} // Slightly behind HTML to avoid z-fighting
        userData={{ name: link.name }} // Store link name for raycasting
      >
        <meshBasicMaterial transparent opacity={0} />
      </Circle>
      <Html center onClick={() => window.open(link.href, "_blank")} transform>
        <div
          className={`flex items-center justify-center cursor-pointer ${(link as any).containerPadding || 'p-2'} ${(link as any).containerSize || 'w-8 h-8'} rounded-full`}
          style={{ cursor: "pointer" }}
        >
          {link.icon}
        </div>
      </Html>
    </group>
  )
}

export function SocialNodesScene({ isOpen, onClose }: SocialNodesSceneProps) {
  const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null)
  const [progressLineEndPosition, setProgressLineEndPosition] = useState<THREE.Vector3 | null>(null)
  const [socialNodeMeshes, setSocialNodeMeshes] = useState<Map<string, THREE.Mesh>>(new Map())
  const [rotationOffset, setRotationOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDockMode, setIsDockMode] = useState(false)
  const [dockPosition, setDockPosition] = useState<"top" | "bottom">("bottom")
  const [dockProgress, setDockProgress] = useState(0)
  const [isCircleMode, setIsCircleMode] = useState(false)
  const [circleProgress, setCircleProgress] = useState(0)
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight })
    }
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  const responsiveValues = useMemo(() => {
    const isMobile = screenSize.width < 640
    const isTablet = screenSize.width >= 640 && screenSize.width < 1024
    
    return {
      orbitRadius: isMobile ? 1.2 : isTablet ? 1.6 : 2.0,
      circleRadius: isMobile ? 1.1 : isTablet ? 1.9 : 2.5,
      dockSpacing: isMobile ? 0.5 : isTablet ? 1.0 : 1.4,
      dockY: isMobile ? 1.4 : isTablet ? 1.8 : 2.5,
      iconSize: isMobile ? 'w-4 h-4' : isTablet ? 'w-5 h-5' : 'w-6 h-6',
      containerSize: isMobile ? 'w-6 h-6' : isTablet ? 'w-8 h-8' : 'w-12 h-12',
      containerPadding: isMobile ? 'p-1' : isTablet ? 'p-2' : 'p-3'
    }
  }, [screenSize.width])

  const centralNodePosition: [number, number, number] = [0, 0, 0]
  const UNIFORM_ORBIT_RADIUS = responsiveValues.orbitRadius

  const socialPlanets = [
    {
      name: "Email",
      icon: <FaEnvelope className={responsiveValues.iconSize} style={{ color: "#EA4335" }} />,
      href: "mailto:elvis@noctyx.dev",
      description: "Send me an email",
      color: "#EA4335",
      size: 0.25,
      orbitSpeed: 0.008,
      ...responsiveValues
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className={responsiveValues.iconSize} style={{ color: "#0A66C2" }} />,
      href: "https://linkedin.com/in/elvisnoctyx",
      description: "Connect professionally",
      color: "#0A66C2",
      size: 0.3,
      orbitSpeed: 0.006,
      ...responsiveValues
    },
    {
      name: "X (Twitter)",
      icon: <FaTwitter className={responsiveValues.iconSize} style={{ color: "#1DA1F2" }} />,
      href: "https://twitter.com/noctyx_dev",
      description: "Follow my dev journey",
      color: "#1DA1F2",
      size: 0.28,
      orbitSpeed: 0.005,
      ...responsiveValues
    },
    {
      name: "GitHub",
      icon: <FaGithub className={responsiveValues.iconSize} style={{ color: "#ffffff" }} />,
      href: "https://github.com/noctyx",
      description: "Explore my code",
      color: "#ffffff",
      size: 0.35,
      orbitSpeed: 0.004,
      ...responsiveValues
    },
    {
      name: "Instagram",
      icon: <FaInstagram className={responsiveValues.iconSize} style={{ color: "#E4405F" }} />,
      href: "https://instagram.com/noctyx_dev",
      description: "See my creative side",
      color: "#E4405F",
      size: 0.32,
      orbitSpeed: 0.003,
      ...responsiveValues
    },
    {
      name: "Discord",
      icon: <FaDiscord className={responsiveValues.iconSize} style={{ color: "#5865F2" }} />,
      href: "https://discord.gg/your-invite",
      description: "Chat with me live",
      color: "#5865F2",
      size: 0.27,
      orbitSpeed: 0.002,
      ...responsiveValues
    },
  ]

  const handleNodeHover = useCallback((name: string | null) => {
    setHoveredNodeName(name)
  }, [])

  const handleMeshReady = useCallback((name: string, mesh: THREE.Mesh) => {
    setSocialNodeMeshes((prev) => new Map(prev).set(name, mesh))
  }, [])

  // Helper function for animating dock progress
  const animateDockProgress = useCallback((start: number, end: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI)
        setDockProgress(start + (end - start) * easeProgress)
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      animate()
    })
  }, [])

  // Helper function for animating circle progress
  const animateCircleProgress = useCallback((start: number, end: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI)
        setCircleProgress(start + (end - start) * easeProgress)
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      animate()
    })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Centered Modal */}
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className="w-full max-w-4xl h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden border border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md mx-2 sm:mx-0">
              <Canvas camera={{ position: [0, 0, 8], zoom: 100 }} dpr={[1, 2]} gl={{ alpha: true }} orthographic={true}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.3} />
                  <pointLight position={[0, 0, 0]} intensity={2} color="#ffd700" />
                  <Environment preset="night" />
                  {/* Single Orbit Line - matches exact icon radius */}
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[3.45, 3.55, 64]} />
                    <meshBasicMaterial color="#ffffff" transparent={false} />
                  </mesh>
                  {/* Central Avatar */}
                  <Html center position={[0, 0, 0]}>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 sm:border-3 md:border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50">
                      <img
                        src="/etb.jpeg"
                        alt="Elvis Baidoo (Noctyx) Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Html>
                  {/* Social Planets */}
                  {socialPlanets.map((planet, index) => (
                    <SocialPlanet
                      key={planet.name}
                      link={planet}
                      orbitRadius={UNIFORM_ORBIT_RADIUS}
                      orbitSpeed={planet.orbitSpeed}
                      onNodeHover={handleNodeHover}
                      isCurrentlyHovered={hoveredNodeName === planet.name}
                      onMeshReady={handleMeshReady}
                      index={index}
                      totalCount={socialPlanets.length}
                      rotationOffset={rotationOffset}
                      isDockMode={isDockMode}
                      dockPosition={dockPosition}
                      dockProgress={dockProgress}
                      isCircleMode={isCircleMode} // Pass new prop
                      circleProgress={circleProgress} // Pass new prop
                    />
                  ))}
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
              {/* Control Buttons (HTML overlay) */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-[101] flex flex-col gap-1 sm:gap-2">
                <Button
                  onClick={() => {
                    if (!isAnimating && !isDockMode && !isCircleMode) {
                      // Only allow rotation in arc mode
                      setIsAnimating(true)
                      const targetRotation = rotationOffset + Math.PI
                      const startRotation = rotationOffset
                      const duration = 1000
                      const startTime = Date.now()
                      const animate = () => {
                        const elapsed = Date.now() - startTime
                        const progress = Math.min(elapsed / duration, 1)
                        const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI)
                        setRotationOffset(startRotation + (targetRotation - startRotation) * easeProgress)
                        if (progress < 1) {
                          requestAnimationFrame(animate)
                        } else {
                          setIsAnimating(false)
                        }
                      }
                      animate()
                    }
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
                  disabled={isAnimating || isDockMode || isCircleMode} // Disable if in dock or circle mode
                >
                  <span className="text-xs sm:text-sm font-mono">↻</span>
                </Button>
                <Button
                  onClick={async () => {
                    if (isAnimating) return // Prevent multiple animations
                    setIsAnimating(true)

                    try {
                      if (isDockMode) {
                        // Already docked, switch position: back to arc, then to new dock
                        const currentDockPos = dockPosition
                        const newDockPos = currentDockPos === "bottom" ? "top" : "bottom"

                        // Phase 1: Animate back to arc (dockProgress from 1 to 0)
                        await animateDockProgress(1, 0, 750)

                        // Phase 2: Update dock position and then animate to new dock
                        setDockPosition(newDockPos)
                        const phase2Duration = newDockPos === "top" ? 1500 : 750 // Slower for top transition
                        await animateDockProgress(0, 1, phase2Duration)
                      } else {
                        // Not docked, switch to dock mode
                        if (isCircleMode) {
                          // If currently in circle mode, go back to arc first
                          await animateCircleProgress(1, 0, 1500)
                          setIsCircleMode(false)
                        }
                        setIsDockMode(true)
                        setDockPosition("bottom") // Explicitly set for initial dock
                        await animateDockProgress(0, 1, 1500)
                      }
                    } finally {
                      setIsAnimating(false)
                    }
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
                  disabled={isAnimating}
                >
                  <span className="text-xs font-mono">
                    {isDockMode ? (dockPosition === "bottom" ? "⬆" : "⬇") : "▬"}
                  </span>
                </Button>
                {/* New button for Full Circle mode */}
                <Button
                  onClick={async () => {
                    if (isAnimating) return
                    setIsAnimating(true)

                    try {
                      if (isCircleMode) {
                        // Currently in circle mode, transition back to arc
                        await animateCircleProgress(1, 0, 1500) // Slower transition out of circle
                        setIsCircleMode(false)
                      } else {
                        // Not in circle mode, transition to circle
                        if (isDockMode) {
                          // If currently docked, first go back to arc
                          await animateDockProgress(1, 0, 750)
                          setIsDockMode(false)
                        }
                        setIsCircleMode(true)
                        await animateCircleProgress(0, 1, 1500) // Slower transition into circle
                      }
                    } finally {
                      setIsAnimating(false)
                    }
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
                  disabled={isAnimating}
                >
                  <span className="text-xs font-mono">◎</span> {/* Circle icon */}
                </Button>
                {isDockMode && (
                  <Button
                    onClick={async () => {
                      setIsAnimating(true)
                      try {
                        await animateDockProgress(1, 0, 1500) // Animate from 1 (docked) to 0 (arc)
                        setIsDockMode(false)
                      } finally {
                        setIsAnimating(false)
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
                  >
                    <span className="text-xs font-mono">◯</span>
                  </Button>
                )}
              </div>
              {/* Close Button (HTML overlay) */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-[101]">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border border-[#21262d] bg-[#161b22] text-[#7d8590] transition-colors duration-300 hover:border-[#4195f6] hover:text-[#4195f6]"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
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
      const nodeName = (intersectedObject.userData as any)?.name || "Unknown" // Access name from userData

      // Calculate proximity factor based on distance from ray origin to intersection point
      // This makes the line extend as the mouse gets closer to the object
      const distanceToIntersection = firstIntersect.distance
      const maxInteractionDistance = 0.5 // Adjusted for better sensitivity
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
