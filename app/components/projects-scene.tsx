"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

interface ProjectsSceneProps {
  projects: Array<{
    name: string
    color: string
  }>
  isDark: boolean
}

function ProjectCube({
  position,
  color,
  index,
  isDark,
}: {
  position: [number, number, number]
  color: string
  index: number
  isDark: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 + index
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + index
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} transparent opacity={0.6} emissive={color} emissiveIntensity={0.1} />
      </mesh>
    </Float>
  )
}

export function ProjectsScene({ projects, isDark }: ProjectsSceneProps) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.3} />

      {projects.map((project, index) => (
        <ProjectCube
          key={project.name}
          position={[(index - 1) * 4, 0, -5]}
          color={project.color}
          index={index}
          isDark={isDark}
        />
      ))}
    </>
  )
}
