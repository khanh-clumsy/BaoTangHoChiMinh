import { useMuseumStore } from '../store/useMuseumStore'

export function ExhibitModal() {
  const modal = useMuseumStore((s) => s.exhibitModal)
  const close = useMuseumStore((s) => s.closeExhibit)
  if (!modal) return null

  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <article className="exhibit-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="eyebrow">ĐIỂM TƯƠNG TÁC</div>
        <h2>{modal.title}</h2>
        <div className="media-placeholder">Ảnh / video / hiện vật 3D</div>
        <p>{modal.subtitle}</p>
        <p className="muted">
          Sau này thay phần này bằng nội dung thật: mô tả hiện vật, ảnh tư liệu, audio thuyết minh,
          câu hỏi HCM202 hoặc nút mở mini game.
        </p>
        <button className="primary-button" onClick={close}>Tiếp tục tham quan</button>
      </article>
    </div>
  )
}
