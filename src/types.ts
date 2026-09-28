export type RoomId = 'main' | 'room1' | 'room2' | 'room3'

export type Treasure = {
  id: string
  room: RoomId
  title: string
  subtitle: string
  position: [number, number, number]
}
