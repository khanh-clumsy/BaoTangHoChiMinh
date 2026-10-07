import { useCallback, useEffect, useState } from 'react'

type SpeechState = {
  isSupported: boolean
  isSpeaking: boolean
  toggle: () => void
  stop: () => void
}

export function useSpeechNarration(text: string): SpeechState {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [isSpeaking, setIsSpeaking] = useState(false)

  const findVietnameseVoice = useCallback(() => {
    if (!isSupported) return undefined

    const voices = window.speechSynthesis.getVoices()
    const vietnameseVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('vi'))

    return vietnameseVoices.sort((a, b) => {
      const score = (voice: SpeechSynthesisVoice) => {
        const name = voice.name.toLowerCase()
        let value = voice.localService ? 2 : 0
        if (name.includes('hoaimy') || name.includes('hoài my')) value += 4
        if (name.includes('namminh') || name.includes('nam minh')) value += 4
        if (name.includes('google') || name.includes('microsoft')) value += 1
        return value
      }
      return score(b) - score(a)
    })[0]
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  const toggle = useCallback(() => {
    if (!isSupported) return

    if (isSpeaking) {
      stop()
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'
    utterance.voice = findVietnameseVoice() ?? null
    utterance.rate = 0.88
    utterance.pitch = 0.98
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [findVietnameseVoice, isSpeaking, isSupported, stop, text])

  useEffect(() => {
    if (!isSupported) return
    const refreshVoices = () => findVietnameseVoice()
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices)
      stop()
    }
  }, [findVietnameseVoice, isSupported, stop])

  return { isSupported, isSpeaking, toggle, stop }
}
