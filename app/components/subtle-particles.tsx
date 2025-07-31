"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface SubtleParticlesProps {
  isDark: boolean
}

export function SubtleParticles({ isDark }: SubtleParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const particleCount = 50
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      // Blue theme particles
      colors[i * 3] = 0.25 // R
      colors[i * 3 + 1] = 0.58 // G
      colors[i * 3 + 2] = 0.96 // B
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.0005
        positions[i * 3] += Math.cos(state.clock.elapsedTime + i) * 0.0003

        if (positions[i * 3 + 1] > 15) positions[i * 3 + 1] = -15
        if (positions[i * 3] > 15) positions[i * 3] = -15
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} transparent opacity={0.3} vertexColors blending={THREE.AdditiveBlending} />
    </points>
  )
}
