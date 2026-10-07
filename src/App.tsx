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
  const isLocked = true
  const [viewMode, setViewMode] = useState<'overview' | 'firstPerson'>('overview')
  const [isLoaded, setIsLoaded] = useState(false)

  const progress = useMemo(() => `${visited.size}/${exhibits.length}`, [visited])

  const navigate = (payload: Omit<MoveCommand, 'id'>) => {
    const nextId = commandId + 1
    setCommandId(nextId)
    setActive(undefined)
    setViewMode('overview')
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
        viewMode={viewMode}
        started={started}
        onArrive={handleArrive}
        onMoveAnywhere={() => setActive(undefined)}
        onRequestOverview={() => setViewMode('overview')}
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
                className={`lock-toggle-btn ${viewMode === 'firstPerson' ? 'is-unlocked' : 'is-locked'}`}
                onClick={() => setViewMode((current) => current === 'firstPerson' ? 'overview' : 'firstPerson')}
                title={viewMode === 'firstPerson' ? 'Quay lại góc nhìn toàn cảnh' : 'Chuyển sang góc nhìn thứ nhất'}
              >
                <span className="lock-icon">{viewMode === 'firstPerson' ? '🏛️' : '👁️'}</span>
                <span className="lock-text">{viewMode === 'firstPerson' ? 'Góc nhìn toàn cảnh' : 'Góc nhìn thứ nhất'}</span>
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
            <span>{viewMode === 'firstPerson' ? '⌨️ WASD để đi bộ · Nhấp vào khung cảnh để khóa chuột và xoay nhìn.' : '🖱️ Click xuống sàn để di chuyển · Map cố định; chỉ kéo để xoay khi inspect.'}</span>
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
          </div>
        </section>
      )}

      {!isLoaded && <LoadingScreen onFinished={() => setIsLoaded(true)} />}
    </main>
  )
}
