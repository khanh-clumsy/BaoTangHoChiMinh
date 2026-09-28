import { Text } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

const wallMaterial = { color: '#e7e1d7', roughness: 0.82, metalness: 0.03 }

function Wall({ position, scale }: { position: [number, number, number], scale: [number, number, number] }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial {...wallMaterial} />
    </mesh>
  )
}

function Partition({ z }: { z: number }) {
  return (
    <>
      <Wall position={[-6.25, 1.7, z]} scale={[7.5, 3.4, 0.25]} />
      <Wall position={[6.25, 1.7, z]} scale={[7.5, 3.4, 0.25]} />
    </>
  )
}

function GalleryPedestal({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1.6, 0.8, 1.1]} />
      <meshStandardMaterial color="#24282f" roughness={0.58} />
    </mesh>
  )
}

export function MuseumPlaceholder() {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.1, -2]} receiveShadow>
          <boxGeometry args={[20, 0.2, 52]} />
          <meshStandardMaterial color="#c6b9a7" roughness={0.9} />
        </mesh>

        <Wall position={[-10, 1.7, -2]} scale={[0.25, 3.4, 52]} />
        <Wall position={[10, 1.7, -2]} scale={[0.25, 3.4, 52]} />
        <Wall position={[-6.25, 1.7, 24]} scale={[7.5, 3.4, 0.25]} />
        <Wall position={[6.25, 1.7, 24]} scale={[7.5, 3.4, 0.25]} />
        <Wall position={[0, 1.7, -28]} scale={[20, 3.4, 0.25]} />

        <Partition z={10} />
        <Partition z={-2} />
        <Partition z={-14} />

        {[-6.7, 6.7].flatMap((x) => [18, 14, 6, 2, -6, -10, -18, -24].map((z) => (
          <GalleryPedestal key={`${x}-${z}`} position={[x, 0.4, z]} />
        )))}
      </RigidBody>

      <Text position={[0, 2.25, 22.8]} fontSize={0.55} color="#5b1722" anchorX="center">
        BẢO TÀNG HỒ CHÍ MINH — GRAYBOX
      </Text>
      <Text position={[0, 2.4, 15]} fontSize={0.5} color="#5b1722" anchorX="center">SẢNH CHÍNH</Text>
      <Text position={[0, 2.4, 3]} fontSize={0.5} color="#5b1722" anchorX="center">PHÒNG 1</Text>
      <Text position={[0, 2.4, -9]} fontSize={0.5} color="#5b1722" anchorX="center">PHÒNG 2</Text>
      <Text position={[0, 2.4, -21]} fontSize={0.5} color="#5b1722" anchorX="center">PHÒNG 3</Text>
    </group>
  )
}
