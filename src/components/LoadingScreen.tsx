import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onFinished?: () => void
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const { active, progress, loaded, total } = useProgress()
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isDone, setIsDone] = useState(false)

  // Smooth progress bar animation
  useEffect(() => {
    const targetProgress = Math.max(progress, loaded && total ? (loaded / total) * 100 : 0)
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress)
        }
        return prev
      })
    }, 16)

    return () => clearInterval(interval)
  }, [progress, loaded, total])

  // Handle completion when all items finish loading
  useEffect(() => {
    if ((!active && loaded > 0 && displayProgress >= 99) || displayProgress >= 100) {
      const timer = setTimeout(() => {
        setIsFadingOut(true)
        const finishTimer = setTimeout(() => {
          setIsDone(true)
          onFinished?.()
        }, 600)
        return () => clearTimeout(finishTimer)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [active, loaded, displayProgress, onFinished])

  // Fallback timer: ensure the loading screen doesn't get stuck indefinitely if no assets remain
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isDone) {
        setDisplayProgress(100)
        setIsFadingOut(true)
        setTimeout(() => {
          setIsDone(true)
          onFinished?.()
        }, 600)
      }
    }, 8000)

    return () => clearTimeout(fallbackTimer)
  }, [isDone, onFinished])

  if (isDone) return null

  const getStatusText = () => {
    if (displayProgress >= 100) return 'Không gian trưng bày đã sẵn sàng!'
    if (displayProgress >= 75) return 'Đang khởi tạo ánh sáng & không gian...'
    if (displayProgress >= 35) return 'Đang nạp dữ liệu hiện vật 3D...'
    return 'Đang kết nối không gian số hóa bảo tàng...'
  }

  const roundedProgress = Math.min(100, Math.round(displayProgress))

  return (
    <div className={`loading-overlay ${isFadingOut ? 'loading-fade-out' : ''}`}>
      <div className="loading-bg-glow" />

      <div className="loading-content">
        {/* Emblem & Glow */}
        <div className="loading-emblem-wrap">
          <div className="loading-pulse-ring" />
          <div className="loading-emblem">
            <span className="loading-star">★</span>
          </div>
        </div>

        {/* Titles */}
        <span className="loading-eyebrow">KHÔNG GIAN TRƯNG BÀY SỐ HÓA 3D</span>
        <h1 className="loading-title">BẢO TÀNG HỒ CHÍ MINH</h1>
        <p className="loading-subtitle">Hành trình khám phá di sản & cuộc đời Chủ tịch Hồ Chí Minh</p>

        {/* Progress Container */}
        <div className="loading-bar-wrapper">
          <div className="loading-bar-track">
            <div
              className="loading-bar-fill"
              style={{ width: `${roundedProgress}%` }}
            >
              <div className="loading-bar-glow" />
            </div>
          </div>
          <div className="loading-meta">
            <span className="loading-status">{getStatusText()}</span>
            <span className="loading-percent">{roundedProgress}%</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="loading-footer">
        </div>
      </div>
    </div>
  )
}
