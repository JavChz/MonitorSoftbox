import React, { useState } from 'react'
import type { SoftboxSettings, AreaShape } from '../types/softbox'
import { PresetSelector } from './PresetSelector'
import type { LightingPreset } from '../types/softbox'
import {
  Sun,
  Sliders,
  Maximize2,
  Minimize2,
  AlertTriangle,
} from 'lucide-react'

interface SettingsPanelProps {
  settings: SoftboxSettings
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onChange: (updates: Partial<SoftboxSettings>) => void
  onApplyPreset: (preset: LightingPreset) => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  isFullscreen,
  onToggleFullscreen,
  onChange,
  onApplyPreset,
}) => {
  const [showAdvancedShape, setShowAdvancedShape] = useState(false)

  const shapes: { id: AreaShape; label: string; icon: React.ReactNode }[] = [
    {
      id: 'fullscreen',
      label: 'Full',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="12" height="12" rx="1.5" />
        </svg>
      ),
    },
    {
      id: 'octa',
      label: 'Octa',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="6" />
        </svg>
      ),
    },
    {
      id: 'box',
      label: 'Box',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="3" width="10" height="10" rx="2" />
        </svg>
      ),
    },
    {
      id: 'stripleft',
      label: 'Left Strip',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="4.5" height="12" rx="1" />
        </svg>
      ),
    },
    {
      id: 'stripright',
      label: 'Right Strip',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
          <rect x="9.5" y="2" width="4.5" height="12" rx="1" />
        </svg>
      ),
    },
    {
      id: 'ring',
      label: 'Ring',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="8" cy="8" r="5" />
        </svg>
      ),
    },
    {
      id: 'bicolor',
      label: 'Bi-Color',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16">
          <path d="M2 3a1 1 0 0 1 1-1h5v12H3a1 1 0 0 1-1-1V3z" fill="#f59e0b" />
          <path d="M8 2h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8V2z" fill="#38bdf8" />
        </svg>
      ),
    },
  ]

  return (
    <div className="pro-dock rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xl text-white select-none">
      {/* 1. SCENE PRESETS SWATCH STRIP */}
      <PresetSelector
        currentKelvin={settings.kelvin}
        currentMode={settings.mode}
        currentShape={settings.shape}
        onSelectPreset={onApplyPreset}
      />

      <div className="w-full h-[1px] bg-white/5" />

      {/* 2. DUAL HARDWARE FADERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Brightness Fader */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs px-0.5">
            <span className="font-medium text-white/60 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-white/60" />
              Intensity
            </span>
            <span className="font-mono font-medium text-white">
              {settings.brightness}%
            </span>
          </div>

          <div className="relative w-full h-8 rounded-lg pro-well flex items-center px-2.5 overflow-hidden">
            {/* Flat fill bar */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-white/20 pointer-events-none transition-all duration-75"
              style={{ width: `${settings.brightness}%` }}
            />
            <input
              type="range"
              min="1"
              max="100"
              value={settings.brightness}
              onChange={(e) => onChange({ brightness: Number(e.target.value) })}
              className="relative z-10 w-full cursor-pointer"
            />
          </div>

          {/* Quick Brightness Buttons */}
          <div className="flex items-center justify-between gap-1">
            {[10, 25, 50, 75, 100].map((val) => (
              <button
                key={val}
                onClick={() => onChange({ brightness: val })}
                className={`flex-1 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                  settings.brightness === val
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        {/* Color Temperature / Gel Spectrum Fader */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs px-0.5">
            <div className="flex items-center gap-1.5">
              <div className="flex bg-black/40 p-0.5 rounded-md border border-white/5">
                <button
                  onClick={() => onChange({ mode: 'cct' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                    settings.mode === 'cct'
                      ? 'bg-white/20 text-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  CCT Kelvin
                </button>
                <button
                  onClick={() => onChange({ mode: 'hsi' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                    settings.mode === 'hsi'
                      ? 'bg-white/20 text-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  Color Gel
                </button>
              </div>
            </div>

            <span className="font-mono font-medium text-white">
              {settings.mode === 'cct' ? `${settings.kelvin}K` : `${settings.hue}°`}
            </span>
          </div>

          <div className="relative w-full h-8 rounded-lg pro-well flex items-center px-2.5 overflow-hidden">
            {/* Color spectrum track */}
            <div
              className="absolute inset-0 opacity-80 pointer-events-none rounded-lg"
              style={{
                background:
                  settings.mode === 'cct'
                    ? 'linear-gradient(to right, #ff8912 0%, #ffaa55 25%, #ffffff 50%, #cce2ff 75%, #8cbfff 100%)'
                    : 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
              }}
            />
            {settings.mode === 'cct' ? (
              <input
                type="range"
                min="1800"
                max="10000"
                step="50"
                value={settings.kelvin}
                onChange={(e) => onChange({ kelvin: Number(e.target.value) })}
                className="relative z-10 w-full cursor-pointer"
              />
            ) : (
              <input
                type="range"
                min="0"
                max="360"
                value={settings.hue}
                onChange={(e) => onChange({ hue: Number(e.target.value) })}
                className="relative z-10 w-full cursor-pointer"
              />
            )}
          </div>

          {/* Quick Kelvin Pills / Saturation */}
          {settings.mode === 'cct' ? (
            <div className="flex items-center justify-between gap-1">
              {[2700, 3200, 4300, 5600, 6500].map((k) => (
                <button
                  key={k}
                  onClick={() => onChange({ kelvin: k })}
                  className={`flex-1 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                    Math.abs(settings.kelvin - k) < 50
                      ? 'bg-white/20 text-white font-medium'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {k}K
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs px-0.5 gap-2">
              <span className="text-white/50 text-[11px]">Saturation</span>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.saturation}
                onChange={(e) => onChange({ saturation: Number(e.target.value) })}
                className="flex-1 h-1.5 rounded-full bg-white/10 accent-white cursor-pointer"
              />
              <span className="font-mono text-xs text-white/80">{settings.saturation}%</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. APERTURE SHAPES, DIFFUSION & FULLSCREEN BUTTON */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Segmented Shape Selector */}
          <div className="flex-1 min-w-[280px] flex items-center gap-1 p-1 rounded-xl pro-well overflow-x-auto no-scrollbar">
            {shapes.map((item) => {
              const isSelected = settings.shape === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onChange({ shape: item.id })}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'pro-pill-active'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Clean Flat Diffusion Control */}
          <div className="w-full sm:w-52 h-10 px-3 rounded-xl pro-well flex items-center gap-2 shrink-0">
            <span className="text-xs text-white/60 font-medium whitespace-nowrap">Diffusion</span>
            <div className="flex-1 min-w-0 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.feather}
                onChange={(e) => onChange({ feather: Number(e.target.value) })}
                className="w-full h-1.5 rounded-full bg-white/20 accent-white cursor-pointer"
              />
            </div>
            <span className="font-mono text-xs text-white/80 w-7 text-right shrink-0">
              {settings.feather}%
            </span>
          </div>

          {/* Toggle geometry options if not fullscreen */}
          {settings.shape !== 'fullscreen' && (
            <button
              onClick={() => setShowAdvancedShape(!showAdvancedShape)}
              className={`h-10 px-3 rounded-xl pro-well text-xs transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                showAdvancedShape ? 'text-white bg-white/15' : 'text-white/60 hover:text-white'
              }`}
              title="Geometry & Dimensions"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

          {/* Clean High-Contrast Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className={`h-10 px-4 sm:px-5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer whitespace-nowrap ${
              isFullscreen
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                : 'bg-white hover:bg-neutral-200 text-black shadow-md'
            }`}
            title={isFullscreen ? 'Exit Fullscreen (Esc or F)' : 'Enter Fullscreen (F)'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-black/10 text-black font-mono rounded">
                  F
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* 4. EXPANDABLE GEOMETRY DRAWER */}
        {settings.shape !== 'fullscreen' && showAdvancedShape && (
          <div className="p-3 rounded-xl pro-well flex flex-wrap gap-4 text-xs animate-fadeIn">
            {/* Box Width / Height */}
            {(settings.shape === 'box' || settings.shape === 'stripleft' || settings.shape === 'stripright') && (
              <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                <div className="flex justify-between text-white/70">
                  <span>Width</span>
                  <span className="font-mono text-white">{settings.boxWidth}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max={settings.shape === 'box' ? 100 : 60}
                  value={settings.boxWidth}
                  onChange={(e) => onChange({ boxWidth: Number(e.target.value) })}
                  className="w-full h-1.5 rounded bg-white/20 accent-white"
                />
              </div>
            )}

            {settings.shape === 'box' && (
              <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                <div className="flex justify-between text-white/70">
                  <span>Height</span>
                  <span className="font-mono text-white">{settings.boxHeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.boxHeight}
                  onChange={(e) => onChange({ boxHeight: Number(e.target.value) })}
                  className="w-full h-1.5 rounded bg-white/20 accent-white"
                />
              </div>
            )}

            {/* Octa or Ring Diameter */}
            {(settings.shape === 'octa' || settings.shape === 'ring') && (
              <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                <div className="flex justify-between text-white/70">
                  <span>Diameter</span>
                  <span className="font-mono text-white">{settings.circleDiameter}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.circleDiameter}
                  onChange={(e) => onChange({ circleDiameter: Number(e.target.value) })}
                  className="w-full h-1.5 rounded bg-white/20 accent-white"
                />
              </div>
            )}

            {/* Ring Inner Hole */}
            {settings.shape === 'ring' && (
              <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                <div className="flex justify-between text-white/70">
                  <span>Inner Hole</span>
                  <span className="font-mono text-white">{settings.ringInner}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  value={settings.ringInner}
                  onChange={(e) => onChange({ ringInner: Number(e.target.value) })}
                  className="w-full h-1.5 rounded bg-white/20 accent-white"
                />
              </div>
            )}

            {/* Bi-Color Key / Fill Controls */}
            {settings.shape === 'bicolor' && (
              <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-white/70">
                    <span>Split Ratio (Left : Right)</span>
                    <span className="font-mono text-white">{settings.splitRatio}% : {100 - settings.splitRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={settings.splitRatio}
                    onChange={(e) => onChange({ splitRatio: Number(e.target.value) })}
                    className="w-full h-1.5 rounded bg-white/20 accent-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-black/40 flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium text-amber-400">Left Key</span>
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>Kelvin</span>
                      <span className="font-mono text-white">{settings.bicolorLeft.kelvin}K</span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="8500"
                      step="100"
                      value={settings.bicolorLeft.kelvin}
                      onChange={(e) =>
                        onChange({
                          bicolorLeft: { ...settings.bicolorLeft, kelvin: Number(e.target.value) },
                        })
                      }
                      className="w-full h-1 rounded bg-white/20 accent-amber-400"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 flex flex-col gap-1.5">
                    <span className="text-[11px] font-medium text-sky-400">Right Fill</span>
                    <div className="flex items-center justify-between text-[11px] text-white/60">
                      <span>Kelvin</span>
                      <span className="font-mono text-white">{settings.bicolorRight.kelvin}K</span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="8500"
                      step="100"
                      value={settings.bicolorRight.kelvin}
                      onChange={(e) =>
                        onChange({
                          bicolorRight: { ...settings.bicolorRight, kelvin: Number(e.target.value) },
                        })
                      }
                      className="w-full h-1 rounded bg-white/20 accent-sky-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. OLED SAFETY NOTICE AT BOTTOM OF DOCK */}
      <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
        <AlertTriangle className="w-3 h-3 text-amber-400/80 shrink-0" />
        <span>Notice: Strictly for standard LCD/IPS monitors. Not recommended for OLED/QD-OLED displays due to risk of burn-in.</span>
      </div>
    </div>
  )
}
