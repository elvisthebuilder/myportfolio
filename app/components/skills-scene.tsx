"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

interface SkillsSceneProps {
  skills: string[]
  isDark: boolean
}

function SkillOrb({
  position,
  skill,
  index,
  isDark,
}: {
  position: [number, number, number]
  skill: string
  index: number
  isDark: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + index
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5
    }
  })

  const colors = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"]
  const color = colors[index % colors.length]

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </Float>
  )
}

export function SkillsScene({ skills, isDark }: SkillsSceneProps) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />

      {skills.slice(0, 8).map((skill, index) => {
        const angle = (index / 8) * Math.PI * 2
        const radius = 4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return <SkillOrb key={skill} position={[x, 0, z]} skill={skill} index={index} isDark={isDark} />
      })}
    </>
  )
}
