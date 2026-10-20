import React from 'react'
import { STUDIO_PRESETS } from '../utils/presets'
import type { LightingPreset } from '../types/softbox'
import { kelvinToRgb, hslToRgb, rgbToHex } from '../utils/color'

interface PresetSelectorProps {
  currentKelvin: number
  currentMode: string
  currentShape: string
  onSelectPreset: (preset: LightingPreset) => void
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentKelvin,
  currentMode,
  currentShape,
  onSelectPreset,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-0.5">
      <div className="flex items-center gap-1.5 min-w-max">
        {STUDIO_PRESETS.map((preset) => {
          // Compute dot color
          const rgb = preset.settings.mode === 'hsi'
            ? hslToRgb(preset.settings.hue ?? 0, preset.settings.saturation ?? 80, 50)
            : kelvinToRgb(preset.settings.kelvin ?? 5600, preset.settings.tint ?? 0)
          const hex = rgbToHex(rgb)

          // Check if active
          const isModeMatch = (preset.settings.mode ?? 'cct') === currentMode
          const isShapeMatch = preset.settings.shape ? preset.settings.shape === currentShape : true
          const isKelvinMatch = preset.settings.kelvin ? Math.abs(preset.settings.kelvin - currentKelvin) < 150 : true
          const isActive = isModeMatch && isShapeMatch && isKelvinMatch

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-all cursor-pointer ${
                isActive
                  ? 'pro-pill-active'
                  : 'pro-pill'
              }`}
            >
              {/* Flat Precision Color Dot */}
              <div
                className="w-2.5 h-2.5 rounded-full pro-dot shrink-0"
                style={{ backgroundColor: hex }}
              />

              <span className="font-medium whitespace-nowrap tracking-tight">
                {preset.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
