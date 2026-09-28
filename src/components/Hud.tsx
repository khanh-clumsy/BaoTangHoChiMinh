import { ROOM_LABELS } from '../data/rooms'
import { TREASURES } from '../data/treasures'
import { useMuseumStore } from '../store/useMuseumStore'
import type { RoomId } from '../types'

const rooms: RoomId[] = ['main', 'room1', 'room2', 'room3']

export function Hud() {
  const entered = useMuseumStore((s) => s.entered)
  const currentRoom = useMuseumStore((s) => s.currentRoom)
  const setRoom = useMuseumStore((s) => s.setRoom)
  const dayMode = useMuseumStore((s) => s.dayMode)
  const toggleDayMode = useMuseumStore((s) => s.toggleDayMode)
  const soundOn = useMuseumStore((s) => s.soundOn)
  const toggleSound = useMuseumStore((s) => s.toggleSound)
  const tourActive = useMuseumStore((s) => s.tourActive)
  const setTourActive = useMuseumStore((s) => s.setTourActive)
  const collected = useMuseumStore((s) => s.collected)

  if (!entered) return null

  return (
    <div className="hud">
      <header className="hud-top">
        <div className="museum-copy">
          <div className="eyebrow">BẢO TÀNG HỒ CHÍ MINH 3D</div>
          <strong>{ROOM_LABELS[currentRoom]}</strong>
          <span>Khám phá không gian và tìm đủ {TREASURES.length} điểm tương tác.</span>
        </div>
        <div className="progress-pill">
          <strong>{String(collected.length).padStart(2, '0')}</strong>
          <span>/ {String(TREASURES.length).padStart(2, '0')}+</span>
        </div>
      </header>

      <nav className="room-tabs" aria-label="Điều hướng phòng">
        {rooms.map((room) => (
          <button
            key={room}
            className={currentRoom === room ? 'active' : ''}
            onClick={() => setRoom(room)}
          >
            {ROOM_LABELS[room]}
          </button>
        ))}
      </nav>

      <div className="hud-actions">
        <button className={tourActive ? 'active' : ''} onClick={() => setTourActive(!tourActive)}>
          {tourActive ? 'Dừng Tour' : 'Bắt đầu Tour'}
        </button>
        <button onClick={toggleDayMode}>{dayMode ? 'Ngày' : 'Đêm'}</button>
        <button onClick={toggleSound}>Âm thanh {soundOn ? 'BẬT' : 'TẮT'}</button>
      </div>

      <div className="crosshair" aria-hidden="true">+</div>
      <div className="desktop-help">Click vào khung 3D để khóa chuột · ESC để thoát</div>
    </div>
  )
}
