import { Html, SoftShadows } from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { exhibits } from '../data/exhibits'
import type { Exhibit, MoveCommand } from '../types'

type Props = {
  command?: MoveCommand
  activeId?: string
  visited: Set<string>
  onArrive: (exhibit: Exhibit) => void
  onMoveAnywhere: () => void
}

const FLOOR_Y = 0

function CameraSetup() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(17, 20, 20)
    camera.lookAt(0, 0, -1)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

function Wall({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#d7cfc1" roughness={0.88} />
    </mesh>
  )
}

function RoomLabel({ position, children }: { position: [number, number, number]; children: string }) {
  return (
    <Html position={position} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
      <div className="room-label">{children}</div>
    </Html>
  )
}

function Artifact({ kind }: { kind: Exhibit['kind'] }) {
  if (kind === 'statue') {
    return (
      <group position={[0, 0.62, 0]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <capsuleGeometry args={[0.28, 0.9, 6, 12]} />
          <meshStandardMaterial color="#9b6d43" metalness={0.35} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.38, 0]} castShadow>
          <sphereGeometry args={[0.31, 20, 20]} />
          <meshStandardMaterial color="#9b6d43" metalness={0.35} roughness={0.5} />
        </mesh>
      </group>
    )
  }

  if (kind === 'sandals') {
    return (
      <group position={[0, 0.54, 0]} rotation={[0, -0.2, 0]}>
        {[-0.2, 0.2].map((x, i) => (
          <group key={x} position={[x, 0, i === 0 ? 0.08 : -0.05]} rotation={[0, i === 0 ? -0.18 : 0.18, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.055, 0.72]} />
              <meshStandardMaterial color="#252423" roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.09, 0.05]} rotation={[0.4, 0, 0]}>
              <torusGeometry args={[0.11, 0.025, 8, 18, Math.PI]} />
              <meshStandardMaterial color="#34312e" />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  if (kind === 'document') {
    return (
      <group position={[0, 0.6, 0]} rotation={[-0.18, 0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.95, 0.06, 0.72]} />
          <meshStandardMaterial color="#e7d3a9" roughness={0.8} />
        </mesh>
        {[0.18, 0.04, -0.1].map((z) => (
          <mesh key={z} position={[0, 0.035, z]}>
            <boxGeometry args={[0.62, 0.01, 0.025]} />
            <meshBasicMaterial color="#866f54" />
          </mesh>
        ))}
      </group>
    )
  }

  if (kind === 'clothing') {
    return (
      <group position={[0, 0.78, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.9, 0.12]} />
          <meshStandardMaterial color="#b7ad86" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.63, 0]} castShadow>
          <boxGeometry args={[0.64, 0.42, 0.12]} />
          <meshStandardMaterial color="#b7ad86" roughness={0.9} />
        </mesh>
      </group>
    )
  }

  if (kind === 'heritage') {
    return (
      <group position={[0, 0.55, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.12, 0.58]} />
          <meshStandardMaterial color="#7d5134" roughness={0.9} />
        </mesh>
        {[-0.38, 0.38].flatMap((x) => [-0.2, 0.2].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.36, z]} castShadow>
            <boxGeometry args={[0.08, 0.7, 0.08]} />
            <meshStandardMaterial color="#6d452f" />
          </mesh>
        )))}
      </group>
    )
  }

  return (
    <group position={[0, 0.75, 0]}>
      <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#b98b54" roughness={0.48} metalness={0.22} />
      </mesh>
    </group>
  )
}

function DisplayCase({ exhibit, active, visited, onNavigate }: {
  exhibit: Exhibit
  active: boolean
  visited: boolean
  onNavigate: (item: Exhibit) => void
}) {
  const [hovered, setHovered] = useState(false)
  const markerRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!markerRef.current) return
    markerRef.current.position.y = 2.55 + Math.sin(clock.elapsedTime * 2.1 + exhibit.index) * 0.1
    markerRef.current.rotation.y += 0.012
  })

  return (
    <group position={exhibit.position}>
      <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.1, 0.36, 1.55]} />
        <meshStandardMaterial color={active ? '#7b2e2e' : '#8a735c'} roughness={0.72} />
      </mesh>
      <Artifact kind={exhibit.kind} />
      <mesh position={[0, 1.28, 0]} castShadow>
        <boxGeometry args={[1.95, 1.82, 1.4]} />
        <meshPhysicalMaterial
          color="#dfe9e4"
          transparent
          opacity={0.17}
          roughness={0.08}
          transmission={0.25}
          thickness={0.08}
        />
      </mesh>
      <mesh
        ref={markerRef}
        position={[0, 2.55, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onNavigate(exhibit) }}
        castShadow
      >
        <octahedronGeometry args={[hovered ? 0.34 : 0.27, 0]} />
        <meshStandardMaterial color={visited ? '#c9a96b' : '#8a2f2f'} emissive={hovered ? '#642020' : '#000000'} />
      </mesh>
      <Html position={[0, 3.15, 0]} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
        <div className={`world-tag ${active ? 'is-active' : ''}`}>
          <span>{visited ? '✓' : String(exhibit.index).padStart(2, '0')}</span>
          {exhibit.title}
        </div>
      </Html>
    </group>
  )
}

function Player({ targetRef, onReached }: {
  targetRef: React.MutableRefObject<{ point: THREE.Vector3; exhibitId?: string } | null>
  onReached: (id?: string) => void
}) {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const velocity = useMemo(() => new THREE.Vector3(), [])
  const lastReached = useRef<string | undefined>(undefined)

  useFrame(({ clock }, delta) => {
    if (!root.current) return
    const target = targetRef.current
    if (!target) {
      if (body.current) body.current.position.y = 0
      return
    }

    const current = root.current.position
    const toTarget = velocity.set(target.point.x - current.x, 0, target.point.z - current.z)
    const distance = toTarget.length()

    if (distance < 0.16) {
      current.x = target.point.x
      current.z = target.point.z
      if (target.exhibitId !== lastReached.current) {
        lastReached.current = target.exhibitId
        onReached(target.exhibitId)
      }
      targetRef.current = null
      if (body.current) body.current.position.y = 0
      return
    }

    lastReached.current = undefined
    const speed = Math.min(4.3, Math.max(2.3, distance * 2.0))
    const step = Math.min(distance, speed * delta)
    toTarget.normalize()
    current.addScaledVector(toTarget, step)
    root.current.rotation.y = Math.atan2(toTarget.x, toTarget.z)
    if (body.current) body.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 8)) * 0.045
  })

  return (
    <group ref={root} position={[0, FLOOR_Y, 12.3]}>
      <group ref={body}>
        <mesh position={[0, 0.86, 0]} castShadow>
          <capsuleGeometry args={[0.28, 0.65, 6, 10]} />
          <meshStandardMaterial color="#33485b" roughness={0.75} />
        </mesh>
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.29, 18, 18]} />
          <meshStandardMaterial color="#d8a77e" roughness={0.9} />
        </mesh>
        <mesh position={[-0.19, 0.18, 0]} castShadow>
          <boxGeometry args={[0.17, 0.48, 0.28]} />
          <meshStandardMaterial color="#2c343c" />
        </mesh>
        <mesh position={[0.19, 0.18, 0]} castShadow>
          <boxGeometry args={[0.17, 0.48, 0.28]} />
          <meshStandardMaterial color="#2c343c" />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.38, 0.55, 28]} />
        <meshBasicMaterial color="#7b2e2e" transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

function MuseumWorld({ command, activeId, visited, onArrive, onMoveAnywhere }: Props) {
  const targetRef = useRef<{ point: THREE.Vector3; exhibitId?: string } | null>(null)

  useEffect(() => {
    if (!command) return
    targetRef.current = {
      point: new THREE.Vector3(command.destination[0], 0, command.destination[1]),
      exhibitId: command.exhibitId,
    }
  }, [command])

  const navigateToExhibit = (item: Exhibit) => {
    targetRef.current = {
      point: new THREE.Vector3(item.approach[0], 0, item.approach[1]),
      exhibitId: item.id,
    }
  }

  const handleFloorClick = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onMoveAnywhere()
    targetRef.current = { point: new THREE.Vector3(event.point.x, 0, event.point.z) }
  }

  const handleReached = (id?: string) => {
    if (!id) return
    const item = exhibits.find((exhibit) => exhibit.id === id)
    if (item) onArrive(item)
  }

  return (
    <>
      <CameraSetup />
      <SoftShadows size={24} samples={14} focus={0.4} />
      <color attach="background" args={['#eee8dd']} />
      <fog attach="fog" args={['#eee8dd', 28, 48]} />
      <ambientLight intensity={1.55} />
      <directionalLight position={[8, 16, 10]} intensity={2.1} castShadow shadow-mapSize={[2048, 2048]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[25, 29]} />
        <meshStandardMaterial color="#d8cbb8" roughness={0.94} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 3.5]} receiveShadow>
        <planeGeometry args={[6.2, 20.5]} />
        <meshStandardMaterial color="#eee5d7" roughness={0.92} />
      </mesh>

      <Wall position={[-12.2, 1.2, 0]} scale={[0.35, 2.4, 29]} />
      <Wall position={[12.2, 1.2, 0]} scale={[0.35, 2.4, 29]} />
      <Wall position={[0, 1.2, -14.2]} scale={[24.5, 2.4, 0.35]} />
      <Wall position={[-7.3, 1.2, 14.2]} scale={[9.6, 2.4, 0.35]} />
      <Wall position={[7.3, 1.2, 14.2]} scale={[9.6, 2.4, 0.35]} />

      <Wall position={[-8.4, 1.05, 6.9]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[8.4, 1.05, 6.9]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[-8.4, 1.05, -2.0]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[8.4, 1.05, -2.0]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[-8.4, 1.05, -8.8]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[8.4, 1.05, -8.8]} scale={[7.5, 2.1, 0.25]} />

      <RoomLabel position={[0, 0.25, 11.4]}>LỐI VÀO</RoomLabel>
      <RoomLabel position={[0, 0.25, 4.4]}>GIAN LONG TRỌNG</RoomLabel>
      <RoomLabel position={[-7.3, 0.25, 3.6]}>QUÊ HƯƠNG</RoomLabel>
      <RoomLabel position={[7.3, 0.25, 3.6]}>TƯ LIỆU</RoomLabel>
      <RoomLabel position={[-7.3, 0.25, -6.7]}>KỶ VẬT</RoomLabel>
      <RoomLabel position={[7.3, 0.25, -6.7]}>KỶ VẬT</RoomLabel>
      <RoomLabel position={[0, 0.25, -12.6]}>TƯỞNG NIỆM</RoomLabel>

      {exhibits.map((item) => (
        <DisplayCase
          key={item.id}
          exhibit={item}
          active={activeId === item.id}
          visited={visited.has(item.id)}
          onNavigate={navigateToExhibit}
        />
      ))}

      <Player targetRef={targetRef} onReached={handleReached} />
    </>
  )
}

export function MuseumScene(props: Props) {
  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [17, 20, 20], zoom: 34, near: 0.1, far: 100 }}
      gl={{ antialias: true }}
    >
      <MuseumWorld {...props} />
    </Canvas>
  )
}
