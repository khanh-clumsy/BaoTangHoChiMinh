import { useEffect, useMemo, useState } from 'react'
import { ExhibitPanel } from './components/ExhibitPanel'
import { MapPanel } from './components/MapPanel'
import { MuseumScene } from './components/MuseumScene'
import { exhibits } from './data/exhibits'
import type { Exhibit, MoveCommand } from './types'

export default function App() {
  const [active, setActive] = useState<Exhibit | undefined>()
  const [visited, setVisited] = useState<Set<string>>(() => new Set())
  const [command, setCommand] = useState<MoveCommand | undefined>()
  const [started, setStarted] = useState(false)
  const [commandId, setCommandId] = useState(0)
  const [isLocked, setIsLocked] = useState(true)

  const progress = useMemo(() => `${visited.size}/${exhibits.length}`, [visited])

  const navigate = (payload: Omit<MoveCommand, 'id'>) => {
    const nextId = commandId + 1
    setCommandId(nextId)
    setActive(undefined)
    setCommand({ id: nextId, ...payload })
  }

  const handleArrive = (item: Exhibit) => {
    setActive(item)
    setVisited((current) => {
      const next = new Set(current)
      next.add(item.id)
      return next
    })
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(undefined)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <main className="app-shell">
      <MuseumScene
        command={command}
        activeId={active?.id}
        visited={visited}
        isLocked={isLocked}
        onArrive={handleArrive}
        onMoveAnywhere={() => setActive(undefined)}
      />

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">HCM</div>
          <div>
            <span className="eyebrow">Interactive Museum Prototype</span>
            <h1>Bảo tàng Hồ Chí Minh · 2.5D</h1>
          </div>
        </div>

        <div className="topbar-actions">
          <button
            className={`lock-toggle-btn ${isLocked ? 'is-locked' : 'is-unlocked'}`}
            onClick={() => setIsLocked(!isLocked)}
            title={isLocked ? 'Đang khóa góc nhìn cố định 2.5D. Bấm để mở xoay 3D tự do.' : 'Đang mở xoay 3D tự do. Bấm để khóa lại góc 2.5D.'}
          >
            <span className="lock-icon">{isLocked ? '🔒' : '🔓'}</span>
            <span className="lock-text">{isLocked ? 'Khóa góc nhìn 2.5D' : 'Mở xoay 3D tự do'}</span>
          </button>

          <div className="progress-box">
            <span>ĐÃ KHÁM PHÁ</span>
            <strong>{progress}</strong>
          </div>
        </div>
      </header>

      <MapPanel activeId={active?.id} visited={visited} onNavigate={navigate} />

      <div className="instruction-card">
        <strong>Điều khiển</strong>
        <span>🎯 Click xuống sàn để di chuyển (chống đi xuyên tường).</span>
        <span>📍 Click ◇ hoặc điểm trên sơ đồ để tới hiện vật.</span>
        <span>{isLocked ? '🔒 Góc nhìn đang cố định 2.5D.' : '🖱️ Chuột trái/phải để xoay & quan sát 3D.'}</span>
      </div>

      {active && (
        <ExhibitPanel
          exhibit={active}
          visited={visited.has(active.id)}
          onClose={() => setActive(undefined)}
        />
      )}

      {!started && (
        <section className="intro-overlay">
          <div className="intro-card">
            <span className="eyebrow">Prototype v0.1</span>
            <h2>Khám phá bảo tàng theo kiểu 2.5D</h2>
            <p>
              Bấm vào điểm trên bản đồ hoặc trực tiếp trên sàn. Nhân vật sẽ tự tìm đường qua các cửa,
              tránh tường và di chuyển tới hiện vật kèm hiệu ứng chỉ đường MOBA.
            </p>
            <button onClick={() => setStarted(true)}>Bắt đầu tham quan</button>
            <small>Đã tích hợp: Nút khóa/mở xoay góc nhìn, hiệu ứng click LoL và chống đi xuyên tường.</small>
          </div>
        </section>
      )}
    </main>
  )
}
