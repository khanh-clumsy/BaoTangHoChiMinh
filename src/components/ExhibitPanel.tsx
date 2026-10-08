import { useState } from 'react'
import type { Exhibit } from '../types'
import { thoughtReviewQuestions } from '../data/thoughtReview'
import { useSpeechNarration } from '../hooks/useSpeechNarration'

type Props = {
  exhibit: Exhibit
  visited: boolean
  onClose: () => void
}

export function ExhibitPanel({ exhibit, visited, onClose }: Props) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [selectedReviewAnswers, setSelectedReviewAnswers] = useState<Record<string, number>>({})
  const narration = useSpeechNarration(exhibit.audioText)

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

        {exhibit.documentContent && (
          <section className="story-block document-content-block">
            <span className="section-kicker">NỘI DUNG TƯ LIỆU</span>
            <p>{exhibit.documentContent}</p>
          </section>
        )}

        <section className="narration-box" aria-label="Thuyết minh bằng âm thanh">
          <div>
            <span className="section-kicker">THUYẾT MINH ÂM THANH</span>
            <strong>Nghe câu chuyện của hiện vật</strong>
          </div>
          {narration.isSupported ? (
            <div className="narration-actions">
              <button className="narration-button" onClick={narration.toggle}>
                {narration.isSpeaking ? '⏹ Dừng đọc' : '▶ Nghe thuyết minh'}
              </button>
              {narration.isSpeaking && <button className="narration-stop" onClick={narration.stop}>Dừng</button>}
            </div>
          ) : (
            <span className="speech-unavailable">Thiết bị chưa hỗ trợ đọc tiếng Việt tự động.</span>
          )}
        </section>

        <section className="story-block">
          <span className="section-kicker">BỐI CẢNH LỊCH SỬ</span>
          <p>{exhibit.historicalContext}</p>
        </section>

        <section className="story-block idea-block">
          <span className="section-kicker">MẠCH HÀNH TRÌNH & TƯ TƯỞNG</span>
          <p>{exhibit.keyIdea}</p>
        </section>

        <section className="reflection-card">
          <span className="section-kicker">CÂU HỎI KHÁM PHÁ</span>
          <strong>{exhibit.reflectionQuestion}</strong>
          <button className="answer-button" onClick={() => setShowAnswer((current) => !current)}>
            {showAnswer ? 'Ẩn gợi ý trả lời' : 'Mở gợi ý trả lời'}
          </button>
          {showAnswer && <p>{exhibit.reflectionAnswer}</p>}
        </section>

        {exhibit.discoverySteps && exhibit.discoverySteps.length > 0 && (
          <section className="discovery-card" aria-label="Các bước khám phá">
            <span className="section-kicker">KHÁM PHÁ TƯ LIỆU</span>
            <strong className="discovery-heading">Tự kiểm tra trước khi xem đáp án</strong>
            {exhibit.discoverySteps.map((step) => {
              const selected = selectedAnswers[step.id]
              const hasAnswered = selected !== undefined
              return (
                <div className="discovery-step" key={step.id}>
                  <span className="step-title">{step.title}</span>
                  <strong>{step.prompt}</strong>
                  <div className="discovery-options">
                    {step.options.map((option, index) => (
                      <button
                        className={`discovery-option ${hasAnswered && index === step.answer ? 'is-correct' : ''} ${hasAnswered && index === selected && index !== step.answer ? 'is-wrong' : ''}`}
                        key={option}
                        onClick={() => setSelectedAnswers((current) => ({ ...current, [step.id]: index }))}
                      >
                        <span>{String.fromCharCode(65 + index)}</span>{option}
                      </button>
                    ))}
                  </div>
                  {hasAnswered && <p className={selected === step.answer ? 'answer-feedback is-correct-text' : 'answer-feedback is-wrong-text'}>{selected === step.answer ? '✓ ' : 'Chưa đúng. '}{step.explanation}</p>}
                </div>
              )
            })}
          </section>
        )}

        <section className="discovery-card thought-review-card" aria-label="Ôn tập tư tưởng Hồ Chí Minh">
          <span className="section-kicker">ÔN TẬP TƯ TƯỞNG HỒ CHÍ MINH</span>
          <strong className="discovery-heading">Kiểm tra nhanh sau khi tham quan</strong>
          {thoughtReviewQuestions.map((step) => {
            const selected = selectedReviewAnswers[step.id]
            const hasAnswered = selected !== undefined
            return (
              <div className="discovery-step" key={step.id}>
                <span className="step-title">{step.title}</span>
                <strong>{step.prompt}</strong>
                <div className="discovery-options">
                  {step.options.map((option, index) => (
                    <button
                      className={`discovery-option ${hasAnswered && index === step.answer ? 'is-correct' : ''} ${hasAnswered && index === selected && index !== step.answer ? 'is-wrong' : ''}`}
                      key={option}
                      onClick={() => setSelectedReviewAnswers((current) => ({ ...current, [step.id]: index }))}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>{option}
                    </button>
                  ))}
                </div>
                {hasAnswered && <p className={selected === step.answer ? 'answer-feedback is-correct-text' : 'answer-feedback is-wrong-text'}>{selected === step.answer ? '✓ ' : 'Chưa đúng. '}{step.explanation}</p>}
              </div>
            )
          })}
        </section>

        <div className="inspect-tip">
          💡 <em>Kéo chuột trái hoặc phải để xoay 360° · Cuộn chuột để phóng to / thu nhỏ.</em>
        </div>

        <div className="panel-footer">
          <span className={visited ? 'visited-badge is-visited' : 'visited-badge'}>
            {visited ? '✓ Đã khám phá' : 'Chưa khám phá'}
          </span>
          <span>Nhấn ESC hoặc nhấp ra ngoài để quay lại</span>
        </div>
      </aside>

    </>
  )
}
