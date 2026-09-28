import { Environment, Html, Line, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { exhibits } from '../data/exhibits'
import type { Exhibit, MoveCommand } from '../types'
import { clampToWalkable, findPath, Point2D } from '../utils/pathfinding'
import {
  ClothingArtifact,
  DocumentsArtifact,
  EmblemArtifact,
  GLBArtifact,
  HeritageArtifact,
  MemorialArtifact,
  SandalsArtifact,
  StatueArtifact,
} from './Artifacts'

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
  const isTransitioning = useRef(false)

  useEffect(() => {
    isTransitioning.current = true
    if (activeId) {
      const activeExhibit = exhibits.find((e) => e.id === activeId)
      if (activeExhibit) {
        // Inspect Mode: Tính toán góc nhìn trực diện mặt trước hiện vật từ hướng tiếp cận (approach)
        const exPos = activeExhibit.position
        targetLookAt.current.set(exPos[0], exPos[1] + 1.0, exPos[2])

        const dirX = activeExhibit.approach[0] - exPos[0]
        const dirZ = activeExhibit.approach[1] - exPos[2]
        const len = Math.hypot(dirX, dirZ) || 1
        const normX = dirX / len
        const normZ = dirZ / len

        // Đặt camera lùi ra 3.6m trực diện phía trước hiện vật (hướng ra lối đi), độ cao Y = 1.35m
        targetCamPos.current.set(
          exPos[0] + normX * 3.6,
          exPos[1] + 1.35,
          exPos[2] + normZ * 3.6
        )
      }
    } else {
      // Overview Mode: Quay lại góc nhìn toàn cảnh bảo tàng mượt mà
      targetLookAt.current.copy(DEFAULT_CAM_TARGET)
      if (isLocked) {
        targetCamPos.current.copy(DEFAULT_CAM_POS)
      }
    }

    const timer = setTimeout(() => {
      isTransitioning.current = false
    }, 1100)
    return () => clearTimeout(timer)
  }, [activeId, isLocked])

  useFrame((_, delta) => {
    if (isTransitioning.current) {
      const speed = activeId ? 3.8 : 2.8
      const t = Math.min(1, delta * speed)

      camera.position.lerp(targetCamPos.current, t)

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, t)
        controlsRef.current.update()
      }
    }
  })

  return null
}

function Wall({ position, scale }: { position: [number, number, number]; scale: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color="#2d3238" roughness={0.7} metalness={0.1} />
    </mesh>
  )
}

function ColumnPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.85, roughness: 0.2 })}>
        <boxGeometry args={[0.7, 0.3, 0.7]} />
      </mesh>
      {/* Column shaft */}
      <mesh position={[0, 1.4, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#d9cdb8', roughness: 0.5 })}>
        <cylinderGeometry args={[0.26, 0.28, 2.3, 20]} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 2.5, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.85, roughness: 0.2 })}>
        <boxGeometry args={[0.65, 0.2, 0.65]} />
      </mesh>
    </group>
  )
}

function VelvetStanchion({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Brass Base */}
      <mesh position={[0, 0.04, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.9, roughness: 0.2 })}>
        <cylinderGeometry args={[0.12, 0.14, 0.08, 16]} />
      </mesh>
      {/* Brass Post */}
      <mesh position={[0, 0.42, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.9, roughness: 0.2 })}>
        <cylinderGeometry args={[0.022, 0.022, 0.72, 12]} />
      </mesh>
      {/* Brass Ball Top */}
      <mesh position={[0, 0.8, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.92, roughness: 0.15 })}>
        <sphereGeometry args={[0.045, 12, 10]} />
      </mesh>
    </group>
  )
}

function RoomLabel({ position, children }: { position: [number, number, number]; children: string }) {
  return (
    <Html position={position} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
      <div className="room-label">{children}</div>
    </Html>
  )
}

function Artifact({ exhibit }: { exhibit: Exhibit }) {
  if (exhibit.modelPath) {
    return (
      <group position={[0, 0.32 + (exhibit.modelOffsetY ?? 0), 0]}>
        <GLBArtifact
          path={exhibit.modelPath}
          texturePath={exhibit.texturePath}
          targetHeight={exhibit.targetHeight ?? 1.6}
          rotation={exhibit.rotation ?? [0, exhibit.rotationY ?? 0, 0]}
        />
      </group>
    )
  }

  const models: Record<string, React.ReactNode> = {
    statue: <StatueArtifact />,
    bust: <StatueArtifact />,
    heritage: <HeritageArtifact />,
    document: <DocumentsArtifact />,
    sandals: <SandalsArtifact />,
    silk: <ClothingArtifact />,
    clothing: <ClothingArtifact />,
    memorial: <MemorialArtifact />,
    emblem: <EmblemArtifact />,
  }
  return <>{models[exhibit.kind] || <StatueArtifact />}</>
}

function RotatingArtifact({ exhibit }: { exhibit: Exhibit; active?: boolean }) {
  return (
    <group>
      <Artifact exhibit={exhibit} />
    </group>
  )
}

// Tiered Circular Museum Pedestal with Gold Nameplate
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
    markerRef.current.position.y = 2.65 + Math.sin(clock.elapsedTime * 2.1 + exhibit.index) * 0.1
    markerRef.current.rotation.y += 0.012
  })

  const appDir = useMemo(() => {
    const dx = exhibit.approach[0] - exhibit.position[0]
    const dz = exhibit.approach[1] - exhibit.position[2]
    const len = Math.hypot(dx, dz) || 1
    const angle = Math.atan2(dx, dz)
    return {
      x: (dx / len) * 1.25,
      z: (dz / len) * 1.25,
      angle,
    }
  }, [exhibit])

  return (
    <group position={exhibit.position}>
      {/* Tiered Circular Pedestal Base (Bục tròn phân tầng sang trọng) */}
      {/* Tier 1: Dark Granite Foundation */}
      <mesh position={[0, 0.07, 0]} receiveShadow castShadow material={new THREE.MeshStandardMaterial({ color: '#22272e', roughness: 0.35, metalness: 0.1 })}>
        <cylinderGeometry args={[1.55, 1.65, 0.14, 40]} />
      </mesh>

      {/* Tier 2: Mahogany Wood Ring with Flat Gold Trim Ring */}
      <mesh position={[0, 0.18, 0]} receiveShadow castShadow material={new THREE.MeshStandardMaterial({ color: '#4a2511', roughness: 0.35 })}>
        <cylinderGeometry args={[1.35, 1.4, 0.12, 40]} />
      </mesh>
      {/* Horizontal Inlaid Gold Ring (Nằm phẳng trên mặt bục gỗ, không cắt ngang hiện vật) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.245, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.9, roughness: 0.18 })}>
        <ringGeometry args={[1.32, 1.38, 48]} />
      </mesh>

      {/* Tier 3: Velvet/Marble Core Platform */}
      <mesh position={[0, 0.28, 0]} receiveShadow castShadow material={new THREE.MeshStandardMaterial({ color: active ? '#8a2420' : '#2d333b', roughness: 0.5 })}>
        <cylinderGeometry args={[1.18, 1.18, 0.08, 40]} />
      </mesh>

      {/* Active Glowing Neon Ring */}
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <ringGeometry args={[1.68, 1.82, 48]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.88} />
        </mesh>
      )}

      {/* Tilted Brass Nameplate hướng ra phía lối vào */}
      <group position={[appDir.x, 0.24, appDir.z]} rotation={[0, appDir.angle, 0]}>
        <group rotation={[-0.45, 0, 0]}>
          <mesh castShadow material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.92, roughness: 0.18 })}>
            <boxGeometry args={[0.56, 0.16, 0.03]} />
          </mesh>
          <mesh position={[0, 0, 0.018]} material={new THREE.MeshStandardMaterial({ color: '#1a1815', roughness: 0.3 })}>
            <planeGeometry args={[0.48, 0.1]} />
          </mesh>
        </group>
      </group>

      {/* Artifact with 360 Gentle Spin in Inspect Mode */}
      <RotatingArtifact exhibit={exhibit} active={active} />

      {/* Diamond / Star Marker - Ẩn khi đang inspect để không che khuất hiện vật */}
      {!active && (
        <mesh
          ref={markerRef}
          position={[0, 2.65, 0]}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => { e.stopPropagation(); onNavigate(exhibit) }}
          castShadow
        >
          <octahedronGeometry args={[hovered ? 0.34 : 0.27, 0]} />
          <meshStandardMaterial
            color={visited ? '#d4af37' : '#963935'}
            emissive={hovered ? '#b0433e' : visited ? '#4a3d12' : '#2d0f0e'}
          />
        </mesh>
      )}

      {/* Floating tag badge: Chỉ hiển thị khi hover và không active để tránh đè lấp màn hình */}
      {hovered && !active && (
        <Html position={[0, 3.25, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
          <div className="world-tag">
            <span>{visited ? '✓' : String(exhibit.index).padStart(2, '0')}</span>
            {exhibit.title}
          </div>
        </Html>
      )}
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
  visible = true,
}: {
  pathRef: React.MutableRefObject<{ waypoints: Point2D[]; exhibitId?: string } | null>
  onReached: (id?: string) => void
  onPositionUpdate: (pos: [number, number]) => void
  visible?: boolean
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
    <group ref={root} position={[0, FLOOR_Y, 12.3]} visible={visible}>
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

  useFrame(() => {
    if (pings.length > 0) {
      const now = Date.now()
      const filtered = pings.filter((p) => now - p.createdAt < 700)
      if (filtered.length !== pings.length) {
        setPings(filtered)
      }
    }
  })

  useEffect(() => {
    if (!command) return
    const safeTarget = clampToWalkable(command.destination[0], command.destination[1])
    const path = findPath({ x: playerPos[0], z: playerPos[1] }, safeTarget)

    pathRef.current = {
      waypoints: [...path],
      exhibitId: command.exhibitId,
    }
    setActiveWaypoints([...path])

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
    // Khóa di chuyển nhân vật khi đang trong chế độ Inspect hiện vật
    if (activeId) return

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
      <Environment preset="city" background={false} environmentIntensity={0.65} />
      <color attach="background" args={['#0f1216']} />
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[18, 28, 18]}
        intensity={1.9}
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
      <directionalLight position={[-14, 18, -14]} intensity={0.6} color="#ffeed4" />

      {/* Floating Golden Dust Sparkles */}
      <Sparkles count={80} scale={[25, 8, 29]} size={4} speed={0.35} opacity={0.65} color="#ffd700" />

      {/* Main Dark Granite Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[26, 30]} />
        <meshStandardMaterial color="#1a1e24" roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Red Velvet Carpet Runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 2.5]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[4.2, 22.5]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.88} />
      </mesh>
      {/* Gold Carpet Border Trims */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.15, 0.008, 2.5]} receiveShadow>
        <planeGeometry args={[0.08, 22.5]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.15, 0.008, 2.5]} receiveShadow>
        <planeGeometry args={[0.08, 22.5]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Branching Red Carpet to Rooms */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.2, 0.005, 1.5]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[4.5, 3.2]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.2, 0.005, 1.5]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[4.5, 3.2]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.2, 0.005, -5.2]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[4.5, 3.2]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.2, 0.005, -5.2]} receiveShadow onPointerDown={handleFloorClick}>
        <planeGeometry args={[4.5, 3.2]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.88} />
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

      {/* Classical Marble Pillars with Gold Trim */}
      <ColumnPost position={[-2.4, 0, 7.0]} />
      <ColumnPost position={[2.4, 0, 7.0]} />
      <ColumnPost position={[-2.4, 0, -1.9]} />
      <ColumnPost position={[2.4, 0, -1.9]} />
      <ColumnPost position={[-2.4, 0, -8.7]} />
      <ColumnPost position={[2.4, 0, -8.7]} />

      {/* Velvet Stanchions around Statue */}
      <VelvetStanchion position={[-1.8, 0, 4.2]} />
      <VelvetStanchion position={[1.8, 0, 4.2]} />
      <VelvetStanchion position={[-1.8, 0, 7.4]} />
      <VelvetStanchion position={[1.8, 0, 7.4]} />

      {/* Red Velvet Rope Connectors */}
      <mesh position={[0, 0.72, 4.2]} rotation={[0, 0, Math.PI / 2]} material={new THREE.MeshStandardMaterial({ color: '#8a1f1d', roughness: 0.9 })}>
        <cylinderGeometry args={[0.018, 0.018, 3.6, 12]} />
      </mesh>

      {/* National Flag & Memorial Red Wall Backdrop */}
      <group position={[0, 1.6, -14.2]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.4 })}>
          <boxGeometry args={[4.8, 2.6, 0.06]} />
        </mesh>
        <mesh position={[0, 0.35, 0.04]} material={new THREE.MeshStandardMaterial({ color: '#e5b83b', metalness: 0.9, roughness: 0.2 })}>
          <octahedronGeometry args={[0.38, 0]} />
        </mesh>
      </group>

      {/* Room labels */}
      <RoomLabel position={[0, 0.25, 11.4]}>LỐI VÀO BẢO TÀNG</RoomLabel>
      <RoomLabel position={[0, 0.25, 4.4]}>GIAN LONG TRỌNG</RoomLabel>
      <RoomLabel position={[-7.0, 0.25, 6.2]}>HOẠT ĐỘNG QUỐC TẾ</RoomLabel>
      <RoomLabel position={[7.0, 0.25, 6.2]}>TƯ LIỆU BÚT TÍCH</RoomLabel>
      <RoomLabel position={[-7.0, 0.25, -2.6]}>BÚT TÍCH LỊCH SỬ</RoomLabel>
      <RoomLabel position={[7.0, 0.25, -2.6]}>KỶ VẬT ĐỜI THƯỜNG</RoomLabel>
      <RoomLabel position={[-7.0, 0.25, -9.4]}>KỶ VẬT KHÁNG CHIẾN</RoomLabel>
      <RoomLabel position={[0, 0.25, -12.6]}>GIAN TƯỞNG NIỆM</RoomLabel>

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

      {/* Player character - Tự động ẩn khi đang inspect hiện vật để không che chắn tầm nhìn */}
      <Player
        pathRef={pathRef}
        onReached={handleReached}
        onPositionUpdate={handlePositionUpdate}
        visible={!activeId}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableRotate={!isLocked || !!activeId}
        enablePan={!activeId}
        enableZoom={true}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={activeId ? Math.PI / 2.05 : Math.PI / 2.15}
        minDistance={activeId ? 2.0 : 6}
        maxDistance={activeId ? 6.2 : 55}
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
