import { useState, useEffect, useCallback } from 'react'
import type { SoftboxSettings, LightingPreset } from './types/softbox'
import { Header } from './components/Header'
import { PreviewBox } from './components/PreviewBox'
import { SettingsPanel } from './components/SettingsPanel'
import { PresetSelector } from './components/PresetSelector'
import { FullscreenView } from './components/FullscreenView'
import { ShortcutsModal } from './components/ShortcutsModal'
import { Film } from 'lucide-react'

const STORAGE_KEY = 'monitor_softbox_settings_v1'

const DEFAULT_SETTINGS: SoftboxSettings = {
  mode: 'cct',
  brightness: 100,
  kelvin: 5600,
  tint: 0,
  hue: 200,
  saturation: 80,
  shape: 'fullscreen',
  boxWidth: 70,
  boxHeight: 70,
  circleDiameter: 75,
  feather: 30,
  ringInner: 40,
  splitRatio: 50,
  bicolorLeft: {
    kelvin: 3200,
    brightness: 90,
  },
  bicolorRight: {
    kelvin: 5600,
    brightness: 40,
  },
}

function loadInitialSettings(): SoftboxSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to parse saved settings', e)
  }
  return DEFAULT_SETTINGS
}

export function App() {
  const [settings, setSettings] = useState<SoftboxSettings>(loadInitialSettings)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isBlackout, setIsBlackout] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (_) {}
  }, [settings])

  const updateSettings = useCallback((updates: Partial<SoftboxSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [])

  const applyPreset = useCallback((preset: LightingPreset) => {
    setSettings((prev) => ({
      ...prev,
      ...preset.settings,
    }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setIsBlackout(false)
  }, [])

  // Fullscreen trigger
  const activateFullscreen = useCallback(async () => {
    setIsFullscreen(true)
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      }
    } catch (e) {
      console.warn('Native fullscreen request declined, using windowed fallback', e)
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    setIsFullscreen(false)
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen()
      }
    } catch (e) {
      console.warn('Error exiting native fullscreen', e)
    }
  }, [])

  // Listen for browser fullscreen change (e.g. user pressed Esc on browser)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Keyboard shortcut for launching fullscreen from main view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) return
      if (e.code === 'KeyF' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        activateFullscreen()
      }
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        setIsBlackout((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen, activateFullscreen])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* FULLSCREEN SOFTBOX VIEW */}
      {isFullscreen && (
        <FullscreenView
          settings={settings}
          isBlackout={isBlackout}
          onToggleBlackout={() => setIsBlackout((prev) => !prev)}
          onExitFullscreen={exitFullscreen}
          onUpdateSettings={updateSettings}
        />
      )}

      {/* HEADER & DASHBOARD */}
      <Header
        onActivateFullscreen={activateFullscreen}
        onReset={resetSettings}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Top Grid: Live Monitor Preview & Presets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Live Preview & Presets (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-20">
            <PreviewBox
              settings={settings}
              isBlackout={isBlackout}
              onToggleBlackout={() => setIsBlackout((prev) => !prev)}
              onActivateFullscreen={activateFullscreen}
            />

            <PresetSelector
              onSelectPreset={applyPreset}
            />
          </div>

          {/* Right Column: Settings & Geometry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <SettingsPanel
              settings={settings}
              onChange={updateSettings}
            />
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/80 px-6 py-4 text-center text-xs font-mono text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Film className="w-3.5 h-3.5 text-neutral-400" />
          <span>MonitorSoftbox — Pro Cinema Lighting Instrument</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-neutral-900 text-neutral-300">F</kbd> for Fullscreen</span>
          <span>Press <kbd className="px-1 py-0.5 rounded bg-neutral-900 text-neutral-300">Space</kbd> for Blackout</span>
        </div>
      </footer>

      {/* Guide & Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  )
}

export default App
