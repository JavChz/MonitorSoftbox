import React from 'react'
import { Maximize2, Sun, HelpCircle, RotateCcw } from 'lucide-react'

interface HeaderProps {
  onActivateFullscreen: () => void
  onReset: () => void
  onOpenHelp: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onActivateFullscreen,
  onReset,
  onOpenHelp,
}) => {
  return (
    <header className="border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur sticky top-0 z-30 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 via-neutral-800 to-sky-500/20 border border-neutral-700/60 flex items-center justify-center shadow-inner">
            <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-base sm:text-lg text-white font-mono">
                MONITOR<span className="text-amber-400">SOFTBOX</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-semibold tracking-widest hidden sm:inline-block">
                STUDIO PRO
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Turn your display into a calibrated cinematography key & fill light
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onReset}
            title="Reset to 5600K Daylight Default"
            className="p-2.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/60 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={onOpenHelp}
            title="Shortcuts and Info"
            className="p-2.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/60 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">Guide</span>
          </button>

          <button
            onClick={onActivateFullscreen}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-bold text-xs sm:text-sm tracking-wider uppercase font-mono shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all transform active:scale-95 cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 stroke-[2.5]" />
            <span>ACTIVATE SOFTBOX</span>
            <kbd className="hidden lg:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-neutral-900/20 text-neutral-900 font-mono rounded">
              F
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
