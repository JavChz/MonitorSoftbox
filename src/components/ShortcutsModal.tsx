import React from 'react'
import { X, Keyboard, Lightbulb, Zap, Monitor, AlertTriangle } from 'lucide-react'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="aero-dock rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 text-white max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-sky-400" />
            </div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              MonitorSoftbox Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* OLED Burn-in Warning */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-amber-300 block">
              OLED / QD-OLED Caution
            </span>
            <p>
              Do <strong>not</strong> run static high-brightness light patterns on OLED or QD-OLED screens for prolonged periods to avoid risk of uneven subpixel burn-in. Designed for standard <strong>LCD, LED, and IPS</strong> computer monitors.
            </p>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <Keyboard className="w-3.5 h-3.5 text-sky-400" />
            <span>Keyboard Shortcuts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl aero-well">
              <span className="text-white/70">Toggle Fullscreen</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px]">
                F / Esc
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl aero-well">
              <span className="text-white/70">Mute / Blackout</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px]">
                Space
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl aero-well">
              <span className="text-white/70">Brightness ±5%</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px]">
                ↑ / ↓
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl aero-well">
              <span className="text-white/70">Kelvin ±100K</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px]">
                ← / →
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl aero-well sm:col-span-2">
              <span className="text-white/70">Pin / Auto-hide HUD</span>
              <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px]">
                H
              </kbd>
            </div>
          </div>
        </div>

        {/* Lighting Tips */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>Lighting Tips</span>
          </div>
          <div className="p-3 rounded-2xl aero-well text-xs text-white/75 space-y-1.5 leading-relaxed">
            <p>• <strong>Monitor Brightness:</strong> Turn your physical monitor brightness buttons to 100% for maximum photonic output.</p>
            <p>• <strong>Catchlights:</strong> Choose the <strong className="text-sky-300">Octa</strong> shape for beautiful circular reflections in the eyes.</p>
            <p>• <strong>Bi-Color:</strong> Use the <strong className="text-amber-300">Bi-Color</strong> shape for instant warm key light and cool soft fill from a single screen.</p>
          </div>
        </div>

        {/* Wake Lock Status */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs">
          <Zap className="w-3.5 h-3.5 shrink-0 text-sky-400" />
          <span>Screen WakeLock automatically keeps your display awake while filming.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          Close Guide
        </button>
      </div>
    </div>
  )
}
