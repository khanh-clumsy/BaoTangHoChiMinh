import * as THREE from 'three'

const bronze = new THREE.MeshStandardMaterial({ color: '#8a672f', metalness: 0.72, roughness: 0.34 })
const rubber = new THREE.MeshStandardMaterial({ color: '#242321', roughness: 0.92 })
const kaki = new THREE.MeshStandardMaterial({ color: '#a99d72', roughness: 0.94 })
const wood = new THREE.MeshStandardMaterial({ color: '#765035', roughness: 0.88 })

function Box({ position, size, material = wood, rotation }: {
  position: [number, number, number]
  size: [number, number, number]
  material?: THREE.Material
  rotation?: [number, number, number]
}) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow material={material}>
    <boxGeometry args={size} />
  </mesh>
}

function Rod({ start, end, radius, material = wood }: {
  start: [number, number, number]
  end: [number, number, number]
  radius: number
  material?: THREE.Material
}) {
  const a = new THREE.Vector3(...start)
  const b = new THREE.Vector3(...end)
  const direction = new THREE.Vector3().subVectors(b, a)
  return <mesh position={a.add(b).multiplyScalar(0.5).toArray()} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())} castShadow material={material}>
    <cylinderGeometry args={[radius, radius, direction.length(), 8]} />
  </mesh>
}

export function StatueArtifact() {
  return <group position={[0, 0.42, 0]} scale={0.78}>
    {/* Standing bronze figure, based on the museum's full-length opening-hall statue. */}
    <mesh position={[0, 0.48, 0]} castShadow material={bronze}><cylinderGeometry args={[0.39, 0.48, 0.9, 12]} /></mesh>
    <mesh position={[0, 1.05, 0]} castShadow material={bronze}><cylinderGeometry args={[0.19, 0.26, 0.24, 12]} /></mesh>
    <mesh position={[0, 1.34, 0]} castShadow material={bronze}><sphereGeometry args={[0.25, 16, 12]} /></mesh>
    <mesh position={[0, 1.36, 0.22]} castShadow material={bronze}><sphereGeometry args={[0.055, 10, 8]} /></mesh>
    <mesh position={[0, 1.30, 0.25]} castShadow material={bronze}><coneGeometry args={[0.055, 0.14, 8]} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 0.47, 0.65, 0.02]} rotation={[0, 0, side * -0.28]} castShadow material={bronze}><cylinderGeometry args={[0.105, 0.13, 0.62, 10]} /></mesh>
      <mesh position={[side * 0.53, 0.32, 0.08]} castShadow material={bronze}><sphereGeometry args={[0.105, 10, 8]} /></mesh>
      <mesh position={[side * 0.17, -0.22, 0.04]} castShadow material={bronze}><cylinderGeometry args={[0.13, 0.15, 0.55, 10]} /></mesh>
      <mesh position={[side * 0.17, -0.5, 0.12]} castShadow material={bronze}><boxGeometry args={[0.28, 0.12, 0.42]} /></mesh>
    </group>)}
    {/* Sun disc and stylized banyan branches recall the real sculptural backdrop. */}
    <mesh position={[0, 1.35, -0.62]} castShadow material={new THREE.MeshStandardMaterial({ color: '#b28b48', metalness: 0.5, roughness: 0.48 })}><torusGeometry args={[0.68, 0.055, 8, 40]} /></mesh>
    <Rod start={[0, 0.7, -0.58]} end={[0, 2.2, -0.58]} radius={0.065} />
    {[-1, 1].map(side => <group key={side}>
      <Rod start={[0, 1.75, -0.58]} end={[side * 0.55, 2.0, -0.58]} radius={0.04} />
      <Rod start={[side * 0.35, 1.88, -0.58]} end={[side * 0.65, 1.68, -0.58]} radius={0.025} />
      <mesh position={[side * 0.57, 2.03, -0.58]} scale={[1, 0.42, 0.36]} material={new THREE.MeshStandardMaterial({ color: '#486244', roughness: 1 })}><sphereGeometry args={[0.35, 10, 8]} /></mesh>
    </group>)}
  </group>
}

function Sandal({ x, z, angle }: { x: number; z: number; angle: number }) {
  const outline = new THREE.Shape()
  outline.moveTo(-0.16, -0.36)
  outline.quadraticCurveTo(-0.22, -0.44, -0.16, -0.52)
  outline.quadraticCurveTo(0, -0.58, 0.16, -0.52)
  outline.quadraticCurveTo(0.22, -0.44, 0.16, -0.36)
  outline.lineTo(0.13, 0.32)
  outline.quadraticCurveTo(0.12, 0.43, 0, 0.46)
  outline.quadraticCurveTo(-0.12, 0.43, -0.13, 0.32)
  outline.closePath()
  const strap = new THREE.MeshStandardMaterial({ color: '#34322f', roughness: 0.83 })
  return <group position={[x, 0.56, z]} rotation={[0, angle, 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow material={rubber}><extrudeGeometry args={[outline, { depth: 0.075, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.018, bevelThickness: 0.018 }]} /></mesh>
    <mesh position={[0, 0.13, -0.02]} castShadow material={strap}>
      <torusGeometry args={[0.16, 0.027, 8, 24, Math.PI * 1.18]} />
    </mesh>
    <mesh position={[0, 0.13, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow material={strap}><cylinderGeometry args={[0.027, 0.027, 0.13, 8]} /></mesh>
    <mesh position={[-0.145, 0.11, 0.1]} rotation={[0, 0, Math.PI / 2]} material={strap}><cylinderGeometry args={[0.025, 0.025, 0.16, 8]} /></mesh>
    <mesh position={[0.145, 0.11, 0.1]} rotation={[0, 0, Math.PI / 2]} material={strap}><cylinderGeometry args={[0.025, 0.025, 0.16, 8]} /></mesh>
  </group>
}

export function SandalsArtifact() {
  return <group><Sandal x={-0.22} z={0.08} angle={-0.12} /><Sandal x={0.22} z={-0.08} angle={0.16} /></group>
}

export function DocumentsArtifact() {
  const paper = new THREE.MeshStandardMaterial({ color: '#dfd1ae', roughness: 0.95, side: THREE.DoubleSide })
  const ink = new THREE.MeshBasicMaterial({ color: '#81735b' })
  return <group position={[0, 0.63, 0]} rotation={[-0.12, 0.08, 0]}>
    <Box position={[0, 0.13, 0]} size={[0.8, 0.06, 0.52]} material={wood} />
    <mesh position={[-0.2, 0.2, 0]} rotation={[0.08, 0, -0.08]} castShadow material={paper}><boxGeometry args={[0.4, 0.035, 0.5]} /></mesh>
    <mesh position={[0.2, 0.2, 0]} rotation={[0.08, 0, 0.08]} castShadow material={paper}><boxGeometry args={[0.4, 0.035, 0.5]} /></mesh>
    {[-0.27, -0.18, -0.09, 0, 0.09, 0.18, 0.27].map((x, i) => <mesh key={x} position={[x, 0.224, i % 2 ? -0.04 : 0.07]} material={ink}><boxGeometry args={[0.23, 0.006, 0.012]} /></mesh>)}
    <Box position={[0.56, 0.26, -0.16]} size={[0.23, 0.12, 0.34]} material={new THREE.MeshStandardMaterial({ color: '#593c2b', roughness: 0.86 })} rotation={[0.18, 0, 0]} />
    <Box position={[-0.55, 0.23, 0.02]} size={[0.1, 0.07, 0.42]} material={new THREE.MeshStandardMaterial({ color: '#d9c9a6', roughness: 1 })} rotation={[0, 0, 0.04]} />
  </group>
}

export function HeritageArtifact() {
  const woven = new THREE.MeshStandardMaterial({ color: '#aa8d63', roughness: 1 })
  return <group position={[0, 0.6, 0]}>
    {/* Small wooden loom and bench refer to the Làng Sen family-life display. */}
    {[-0.43, 0.43].map(x => <group key={x}>
      <Rod start={[x, -0.38, -0.2]} end={[x, 0.55, -0.2]} radius={0.045} />
      <Rod start={[x, -0.38, 0.2]} end={[x, 0.55, 0.2]} radius={0.045} />
    </group>)}
    <Rod start={[-0.48, 0.5, -0.2]} end={[0.48, 0.5, -0.2]} radius={0.04} />
    <Rod start={[-0.48, 0.5, 0.2]} end={[0.48, 0.5, 0.2]} radius={0.04} />
    <Box position={[0, 0.03, 0]} size={[0.7, 0.48, 0.06]} material={woven} />
    {Array.from({ length: 9 }, (_, i) => <Box key={i} position={[-0.32 + i * 0.08, 0.03, 0.04]} size={[0.018, 0.47, 0.014]} material={wood} />)}
    <Box position={[0, -0.21, 0.48]} size={[0.92, 0.12, 0.34]} />
    {[-0.38, 0.38].flatMap(x => [-0.11, 0.11].map(z => <Rod key={`${x}-${z}`} start={[x, -0.28, 0.48 + z]} end={[x, -0.54, 0.48 + z]} radius={0.035} />))}
    <Box position={[0, 0.62, -0.02]} size={[0.66, 0.1, 0.5]} />
  </group>
}

export function ClothingArtifact() {
  const darkKaki = new THREE.MeshStandardMaterial({ color: '#786f55', roughness: 0.96 })
  const mannequin = new THREE.MeshStandardMaterial({ color: '#c7b99a', roughness: 0.85 })
  return <group position={[0, 0.7, 0]}>
    {/* Jacket, straight trousers and pith helmet echo the documented display. */}
    <mesh position={[0, 0.24, 0]} castShadow material={kaki}><cylinderGeometry args={[0.32, 0.42, 0.72, 12]} /></mesh>
    <mesh position={[0, 0.65, 0]} castShadow material={kaki}><cylinderGeometry args={[0.13, 0.2, 0.18, 10]} /></mesh>
    <mesh position={[0, 0.84, 0]} castShadow material={mannequin}><sphereGeometry args={[0.19, 14, 10]} /></mesh>
    <mesh position={[0, 0.85, 0.16]} castShadow material={mannequin}><coneGeometry args={[0.045, 0.1, 8]} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 0.42, 0.27, 0.01]} rotation={[0, 0, -side * 0.18]} castShadow material={kaki}><cylinderGeometry args={[0.095, 0.08, 0.62, 10]} /></mesh>
      <mesh position={[side * 0.46, -0.06, 0.04]} material={mannequin}><sphereGeometry args={[0.075, 8, 6]} /></mesh>
      <mesh position={[side * 0.17, -0.4, 0]} castShadow material={kaki}><cylinderGeometry args={[0.13, 0.14, 0.64, 10]} /></mesh>
      <mesh position={[side * 0.17, -0.72, 0.04]} castShadow material={darkKaki}><boxGeometry args={[0.24, 0.11, 0.35]} /></mesh>
      {[0.32, 0.08].map(y => <mesh key={y} position={[side * 0.19, y, 0.22]} castShadow material={darkKaki}><boxGeometry args={[0.2, 0.13, 0.035]} /></mesh>)}
    </group>)}
    <Rod start={[-0.1, 0.54, 0.15]} end={[0, 0.39, 0.19]} radius={0.012} material={darkKaki} />
    <Rod start={[0.1, 0.54, 0.15]} end={[0, 0.39, 0.19]} radius={0.012} material={darkKaki} />
    {[-0.035, 0.07, 0.17, 0.27, 0.37].map(y => <mesh key={y} position={[0, y, 0.225]} material={darkKaki}><sphereGeometry args={[0.025, 8, 6]} /></mesh>)}
    <mesh position={[0, 0.73, 0]} castShadow material={darkKaki}><cylinderGeometry args={[0.23, 0.25, 0.1, 16]} /></mesh>
    <mesh position={[0, 0.8, 0]} castShadow material={darkKaki}><cylinderGeometry args={[0.15, 0.15, 0.1, 16]} /></mesh>
  </group>
}

export function MemorialArtifact() {
  const gold = new THREE.MeshStandardMaterial({ color: '#bd9853', metalness: 0.45, roughness: 0.48 })
  return <group position={[0, 0.55, 0]}>
    <mesh position={[0, -0.08, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#eee5d3', roughness: 0.8 })}><cylinderGeometry args={[0.38, 0.48, 0.2, 12]} /></mesh>
    <mesh position={[0, 0.1, 0]} castShadow material={gold}><cylinderGeometry args={[0.2, 0.32, 0.2, 10]} /></mesh>
    <mesh position={[0, 0.25, 0]} castShadow material={gold}><cylinderGeometry args={[0.24, 0.24, 0.08, 12]} /></mesh>
    <mesh position={[0, 0.38, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#f1eee6', roughness: 0.8, emissive: '#3b3020' })}><sphereGeometry args={[0.09, 12, 10]} /></mesh>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 0.38, 0.82 + (i % 2) * 0.12, Math.sin(i * Math.PI / 4) * 0.38]} rotation={[0.4, -i * Math.PI / 4, 0]} material={new THREE.MeshStandardMaterial({ color: '#bd9b6b', roughness: 0.8 })}><sphereGeometry args={[0.27, 10, 8]} /></mesh>)}
  </group>
}
