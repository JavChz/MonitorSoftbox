import { useState, useEffect, useCallback, useRef } from 'react'
import type { SoftboxSettings, LightingPreset } from './types/softbox'
import { Header } from './components/Header'
import { SettingsPanel } from './components/SettingsPanel'
import { SoftboxRenderer } from './components/SoftboxRenderer'
import { ShortcutsModal } from './components/ShortcutsModal'

const STORAGE_KEY = 'monitor_softbox_settings_v2'

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
  const [isPinned, setIsPinned] = useState(false)
  const [isHudVisible, setIsHudVisible] = useState(true)
  const hideTimerRef = useRef<number | null>(null)
  const wakeLockSentinelRef = useRef<any>(null)

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
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
          setIsFullscreen(true)
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
          setIsFullscreen(false)
        }
      }
    } catch (e) {
      console.warn('Native fullscreen request error:', e)
      setIsFullscreen((prev) => !prev)
    }
  }, [])

  // Listen for browser fullscreen change (e.g. user pressed Esc on browser)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Request screen wake lock
  useEffect(() => {
    let active = true
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const sentinel = await (navigator as any).wakeLock.request('screen')
          if (active) {
            wakeLockSentinelRef.current = sentinel
            sentinel.addEventListener('release', () => {
              // released
            })
          }
        }
      } catch (err) {
        console.warn('WakeLock not supported or denied:', err)
      }
    }

    requestWakeLock()

    return () => {
      active = false
      if (wakeLockSentinelRef.current) {
        try {
          wakeLockSentinelRef.current.release()
        } catch (_) {}
      }
    }
  }, [])

  // Activity & Auto-hide timer for HUD
  const triggerActivity = useCallback(() => {
    setIsHudVisible(true)
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current)
    }
    if (!isPinned) {
      hideTimerRef.current = window.setTimeout(() => {
        setIsHudVisible(false)
      }, 3000)
    }
  }, [isPinned])

  useEffect(() => {
    triggerActivity()
    const handleMouseMove = () => triggerActivity()
    const handleTouch = () => triggerActivity()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchstart', handleTouch)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouch)
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current)
      }
    }
  }, [triggerActivity])

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return

      triggerActivity()

      if (e.code === 'KeyF') {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.code === 'Space') {
        e.preventDefault()
        setIsBlackout((prev) => !prev)
      } else if (e.code === 'KeyH') {
        e.preventDefault()
        setIsPinned((prev) => !prev)
      } else if (e.code === 'ArrowUp') {
        e.preventDefault()
        setSettings((prev) => ({
          ...prev,
          brightness: Math.min(100, prev.brightness + 5),
        }))
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        setSettings((prev) => ({
          ...prev,
          brightness: Math.max(1, prev.brightness - 5),
        }))
      } else if (e.code === 'ArrowRight' && settings.mode === 'cct') {
        e.preventDefault()
        setSettings((prev) => ({
          ...prev,
          kelvin: Math.min(10000, prev.kelvin + 100),
        }))
      } else if (e.code === 'ArrowLeft' && settings.mode === 'cct') {
        e.preventDefault()
        setSettings((prev) => ({
          ...prev,
          kelvin: Math.max(1800, prev.kelvin - 100),
        }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleFullscreen, triggerActivity, settings.mode])

  return (
    <div
      className={`fixed inset-0 w-screen h-screen overflow-hidden bg-black select-none ${
        isHudVisible || isPinned ? 'cursor-default' : 'cursor-none'
      }`}
      onMouseMove={triggerActivity}
    >
      {/* 1. FULL VIEWPORT DIRECT SOFTBOX CANVAS */}
      <SoftboxRenderer
        settings={settings}
        isBlackout={isBlackout}
        isPreview={false}
        className="w-full h-full absolute inset-0 z-0"
      />

      {/* 2. FLOATING TOP STATUS & ACTION BAR */}
      <div
        className={`transition-all duration-300 pointer-events-none ${
          isHudVisible || isPinned ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <Header
          settings={settings}
          isBlackout={isBlackout}
          isFullscreen={isFullscreen}
          isPinned={isPinned}
          onToggleBlackout={() => setIsBlackout((prev) => !prev)}
          onToggleFullscreen={toggleFullscreen}
          onTogglePinned={() => setIsPinned((prev) => !prev)}
          onReset={resetSettings}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      </div>

      {/* 3. FLOATING PRO HARDWARE CONTROL CENTER DOCK */}
      <div
        className={`fixed inset-x-0 bottom-4 sm:bottom-6 z-40 px-4 flex justify-center transition-all duration-300 pointer-events-none ${
          isHudVisible || isPinned ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="w-full max-w-4xl pointer-events-auto">
          <SettingsPanel
            settings={settings}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onChange={updateSettings}
            onApplyPreset={applyPreset}
          />
        </div>
      </div>

      {/* 4. SHORTCUTS & USER GUIDE MODAL */}
      <ShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  )
}

export default App
