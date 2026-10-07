import { Environment, Html, Line, OrbitControls, PointerLockControls, Sparkles, useGLTF, useAnimations, useTexture } from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { exhibits } from '../data/exhibits'
import type { Exhibit, MoveCommand } from '../types'
import { clampToWalkable, findPath, isWalkable, Point2D } from '../utils/pathfinding'
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
  viewMode: 'overview' | 'firstPerson'
  started: boolean
  onArrive: (exhibit: Exhibit) => void
  onMoveAnywhere: () => void
  onRequestOverview: () => void
}

interface Ping {
  id: number
  x: number
  z: number
  createdAt: number
}

const FLOOR_Y = 0

// Standard overview camera coordinates
const DEFAULT_CAM_POS = new THREE.Vector3(20, 24, 20)
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 0, -3.5)

const DOOR_CAM_POS = new THREE.Vector3(0, 2.2, 21.0)
const DOOR_LOOK_AT = new THREE.Vector3(0, 1.8, 14.5)

function CameraController({
  activeId,
  isLocked,
  viewMode,
  started,
  controlsRef,
}: {
  activeId?: string
  isLocked: boolean
  started: boolean
  controlsRef: React.RefObject<any>
  viewMode: 'overview' | 'firstPerson'
}) {
  const { camera } = useThree()
  const introStartTime = useRef<number | null>(null)
  const prevStarted = useRef(started)
  const targetCamPos = useRef(new THREE.Vector3().copy(DEFAULT_CAM_POS))
  const targetLookAt = useRef(new THREE.Vector3().copy(DEFAULT_CAM_TARGET))
  const isTransitioning = useRef(false)

  // Ban đầu khi chưa bấm bắt đầu: cố định camera trước cửa
  useEffect(() => {
    if (viewMode === 'firstPerson') return
    if (!started) {
      camera.position.copy(DOOR_CAM_POS)
      if (controlsRef.current) {
        controlsRef.current.target.copy(DOOR_LOOK_AT)
        controlsRef.current.update()
      }
    }
  }, [started, camera, controlsRef, viewMode])

  // Kích hoạt chuỗi fly-in khi bấm "Bắt đầu tham quan"
  useEffect(() => {
    if (started && !prevStarted.current) {
      introStartTime.current = Date.now()
    }
    prevStarted.current = started
  }, [started])

  useEffect(() => {
    if (!started || viewMode === 'firstPerson') return
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

        targetCamPos.current.set(
          exPos[0] + normX * 3.6,
          exPos[1] + 1.35,
          exPos[2] + normZ * 3.6
        )

        // Vào inspect ngay lập tức để thao tác kéo chuột phải không bị transition ghi đè.
        camera.position.copy(targetCamPos.current)
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt.current)
          controlsRef.current.update()
        }
        isTransitioning.current = false
        return
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
    }, 2500)
    return () => clearTimeout(timer)
  }, [activeId, isLocked, started, viewMode])

  useFrame(() => {
    // Nếu chưa bấm start: camera đứng yên ở trước cửa nhìn vào cánh cửa
    if (!started || viewMode === 'firstPerson') {
      if (viewMode === 'firstPerson') return
      camera.position.lerp(DOOR_CAM_POS, 0.2)
      if (controlsRef.current) {
        controlsRef.current.target.lerp(DOOR_LOOK_AT, 0.2)
        controlsRef.current.update()
      }
      return
    }

    // Cinematic Fly-in khi vừa mở cửa
    if (introStartTime.current !== null) {
      const elapsed = (Date.now() - introStartTime.current) / 1000
      const totalDuration = 3.2

      if (elapsed < totalDuration) {
        const t = Math.min(1, elapsed / totalDuration)

        let curX = 0
        let curY = 2.2
        let curZ = 21.0
        let tgtX = 0
        let tgtY = 1.8
        let tgtZ = 14.5

        if (t < 0.42) {
          // Giai đoạn 1: Cửa mở, camera lướt thẳng qua cánh cửa vào sảnh
          const subT = t / 0.42
          const ease1 = subT * subT * (3 - 2 * subT)
          curX = 0
          curY = 2.2 - ease1 * 0.3
          curZ = 21.0 - ease1 * 8.2 // 21.0 -> 12.8 (vượt qua cửa)
          tgtX = 0
          tgtY = 1.8 - ease1 * 0.4
          tgtZ = 14.5 - ease1 * 6.5
        } else {
          // Giai đoạn 2: Camera từ sảnh bay vút lên góc nhìn Isometric 2.5D
          const subT = (t - 0.42) / 0.58
          const ease2 = subT * subT * (3 - 2 * subT)
          curX = 0 + ease2 * DEFAULT_CAM_POS.x
          curY = 1.9 + ease2 * (DEFAULT_CAM_POS.y - 1.9)
          curZ = 12.8 + ease2 * (DEFAULT_CAM_POS.z - 12.8)
          tgtX = 0
          tgtY = 1.4 - ease2 * 1.4
          tgtZ = 8.0 - ease2 * 8.0
        }

        camera.position.set(curX, curY, curZ)
        if (controlsRef.current) {
          controlsRef.current.target.set(tgtX, tgtY, tgtZ)
          controlsRef.current.update()
        }
        return
      } else {
        introStartTime.current = null
        camera.position.copy(DEFAULT_CAM_POS)
        if (controlsRef.current) {
          controlsRef.current.target.copy(DEFAULT_CAM_TARGET)
          controlsRef.current.update()
        }
      }
    }

    if (isTransitioning.current) {
      const speed = activeId ? 0.05 : 0.02
      if (!(!isLocked && !activeId && started)) {
        camera.position.lerp(targetCamPos.current, speed)
      }

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, speed)
        controlsRef.current.update()
      }
    }
  })

  return null
}

function MapMouseControls({
  controlsRef,
  enabled,
  suppressClickRef,
}: {
  controlsRef: React.RefObject<any>
  enabled: boolean
  suppressClickRef: React.MutableRefObject<boolean>
}) {
  const { camera, gl } = useThree()
  const pressedButtons = useRef(0)
  const previousPoint = useRef<{ x: number; y: number } | null>(null)
  const dragStartPoint = useRef<{ x: number; y: number } | null>(null)
  const spherical = useMemo(() => new THREE.Spherical(), [])
  const rotatedPosition = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const element = gl.domElement

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.button !== 2) return
      if (pressedButtons.current === 0) suppressClickRef.current = false

      pressedButtons.current |= event.button === 0 ? 1 : 2
      previousPoint.current = { x: event.clientX, y: event.clientY }
      dragStartPoint.current = { x: event.clientX, y: event.clientY }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const canRotate = pressedButtons.current === 1 || pressedButtons.current === 2 || pressedButtons.current === 3
      if (!enabled || !canRotate || (event.buttons & pressedButtons.current) === 0) return
      if (!previousPoint.current) {
        previousPoint.current = { x: event.clientX, y: event.clientY }
        return
      }

      if (dragStartPoint.current && !suppressClickRef.current) {
        const distance = Math.hypot(
          event.clientX - dragStartPoint.current.x,
          event.clientY - dragStartPoint.current.y,
        )
        if (distance > 4) suppressClickRef.current = true
      }

      const deltaX = event.clientX - previousPoint.current.x
      const deltaY = event.clientY - previousPoint.current.y
      previousPoint.current = { x: event.clientX, y: event.clientY }

      const controls = controlsRef.current
      if (!controls || deltaX === 0 && deltaY === 0) return

      spherical.setFromVector3(camera.position.clone().sub(controls.target))
      spherical.theta -= deltaX * 0.0035
      spherical.phi = THREE.MathUtils.clamp(spherical.phi + deltaY * 0.0035, 0.12, Math.PI / 2.15)
      rotatedPosition.setFromSpherical(spherical.makeSafe()).add(controls.target)
      camera.position.copy(rotatedPosition)
      camera.lookAt(controls.target)
      controls.update()
    }

    const releaseButton = (event: PointerEvent) => {
      if (event.button === 0) pressedButtons.current &= ~1
      if (event.button === 2) pressedButtons.current &= ~2
      if (pressedButtons.current === 0) {
        previousPoint.current = null
        dragStartPoint.current = null
      }
    }

    const handleContextMenu = (event: MouseEvent) => event.preventDefault()

    element.addEventListener('pointerdown', handlePointerDown)
    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerup', releaseButton)
    element.addEventListener('pointercancel', releaseButton)
    element.addEventListener('contextmenu', handleContextMenu)

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown)
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerup', releaseButton)
      element.removeEventListener('pointercancel', releaseButton)
      element.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [camera, controlsRef, enabled, gl, rotatedPosition, spherical, suppressClickRef])

  return null
}

function FirstPersonController({
  enabled,
  pathRef,
  playerPosRef,
  onPositionUpdate,
}: {
  enabled: boolean
  pathRef: React.MutableRefObject<{ waypoints: Point2D[]; exhibitId?: string } | null>
  playerPosRef: React.MutableRefObject<[number, number]>
  onPositionUpdate: (pos: [number, number]) => void
}) {
  const { camera } = useThree()
  const keys = useRef(new Set<string>())
  const wasEnabled = useRef(false)

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        event.preventDefault()
        keys.current.add(key)
      }
    }
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase())
    const clear = () => keys.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', clear)
    }
  }, [])

  useFrame((_, delta) => {
    const [x, z] = playerPosRef.current
    if (enabled && !wasEnabled.current) {
      pathRef.current = null
      camera.position.set(x, 1.65, z)
      camera.lookAt(x, 1.65, z - 1)
    }
    wasEnabled.current = enabled
    if (!enabled) return

    const forward = Number(keys.current.has('w') || keys.current.has('arrowup')) - Number(keys.current.has('s') || keys.current.has('arrowdown'))
    const strafe = Number(keys.current.has('d') || keys.current.has('arrowright')) - Number(keys.current.has('a') || keys.current.has('arrowleft'))
    if (!forward && !strafe) return
    pathRef.current = null

    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()
    // Camera nhìn theo hướng -Z thì bên phải là +X.
    const right = new THREE.Vector3(-direction.z, 0, direction.x)
    // Không dùng clampToWalkable cho từng frame: khi đụng tường, nó có thể
    // nhảy sang điểm gần đó và làm người chơi bị giật/quay hướng bất ngờ.
    const frameDelta = Math.min(delta, 0.05)
    const nextX = x + (direction.x * forward + right.x * strafe) * frameDelta * 2.6
    const nextZ = z + (direction.z * forward + right.z * strafe) * frameDelta * 2.6
    let safe = { x, z }

    // Thử đi chéo trước, sau đó trượt theo từng trục khi áp sát tường.
    if (isWalkable(nextX, nextZ)) {
      safe = { x: nextX, z: nextZ }
    } else if (isWalkable(nextX, z)) {
      safe = { x: nextX, z }
    } else if (isWalkable(x, nextZ)) {
      safe = { x, z: nextZ }
    }
    playerPosRef.current = [safe.x, safe.z]
    camera.position.set(safe.x, 1.65, safe.z)
    onPositionUpdate([safe.x, safe.z])
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

function WallFlag({ position, type, label, visible = true }: { position: [number, number, number]; type: 'national' | 'party'; label: string; visible?: boolean }) {
  const partyTexture = useTexture('/24-02-2024-ve-su-dung-co-dang-va-hinh-anh-co-dang-cong-san-viet-nam-A3C3304C.jpg')
  const nationalTexture = useTexture('/images%20(4).jpg')
  const texture = type === 'party' ? partyTexture : nationalTexture
  const flagHeight = type === 'party' ? 2.13 : 1.75
  texture.colorSpace = THREE.SRGBColorSpace
  return (
    <group position={position} visible={visible}>
      <mesh position={[-1.6, 0.9, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.8, roughness: 0.25 })}>
        <cylinderGeometry args={[0.035, 0.035, 2.15, 12]} />
      </mesh>
      <mesh position={[0, 0.02, 0.02]} castShadow>
        <planeGeometry args={[3.2, flagHeight, 8, 5]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.72} />
      </mesh>
      <Html position={[0, -(flagHeight / 2 + 0.23), 0.04]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <span className="world-wall-label">{label}</span>
      </Html>
    </group>
  )
}

function ReliefBanner({ position, title, subtitle, width = 6.8, height = 1.2 }: { position: [number, number, number]; title: string; subtitle: string; width?: number; height?: number }) {
  const texture = useMemo(() => createPlaqueTexture(title, subtitle, 1200, 240), [title, subtitle])
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.08]} castShadow material={new THREE.MeshStandardMaterial({ color: '#3a2117', roughness: 0.38, metalness: 0.12 })}>
        <boxGeometry args={[width + 0.26, height + 0.26, 0.16]} />
      </mesh>
      <mesh position={[0, 0, 0.015]} castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.42} metalness={0.2} />
      </mesh>
    </group>
  )
}

function PortraitDisplay({ position, visible = true }: { position: [number, number, number]; visible?: boolean }) {
  const portraitTexture = useTexture('/OIP.jpg')
  portraitTexture.colorSpace = THREE.SRGBColorSpace
  return (
    <group position={position} visible={visible}>
      <mesh position={[0, 0, -0.09]} castShadow material={new THREE.MeshStandardMaterial({ color: '#4a2511', roughness: 0.38 })}>
        <boxGeometry args={[3.2, 2.9, 0.18]} />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[2.75, 2.55]} />
        <meshStandardMaterial map={portraitTexture} roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.15, 0.03]} castShadow material={new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.88, roughness: 0.2 })}>
        <boxGeometry args={[3.0, 0.08, 0.08]} />
      </mesh>
    </group>
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

function createPlaqueTexture(title: string, subtitle?: string, width = 640, height = 160): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  ctx.clearRect(0, 0, width, height)

  // Outer background plate (Deep Mahogany / Dark Bronze)
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, '#1c1512')
  grad.addColorStop(0.5, '#281e18')
  grad.addColorStop(1, '#15100d')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.roundRect(6, 6, width - 12, height - 12, 18)
  ctx.fill()

  // Outer Gold Inlaid Border
  ctx.lineWidth = 3.5
  ctx.strokeStyle = '#ffd700'
  ctx.stroke()

  // Inner Subtle Gold Border
  ctx.lineWidth = 1.2
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.45)'
  ctx.beginPath()
  ctx.roundRect(14, 14, width - 28, height - 28, 12)
  ctx.stroke()

  // Title
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 22px "Be Vietnam Pro", system-ui, sans-serif'
  ctx.fillStyle = '#ffd700'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
  ctx.shadowBlur = 6
  ctx.fillText(title, width / 2, subtitle ? 56 : 80)

  // Subtitle
  if (subtitle) {
    ctx.font = '500 14px "Be Vietnam Pro", system-ui, sans-serif'
    ctx.fillStyle = '#ded5c5'
    ctx.shadowBlur = 4
    ctx.fillText(subtitle, width / 2, 106)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

function RoomPlaque({
  position,
  title,
  subtitle,
  width = 3.8,
  height = 0.95,
  rotation = [-Math.PI / 2, 0, 0],
}: {
  position: [number, number, number]
  title: string
  subtitle?: string
  width?: number
  height?: number
  rotation?: [number, number, number]
}) {
  const texture = useMemo(() => createPlaqueTexture(title, subtitle), [title, subtitle])

  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} roughness={0.3} metalness={0.35} transparent />
    </mesh>
  )
}

function RoomCarpet({
  position,
  onPointerUp,
}: {
  position: [number, number]
  onPointerUp: (event: ThreeEvent<PointerEvent>) => void
}) {
  const size = 4.4
  const trim = size / 2 - 0.06

  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow onPointerUp={onPointerUp}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#a82932" roughness={0.88} />
      </mesh>
      <mesh position={[-trim, 0.009, 0]}>
        <boxGeometry args={[0.07, 0.012, size]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[trim, 0.009, 0]}>
        <boxGeometry args={[0.07, 0.012, size]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.009, -trim]}>
        <boxGeometry args={[size, 0.012, 0.07]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.009, trim]}>
        <boxGeometry args={[size, 0.012, 0.07]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CarpetStrip({
  position,
  size,
  onPointerUp,
}: {
  position: [number, number]
  size: [number, number]
  onPointerUp: (event: ThreeEvent<PointerEvent>) => void
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.006, position[1]]} receiveShadow onPointerUp={onPointerUp}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#a82932" roughness={0.88} />
    </mesh>
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
          wrapperRotationY={exhibit.wrapperRotationY}
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

function RotatingArtifact({ exhibit, active }: { exhibit: Exhibit; active?: boolean }) {
  return (
    <group>
      <Artifact exhibit={exhibit} />
    </group>
  )
}

// Tiered Circular Museum Pedestal with Gold Nameplate
function DisplayCase({ exhibit, active, visited, onNavigate, allowHover }: {
  exhibit: Exhibit
  active: boolean
  visited: boolean
  onNavigate: (item: Exhibit) => void
  allowHover: boolean
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
    <group
      position={exhibit.position}
      onClick={(e) => {
        e.stopPropagation()
        if (!active) onNavigate(exhibit)
      }}
    >
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

      {/* Hitbox vô hình bao quanh hiện vật: model hoặc vùng sát model đều mở Inspect */}
      {!active && (
        <group
          position={[0, 1.55, 0]}
          onClick={(e) => { e.stopPropagation(); onNavigate(exhibit) }}
        >
          <mesh>
            <boxGeometry args={[3.8, 3.2, 3.8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* Diamond / Star Marker - Ẩn khi đang inspect để không che khuất hiện vật */}
      {!active && (
        <mesh
          ref={markerRef}
          position={[0, 2.65, 0]}
          onPointerOver={allowHover ? (e) => { e.stopPropagation(); setHovered(true) } : undefined}
          onPointerOut={allowHover ? () => setHovered(false) : undefined}
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

// Hiệu ứng vòng sóng điều hướng khi nhấp chuột (Golden navigation pulse effect)
function ClickMarker({ ping }: { ping: Ping }) {
  const meshRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const [opacity, setOpacity] = useState(1)

  useFrame(() => {
    const elapsed = (Date.now() - ping.createdAt) / 1000
    if (elapsed > 0.65) {
      setOpacity(0)
      return
    }
    const progress = elapsed / 0.65
    setOpacity(1 - progress)

    if (ringRef.current) {
      const scale = 0.3 + progress * 0.9
      ringRef.current.scale.set(scale, scale, scale)
    }
    if (innerRingRef.current) {
      const innerScale = 0.2 + progress * 0.5
      innerRingRef.current.scale.set(innerScale, innerScale, innerScale)
    }
  })

  if (opacity <= 0.01) return null

  return (
    <group ref={meshRef} position={[ping.x, 0.03, ping.z]}>
      {/* Vòng lan tỏa ánh vàng chính */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={opacity * 0.85} />
      </mesh>

      {/* Vòng sáng tâm */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.22, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={opacity * 0.9} />
      </mesh>

      {/* Điểm nhấn tâm sáng */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.07, 16]} />
        <meshBasicMaterial color="#fffbeb" transparent opacity={opacity} />
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

function IntroDoor({ started }: { started: boolean }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/psx_indian_door.glb')
  const { actions } = useAnimations(animations, group)

  // Căn giữa chính xác và tính tỷ lệ để cửa vừa khít cổng vòm (rộng ~3.6m, cao ~3.6m)
  const { scale, centerOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // Khẩu độ cổng vào rộng 3.6m
    const targetW = 3.6
    const s = size.x > 0 ? targetW / size.x : 0.28

    return {
      scale: s,
      centerOffset: new THREE.Vector3(
        -center.x * s,
        -box.min.y * s,
        -center.z * s
      ),
    }
  }, [scene])

  useEffect(() => {
    if (started && actions) {
      const action = actions['Take 001'] || Object.values(actions)[0]
      if (action) {
        action.reset()
        action.setLoop(THREE.LoopOnce, 1)
        action.clampWhenFinished = true
        action.timeScale = 0.8
        action.play()
      }
    }
  }, [started, actions])

  return (
    <group ref={group} position={[0, 0, 14.5]} raycast={() => null}>
      <group position={[centerOffset.x, centerOffset.y, centerOffset.z]} scale={[scale, scale, scale]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}
// Exhibit models are already requested by GLBArtifact when their display cases mount.
// Preloading them here duplicates the eager request and adds work before the scene mounts.
useGLTF.preload('/models/psx_indian_door.glb')

function MuseumWorld({ command, activeId, visited, isLocked, viewMode, started, onArrive, onMoveAnywhere, onRequestOverview }: Props) {
  const controlsRef = useRef<any>(null)
  const pointerLockRef = useRef<any>(null)
  const pathRef = useRef<{ waypoints: Point2D[]; exhibitId?: string } | null>(null)
  const lastWaypointCount = useRef(0)
  const [pings, setPings] = useState<Ping[]>([])
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 12.3])
  const playerPosRef = useRef<[number, number]>([0, 12.3])
  const [activeWaypoints, setActiveWaypoints] = useState<Point2D[]>([])
  const suppressFloorClickRef = useRef(false)

  useEffect(() => {
    // Rời FPS phải nhả Pointer Lock ngay để có thể bấm nút Inspect/Thoát.
    if (!started || viewMode !== 'firstPerson' || activeId) {
      pointerLockRef.current?.unlock?.()
    }
  }, [activeId, started, viewMode])

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
    lastWaypointCount.current = path.length
    setActiveWaypoints([...path])

    setPings((prev) => [
      ...prev,
      { id: Date.now(), x: safeTarget.x, z: safeTarget.z, createdAt: Date.now() },
    ])
  }, [command])

  const navigateToExhibit = (item: Exhibit) => {
    onRequestOverview()
    const safeTarget = clampToWalkable(item.approach[0], item.approach[1])
    const path = findPath({ x: playerPos[0], z: playerPos[1] }, safeTarget)

    pathRef.current = {
      waypoints: [...path],
      exhibitId: item.id,
    }
    lastWaypointCount.current = path.length
    setActiveWaypoints([...path])

    setPings((prev) => [
      ...prev,
      { id: Date.now(), x: safeTarget.x, z: safeTarget.z, createdAt: Date.now() },
    ])
  }

  const handleFloorClick = (event: ThreeEvent<PointerEvent>) => {
    // Khóa di chuyển nhân vật khi đang trong chế độ Inspect hiện vật
    if (activeId || viewMode === 'firstPerson') return
    // Tổ hợp trái + phải dành riêng cho xoay camera, không đặt điểm đến.
    if (suppressFloorClickRef.current || event.nativeEvent.buttons === 3) return

    event.stopPropagation()
    onMoveAnywhere()

    const targetX = event.point.x
    const targetZ = event.point.z
    const safeTarget = clampToWalkable(targetX, targetZ)
    const path = findPath({ x: playerPos[0], z: playerPos[1] }, safeTarget)

    pathRef.current = {
      waypoints: [...path],
    }
    lastWaypointCount.current = path.length
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
    // Player runs in useFrame; updating React state at 60fps rerenders the whole museum.
    // Keep navigation responsive while limiting scene-level renders to meaningful movement.
    const dx = pos[0] - playerPos[0]
    const dz = pos[1] - playerPos[1]
    playerPosRef.current = pos
    if (dx * dx + dz * dz >= 0.04) setPlayerPos(pos)
    const waypointCount = pathRef.current?.waypoints.length ?? 0
    if (waypointCount !== lastWaypointCount.current) {
      lastWaypointCount.current = waypointCount
      setActiveWaypoints(pathRef.current ? [...pathRef.current.waypoints] : [])
    }
  }

  return (
    <>
      <CameraController activeId={activeId} isLocked={isLocked} started={started} controlsRef={controlsRef} viewMode={viewMode} />
      <FirstPersonController enabled={started && viewMode === 'firstPerson' && !activeId} pathRef={pathRef} playerPosRef={playerPosRef} onPositionUpdate={handlePositionUpdate} />
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
      <MapMouseControls
        controlsRef={controlsRef}
        // Toàn cảnh cố định; chỉ cho phép xoay khi đang inspect hiện vật.
        enabled={started && Boolean(activeId) && viewMode === 'overview'}
        suppressClickRef={suppressFloorClickRef}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -1]} receiveShadow onPointerUp={handleFloorClick}>
        <planeGeometry args={[26, 32]} />
        <meshStandardMaterial color="#1a1e24" roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Red Velvet Carpet Runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow onPointerUp={handleFloorClick}>
        <planeGeometry args={[4.2, 27.5]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.88} />
      </mesh>
      {/* Gold Carpet Border Trims */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.15, 0.008, 0]} receiveShadow>
        <planeGeometry args={[0.08, 27.5]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.15, 0.008, 0]} receiveShadow>
        <planeGeometry args={[0.08, 27.5]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Thảm đỏ đồng nhất: tâm thảm trùng tâm từng bục trưng bày */}
      <RoomCarpet position={[-8.9, 4]} onPointerUp={handleFloorClick} />
      <RoomCarpet position={[8.9, 4]} onPointerUp={handleFloorClick} />
      <RoomCarpet position={[-8.9, -4.8]} onPointerUp={handleFloorClick} />
      <RoomCarpet position={[8.9, -4.8]} onPointerUp={handleFloorClick} />
      <RoomCarpet position={[-8.9, -11.5]} onPointerUp={handleFloorClick} />
      <RoomCarpet position={[0, -11.5]} onPointerUp={handleFloorClick} />

      {/* Nhánh nối liền từ trục đỏ chính vào từng phòng */}
      <CarpetStrip position={[-4.4, 4]} size={[4.6, 2.0]} onPointerUp={handleFloorClick} />
      <CarpetStrip position={[4.4, 4]} size={[4.6, 2.0]} onPointerUp={handleFloorClick} />
      <CarpetStrip position={[-4.4, -4.8]} size={[4.6, 2.0]} onPointerUp={handleFloorClick} />
      <CarpetStrip position={[4.4, -4.8]} size={[4.6, 2.0]} onPointerUp={handleFloorClick} />
      <CarpetStrip position={[-4.4, -11.5]} size={[4.6, 2.0]} onPointerUp={handleFloorClick} />

      {/* Cánh cửa Intro */}
      <IntroDoor started={started} />

      {/* Sân trước sảnh bảo tàng (Outdoor Entrance Plaza) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 19.5]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#1a1e24" roughness={0.35} metalness={0.15} />
      </mesh>
      {/* Thảm đỏ ngoài sân dẫn thẳng vào cánh cửa */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 19.5]} receiveShadow>
        <planeGeometry args={[3.2, 10]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.64, -0.038, 19.5]} receiveShadow>
        <planeGeometry args={[0.08, 10]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.64, -0.038, 19.5]} receiveShadow>
        <planeGeometry args={[0.08, 10]} />
        <meshStandardMaterial color="#e5b83b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Đèn rọi chiếu sáng mặt tiền cánh cửa bảo tàng */}
      <spotLight
        position={[0, 5.5, 19.0]}
        target-position={[0, 1.8, 14.5]}
        intensity={7.0}
        angle={0.68}
        penumbra={0.6}
        color="#fff1d6"
      />

      {/* Cặp cột đá cẩm thạch hai bên cổng vòm lối vào */}
      <ColumnPost position={[-1.95, 0, 14.6]} />
      <ColumnPost position={[1.95, 0, 14.6]} />
      <ColumnPost position={[-2.4, 0, 20.5]} />
      <ColumnPost position={[2.4, 0, 20.5]} />

      {/* Tường bao ngoài bảo tàng */}
      <Wall position={[-12.5, 2.4, -1]} scale={[0.4, 4.8, 31.5]} />
      <Wall position={[12.5, 2.4, -1]} scale={[0.4, 4.8, 31.5]} />
      <Wall position={[0, 3.1, -16.5]} scale={[25, 6.2, 0.4]} />
      <Wall position={[-7.1, 1.5, 14.5]} scale={[10.6, 3.0, 0.4]} />
      <Wall position={[7.1, 1.5, 14.5]} scale={[10.6, 3.0, 0.4]} />

      {/* Interior room partition dividers */}
      <Wall position={[-8.75, 1.05, 6.9]} scale={[6.8, 2.1, 0.25]} />
      <Wall position={[8.75, 1.05, 6.9]} scale={[6.8, 2.1, 0.25]} />
      <Wall position={[-8.75, 1.05, -1.0]} scale={[6.8, 2.1, 0.25]} />
      <Wall position={[8.75, 1.05, -1.0]} scale={[6.8, 2.1, 0.25]} />
      <Wall position={[-8.75, 1.05, -8.8]} scale={[6.8, 2.1, 0.25]} />
      <Wall position={[8.75, 1.05, -8.8]} scale={[6.8, 2.1, 0.25]} />

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

      {/* Cụm nhận diện lịch sử được mount sớm để không làm Suspense đen màn hình khi bắt đầu. */}
      <WallFlag position={[-5.1, 4.35, -16.04]} type="national" label="CỜ TỔ QUỐC" visible={started} />
      <WallFlag position={[5.1, 4.35, -16.04]} type="party" label="CỜ ĐẢNG" visible={started} />
      <PortraitDisplay position={[0, 4.35, -16.0]} visible={started} />
      <ReliefBanner
        position={[0, 2.15, -16.02]}
        title="KHÔNG CÓ GÌ QUÝ HƠN ĐỘC LẬP, TỰ DO"
        subtitle="Chủ tịch Hồ Chí Minh"
        width={7.2}
        height={1.25}
      />

      {/* Bảng mô tả đồng nhất, gắn trên tường phía sau từng gian trưng bày */}
      {started && (
        <group>
          {/* Lối vào & Sảnh Đón Tiếp */}
          <RoomPlaque
            position={[0, 2.1, 14.27]}
            title="✦ LỐI VÀO BẢO TÀNG · SẢNH ĐÓN TIẾP ✦"
            subtitle="Chào mừng quý khách đến với Bảo tàng Hồ Chí Minh"
            width={3.8}
            height={0.85}
            rotation={[0, Math.PI, 0]}
          />

          {/* Gian Long Trọng (Tượng Bác Hồ) */}
          <RoomPlaque
            position={[0, 1.42, 6.77]}
            title="★ GIAN LONG TRỌNG · TƯỢNG BÁC HỒ ★"
            subtitle="Không gian trung tâm mở đầu hành trình di sản"
            width={3.8}
            height={0.85}
            rotation={[0, Math.PI, 0]}
          />

          {/* Phòng 1: Hoạt động quốc tế */}
          <RoomPlaque
            position={[-12.27, 1.42, 4.0]}
            title="✦ PHÒNG 1: HOẠT ĐỘNG QUỐC TẾ ✦"
            subtitle="Chi bộ Đảng Pháp & Hành trình cứu nước (1920–1923)"
            width={3.8}
            height={0.85}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Phòng 2: Tư liệu bút tích */}
          <RoomPlaque
            position={[12.27, 1.42, 4.0]}
            title="✦ PHÒNG 2: TƯ LIỆU BÚT TÍCH ✦"
            subtitle="Thư Bác Hồ gửi công nhân & Kháng chiến kiến quốc"
            width={3.8}
            height={0.85}
            rotation={[0, -Math.PI / 2, 0]}
          />

          {/* Phòng 3: Bút tích lịch sử */}
          <RoomPlaque
            position={[-12.27, 1.42, -4.8]}
            title="✦ PHÒNG 3: BÚT TÍCH LỊCH SỬ ✦"
            subtitle="Thư của Bác & Các bản tuyên cáo độc lập 1945"
            width={3.8}
            height={0.85}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Phòng 4: Kỷ vật đời thường */}
          <RoomPlaque
            position={[12.27, 1.42, -4.8]}
            title="✦ PHÒNG 4: KỶ VẬT ĐỜI THƯỜNG ✦"
            subtitle="Chiếc áo lụa nâu giản dị & Kỷ vật chiến khu Việt Bắc"
            width={3.8}
            height={0.85}
            rotation={[0, -Math.PI / 2, 0]}
          />

          {/* Phòng 5: Kỷ vật kháng chiến */}
          <RoomPlaque
            position={[-12.27, 1.42, -11.5]}
            title="✦ PHÒNG 5: KỶ VẬT KHÁNG CHIẾN ✦"
            subtitle="Bộ quần áo kaki lịch sử & Kỷ vật ngoại giao 1959"
            width={3.8}
            height={0.85}
            rotation={[0, Math.PI / 2, 0]}
          />

          {/* Gian tưởng niệm */}
          <RoomPlaque
            position={[0, 1.42, -16.27]}
            title="★ GIAN TƯỞNG NIỆM CHỦ TỊCH HỒ CHÍ MINH ★"
            subtitle="Không gian tri ân Anh hùng giải phóng dân tộc"
            width={3.8}
            height={0.85}
          />
        </group>
      )}

      {/* Display Cases */}
      {exhibits.map((item) => (
        <DisplayCase
          key={item.id}
          exhibit={item}
          active={activeId === item.id}
          visited={visited.has(item.id)}
          allowHover={viewMode === 'overview'}
          onNavigate={navigateToExhibit}
        />
      ))}

      {/* Guide Path Line (foot to destination) */}
      <GuidePath waypoints={activeWaypoints} playerPos={playerPos} />

      {/* Hiệu ứng chỉ điểm khi nhấp chuột */}
      {pings.map((ping) => (
        <ClickMarker key={ping.id} ping={ping} />
      ))}

      {/* Player character - Tự động ẩn khi chưa bắt đầu hoặc đang inspect hiện vật */}
      <Player
        pathRef={pathRef}
        onReached={handleReached}
        onPositionUpdate={handlePositionUpdate}
        visible={started && !activeId && viewMode === 'overview'}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={started && viewMode === 'overview' && Boolean(activeId)}
        enableRotate={false}
        enablePan={Boolean(activeId)}
        enableZoom={Boolean(activeId)}
        mouseButtons={{ LEFT: -1 as THREE.MOUSE, RIGHT: -1 as THREE.MOUSE }}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={activeId ? Math.PI / 2.05 : Math.PI / 2.15}
        minDistance={activeId ? 2.0 : 6}
        maxDistance={activeId ? 6.2 : 68}
      />
      <PointerLockControls
        ref={pointerLockRef}
        enabled={started && viewMode === 'firstPerson' && !activeId}
        pointerSpeed={0.35}
      />
    </>
  )
}

export function MuseumScene(props: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 2.2, 21.0], fov: 42, near: 0.1, far: 150 }}
      gl={{ antialias: true, preserveDrawingBuffer: false }}
    >
      <Suspense fallback={null}>
        <MuseumWorld {...props} />
      </Suspense>
    </Canvas>
  )
}
