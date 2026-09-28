import { ExhibitModal } from './components/ExhibitModal'
import { Hud } from './components/Hud'
import { IntroOverlay } from './components/IntroOverlay'
import { LoadingScreen } from './components/LoadingScreen'
import { Experience } from './three/Experience'

export default function App() {
  return (
    <main className="app-shell">
      <Experience />
      <Hud />
      <IntroOverlay />
      <ExhibitModal />
      <LoadingScreen />
    </main>
  )
}
