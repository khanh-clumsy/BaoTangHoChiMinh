import { create } from 'zustand'
import type { RoomId } from '../types'

export type ExhibitModal = {
  id: string
  title: string
  subtitle: string
} | null

type MuseumState = {
  entered: boolean
  currentRoom: RoomId
  dayMode: boolean
  soundOn: boolean
  tourActive: boolean
  collected: string[]
  exhibitModal: ExhibitModal
  setEntered: (value: boolean) => void
  setRoom: (room: RoomId) => void
  toggleDayMode: () => void
  toggleSound: () => void
  setTourActive: (value: boolean) => void
  collect: (id: string) => void
  openExhibit: (modal: Exclude<ExhibitModal, null>) => void
  closeExhibit: () => void
  resetProgress: () => void
}

export const useMuseumStore = create<MuseumState>((set) => ({
  entered: false,
  currentRoom: 'main',
  dayMode: true,
  soundOn: true,
  tourActive: false,
  collected: [],
  exhibitModal: null,
  setEntered: (entered) => set({ entered }),
  setRoom: (currentRoom) => set({ currentRoom, tourActive: false }),
  toggleDayMode: () => set((state) => ({ dayMode: !state.dayMode })),
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
  setTourActive: (tourActive) => set({ tourActive }),
  collect: (id) => set((state) => ({
    collected: state.collected.includes(id) ? state.collected : [...state.collected, id],
  })),
  openExhibit: (exhibitModal) => set({ exhibitModal }),
  closeExhibit: () => set({ exhibitModal: null }),
  resetProgress: () => set({ collected: [] }),
}))
