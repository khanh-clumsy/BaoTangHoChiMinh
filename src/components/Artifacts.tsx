import { useGLTF, useTexture } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'

// High-end PBR Materials
const marbleWhite = new THREE.MeshStandardMaterial({
  color: '#f6f3ed',
  roughness: 0.28,
  metalness: 0.05,
})

const marbleDark = new THREE.MeshStandardMaterial({
  color: '#1a1d20',
  roughness: 0.25,
  metalness: 0.15,
})

const goldGleam = new THREE.MeshStandardMaterial({
  color: '#e5b83b',
  metalness: 0.92,
  roughness: 0.18,
})

const bronzeAntique = new THREE.MeshStandardMaterial({
  color: '#966d34',
  metalness: 0.88,
  roughness: 0.26,
})

const redEnamel = new THREE.MeshStandardMaterial({
  color: '#b91c1c',
  roughness: 0.25,
  metalness: 0.2,
})

const tireRubber = new THREE.MeshStandardMaterial({
  color: '#1c1b1a',
  roughness: 0.88,
  metalness: 0.05,
})

const strapRubber = new THREE.MeshStandardMaterial({
  color: '#2b2a28',
  roughness: 0.65,
  metalness: 0.15,
})

const kakiCloth = new THREE.MeshStandardMaterial({
  color: '#a3976c',
  roughness: 0.94,
})

const darkKakiTrim = new THREE.MeshStandardMaterial({
  color: '#6e6345',
  roughness: 0.88,
})

const helmetGreen = new THREE.MeshStandardMaterial({
  color: '#34472c',
  roughness: 0.72,
})

const agedPaper = new THREE.MeshStandardMaterial({
  color: '#f3e5c8',
  roughness: 0.95,
  side: THREE.DoubleSide,
})

const antiqueMetal = new THREE.MeshStandardMaterial({
  color: '#2a2d30',
  metalness: 0.85,
  roughness: 0.3,
})

const woodMahogany = new THREE.MeshStandardMaterial({
  color: '#4a2511',
  roughness: 0.35,
  metalness: 0.05,
})

const woodLoom = new THREE.MeshStandardMaterial({
  color: '#6b4423',
  roughness: 0.8,
})

function GLBLoaderInner({
  path,
  texturePath,
  targetHeight = 1.55,
  rotation = [0, 0, 0],
  offsetY = 0,
  wrapperRotationY = 0,
}: {
  path: string
  texturePath?: string
  targetHeight?: number
  rotation?: [number, number, number]
  offsetY?: number
  wrapperRotationY?: number
}) {
  const { scene } = useGLTF(path)
  const texture = texturePath ? useTexture(texturePath) : null

  const processedGroup = useMemo(() => {
    const clone = scene.clone(true)

    if (texture) {
      texture.flipY = false
      texture.colorSpace = THREE.SRGBColorSpace
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.5,
            metalness: 0.25,
          })
        }
      })
    }

    // Áp dụng góc xoay vào clone trước để tính đúng BoundingBox sau khi xoay/nghiêng
    clone.rotation.set(rotation[0], rotation[1], rotation[2])
    clone.updateMatrixWorld(true)

    // Tính toán Bounding Box chính xác của model sau khi xoay
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // Tính toán tỷ lệ phóng to/thu nhỏ chuẩn để vừa vặn bục bảo tàng
    const maxDim = Math.max(size.x, size.y, size.z, 0.001)
    const scaleFactor = targetHeight / maxDim

    // Bật đổ bóng PBR và hiển thị 2 mặt (DoubleSide) cho toàn bộ mesh con
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              m.side = THREE.DoubleSide
            })
          } else {
            mesh.material.side = THREE.DoubleSide
          }
        }
      }
    })

    // Căn giữa tâm X, Z và đặt điểm thấp nhất của model nằm khớp chính xác với mặt bục Y = 0
    const wrapper = new THREE.Group()
    wrapper.rotation.y = wrapperRotationY
    clone.position.set(
      -center.x * scaleFactor,
      -box.min.y * scaleFactor + offsetY,
      -center.z * scaleFactor,
    )
    clone.scale.set(scaleFactor, scaleFactor, scaleFactor)
    wrapper.add(clone)

    return wrapper
  }, [scene, texture, targetHeight, rotation, offsetY, wrapperRotationY])

  return <primitive object={processedGroup} />
}

// GLB Model Loader với tự động tính toán Bounding Box, căn giữa và chuẩn hóa kích thước
export function GLBArtifact(props: {
  path: string
  texturePath?: string
  targetHeight?: number
  rotation?: [number, number, number]
  offsetY?: number
  wrapperRotationY?: number
}) {
  return (
    <Suspense fallback={null}>
      <GLBLoaderInner {...props} />
    </Suspense>
  )
}

// 1. Tượng Bán Thân Chủ tịch Hồ Chí Minh (Đồng cổ PBR & Bệ gỗ quý sang trọng)
export function StatueArtifact() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 0.35, 0]} scale={0.95}>
        {/* Mahogany Display Pedestal Block */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow material={woodMahogany}>
          <boxGeometry args={[0.76, 0.16, 0.56]} />
        </mesh>
        {/* Polished Gold Plate Inlay */}
        <mesh position={[0, 0.17, 0]} castShadow material={goldGleam}>
          <boxGeometry args={[0.66, 0.025, 0.48]} />
        </mesh>
        {/* Marble Base for Bust */}
        <mesh position={[0, 0.22, 0]} castShadow material={marbleDark}>
          <cylinderGeometry args={[0.28, 0.32, 0.08, 32]} />
        </mesh>

        {/* Bronze Bust (Tượng bán thân đồng cổ) */}
        {/* Torso & Shoulders */}
        <mesh position={[0, 0.48, 0]} castShadow receiveShadow material={bronzeAntique}>
          <cylinderGeometry args={[0.26, 0.38, 0.46, 24]} />
        </mesh>
        {/* Suit Collar & Lapel */}
        <mesh position={[0, 0.68, 0.04]} castShadow material={bronzeAntique}>
          <cylinderGeometry args={[0.17, 0.23, 0.16, 20]} />
        </mesh>
        {/* Shirt Collar detail */}
        <mesh position={[0, 0.72, 0.07]} castShadow material={marbleWhite}>
          <boxGeometry args={[0.12, 0.04, 0.08]} />
        </mesh>

        {/* Head & Cranium */}
        <mesh position={[0, 0.92, 0.02]} castShadow receiveShadow material={bronzeAntique}>
          <sphereGeometry args={[0.22, 32, 28]} />
        </mesh>
        {/* Forehead & Brow Line */}
        <mesh position={[0, 0.98, 0.12]} castShadow material={bronzeAntique}>
          <boxGeometry args={[0.2, 0.08, 0.12]} />
        </mesh>
        {/* High Noble Nose Bridge */}
        <mesh position={[0, 0.91, 0.19]} castShadow material={bronzeAntique}>
          <coneGeometry args={[0.042, 0.14, 16]} />
        </mesh>
        {/* Moustache */}
        <mesh position={[0, 0.82, 0.18]} castShadow material={bronzeAntique}>
          <boxGeometry args={[0.14, 0.035, 0.06]} />
        </mesh>
        {/* Iconic Long Beard (Chòm râu dài đặc trưng của Bác) */}
        <mesh position={[0, 0.72, 0.16]} rotation={[0.18, 0, 0]} castShadow material={bronzeAntique}>
          <coneGeometry args={[0.078, 0.28, 20]} />
        </mesh>

        {/* Backdrop: Brilliant Sunburst Radiant Halo of Vietnam */}
        <group position={[0, 0.98, -0.32]}>
          <mesh castShadow material={goldGleam}>
            <torusGeometry args={[0.68, 0.035, 16, 48]} />
          </mesh>
          <mesh material={goldGleam}>
            <circleGeometry args={[0.22, 32]} />
          </mesh>
          {Array.from({ length: 16 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 8]} position={[0, 0, -0.01]} material={goldGleam}>
              <boxGeometry args={[0.024, 1.25, 0.012]} />
            </mesh>
          ))}
        </group>
      </group>
    </Suspense>
  )
}

// 2. Quốc Huy / Biểu tượng Búa Liềm Sao Vàng Mạ Vàng Chạm Khắc Tinh Xảo
export function EmblemArtifact() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 0.6, 0]} scale={0.9}>
        {/* Tiered circular mount */}
        <mesh position={[0, -0.12, 0]} castShadow material={marbleDark}>
          <cylinderGeometry args={[0.55, 0.6, 0.1, 32]} />
        </mesh>
        <mesh position={[0, -0.04, 0]} castShadow material={goldGleam}>
          <cylinderGeometry args={[0.48, 0.48, 0.05, 32]} />
        </mesh>

        {/* Red Shield Backing */}
        <mesh position={[0, 0.28, 0]} rotation={[0.18, 0, 0]} castShadow material={redEnamel}>
          <cylinderGeometry args={[0.38, 0.38, 0.06, 32]} />
        </mesh>
        {/* Gold Border Wreath (Bông lúa vàng bao quanh) */}
        <mesh position={[0, 0.28, 0.03]} rotation={[0.18, 0, 0]} castShadow material={goldGleam}>
          <torusGeometry args={[0.37, 0.038, 12, 36]} />
        </mesh>

        {/* Gold Star & Hammer Sickle (Ngôi sao vàng / Búa liềm đúc nổi) */}
        <group position={[0, 0.3, 0.06]} rotation={[0.18, 0, 0]}>
          <mesh castShadow material={goldGleam}>
            <octahedronGeometry args={[0.18, 0]} />
          </mesh>
          <mesh position={[0, -0.08, 0.02]} rotation={[0, 0, 0.4]} material={goldGleam}>
            <boxGeometry args={[0.04, 0.24, 0.03]} />
          </mesh>
          <mesh position={[0.04, 0.04, 0.02]} rotation={[0, 0, -0.6]} material={goldGleam}>
            <torusGeometry args={[0.09, 0.02, 8, 16, Math.PI * 0.9]} />
          </mesh>
        </group>
      </group>
    </Suspense>
  )
}

// 3. Đôi Dép Cao Su Lịch Sử (Làm từ săm lốp ô tô quân sự)
function SingleSandal({ x, z, rotationY }: { x: number; z: number; rotationY: number }) {
  const shape = new THREE.Shape()
  shape.moveTo(-0.18, -0.38)
  shape.quadraticCurveTo(-0.24, -0.5, -0.15, -0.58)
  shape.quadraticCurveTo(0, -0.64, 0.15, -0.58)
  shape.quadraticCurveTo(0.24, -0.5, 0.18, -0.38)
  shape.lineTo(0.16, 0.32)
  shape.quadraticCurveTo(0.14, 0.48, 0, 0.52)
  shape.quadraticCurveTo(-0.14, 0.48, -0.16, 0.32)
  shape.closePath()

  return (
    <group position={[x, 0.28, z]} rotation={[0, rotationY, 0]}>
      {/* Tire Rubber Sole with Tread */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow material={tireRubber}>
        <extrudeGeometry args={[shape, { depth: 0.085, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.015, bevelThickness: 0.015 }]} />
      </mesh>

      {/* Tire Tread Grips */}
      {[-0.35, -0.2, -0.05, 0.1, 0.25, 0.4].map((pz, idx) => (
        <mesh key={idx} position={[0, -0.01, pz]} rotation={[-Math.PI / 2, 0, 0]} material={tireRubber}>
          <boxGeometry args={[0.26, 0.035, 0.01]} />
        </mesh>
      ))}

      {/* Cross Straps (Quai chéo săm xe) */}
      <mesh position={[0, 0.15, -0.02]} rotation={[0.2, 0, 0]} castShadow material={strapRubber}>
        <torusGeometry args={[0.18, 0.032, 10, 28, Math.PI * 1.15]} />
      </mesh>
      <mesh position={[0, 0.14, 0.14]} rotation={[-0.15, 0, 0]} castShadow material={strapRubber}>
        <torusGeometry args={[0.17, 0.032, 10, 28, Math.PI * 1.15]} />
      </mesh>

      {/* Heel Strap (Quai hậu) */}
      <mesh position={[0, 0.12, -0.42]} rotation={[0.85, 0, 0]} castShadow material={strapRubber}>
        <torusGeometry args={[0.15, 0.028, 8, 24, Math.PI]} />
      </mesh>
    </group>
  )
}

export function SandalsArtifact() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow material={woodMahogany}>
          <boxGeometry args={[0.9, 0.08, 0.74]} />
        </mesh>
        <SingleSandal x={-0.24} z={0.06} rotationY={-0.15} />
        <SingleSandal x={0.24} z={-0.06} rotationY={0.18} />
      </group>
    </Suspense>
  )
}

// 4. Tư liệu Hành trình & Máy chữ cổ (Vintage Typewriter, Manuscripts & Eyeglasses)
export function DocumentsArtifact() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 0.35, 0]}>
        <mesh position={[0, 0.08, 0]} castShadow material={woodMahogany}>
          <boxGeometry args={[1.25, 0.08, 0.85]} />
        </mesh>

        {/* Vintage Portable Typewriter */}
        <group position={[0.22, 0.24, 0.05]} rotation={[0, -0.15, 0]}>
          <mesh castShadow material={antiqueMetal}>
            <boxGeometry args={[0.48, 0.14, 0.42]} />
          </mesh>
          <mesh position={[0, -0.02, 0.18]} rotation={[0.3, 0, 0]} castShadow material={antiqueMetal}>
            <boxGeometry args={[0.42, 0.06, 0.18]} />
          </mesh>
          {[-0.16, -0.08, 0, 0.08, 0.16].flatMap((kx) =>
            [0.12, 0.18, 0.24].map((kz, ki) => (
              <mesh key={`${kx}-${kz}`} position={[kx + (ki % 2) * 0.03, 0.04, kz]} material={new THREE.MeshStandardMaterial({ color: '#f0ece1', roughness: 0.2 })}>
                <cylinderGeometry args={[0.022, 0.022, 0.03, 8]} />
              </mesh>
            )),
          )}
          <mesh position={[0, 0.12, -0.12]} rotation={[0, 0, Math.PI / 2]} castShadow material={antiqueMetal}>
            <cylinderGeometry args={[0.045, 0.045, 0.52, 16]} />
          </mesh>
          <mesh position={[0, 0.2, -0.14]} rotation={[-0.4, 0, 0]} castShadow material={agedPaper}>
            <boxGeometry args={[0.36, 0.22, 0.005]} />
          </mesh>
        </group>

        {/* Historic Manuscripts & Eyeglasses */}
        <group position={[-0.32, 0.15, 0.08]} rotation={[0, 0.2, 0]}>
          <mesh castShadow material={agedPaper}>
            <boxGeometry args={[0.44, 0.02, 0.56]} />
          </mesh>
          {[-0.18, -0.12, -0.06, 0, 0.06, 0.12, 0.18].map((ly, li) => (
            <mesh key={ly} position={[-0.02, 0.015, ly]} material={new THREE.MeshBasicMaterial({ color: '#524535' })}>
              <boxGeometry args={[li % 3 === 0 ? 0.24 : 0.34, 0.002, 0.012]} />
            </mesh>
          ))}
          {/* Eyeglasses */}
          <group position={[0.06, 0.035, -0.12]} rotation={[0, 0.4, 0]}>
            <mesh material={goldGleam}>
              <torusGeometry args={[0.045, 0.006, 8, 20]} />
            </mesh>
            <mesh position={[0.11, 0, 0]} material={goldGleam}>
              <torusGeometry args={[0.045, 0.006, 8, 20]} />
            </mesh>
            <mesh position={[0.055, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={goldGleam}>
              <cylinderGeometry args={[0.004, 0.004, 0.03, 6]} />
            </mesh>
          </group>
        </group>
      </group>
    </Suspense>
  )
}

// 5. Không gian Làng Sen (Khung cửi dệt vải & Chõng tre)
export function HeritageArtifact() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 0.55, 0]} scale={0.92}>
        {/* Wooden Loom */}
        {[-0.45, 0.45].flatMap((px) =>
          [-0.28, 0.28].map((pz, pi) => (
            <mesh key={`${px}-${pz}-${pi}`} position={[px, 0.1, pz]} castShadow material={woodMahogany}>
              <boxGeometry args={[0.07, 0.95, 0.07]} />
            </mesh>
          )),
        )}
        <mesh position={[0, 0.52, -0.28]} castShadow material={woodMahogany}>
          <boxGeometry args={[0.96, 0.06, 0.06]} />
        </mesh>
        <mesh position={[0, 0.52, 0.28]} castShadow material={woodMahogany}>
          <boxGeometry args={[0.96, 0.06, 0.06]} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[0.45, 0, 0]} castShadow material={new THREE.MeshStandardMaterial({ color: '#c9b189', roughness: 0.95 })}>
          <boxGeometry args={[0.72, 0.55, 0.02]} />
        </mesh>
        <mesh position={[0.12, 0.18, 0.08]} rotation={[0, 0.6, 0]} castShadow material={woodLoom}>
          <coneGeometry args={[0.04, 0.28, 8]} />
        </mesh>

        {/* Bench */}
        <group position={[0, -0.22, 0.48]}>
          <mesh castShadow material={woodMahogany}>
            <boxGeometry args={[0.95, 0.08, 0.32]} />
          </mesh>
          {[-0.4, 0.4].flatMap((bx) =>
            [-0.1, 0.1].map((bz, bi) => (
              <mesh key={`${bx}-${bz}-${bi}`} position={[bx, -0.15, bz]} castShadow material={woodMahogany}>
                <cylinderGeometry args={[0.03, 0.03, 0.24, 8]} />
              </mesh>
            )),
          )}
        </group>
      </group>
    </Suspense>
  )
}

// 6. Bộ Quần Áo Kaki & Mũ Cối (Kỷ vật May 10 & Kháng chiến)
export function ClothingArtifact() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 1.05, 0]} scale={0.95}>
        <mesh position={[0, -0.85, 0]} castShadow material={marbleDark}>
          <cylinderGeometry args={[0.32, 0.36, 0.08, 24]} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow material={bronzeAntique}>
          <cylinderGeometry args={[0.025, 0.025, 0.9, 12]} />
        </mesh>

        {/* Trousers */}
        <mesh position={[-0.15, -0.32, 0]} castShadow material={kakiCloth}>
          <cylinderGeometry args={[0.13, 0.15, 0.72, 16]} />
        </mesh>
        <mesh position={[0.15, -0.32, 0]} castShadow material={kakiCloth}>
          <cylinderGeometry args={[0.13, 0.15, 0.72, 16]} />
        </mesh>
        {/* Shoes */}
        <mesh position={[-0.15, -0.7, 0.04]} castShadow material={tireRubber}>
          <boxGeometry args={[0.18, 0.1, 0.32]} />
        </mesh>
        <mesh position={[0.15, -0.7, 0.04]} castShadow material={tireRubber}>
          <boxGeometry args={[0.18, 0.1, 0.32]} />
        </mesh>

        {/* Kaki Jacket */}
        <mesh position={[0, 0.26, 0]} castShadow material={kakiCloth}>
          <cylinderGeometry args={[0.34, 0.42, 0.76, 18]} />
        </mesh>
        {/* 4 Pockets */}
        {[-0.19, 0.19].flatMap((tx) =>
          [0.36, 0.1].map((ty, ti) => (
            <mesh key={`${tx}-${ty}-${ti}`} position={[tx, ty, 0.21]} castShadow material={darkKakiTrim}>
              <boxGeometry args={[0.17, 0.12, 0.03]} />
            </mesh>
          )),
        )}
        {/* Gold Buttons */}
        {[-0.02, 0.08, 0.18, 0.28, 0.38, 0.48].map((by) => (
          <mesh key={by} position={[0, by, 0.22]} material={goldGleam}>
            <sphereGeometry args={[0.02, 10, 8]} />
          </mesh>
        ))}

        {/* Sleeves */}
        <mesh position={[-0.42, 0.24, 0.02]} rotation={[0, 0, 0.22]} castShadow material={kakiCloth}>
          <cylinderGeometry args={[0.11, 0.09, 0.65, 12]} />
        </mesh>
        <mesh position={[0.42, 0.24, 0.02]} rotation={[0, 0, -0.22]} castShadow material={kakiCloth}>
          <cylinderGeometry args={[0.11, 0.09, 0.65, 12]} />
        </mesh>

        {/* Pith Helmet */}
        <group position={[0, 0.85, 0]}>
          <mesh castShadow material={helmetGreen}>
            <sphereGeometry args={[0.25, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow material={helmetGreen}>
            <ringGeometry args={[0.22, 0.38, 32]} />
          </mesh>
          <mesh position={[0, 0.12, 0.25]} rotation={[0.3, 0, 0]} material={redEnamel}>
            <circleGeometry args={[0.04, 16]} />
          </mesh>
          <mesh position={[0, 0.12, 0.255]} rotation={[0.3, 0, 0]} material={goldGleam}>
            <octahedronGeometry args={[0.025, 0]} />
          </mesh>
        </group>
      </group>
    </Suspense>
  )
}

// 7. Gian Tưởng Niệm (Lư hương đồng tam khí & Hoa sen vàng vĩnh cửu)
export function MemorialArtifact() {
  return (
    <Suspense fallback={null}>
      <group position={[0, 0.55, 0]} scale={0.92}>
        <mesh position={[0, -0.28, 0]} castShadow receiveShadow material={marbleDark}>
          <boxGeometry args={[1.0, 0.14, 0.8]} />
        </mesh>

        {/* Incense Burner */}
        <mesh position={[0, 0.08, 0]} castShadow material={goldGleam}>
          <cylinderGeometry args={[0.26, 0.38, 0.26, 24]} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow material={goldGleam}>
          <torusGeometry args={[0.28, 0.035, 12, 32]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow material={goldGleam}>
          <sphereGeometry args={[0.24, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow material={goldGleam}>
          <octahedronGeometry args={[0.08, 0]} />
        </mesh>

        {/* Golden Lotus Bloom */}
        <group position={[0, 0.38, 0]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh
              key={i}
              position={[Math.cos((i * Math.PI) / 4) * 0.42, 0.15 + (i % 2) * 0.08, Math.sin((i * Math.PI) / 4) * 0.42]}
              rotation={[0.55, (-i * Math.PI) / 4, 0]}
              castShadow
              material={goldGleam}
            >
              <sphereGeometry args={[0.18, 12, 10]} />
            </mesh>
          ))}
          <mesh position={[0, 0.24, 0]} material={new THREE.MeshStandardMaterial({ color: '#fff0a6', emissive: '#ffd700', emissiveIntensity: 0.8 })}>
            <sphereGeometry args={[0.1, 16, 12]} />
          </mesh>
        </group>
      </group>
    </Suspense>
  )
}
