import type { Exhibit } from '../types'

type Props = {
  exhibit: Exhibit
  visited: boolean
  onClose: () => void
}

export function ExhibitPanel({ exhibit, visited, onClose }: Props) {
  return (
    <aside className="exhibit-panel" aria-live="polite">
      <button className="close-button" onClick={onClose} aria-label="Đóng">
        ×
      </button>
      <div className="eyebrow">Điểm {String(exhibit.index).padStart(2, '0')} · {exhibit.zone}</div>
      <h2>{exhibit.title}</h2>
      <div className="period-pill">{exhibit.period}</div>
      <p className="summary">{exhibit.summary}</p>
      <div className="divider" />
      <p>{exhibit.narration}</p>
      <div className="panel-footer">
        <span className={visited ? 'visited-badge is-visited' : 'visited-badge'}>
          {visited ? '✓ Đã khám phá' : 'Chưa khám phá'}
        </span>
        <span>ESC để đóng</span>
      </div>
    </aside>
  )
}
