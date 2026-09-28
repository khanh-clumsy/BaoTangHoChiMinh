import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { ROOM_SPAWNS } from '../data/rooms'
import { useMuseumStore } from '../store/useMuseumStore'

export type Controls = 'forward' | 'backward' | 'left' | 'right' | 'run'

const front = new THREE.Vector3()
const side = new THREE.Vector3()
const direction = new THREE.Vector3()

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const [, getKeys] = useKeyboardControls<Controls>()
  const camera = useThree((state) => state.camera)
  const currentRoom = useMuseumStore((s) => s.currentRoom)
  const tourActive = useMuseumStore((s) => s.tourActive)
  const exhibitModal = useMuseumStore((s) => s.exhibitModal)

  useEffect(() => {
    const rigidBody = body.current
    if (!rigidBody) return
    const [x, y, z] = ROOM_SPAWNS[currentRoom]
    rigidBody.setTranslation({ x, y, z }, true)
    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
    camera.position.set(x, y + 0.85, z)
  }, [camera, currentRoom])

  useFrame(() => {
    const rigidBody = body.current
    if (!rigidBody || tourActive || exhibitModal) return

    const keys = getKeys()
    const velocity = rigidBody.linvel()
    const speed = keys.run ? 5.4 : 3.3

    front.set(0, 0, Number(keys.backward) - Number(keys.forward))
    side.set(Number(keys.left) - Number(keys.right), 0, 0)
    direction.subVectors(front, side).normalize().multiplyScalar(speed).applyEuler(camera.rotation)
    direction.y = 0

    rigidBody.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)

    const position = rigidBody.translation()
    camera.position.set(position.x, position.y + 0.85, position.z)
  })

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        enabledRotations={[false, false, false]}
        position={ROOM_SPAWNS.main}
        mass={1}
        friction={0.1}
        linearDamping={8}
      >
        <CapsuleCollider args={[0.45, 0.32]} />
      </RigidBody>
      {!tourActive && !exhibitModal && <PointerLockControls />}
    </>
  )
}
