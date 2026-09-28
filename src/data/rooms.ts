import type { RoomId } from '../types'

export const ROOM_LABELS: Record<RoomId, string> = {
  main: 'Sảnh Chính',
  room1: 'Phòng 1',
  room2: 'Phòng 2',
  room3: 'Phòng 3',
}

export const ROOM_SPAWNS: Record<RoomId, [number, number, number]> = {
  main: [0, 1.2, 18],
  room1: [0, 1.2, 6],
  room2: [0, 1.2, -6],
  room3: [0, 1.2, -18],
}
