import { useEffect, useMemo, useState } from 'react'
import { ExhibitPanel } from './components/ExhibitPanel'
import { LoadingScreen } from './components/LoadingScreen'
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
  const [isLoaded, setIsLoaded] = useState(false)

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
        started={started}
        onArrive={handleArrive}
        onMoveAnywhere={() => setActive(undefined)}
      />

      {started && (
        <>
          <header className="topbar">
            <div className="brand-block">
              <div className="brand-mark">HCM</div>
              <div>
                <span className="eyebrow">Không gian trưng bày số hóa 3D</span>
                <h1>Bảo tàng Hồ Chí Minh</h1>
              </div>
            </div>

            <div className="topbar-actions">
              <button
                className={`lock-toggle-btn ${isLocked ? 'is-locked' : 'is-unlocked'}`}
                onClick={() => setIsLocked(!isLocked)}
                title={isLocked ? 'Góc nhìn cố định 2.5D. Bấm để chuyển sang xoay 3D tự do.' : 'Góc nhìn 3D tự do. Bấm để cố định góc nhìn 2.5D.'}
              >
                <span className="lock-icon">{isLocked ? '🔒' : '🔓'}</span>
                <span className="lock-text">{isLocked ? 'Khóa góc nhìn 2.5D' : 'Mở xoay 3D tự do'}</span>
              </button>

              <div className="progress-box">
                <span>TIẾN ĐỘ THAM QUAN</span>
                <strong>{progress}</strong>
              </div>
            </div>
          </header>

          <MapPanel activeId={active?.id} visited={visited} onNavigate={navigate} />

          <div className="instruction-card">
            <strong>Hướng dẫn điều hướng</strong>
            <span>🧭 Nhấp chuột xuống sàn để di chuyển nhân vật.</span>
            <span>🏛️ Chọn hiện vật hoặc điểm trên sơ đồ để tới vị trí trưng bày.</span>
            <span>{isLocked ? '🔒 Góc nhìn 2.5D đang được cố định.' : '🖱️ Giữ và rê chuột để xoay quan sát không gian 3D.'}</span>
          </div>
        </>
      )}

      {active && (
        <>
          <button
            className="exit-inspect-btn"
            onClick={() => setActive(undefined)}
            title="Bấm hoặc nhấn phím ESC để quay lại không gian bảo tàng"
          >
            <span className="exit-icon">✕</span>
            <span>Quay lại không gian (ESC)</span>
          </button>
          <ExhibitPanel
            exhibit={active}
            visited={visited.has(active.id)}
            onClose={() => setActive(undefined)}
          />
        </>
      )}

      {!started && isLoaded && (
        <section className="intro-overlay">
          <div className="intro-card">
            <span className="eyebrow">KHÔNG GIAN TRƯNG BÀY SỐ</span>
            <h2>BẢO TÀNG HỒ CHÍ MINH</h2>
            <p>
              Chào mừng quý khách đến với không gian trải nghiệm bảo tàng tương tác 3D.
              Cùng bước vào hành trình tìm hiểu cuộc đời, sự nghiệp và những kỷ vật vô giá của Chủ tịch Hồ Chí Minh.
            </p>
            <button onClick={() => setStarted(true)}>
              🏛️ Bắt đầu tham quan
            </button>
            <small>✨ Trải nghiệm: Không gian tương tác 3D chân thực · Bản đồ định tuyến thông minh · Thuyết minh hiện vật chi tiết</small>
          </div>
        </section>
      )}

      {!isLoaded && <LoadingScreen onFinished={() => setIsLoaded(true)} />}
    </main>
  )
}
