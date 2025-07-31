"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Float } from "@react-three/drei"
import type * as THREE from "three"

interface TechOrbitProps {
  skills: string[]
  isDark: boolean
}

function OrbitingSkill({
  skill,
  position,
  index,
  isDark,
}: {
  skill: string
  position: [number, number, number]
  index: number
  isDark: boolean
}) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const radius = 3
      const angle = (index / 16) * Math.PI * 2 + time * 0.3

      meshRef.current.position.x = Math.cos(angle) * radius
      meshRef.current.position.z = Math.sin(angle) * radius
      meshRef.current.position.y = Math.sin(time + index) * 0.5

      meshRef.current.lookAt(0, 0, 0)
    }
  })

  const colors = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"]
  const color = colors[index % colors.length]

  return (
    <group ref={meshRef}>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Skill Badge Background */}
        <mesh>
          <planeGeometry args={[1.2, 0.3]} />
          <meshStandardMaterial color={color} transparent opacity={0.2} emissive={color} emissiveIntensity={0.1} />
        </mesh>

        {/* Skill Text */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.12}
          color={isDark ? "#ffffff" : "#000000"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Regular.ttf"
        >
          {skill}
        </Text>
      </Float>
    </group>
  )
}

export function TechOrbit({ skills, isDark }: TechOrbitProps) {
  const centralRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (centralRef.current) {
      centralRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#10b981" />

      <group ref={centralRef}>
        {/* Central Core */}
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh>
            <icosahedronGeometry args={[0.5]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
              wireframe
            />
          </mesh>
        </Float>

        {/* Orbiting Skills */}
        {skills.slice(0, 16).map((skill, index) => (
          <OrbitingSkill key={skill} skill={skill} position={[0, 0, 0]} index={index} isDark={isDark} />
        ))}

        {/* Orbit Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.01, 8, 32]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} transparent opacity={0.5} />
        </mesh>
      </group>
    </>
  )
}
