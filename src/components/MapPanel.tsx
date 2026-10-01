import { exhibits } from '../data/exhibits'
import type { MoveCommand } from '../types'

type Props = {
  activeId?: string
  visited: Set<string>
  onNavigate: (command: Omit<MoveCommand, 'id'>) => void
}

export function MapPanel({ activeId, visited, onNavigate }: Props) {
  return (
    <div className="map-panel">
      <div className="map-heading">
        <div>
          <span className="eyebrow">Sơ đồ bảo tàng</span>
          <strong>Khu vực trưng bày</strong>
        </div>
        <span className="map-hint">Chọn điểm đến</span>
      </div>
      <div className="mini-map">
        <div className="mini-map-axis axis-a" />
        <div className="mini-map-axis axis-b" />
        <div className="mini-map-core">SẢNH</div>
        {exhibits.map((item) => (
          <button
            key={item.id}
            className={`map-pin ${activeId === item.id ? 'is-active' : ''} ${visited.has(item.id) ? 'is-visited' : ''}`}
            style={{ left: `${item.map[0]}%`, top: `${item.map[1]}%` }}
            title={item.title}
            onClick={() => onNavigate({ destination: item.approach, exhibitId: item.id })}
          >
            {visited.has(item.id) ? '✓' : item.index}
          </button>
        ))}
      </div>
    </div>
  )
}
