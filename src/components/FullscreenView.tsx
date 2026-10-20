import React, { useEffect, useState, useRef, useCallback } from 'react'
import type { SoftboxSettings } from '../types/softbox'
import { SoftboxRenderer } from './SoftboxRenderer'
import {
  Minimize2,
  Moon,
  Sun,
  Lock,
  Unlock,
  Thermometer,
  Zap,
} from 'lucide-react'

interface FullscreenViewProps {
  settings: SoftboxSettings
  isBlackout: boolean
  onToggleBlackout: () => void
  onExitFullscreen: () => void
  onUpdateSettings: (updates: Partial<SoftboxSettings>) => void
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({
  settings,
  isBlackout,
  onToggleBlackout,
  onExitFullscreen,
  onUpdateSettings,
}) => {
  const [hudVisible, setHudVisible] = useState(true)
  const [hudPinned, setHudPinned] = useState(false)
  const [wakeLockActive, setWakeLockActive] = useState(false)
  const hideTimerRef = useRef<number | null>(null)
  const wakeLockSentinelRef = useRef<any>(null)

  // Request screen wake lock
  useEffect(() => {
    let active = true
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const sentinel = await (navigator as any).wakeLock.request('screen')
          if (active) {
            wakeLockSentinelRef.current = sentinel
            setWakeLockActive(true)
            sentinel.addEventListener('release', () => {
              if (active) setWakeLockActive(false)
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

  // Inactivity auto-hide HUD
  const triggerActivity = useCallback(() => {
    setHudVisible(true)
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current)
    }
    if (!hudPinned) {
      hideTimerRef.current = window.setTimeout(() => {
        setHudVisible(false)
      }, 2500)
    }
  }, [hudPinned])

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      triggerActivity()

      if (e.code === 'Space') {
        e.preventDefault()
        onToggleBlackout()
      } else if (e.code === 'KeyF' || e.key === 'Escape') {
        e.preventDefault()
        onExitFullscreen()
      } else if (e.code === 'ArrowUp') {
        e.preventDefault()
        onUpdateSettings({ brightness: Math.min(100, settings.brightness + 5) })
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        onUpdateSettings({ brightness: Math.max(1, settings.brightness - 5) })
      } else if (e.code === 'ArrowRight' && settings.mode === 'cct') {
        e.preventDefault()
        onUpdateSettings({ kelvin: Math.min(10000, settings.kelvin + 100) })
      } else if (e.code === 'ArrowLeft' && settings.mode === 'cct') {
        e.preventDefault()
        onUpdateSettings({ kelvin: Math.max(1800, settings.kelvin - 100) })
      } else if (e.code === 'KeyH') {
        e.preventDefault()
        setHudPinned((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    onToggleBlackout,
    onExitFullscreen,
    onUpdateSettings,
    settings.brightness,
    settings.kelvin,
    settings.mode,
    triggerActivity,
  ])

  return (
    <div
      className={`fixed inset-0 z-50 bg-black cursor-${hudVisible ? 'default' : 'none'} select-none`}
      onMouseMove={triggerActivity}
    >
      {/* Light Surface */}
      <SoftboxRenderer
        settings={settings}
        isBlackout={isBlackout}
        isPreview={false}
        className="w-full h-full"
      />

      {/* Auto-Hiding HUD Overlay */}
      <div
        className={`fixed inset-x-0 bottom-0 p-4 sm:p-6 transition-all duration-300 pointer-events-none flex flex-col items-center justify-end ${
          hudVisible || hudPinned ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="w-full max-w-4xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-2xl pointer-events-auto flex flex-col gap-4 text-white">
          {/* Top HUD status bar */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-amber-400 tracking-wider uppercase">
                SOFTBOX ACTIVE
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-xs font-mono text-neutral-300">
                {settings.shape.toUpperCase()}
              </span>
              {wakeLockActive && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Zap className="w-3 h-3" />
                  Screen Awake
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Pin HUD button */}
              <button
                onClick={() => setHudPinned(!hudPinned)}
                className={`p-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  hudPinned
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title={hudPinned ? 'Unpin HUD (Auto-hide)' : 'Pin HUD (Stay visible)'}
              >
                {hudPinned ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{hudPinned ? 'Pinned' : 'Auto-hide'}</span>
              </button>

              {/* Standby / Blackout button */}
              <button
                onClick={onToggleBlackout}
                className={`p-2 px-3 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isBlackout
                    ? 'bg-red-500/30 border-red-500/60 text-red-300'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                }`}
                title="Toggle Blackout / Light Standby (Spacebar)"
              >
                {isBlackout ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isBlackout ? 'Resume Light' : 'Blackout'}</span>
                <kbd className="hidden sm:inline-block text-[10px] px-1 py-0.2 bg-neutral-800 rounded text-neutral-400">
                  Space
                </kbd>
              </button>

              {/* Exit Fullscreen button */}
              <button
                onClick={onExitFullscreen}
                className="p-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Exit Fullscreen (Esc or F)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit</span>
                <kbd className="hidden sm:inline-block text-[10px] px-1 py-0.2 bg-neutral-900 rounded text-neutral-400">
                  Esc
                </kbd>
              </button>
            </div>
          </div>

          {/* Quick Sliders Row in HUD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Brightness */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>BRIGHTNESS (↑ / ↓)</span>
                </div>
                <span className="text-amber-400 font-bold text-sm">
                  {settings.brightness}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.brightness}
                onChange={(e) => onUpdateSettings({ brightness: Number(e.target.value) })}
                className="w-full h-2 rounded bg-neutral-800 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* CCT Kelvin or HSI Hue */}
            {settings.mode === 'cct' ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                    <span>COLOR TEMP (← / →)</span>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {settings.kelvin} K
                  </span>
                </div>
                <input
                  type="range"
                  min="1800"
                  max="10000"
                  step="50"
                  value={settings.kelvin}
                  onChange={(e) => onUpdateSettings({ kelvin: Number(e.target.value) })}
                  className="w-full h-2 rounded cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(to right, #ff8912 0%, #ffaa55 25%, #ffffff 50%, #cce2ff 75%, #8cbfff 100%)',
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">GEL HUE</span>
                  <span className="text-purple-400 font-bold">{settings.hue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={settings.hue}
                  onChange={(e) => onUpdateSettings({ hue: Number(e.target.value) })}
                  className="w-full h-2 rounded cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
