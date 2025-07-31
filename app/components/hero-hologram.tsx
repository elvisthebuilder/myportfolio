"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Float, Sphere } from "@react-three/drei"
import type * as THREE from "three"

interface HeroHologramProps {
  isDark: boolean
}

function HologramRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.02, 8, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.7} />
    </mesh>
  )
}

function DataNodes({ isDark }: { isDark: boolean }) {
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2
    const radius = 2
    return {
      position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0] as [number, number, number],
      color: ["#10b981", "#3b82f6", "#ef4444", "#f59e0b"][i % 4],
    }
  })

  return (
    <>
      {nodes.map((node, index) => (
        <Float key={index} speed={2} rotationIntensity={1} floatIntensity={2}>
          <Sphere position={node.position} args={[0.1]}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </Sphere>
        </Float>
      ))}
    </>
  )
}

export function HeroHologram({ isDark }: HeroHologramProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 0.5} />
      <pointLight position={[2, 2, 2]} intensity={1} color="#10b981" />
      <pointLight position={[-2, -2, -2]} intensity={0.8} color="#3b82f6" />

      <group ref={groupRef}>
        {/* Central Hologram Text */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.5}
            color={isDark ? "#10b981" : "#059669"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf"
          >
            NOCTYX
          </Text>
        </Float>

        {/* Hologram Rings */}
        <HologramRing radius={1.5} speed={0.5} color="#10b981" />
        <HologramRing radius={2} speed={-0.3} color="#3b82f6" />
        <HologramRing radius={2.5} speed={0.2} color="#ef4444" />

        {/* Data Nodes */}
        <DataNodes isDark={isDark} />

        {/* Central Core */}
        <Float speed={2} rotationIntensity={2} floatIntensity={1}>
          <Sphere args={[0.2]}>
            <meshStandardMaterial color="#ffffff" emissive="#10b981" emissiveIntensity={1} transparent opacity={0.8} />
          </Sphere>
        </Float>
      </group>
    </>
  )
}
