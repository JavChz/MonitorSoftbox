import React from 'react'
import {
  Sun,
  Maximize2,
  Minimize2,
  Moon,
  HelpCircle,
  RotateCcw,
  Pin,
  PinOff,
} from 'lucide-react'
import type { SoftboxSettings } from '../types/softbox'

interface HeaderProps {
  settings: SoftboxSettings
  isBlackout: boolean
  isFullscreen: boolean
  isPinned: boolean
  onToggleBlackout: () => void
  onToggleFullscreen: () => void
  onTogglePinned: () => void
  onReset: () => void
  onOpenHelp: () => void
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  isBlackout,
  isFullscreen,
  isPinned,
  onToggleBlackout,
  onToggleFullscreen,
  onTogglePinned,
  onReset,
  onOpenHelp,
}) => {
  return (
    <header className="fixed top-3.5 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none flex items-center justify-between gap-3">
      {/* Brand & Live Telemetry Pill */}
      <div className="pointer-events-auto pro-dock flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs">
        <span className="font-semibold tracking-tight text-white/90">
          MonitorSoftbox
        </span>
        <span className="text-white/20">•</span>
        <span className="font-mono text-white/80">
          {isBlackout ? 'MUTED' : settings.mode === 'cct' ? `${settings.kelvin}K` : `${settings.hue}°`}
        </span>
        <span className="text-white/20">•</span>
        <span className="font-mono text-white/60">
          {settings.brightness}%
        </span>
      </div>

      {/* Right Controls Pill */}
      <div className="pointer-events-auto pro-dock flex items-center gap-1 p-1 rounded-xl text-xs">
        {/* Blackout / Standby button */}
        <button
          onClick={onToggleBlackout}
          className={`px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isBlackout
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle Blackout / Light Mute (Space)"
        >
          {isBlackout ? <Sun className="w-3.5 h-3.5 text-red-400" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isBlackout ? 'Resume' : 'Mute'}</span>
          <kbd className="hidden lg:inline-block px-1 py-0.2 text-[10px] bg-white/10 text-white/70 font-mono rounded">
            Space
          </kbd>
        </button>

        <div className="w-[1px] h-3.5 bg-white/10 mx-0.5" />

        {/* Pin HUD */}
        <button
          onClick={onTogglePinned}
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            isPinned
              ? 'text-white bg-white/15'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title={isPinned ? 'HUD Pinned (Always Visible)' : 'Auto-hide HUD on Inactivity (Press H)'}
        >
          {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
        </button>

        {/* Help Modal */}
        <button
          onClick={onOpenHelp}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Guide & Shortcuts"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Reset to 5600K 100%"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3.5 bg-white/10 mx-0.5" />

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen (Esc or F)' : 'Enter Fullscreen (F)'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          <kbd className="hidden lg:inline-block px-1 py-0.2 text-[10px] bg-white/10 text-white/70 font-mono rounded">
            F
          </kbd>
        </button>
      </div>
    </header>
  )
}
