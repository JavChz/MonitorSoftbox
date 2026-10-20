import React from 'react'
import { X, Keyboard, Lightbulb, Zap, Monitor } from 'lucide-react'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-5 text-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono text-base font-bold uppercase tracking-wider">
              MonitorSoftbox Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pro Tips */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
            <Lightbulb className="w-4 h-4" />
            <span>Cinematography & Lighting Tips</span>
          </div>
          <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-lg p-3 text-xs text-neutral-300 space-y-2 leading-relaxed">
            <p>
              • <strong className="text-white">Hardware Brightness:</strong> Set your physical monitor/laptop screen brightness to 100% using hardware buttons for maximum photonic power output.
            </p>
            <p>
              • <strong className="text-white">Daylight vs Tungsten:</strong> Use <span className="text-sky-300 font-mono">5600K</span> for modern crisp video and matching natural window light; use <span className="text-amber-300 font-mono">3200K</span> for intimate, warm cinematic scenes.
            </p>
            <p>
              • <strong className="text-white">Catchlights:</strong> Choose the <span className="text-emerald-300 font-mono">Octa</span> shape to produce round, lively reflections in the eyes of your subject.
            </p>
            <p>
              • <strong className="text-white">Dual Key & Fill:</strong> Use the <span className="text-purple-300 font-mono">Dual Key/Fill</span> mode to create rich cinematic contrast across your face using a single display!
            </p>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase">
            <Keyboard className="w-4 h-4" />
            <span>Keyboard Shortcuts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400">Toggle Fullscreen</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200">
                F or Esc
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400">Blackout / Standby</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200">
                Space
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400">Brightness ±5%</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200">
                ↑ / ↓
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400">Kelvin ±100K</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200">
                ← / →
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-neutral-950/60 border border-neutral-800">
              <span className="text-neutral-400">Pin / Auto-hide HUD</span>
              <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-200">
                H
              </kbd>
            </div>
          </div>
        </div>

        {/* Screen Awake info */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Zap className="w-4 h-4 shrink-0" />
          <span>Screen WakeLock prevents monitor standby & screensaver during recording.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
        >
          Close Guide
        </button>
      </div>
    </div>
  )
}
