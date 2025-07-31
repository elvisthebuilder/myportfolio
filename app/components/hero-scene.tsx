"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

interface HeroSceneProps {
  isDark: boolean
}

function FloatingGeometry({
  position,
  color,
  isDark,
}: { position: [number, number, number]; color: string; isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isDark ? 0.8 : 0.6}
          emissive={color}
          emissiveIntensity={isDark ? 0.2 : 0.1}
        />
      </mesh>
    </Float>
  )
}

function CodeParticles({ isDark }: { isDark: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={isDark ? "#10b981" : "#059669"} transparent opacity={0.6} />
    </points>
  )
}

export function HeroScene({ isDark }: HeroSceneProps) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.3 : 0.5} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 0.8 : 1} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={isDark ? 0.5 : 0.7} color="#3b82f6" />

      <CodeParticles isDark={isDark} />

      <FloatingGeometry position={[-4, 2, -2]} color="#10b981" isDark={isDark} />
      <FloatingGeometry position={[4, -2, -3]} color="#3b82f6" isDark={isDark} />
      <FloatingGeometry position={[2, 3, -1]} color="#ef4444" isDark={isDark} />
      <FloatingGeometry position={[-3, -1, -4]} color="#f59e0b" isDark={isDark} />
      <FloatingGeometry position={[0, -3, -2]} color="#8b5cf6" isDark={isDark} />
    </>
  )
}
