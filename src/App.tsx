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
        <div className="progress-box">
          <span>ĐÃ KHÁM PHÁ</span>
          <strong>{progress}</strong>
        </div>
      </header>

      <MapPanel activeId={active?.id} visited={visited} onNavigate={navigate} />

      <div className="instruction-card">
        <strong>Điều khiển</strong>
        <span>Click xuống sàn để di chuyển.</span>
        <span>Click ◇ hoặc điểm trên sơ đồ để tới hiện vật.</span>
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
              Bấm vào điểm trên bản đồ hoặc trực tiếp trên sàn. Nhân vật sẽ tự đi tới hiện vật,
              sau đó mở phần thuyết minh.
            </p>
            <button onClick={() => setStarted(true)}>Bắt đầu tham quan</button>
            <small>Kiến trúc trong bản này là graybox minh họa, chưa phải bản dựng chính xác mặt bằng thực tế.</small>
          </div>
        </section>
      )}
    </main>
  )
}
