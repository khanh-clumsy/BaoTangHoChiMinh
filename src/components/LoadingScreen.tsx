import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { active, progress } = useProgress()
  if (!active) return null

  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="eyebrow">HCM MUSEUM 3D</div>
        <div className="loading-title">Đang nạp không gian 3D...</div>
        <div className="loading-track"><div className="loading-fill" style={{ width: `${progress}%` }} /></div>
        <div className="loading-value">{Math.round(progress)}%</div>
      </div>
    </div>
  )
}
