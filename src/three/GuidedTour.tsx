import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMuseumStore } from '../store/useMuseumStore'

const TOUR_POINTS = [
  new THREE.Vector3(0, 2.1, 22),
  new THREE.Vector3(-4, 1.9, 17),
  new THREE.Vector3(4, 1.9, 13),
  new THREE.Vector3(-4, 1.9, 5),
  new THREE.Vector3(4, 1.9, -7),
  new THREE.Vector3(0, 2.0, -20),
]

export function GuidedTour() {
  const camera = useThree((s) => s.camera)
  const active = useMuseumStore((s) => s.tourActive)
  const setTourActive = useMuseumStore((s) => s.setTourActive)
  const setRoom = useMuseumStore((s) => s.setRoom)
  const elapsed = useRef(0)
  const curve = useMemo(() => new THREE.CatmullRomCurve3(TOUR_POINTS, false, 'catmullrom', 0.3), [])

  useEffect(() => {
    if (active) elapsed.current = 0
  }, [active])

  useFrame((_, delta) => {
    if (!active) return
    elapsed.current += delta
    const duration = 22
    const t = THREE.MathUtils.clamp(elapsed.current / duration, 0, 1)
    const position = curve.getPointAt(t)
    const lookT = Math.min(1, t + 0.015)
    const lookAt = curve.getPointAt(lookT)
    camera.position.copy(position)
    camera.lookAt(lookAt)

    if (t >= 1) {
      setRoom('room3')
      setTourActive(false)
    }
  })

  return null
}
