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

export type DiscoveryStep = {
  id: string
  title: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
}

export type Exhibit = {
  id: string
  index: number
  title: string
  period: string
  zone: string
  summary: string
  narration: string
  documentContent?: string
  historicalContext: string
  keyIdea: string
  reflectionQuestion: string
  reflectionAnswer: string
  audioText: string
  discoverySteps?: DiscoveryStep[]
  kind: ExhibitKind
  modelPath?: string
  texturePath?: string
  scale?: number
  targetHeight?: number
  rotation?: [number, number, number]
  rotationY?: number
  wrapperRotationY?: number
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
