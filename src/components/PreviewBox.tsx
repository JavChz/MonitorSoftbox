import React from 'react'
import type { SoftboxSettings } from '../types/softbox'
import { SoftboxRenderer } from './SoftboxRenderer'
import { Maximize2, Moon, Sun } from 'lucide-react'
import { kelvinToRgb, hslToRgb, rgbToHex } from '../utils/color'

interface PreviewBoxProps {
  settings: SoftboxSettings
  isBlackout: boolean
  onToggleBlackout: () => void
  onActivateFullscreen: () => void
}

export const PreviewBox: React.FC<PreviewBoxProps> = ({
  settings,
  isBlackout,
  onToggleBlackout,
  onActivateFullscreen,
}) => {
  const primaryRgb = settings.mode === 'cct'
    ? kelvinToRgb(settings.kelvin, settings.tint)
    : hslToRgb(settings.hue, settings.saturation, 50)
  const hex = rgbToHex(primaryRgb)

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
      {/* Top Bar with monitor metadata */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-neutral-400 uppercase tracking-wider font-semibold">
            LIVE EMITTER PREVIEW
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-700"
              style={{ backgroundColor: hex }}
            />
            <span>{settings.mode === 'cct' ? `${settings.kelvin}K` : `HUE ${settings.hue}°`}</span>
          </div>
          <span className="text-amber-400 font-bold">{settings.brightness}%</span>
        </div>
      </div>

      {/* Monitor Screen Frame */}
      <div className="relative group w-full aspect-video rounded-lg overflow-hidden border-2 border-neutral-700/80 bg-black shadow-2xl flex items-center justify-center cursor-pointer">
        {/* Softbox simulated render */}
        <SoftboxRenderer
          settings={settings}
          isBlackout={isBlackout}
          isPreview={true}
          className="w-full h-full"
        />

        {/* Hover overlay button to launch */}
        <div
          onClick={onActivateFullscreen}
          className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white font-mono"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Maximize2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold tracking-wider drop-shadow-md">
            CLICK TO GO FULLSCREEN
          </span>
          <span className="text-[11px] text-neutral-300">Press F or click button</span>
        </div>

        {/* Bottom indicators */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] text-neutral-300 uppercase font-mono border border-white/10">
            {settings.shape}
          </span>
          {settings.feather > 0 && (
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] text-neutral-400 font-mono border border-white/10">
              FEATHER {settings.feather}%
            </span>
          )}
        </div>
      </div>

      {/* Quick Action bar underneath monitor */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={onToggleBlackout}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
            isBlackout
              ? 'bg-red-500/20 border-red-500/40 text-red-300'
              : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
          }`}
        >
          {isBlackout ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span>{isBlackout ? 'Standby (Muted)' : 'Blackout Check'}</span>
          <kbd className="px-1 py-0.2 rounded bg-neutral-900 text-[10px] text-neutral-400">Space</kbd>
        </button>

        <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
          Tip: Set hardware monitor brightness to 100%
        </span>
      </div>
    </div>
  )
}
