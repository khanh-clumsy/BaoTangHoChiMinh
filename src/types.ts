export type ExhibitKind =
  | 'statue'
  | 'bust'
  | 'heritage'
  | 'document'
  | 'sandals'
  | 'clothing'
  | 'silk'
  | 'memorial'
  | 'emblem'

export type Exhibit = {
  id: string
  index: number
  title: string
  period: string
  zone: string
  summary: string
  narration: string
  kind: ExhibitKind
  modelPath?: string
  texturePath?: string
  scale?: number
  targetHeight?: number
  rotation?: [number, number, number]
  rotationY?: number
  modelOffsetY?: number
  position: [number, number, number]
  approach: [number, number]
  map: [number, number]
}

export type MoveCommand = {
  id: number
  destination: [number, number]
  exhibitId?: string
}
