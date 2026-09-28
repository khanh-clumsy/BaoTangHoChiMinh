import { useState } from 'react'
import type { Exhibit } from '../types'

type Props = {
  exhibit: Exhibit
  visited: boolean
  onClose: () => void
}

export function ExhibitPanel({ exhibit, visited, onClose }: Props) {
  const [expandedDoc, setExpandedDoc] = useState(false)

  const isDocument = exhibit.kind === 'document' || exhibit.kind === 'heritage'

  return (
    <>
      <aside className="exhibit-panel" aria-live="polite">
        <button className="close-button" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <div className="eyebrow">
          Điểm {String(exhibit.index).padStart(2, '0')} · {exhibit.zone}
        </div>
        <h2>{exhibit.title}</h2>
        <div className="period-pill">{exhibit.period}</div>
        <p className="summary">{exhibit.summary}</p>
        <div className="divider" />
        <p>{exhibit.narration}</p>

        {isDocument && (
          <button
            className="doc-read-btn"
            onClick={() => setExpandedDoc(true)}
            style={{
              marginTop: '12px',
              padding: '8px 14px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #c5a059',
              background: '#fdfbf7',
              color: '#792f2c',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>📜</span> Đọc Toàn Văn Bút Tích Lịch Sử
          </button>
        )}

        <div className="inspect-tip" style={{ marginTop: '14px', padding: '8px 10px', borderRadius: '8px', background: '#f5efe6', fontSize: '11px', color: '#68594b' }}>
          💡 <em>Kéo chuột để xoay 360° hoặc cuộn chuột để zoom cực gần quan sát hiện vật.</em>
        </div>

        <div className="panel-footer">
          <span className={visited ? 'visited-badge is-visited' : 'visited-badge'}>
            {visited ? '✓ Đã khám phá' : 'Chưa khám phá'}
          </span>
          <span>ESC hoặc click sàn để đóng</span>
        </div>
      </aside>

      {/* Fullscreen Document Reader Modal */}
      {expandedDoc && (
        <div
          className="doc-reader-overlay"
          onClick={() => setExpandedDoc(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 18, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
          }}
        >
          <div
            className="doc-reader-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(680px, 100%)',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#fcf8f0',
              border: '2px solid #c5a059',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
              color: '#2b231c',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8a735c', fontWeight: '700' }}>
                  Tư Liệu Bút Tích Lịch Sử
                </span>
                <h3 style={{ margin: '4px 0 0', fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#792f2c' }}>
                  {exhibit.title}
                </h3>
              </div>
              <button
                onClick={() => setExpandedDoc(false)}
                style={{
                  border: 0,
                  background: '#eee4d7',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '22px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '16px', background: '#fff', border: '1px solid #e2d7c8', borderRadius: '12px', margin: '16px 0', lineHeight: '1.8', fontSize: '14px' }}>
              <strong style={{ color: '#792f2c', display: 'block', marginBottom: '8px' }}>Nội dung tư liệu:</strong>
              <p style={{ margin: 0, whiteSpace: 'pre-line', fontStyle: 'italic', color: '#453a31' }}>
                {exhibit.narration}
              </p>
            </div>

            <p style={{ fontSize: '13px', color: '#68594b', lineHeight: '1.6' }}>
              Bản thảo và tư liệu bút tích được số hóa 3D nguyên bản từ kho lưu trữ của Bảo tàng Hồ Chí Minh.
            </p>

            <button
              onClick={() => setExpandedDoc(false)}
              style={{
                marginTop: '16px',
                padding: '10px 22px',
                border: 0,
                borderRadius: '10px',
                background: '#792f2c',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer',
                float: 'right',
              }}
            >
              Đóng cửa sổ đọc
            </button>
          </div>
        </div>
      )}
    </>
  )
}
