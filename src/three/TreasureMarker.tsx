import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useMuseumStore } from '../store/useMuseumStore'
import type { Treasure } from '../types'

export function TreasureMarker({ treasure }: { treasure: Treasure }) {
  const camera = useThree((s) => s.camera)
  const group = useRef<THREE.Group>(null)
  const [near, setNear] = useState(false)
  const collected = useMuseumStore((s) => s.collected.includes(treasure.id))
  const collect = useMuseumStore((s) => s.collect)
  const openExhibit = useMuseumStore((s) => s.openExhibit)
  const tourActive = useMuseumStore((s) => s.tourActive)

  const interact = () => {
    if (collected || tourActive) return
    collect(treasure.id)
    openExhibit({ id: treasure.id, title: treasure.title, subtitle: treasure.subtitle })
  }

  useFrame((_, delta) => {
    if (!group.current || collected) return
    group.current.rotation.y += delta * 0.8
    const distance = camera.position.distanceTo(group.current.position)
    const shouldBeNear = distance < 2.4
    if (shouldBeNear !== near) setNear(shouldBeNear)
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e' && near) interact()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [near, collected, tourActive])

  if (collected) return null

  return (
    <group ref={group} position={treasure.position}>
      <mesh castShadow onClick={interact}>
        <octahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#caa969" emissive="#6f4f1f" emissiveIntensity={0.8} metalness={0.45} roughness={0.25} />
      </mesh>
      <pointLight intensity={1.8} distance={2.6} color="#f3d79a" />
      {near && (
        <Html center position={[0, 0.65, 0]} distanceFactor={8}>
          <div className="interaction-prompt"><kbd>E</kbd> Khám phá</div>
        </Html>
      )}
    </group>
  )
}
