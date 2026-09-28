export type ExhibitKind = 'statue' | 'heritage' | 'document' | 'sandals' | 'clothing' | 'memorial'

export type Exhibit = {
  id: string
  index: number
  title: string
  period: string
  zone: string
  summary: string
  narration: string
  kind: ExhibitKind
  position: [number, number, number]
  approach: [number, number]
  map: [number, number]
}

export type MoveCommand = {
  id: number
  destination: [number, number]
  exhibitId?: string
}
