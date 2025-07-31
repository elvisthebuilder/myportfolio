"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

function MatrixRain({ count = 30 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= 0.05
        if (positions[i * 3 + 1] < -10) {
          positions[i * 3 + 1] = 10
          positions[i * 3] = (Math.random() - 0.5) * 20
          positions[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = Math.random() * 20 - 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#00ff00" transparent opacity={0.6} />
    </points>
  )
}

function TerminalCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#00ff00" transparent opacity={0.05} wireframe />
      </mesh>
    </Float>
  )
}

export function TerminalInterface() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#00ff00" />

      <MatrixRain count={50} />

      <TerminalCube position={[-3, 0, -3]} />
      <TerminalCube position={[3, 2, -5]} />
      <TerminalCube position={[0, -2, -4]} />
    </>
  )
}
