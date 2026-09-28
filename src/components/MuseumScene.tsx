import { Html, Line, OrbitControls } from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { exhibits } from '../data/exhibits'
import type { Exhibit, MoveCommand } from '../types'
import { clampToWalkable, findPath, Point2D } from '../utils/pathfinding'

type Props = {
  command?: MoveCommand
  activeId?: string
  visited: Set<string>
  isLocked: boolean
  onArrive: (exhibit: Exhibit) => void
  onMoveAnywhere: () => void
}

interface Ping {
  id: number
  x: number
  z: number
  createdAt: number
}

const FLOOR_Y = 0

// Standard overview camera coordinates
const DEFAULT_CAM_POS = new THREE.Vector3(18, 22, 18)
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 0, 0)

function CameraController({
  activeId,
  isLocked,
  controlsRef,
}: {
  activeId?: string
  isLocked: boolean
  controlsRef: React.RefObject<any>
}) {
  const { camera } = useThree()
  const targetCamPos = useRef(new THREE.Vector3().copy(DEFAULT_CAM_POS))
  const targetLookAt = useRef(new THREE.Vector3().copy(DEFAULT_CAM_TARGET))

  useEffect(() => {
    if (activeId) {
      const activeExhibit = exhibits.find((e) => e.id === activeId)
      if (activeExhibit) {
        // Inspect Mode: Zoom in close to exhibit with cinematic isometric angle
        const exPos = activeExhibit.position
        targetLookAt.current.set(exPos[0], exPos[1] + 1.1, exPos[2])
        targetCamPos.current.set(exPos[0] + 4.2, exPos[1] + 3.2, exPos[2] + 4.8)
      }
    } else {
      // Overview Mode: Return smoothly to museum overview
      targetLookAt.current.copy(DEFAULT_CAM_TARGET)
      if (isLocked) {
        targetCamPos.current.copy(DEFAULT_CAM_POS)
      }
    }
  }, [activeId, isLocked])

  useFrame((_, delta) => {
    // Smooth lerp for Inspect Camera transition
    const speed = activeId ? 3.2 : 2.5
    const t = Math.min(1, delta * speed)

    camera.position.lerp(targetCamPos.current, t)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, t)
      controlsRef.current.update()
    }
  })

  return null
}

function Wall({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#c4b8a5" roughness={0.7} metalness={0.05} />
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
          <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.38, 0]} castShadow>
          <sphereGeometry args={[0.31, 20, 20]} />
          <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.35} />
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

function RotatingArtifact({ kind, active }: { kind: Exhibit['kind']; active: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (active) {
      // Slow 360-degree rotation when being inspected
      groupRef.current.rotation.y += delta * 0.75
    } else {
      // Smoothly return to default orientation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, delta * 3)
    }
  })

  return (
    <group ref={groupRef}>
      <Artifact kind={kind} />
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
      {/* Pedestal */}
      <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.1, 0.36, 1.55]} />
        <meshStandardMaterial color={active ? '#963935' : '#735f4b'} roughness={0.7} />
      </mesh>

      {/* Artifact with 360 spin in inspect mode */}
      <RotatingArtifact kind={exhibit.kind} active={active} />

      {/* Glass Showcase */}
      <mesh position={[0, 1.28, 0]} castShadow>
        <boxGeometry args={[1.95, 1.82, 1.4]} />
        <meshPhysicalMaterial
          color="#e6f0ed"
          transparent
          opacity={active ? 0.08 : 0.2}
          roughness={0.05}
          transmission={0.3}
          thickness={0.1}
        />
      </mesh>

      {/* Inspect Highlight Ring on floor */}
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[1.35, 1.65, 32]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.75} />
        </mesh>
      )}

      {/* Diamond Marker */}
      <mesh
        ref={markerRef}
        position={[0, 2.55, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => { e.stopPropagation(); onNavigate(exhibit) }}
        castShadow
      >
        <octahedronGeometry args={[hovered || active ? 0.34 : 0.27, 0]} />
        <meshStandardMaterial
          color={visited ? '#d4af37' : '#963935'}
          emissive={active ? '#d4af37' : hovered ? '#b0433e' : visited ? '#4a3d12' : '#2d0f0e'}
        />
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

// LoL Style Click Indicator (Cross marker + pulse ripple effect)
function ClickMarker({ ping }: { ping: Ping }) {
  const meshRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [opacity, setOpacity] = useState(1)

  useFrame(() => {
    const elapsed = (Date.now() - ping.createdAt) / 1000
    if (elapsed > 0.6) {
      setOpacity(0)
      return
    }
    const progress = elapsed / 0.6
    setOpacity(1 - progress)

    if (ringRef.current) {
      const scale = 0.4 + progress * 0.8
      ringRef.current.scale.set(scale, scale, scale)
    }
  })

  if (opacity <= 0.01) return null

  return (
    <group ref={meshRef} position={[ping.x, 0.03, ping.z]}>
      {/* Expanding Ripple Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.52, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={opacity * 0.8} />
      </mesh>

      {/* Cross Marker / X like LoL */}
      <group rotation={[0, Math.PI / 4, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.08]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={opacity} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.5]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={opacity} />
        </mesh>
      </group>

      {/* Center glowing diamond */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.16, 4]} />
        <meshBasicMaterial color="#86efac" transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

// Dotted/Glowing Guide Path Line from player to destination
function GuidePath({ waypoints, playerPos }: { waypoints: Point2D[]; playerPos: [number, number] }) {
  const points = useMemo(() => {
    if (waypoints.length === 0) return []
    const pts: [number, number, number][] = [[playerPos[0], 0.04, playerPos[1]]]
    for (const wp of waypoints) {
      pts.push([wp.x, 0.04, wp.z])
    }
    return pts
  }, [waypoints, playerPos])

  if (points.length < 2) return null

  return (
    <group>
      <Line
        points={points}
        color="#22c55e"
        lineWidth={3}
        dashed
        dashScale={2}
        dashSize={0.4}
        gapSize={0.2}
        transparent
        opacity={0.75}
      />
      {/* Small dot at each waypoint corner */}
      {waypoints.map((wp, i) => (
        <mesh key={i} position={[wp.x, 0.04, wp.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Player({
  pathRef,
  onReached,
  onPositionUpdate,
}: {
  pathRef: React.MutableRefObject<{ waypoints: Point2D[]; exhibitId?: string } | null>
  onReached: (id?: string) => void
  onPositionUpdate: (pos: [number, number]) => void
}) {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const velocity = useMemo(() => new THREE.Vector3(), [])
  const lastReached = useRef<string | undefined>(undefined)

  useFrame(({ clock }, delta) => {
    if (!root.current) return
    const pathData = pathRef.current
    if (!pathData || pathData.waypoints.length === 0) {
      if (body.current) body.current.position.y = 0
      return
    }

    const current = root.current.position
    const targetPoint = pathData.waypoints[0]
    const toTarget = velocity.set(targetPoint.x - current.x, 0, targetPoint.z - current.z)
    const distance = toTarget.length()

    if (distance < 0.2) {
      // Reached current waypoint, pop it
      pathData.waypoints.shift()
      if (pathData.waypoints.length === 0) {
        current.x = targetPoint.x
        current.z = targetPoint.z
        if (pathData.exhibitId !== lastReached.current) {
          lastReached.current = pathData.exhibitId
          onReached(pathData.exhibitId)
        }
        pathRef.current = null
        if (body.current) body.current.position.y = 0
        onPositionUpdate([current.x, current.z])
        return
      }
    }

    lastReached.current = undefined
    const speed = Math.min(4.8, Math.max(2.6, distance * 2.2))
    const step = Math.min(distance, speed * delta)
    toTarget.normalize()
    current.addScaledVector(toTarget, step)
    root.current.rotation.y = Math.atan2(toTarget.x, toTarget.z)
    if (body.current) body.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 9)) * 0.045

    onPositionUpdate([current.x, current.z])
  })

  return (
    <group ref={root} position={[0, FLOOR_Y, 12.3]}>
      <group ref={body}>
        <mesh position={[0, 0.86, 0]} castShadow>
          <capsuleGeometry args={[0.28, 0.65, 6, 10]} />
          <meshStandardMaterial color="#2d4255" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.55, 0]} castShadow>
          <sphereGeometry args={[0.29, 18, 18]} />
          <meshStandardMaterial color="#d8a77e" roughness={0.8} />
        </mesh>
        <mesh position={[-0.19, 0.18, 0]} castShadow>
          <boxGeometry args={[0.17, 0.48, 0.28]} />
          <meshStandardMaterial color="#1f252b" />
        </mesh>
        <mesh position={[0.19, 0.18, 0]} castShadow>
          <boxGeometry args={[0.17, 0.48, 0.28]} />
          <meshStandardMaterial color="#1f252b" />
        </mesh>
      </group>

      {/* Ring marker under player feet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.38, 0.55, 28]} />
        <meshBasicMaterial color="#963935" transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

function MuseumWorld({ command, activeId, visited, isLocked, onArrive, onMoveAnywhere }: Props) {
  const controlsRef = useRef<any>(null)
  const pathRef = useRef<{ waypoints: Point2D[]; exhibitId?: string } | null>(null)
  const [pings, setPings] = useState<Ping[]>([])
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 12.3])
  const [activeWaypoints, setActiveWaypoints] = useState<Point2D[]>([])

  // Cleanup old pings
  useFrame(() => {
    if (pings.length > 0) {
      const now = Date.now()
      const filtered = pings.filter((p) => now - p.createdAt < 700)
      if (filtered.length !== pings.length) {
        setPings(filtered)
      }
    }
  })

  // Handle move command from MapPanel
  useEffect(() => {
    if (!command) return
    const safeTarget = clampToWalkable(command.destination[0], command.destination[1])
    const path = findPath({ x: playerPos[0], z: playerPos[1] }, safeTarget)

    pathRef.current = {
      waypoints: [...path],
      exhibitId: command.exhibitId,
    }
    setActiveWaypoints([...path])

    // Add ping effect
    setPings((prev) => [
      ...prev,
      { id: Date.now(), x: safeTarget.x, z: safeTarget.z, createdAt: Date.now() },
    ])
  }, [command])

  const navigateToExhibit = (item: Exhibit) => {
    const safeTarget = clampToWalkable(item.approach[0], item.approach[1])
    const path = findPath({ x: playerPos[0], z: playerPos[1] }, safeTarget)

    pathRef.current = {
      waypoints: [...path],
      exhibitId: item.id,
    }
    setActiveWaypoints([...path])

    setPings((prev) => [
      ...prev,
      { id: Date.now(), x: safeTarget.x, z: safeTarget.z, createdAt: Date.now() },
    ])
  }

  const handleFloorClick = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onMoveAnywhere()

    const targetX = event.point.x
    const targetZ = event.point.z
    const safeTarget = clampToWalkable(targetX, targetZ)
    const path = findPath({ x: playerPos[0], z: playerPos[1] }, safeTarget)

    pathRef.current = {
      waypoints: [...path],
    }
    setActiveWaypoints([...path])

    // Spawn LoL-style Ping indicator at clicked location
    setPings((prev) => [
      ...prev,
      { id: Date.now(), x: safeTarget.x, z: safeTarget.z, createdAt: Date.now() },
    ])
  }

  const handleReached = (id?: string) => {
    setActiveWaypoints([])
    if (!id) return
    const item = exhibits.find((exhibit) => exhibit.id === id)
    if (item) onArrive(item)
  }

  const handlePositionUpdate = (pos: [number, number]) => {
    setPlayerPos(pos)
    if (pathRef.current) {
      setActiveWaypoints([...pathRef.current.waypoints])
    } else {
      setActiveWaypoints([])
    }
  }

  return (
    <>
      <CameraController activeId={activeId} isLocked={isLocked} controlsRef={controlsRef} />
      <color attach="background" args={['#e8e2d5']} />
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[18, 28, 18]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-14, 18, -14]} intensity={0.5} />

      {/* Main floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[26, 30]} />
        <meshStandardMaterial color="#ded5c5" roughness={0.8} />
      </mesh>

      {/* Central hallway carpet path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 3.5]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[6.2, 20.5]} />
        <meshStandardMaterial color="#f0e9dc" roughness={0.7} />
      </mesh>

      {/* Exterior perimeter walls */}
      <Wall position={[-12.5, 1.2, 0]} scale={[0.4, 2.4, 29.5]} />
      <Wall position={[12.5, 1.2, 0]} scale={[0.4, 2.4, 29.5]} />
      <Wall position={[0, 1.2, -14.5]} scale={[25, 2.4, 0.4]} />
      <Wall position={[-7.5, 1.2, 14.5]} scale={[9.8, 2.4, 0.4]} />
      <Wall position={[7.5, 1.2, 14.5]} scale={[9.8, 2.4, 0.4]} />

      {/* Interior room partition dividers */}
      <Wall position={[-8.4, 1.05, 6.9]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[8.4, 1.05, 6.9]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[-8.4, 1.05, -2.0]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[8.4, 1.05, -2.0]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[-8.4, 1.05, -8.8]} scale={[7.5, 2.1, 0.25]} />
      <Wall position={[8.4, 1.05, -8.8]} scale={[7.5, 2.1, 0.25]} />

      {/* Room labels */}
      <RoomLabel position={[0, 0.25, 11.4]}>LỐI VÀO</RoomLabel>
      <RoomLabel position={[0, 0.25, 4.4]}>GIAN LONG TRỌNG</RoomLabel>
      <RoomLabel position={[-7.3, 0.25, 3.6]}>QUÊ HƯƠNG</RoomLabel>
      <RoomLabel position={[7.3, 0.25, 3.6]}>TƯ LIỆU</RoomLabel>
      <RoomLabel position={[-7.3, 0.25, -6.7]}>KỶ VẬT</RoomLabel>
      <RoomLabel position={[7.3, 0.25, -6.7]}>KỶ VẬT</RoomLabel>
      <RoomLabel position={[0, 0.25, -12.6]}>TƯỞNG NIỆM</RoomLabel>

      {/* Display Cases */}
      {exhibits.map((item) => (
        <DisplayCase
          key={item.id}
          exhibit={item}
          active={activeId === item.id}
          visited={visited.has(item.id)}
          onNavigate={navigateToExhibit}
        />
      ))}

      {/* Guide Path Line (foot to destination) */}
      <GuidePath waypoints={activeWaypoints} playerPos={playerPos} />

      {/* LoL Click Ping indicators */}
      {pings.map((ping) => (
        <ClickMarker key={ping.id} ping={ping} />
      ))}

      {/* Player character */}
      <Player
        pathRef={pathRef}
        onReached={handleReached}
        onPositionUpdate={handlePositionUpdate}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableRotate={!isLocked && !activeId}
        enablePan={!activeId}
        enableZoom={true}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={3}
        maxDistance={65}
      />
    </>
  )
}

export function MuseumScene(props: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [18, 22, 18], fov: 42, near: 0.1, far: 150 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <MuseumWorld {...props} />
    </Canvas>
  )
}
