import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { TREASURES } from '../data/treasures'
import { useMuseumStore } from '../store/useMuseumStore'
import { GuidedTour } from './GuidedTour'
import { MuseumPlaceholder } from './MuseumPlaceholder'
import { Player, type Controls } from './Player'
import { TreasureMarker } from './TreasureMarker'

const keyboardMap = [
  { name: 'forward' as Controls, keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward' as Controls, keys: ['ArrowDown', 'KeyS'] },
  { name: 'left' as Controls, keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right' as Controls, keys: ['ArrowRight', 'KeyD'] },
  { name: 'run' as Controls, keys: ['ShiftLeft', 'ShiftRight'] },
]

function Scene() {
  const dayMode = useMuseumStore((s) => s.dayMode)
  return (
    <>
      <color attach="background" args={[dayMode ? '#bdc6ca' : '#080b12']} />
      <fog attach="fog" args={[dayMode ? '#bdc6ca' : '#080b12', 30, 76]} />
      <ambientLight intensity={dayMode ? 1.2 : 0.22} />
      <directionalLight
        castShadow
        position={[8, 14, 8]}
        intensity={dayMode ? 2.2 : 0.35}
        shadow-mapSize={[2048, 2048]}
      />
      {!dayMode && <pointLight position={[0, 3, 8]} intensity={12} distance={34} color="#f1d7aa" />}
      <Physics gravity={[0, -9.81, 0]}>
        <MuseumPlaceholder />
        <Player />
      </Physics>
      {TREASURES.map((treasure) => <TreasureMarker key={treasure.id} treasure={treasure} />)}
      <GuidedTour />
    </>
  )
}

export function Experience() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
        shadows
        camera={{ fov: 70, near: 0.05, far: 180, position: [0, 1.85, 18] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
