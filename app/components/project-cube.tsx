"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Html } from "@react-three/drei"
import type * as THREE from "three"

interface ProjectCubeProps {
  project: {
    name: string
    color: string
    category: string
  }
  index: number
  isDark: boolean
}

export function ProjectCube({ project, index, isDark }: ProjectCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 + index
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + index
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.2
    }
  })

  const shapes = [
    // Voidline - Security (Octahedron)
    () => <octahedronGeometry args={[1]} />,
    // CampusConnect - Social (Torus)
    () => <torusGeometry args={[0.8, 0.3, 8, 16]} />,
    // NuroDesk - AI (Icosahedron)
    () => <icosahedronGeometry args={[1]} />,
  ]

  const ShapeGeometry = shapes[index] || shapes[0]

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={0.8} color={project.color} />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <ShapeGeometry />
          <meshStandardMaterial
            color={project.color}
            transparent
            opacity={hovered ? 0.9 : 0.7}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.4 : 0.2}
            wireframe={hovered}
          />
        </mesh>

        {hovered && (
          <Html position={[0, 2, 0]} center>
            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono border border-green-500/30">
              {project.category}
            </div>
          </Html>
        )}
      </Float>
    </>
  )
}
