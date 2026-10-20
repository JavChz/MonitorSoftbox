import React from 'react'
import { STUDIO_PRESETS } from '../utils/presets'
import type { LightingPreset } from '../types/softbox'
import { Sparkles, Camera, Video, Palette } from 'lucide-react'

interface PresetSelectorProps {
  onSelectPreset: (preset: LightingPreset) => void
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelectPreset,
}) => {
  const getCategoryIcon = (category: LightingPreset['category']) => {
    switch (category) {
      case 'cinema':
        return <Video className="w-3.5 h-3.5 text-amber-400" />
      case 'portrait':
        return <Camera className="w-3.5 h-3.5 text-sky-400" />
      case 'streaming':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
      case 'creative':
        return <Palette className="w-3.5 h-3.5 text-purple-400" />
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-200 font-bold">
            Studio Lighting Presets
          </h2>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          Pro Key & Fill Recipes
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {STUDIO_PRESETS.map((preset) => {
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="text-left p-3 rounded-lg bg-neutral-950/70 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 transition-all group flex flex-col justify-between gap-1.5 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-neutral-200 group-hover:text-amber-400 transition-colors font-mono">
                  {preset.name}
                </span>
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                  {getCategoryIcon(preset.category)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {preset.settings.kelvin && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    {preset.settings.kelvin}K
                  </span>
                )}
                {preset.settings.brightness && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    {preset.settings.brightness}%
                  </span>
                )}
                {preset.settings.shape && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-amber-400/80 border border-neutral-800 uppercase">
                    {preset.settings.shape}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
