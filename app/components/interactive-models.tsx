"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import type * as THREE from "three"

interface InteractiveModelProps {
  isDark: boolean
}

function Laptop({ isDark }: InteractiveModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (groupRef.current && !clicked) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <>
      <OrbitControls enablePan={false} enableZoom={true} maxDistance={8} minDistance={2} />
      <ambientLight intensity={isDark ? 0.4 : 0.6} />
      <pointLight position={[2, 2, 2]} intensity={isDark ? 0.8 : 1} color="#10b981" />

      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
        scale={hovered ? 1.1 : 1}
      >
        {/* Laptop Base */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[3, 0.2, 2]} />
          <meshStandardMaterial color={isDark ? "#374151" : "#6b7280"} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Laptop Screen */}
        <mesh position={[0, 0.5, -0.9]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[2.8, 1.8, 0.1]} />
          <meshStandardMaterial color={isDark ? "#1f2937" : "#4b5563"} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Screen Content */}
        <mesh position={[0, 0.5, -0.85]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[2.6, 1.6]} />
          <meshStandardMaterial color="#000000" emissive="#10b981" emissiveIntensity={0.3} />
        </mesh>

        {/* Keyboard */}
        <mesh position={[0, -0.4, 0.3]}>
          <boxGeometry args={[2.6, 0.05, 1.4]} />
          <meshStandardMaterial color={isDark ? "#111827" : "#374151"} metalness={0.3} roughness={0.7} />
        </mesh>

        {hovered && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">Click and drag to rotate</div>
          </Html>
        )}
      </group>
    </>
  )
}

function Smartphone({ isDark }: InteractiveModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (groupRef.current && !clicked) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <>
      <OrbitControls enablePan={false} enableZoom={true} maxDistance={6} minDistance={2} />
      <ambientLight intensity={isDark ? 0.4 : 0.6} />
      <pointLight position={[1, 2, 1]} intensity={isDark ? 0.8 : 1} color="#3b82f6" />

      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
        scale={hovered ? 1.1 : 1}
      >
        {/* Phone Body */}
        <mesh>
          <boxGeometry args={[1, 2, 0.2]} />
          <meshStandardMaterial color={isDark ? "#1f2937" : "#374151"} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.9, 1.8, 0.01]} />
          <meshStandardMaterial color="#000000" emissive="#3b82f6" emissiveIntensity={0.2} />
        </mesh>

        {/* Home Button */}
        <mesh position={[0, -0.7, 0.11]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color={isDark ? "#6b7280" : "#9ca3af"} metalness={0.8} roughness={0.2} />
        </mesh>

        {hovered && (
          <Html position={[0, 1.5, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">Mobile-first development</div>
          </Html>
        )}
      </group>
    </>
  )
}

function Server({ isDark }: InteractiveModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (groupRef.current && !clicked) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
    }
  })

  return (
    <>
      <OrbitControls enablePan={false} enableZoom={true} maxDistance={8} minDistance={2} />
      <ambientLight intensity={isDark ? 0.4 : 0.6} />
      <pointLight position={[2, 2, 2]} intensity={isDark ? 0.8 : 1} color="#ef4444" />

      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
        scale={hovered ? 1.05 : 1}
      >
        {/* Server Rack */}
        <mesh>
          <boxGeometry args={[2, 3, 1]} />
          <meshStandardMaterial color={isDark ? "#111827" : "#374151"} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Server Units */}
        {[0.8, 0.2, -0.4, -1.0].map((y, index) => (
          <group key={index}>
            <mesh position={[0, y, 0.51]}>
              <boxGeometry args={[1.8, 0.3, 0.02]} />
              <meshStandardMaterial color={isDark ? "#374151" : "#6b7280"} metalness={0.8} roughness={0.2} />
            </mesh>

            {/* LED Indicators */}
            <mesh position={[-0.7, y, 0.52]}>
              <cylinderGeometry args={[0.02, 0.02, 0.01]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
            </mesh>

            <mesh position={[-0.5, y, 0.52]}>
              <cylinderGeometry args={[0.02, 0.02, 0.01]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={Math.sin(Date.now() * 0.01 + index) > 0 ? 0.5 : 0.1}
              />
            </mesh>
          </group>
        ))}

        {hovered && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">Scalable backend infrastructure</div>
          </Html>
        )}
      </group>
    </>
  )
}

function ProjectPreview({
  projectIndex,
  color,
  isDark,
}: {
  projectIndex: number
  color: string
  isDark: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3 + projectIndex
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime + projectIndex) * 0.1
    }
  })

  const shapes = [
    // Voidline - Security themed
    () => (
      <mesh>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe={hovered}
        />
      </mesh>
    ),
    // CampusConnect - Social themed
    () => (
      <mesh>
        <torusGeometry args={[0.8, 0.3, 8, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe={hovered}
        />
      </mesh>
    ),
    // NuroDesk - AI themed
    () => (
      <mesh>
        <icosahedronGeometry args={[1]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe={hovered}
        />
      </mesh>
    ),
  ]

  const ShapeComponent = shapes[projectIndex] || shapes[0]

  return (
    <>
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={true} />
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={0.6} color={color} />

      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <ShapeComponent />

        {hovered && (
          <Html position={[0, 1.5, 0]} center>
            <div className="bg-black/80 text-white px-2 py-1 rounded text-sm">Click and drag to explore</div>
          </Html>
        )}
      </group>
    </>
  )
}

export const InteractiveModels = {
  Laptop,
  Smartphone,
  Server,
  ProjectPreview,
}
