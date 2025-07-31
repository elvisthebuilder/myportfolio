"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface CodeParticlesProps {
  isDark: boolean
}

export function CodeParticles({ isDark }: CodeParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const particleCount = 200
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Random positions in a large sphere
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50

      // Random colors (green, blue, purple theme)
      const colorChoice = Math.random()
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.06 // Green
        colors[i * 3 + 1] = 0.73
        colors[i * 3 + 2] = 0.51
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.23 // Blue
        colors[i * 3 + 1] = 0.51
        colors[i * 3 + 2] = 0.96
      } else {
        colors[i * 3] = 0.55 // Purple
        colors[i * 3 + 1] = 0.36
        colors[i * 3 + 2] = 0.97
      }
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        // Slow floating motion
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
        positions[i * 3] += Math.cos(state.clock.elapsedTime + i) * 0.0005

        // Reset particles that go too far
        if (positions[i * 3 + 1] > 25) positions[i * 3 + 1] = -25
        if (positions[i * 3] > 25) positions[i * 3] = -25
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        transparent
        opacity={isDark ? 0.6 : 0.4}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
