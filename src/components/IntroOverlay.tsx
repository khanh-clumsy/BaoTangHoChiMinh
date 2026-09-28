import { useMuseumStore } from '../store/useMuseumStore'

export function IntroOverlay() {
  const entered = useMuseumStore((s) => s.entered)
  const setEntered = useMuseumStore((s) => s.setEntered)
  if (entered) return null

  return (
    <div className="intro-overlay">
      <div className="intro-panel">
        <div className="eyebrow">TRẢI NGHIỆM 3D TƯƠNG TÁC</div>
        <h1>Bảo tàng Hồ Chí Minh 3D</h1>
        <p>
          Starter project theo mô-típ tour bảo tàng 3D: khám phá các phòng, tìm hotspot,
          bật/tắt ngày đêm và chạy guided tour. Geometry hiện tại là graybox để thay bằng
          mô hình Bảo tàng Hồ Chí Minh thật sau khi nhóm hoàn thiện Blender/GLB.
        </p>
        <div className="intro-controls">
          <span>WASD di chuyển</span>
          <span>Chuột quan sát</span>
          <span>E tương tác</span>
          <span>ESC mở chuột</span>
        </div>
        <button className="primary-button" onClick={() => setEntered(true)}>Bắt đầu khám phá</button>
      </div>
    </div>
  )
}
