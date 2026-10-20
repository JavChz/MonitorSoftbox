import React from 'react'
import type { SoftboxSettings, AreaShape } from '../types/softbox'
import { CCT_QUICK_PRESETS } from '../utils/presets'
import { kelvinToRgb, rgbToHex } from '../utils/color'
import {
  Sun,
  Thermometer,
  Layers,
  Circle,
  Square,
  Columns,
  Palette,
  Disc,
  Split,
} from 'lucide-react'

interface SettingsPanelProps {
  settings: SoftboxSettings
  onChange: (updates: Partial<SoftboxSettings>) => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onChange,
}) => {
  const currentRgb = kelvinToRgb(settings.kelvin, settings.tint)
  const currentHex = rgbToHex(currentRgb)

  const shapes: { id: AreaShape; label: string; icon: React.ReactNode }[] = [
    { id: 'fullscreen', label: 'Full Panel', icon: <Square className="w-4 h-4 fill-current opacity-80" /> },
    { id: 'octa', label: 'Octa Catchlight', icon: <Circle className="w-4 h-4" /> },
    { id: 'box', label: 'Softbox Box', icon: <Square className="w-4 h-4" /> },
    { id: 'stripleft', label: 'Left Strip', icon: <Columns className="w-4 h-4" /> },
    { id: 'stripright', label: 'Right Strip', icon: <Columns className="w-4 h-4 transform scale-x-[-1]" /> },
    { id: 'ring', label: 'Ring Light', icon: <Disc className="w-4 h-4" /> },
    { id: 'bicolor', label: 'Dual Key/Fill', icon: <Split className="w-4 h-4" /> },
  ]

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-6 flex flex-col gap-6 shadow-xl">
      {/* 1. LIGHT MODE SELECTOR */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
            OPERATING MODE
          </span>
          <p className="text-xs text-neutral-500">Choose physical CCT or creative color gel</p>
        </div>
        <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => onChange({ mode: 'cct' })}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              settings.mode === 'cct'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>CCT (Kelvin)</span>
          </button>
          <button
            onClick={() => onChange({ mode: 'hsi' })}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              settings.mode === 'hsi'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>HSI (Color Gel)</span>
          </button>
        </div>
      </div>

      {/* 2. BRIGHTNESS CONTROL */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
              Brightness / Intensity
            </label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold text-amber-400">
              {settings.brightness}%
            </span>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="100"
          value={settings.brightness}
          onChange={(e) => onChange({ brightness: Number(e.target.value) })}
          className="w-full h-2.5 rounded-lg bg-neutral-800 accent-amber-400 cursor-pointer"
        />

        {/* Quick Brightness Presets */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          {[10, 25, 50, 75, 100].map((val) => (
            <button
              key={val}
              onClick={() => onChange({ brightness: val })}
              className={`flex-1 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${
                settings.brightness === val
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-neutral-950/60 hover:bg-neutral-800 border-neutral-800 text-neutral-400'
              }`}
            >
              {val}%
            </button>
          ))}
        </div>
      </div>

      {/* 3. COLOR TEMPERATURE (CCT) OR HSI GEL */}
      {settings.mode === 'cct' ? (
        <div className="flex flex-col gap-4">
          {/* Kelvin Slider */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-sky-400" />
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
                  White Balance (Color Temperature)
                </label>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800">
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: currentHex }}
                />
                <span className="text-sm font-mono font-bold text-white">
                  {settings.kelvin} K
                </span>
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                type="range"
                min="1800"
                max="10000"
                step="50"
                value={settings.kelvin}
                onChange={(e) => onChange({ kelvin: Number(e.target.value) })}
                className="w-full h-3 rounded-lg cursor-pointer"
                style={{
                  background:
                    'linear-gradient(to right, #ff8912 0%, #ffaa55 25%, #ffffff 50%, #cce2ff 75%, #8cbfff 100%)',
                }}
              />
            </div>

            {/* Quick Kelvin Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CCT_QUICK_PRESETS.map((preset) => {
                const isActive = Math.abs(settings.kelvin - preset.kelvin) < 50
                return (
                  <button
                    key={preset.kelvin}
                    onClick={() => onChange({ kelvin: preset.kelvin })}
                    className={`px-2.5 py-1 rounded text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-500/60 text-sky-200 font-bold'
                        : 'bg-neutral-950/60 hover:bg-neutral-800 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <span>{preset.label}</span>
                    <span className="text-[10px] opacity-70">({preset.kelvin}K)</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Green / Magenta Tint Shift */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400 uppercase tracking-wider font-semibold">
                Green / Magenta Tint (duv)
              </span>
              <div className="flex items-center gap-2">
                <span className={settings.tint > 0 ? 'text-emerald-400 font-bold' : settings.tint < 0 ? 'text-pink-400 font-bold' : 'text-neutral-400'}>
                  {settings.tint > 0 ? `+${settings.tint} (Green)` : settings.tint < 0 ? `${settings.tint} (Magenta)` : '0 (Neutral)'}
                </span>
                {settings.tint !== 0 && (
                  <button
                    onClick={() => onChange({ tint: 0 })}
                    className="text-[10px] text-neutral-500 hover:text-white underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <input
              type="range"
              min="-50"
              max="50"
              value={settings.tint}
              onChange={(e) => onChange({ tint: Number(e.target.value) })}
              className="w-full h-2 rounded-lg cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ec4899 0%, #737373 50%, #10b981 100%)',
              }}
            />
          </div>
        </div>
      ) : (
        /* HSI COLOR GEL MODE */
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300 uppercase tracking-wider font-bold">
                Color Gel Hue
              </span>
              <span className="text-purple-400 font-bold">{settings.hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={settings.hue}
              onChange={(e) => onChange({ hue: Number(e.target.value) })}
              className="w-full h-3 rounded-lg cursor-pointer"
              style={{
                background:
                  'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300 uppercase tracking-wider font-bold">
                Saturation
              </span>
              <span className="text-purple-400 font-bold">{settings.saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.saturation}
              onChange={(e) => onChange({ saturation: Number(e.target.value) })}
              className="w-full h-2.5 rounded-lg bg-neutral-800 accent-purple-400 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 4. AREA / SHAPE SELECTOR */}
      <div className="flex flex-col gap-3 border-t border-neutral-800 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
              Softbox Area & Shape
            </label>
          </div>
          <span className="text-xs font-mono text-neutral-400 uppercase">
            {settings.shape}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {shapes.map((item) => {
            const isSelected = settings.shape === item.id
            return (
              <button
                key={item.id}
                onClick={() => onChange({ shape: item.id })}
                className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                    : 'bg-neutral-950/70 hover:bg-neutral-800 border-neutral-800 text-neutral-400'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. DYNAMIC SHAPE CONTROLS */}
      {settings.shape !== 'fullscreen' && (
        <div className="bg-neutral-950/70 border border-neutral-800/80 rounded-lg p-3.5 flex flex-col gap-3.5">
          <span className="text-[11px] font-mono text-neutral-400 uppercase font-bold tracking-wider">
            Shape Dimensions & Position
          </span>

          {/* BOX WIDTH / HEIGHT */}
          {(settings.shape === 'box' || settings.shape === 'stripleft' || settings.shape === 'stripright') && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Width</span>
                <span className="text-neutral-200">{settings.boxWidth}%</span>
              </div>
              <input
                type="range"
                min="10"
                max={settings.shape === 'box' ? '100' : '60'}
                value={settings.boxWidth}
                onChange={(e) => onChange({ boxWidth: Number(e.target.value) })}
                className="w-full h-2 rounded bg-neutral-800 accent-emerald-400 cursor-pointer"
              />
            </div>
          )}

          {settings.shape === 'box' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Height</span>
                <span className="text-neutral-200">{settings.boxHeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.boxHeight}
                onChange={(e) => onChange({ boxHeight: Number(e.target.value) })}
                className="w-full h-2 rounded bg-neutral-800 accent-emerald-400 cursor-pointer"
              />
            </div>
          )}

          {/* OCTA OR RING DIAMETER */}
          {(settings.shape === 'octa' || settings.shape === 'ring') && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Diameter</span>
                <span className="text-neutral-200">{settings.circleDiameter}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.circleDiameter}
                onChange={(e) => onChange({ circleDiameter: Number(e.target.value) })}
                className="w-full h-2 rounded bg-neutral-800 accent-emerald-400 cursor-pointer"
              />
            </div>
          )}

          {/* RING INNER HOLE */}
          {settings.shape === 'ring' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Inner Camera Hole Size</span>
                <span className="text-neutral-200">{settings.ringInner}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                value={settings.ringInner}
                onChange={(e) => onChange({ ringInner: Number(e.target.value) })}
                className="w-full h-2 rounded bg-neutral-800 accent-emerald-400 cursor-pointer"
              />
            </div>
          )}

          {/* BI-COLOR SPLIT CONTROLS */}
          {settings.shape === 'bicolor' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Left / Right Split Balance</span>
                  <span className="text-neutral-200">{settings.splitRatio} : {100 - settings.splitRatio}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={settings.splitRatio}
                  onChange={(e) => onChange({ splitRatio: Number(e.target.value) })}
                  className="w-full h-2 rounded bg-neutral-800 accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Sub-controls for Left (Key) and Right (Fill) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Left */}
                <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800 flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                    Left Zone (Key)
                  </span>
                  <div className="flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-neutral-400">Kelvin: {settings.bicolorLeft.kelvin}K</span>
                    <input
                      type="range"
                      min="2000"
                      max="8500"
                      step="100"
                      value={settings.bicolorLeft.kelvin}
                      onChange={(e) =>
                        onChange({
                          bicolorLeft: {
                            ...settings.bicolorLeft,
                            kelvin: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full h-1.5 rounded bg-neutral-800 accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-neutral-400">Brightness: {settings.bicolorLeft.brightness}%</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={settings.bicolorLeft.brightness}
                      onChange={(e) =>
                        onChange({
                          bicolorLeft: {
                            ...settings.bicolorLeft,
                            brightness: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full h-1.5 rounded bg-neutral-800 accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Right */}
                <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800 flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-sky-400 font-bold uppercase">
                    Right Zone (Fill)
                  </span>
                  <div className="flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-neutral-400">Kelvin: {settings.bicolorRight.kelvin}K</span>
                    <input
                      type="range"
                      min="2000"
                      max="8500"
                      step="100"
                      value={settings.bicolorRight.kelvin}
                      onChange={(e) =>
                        onChange({
                          bicolorRight: {
                            ...settings.bicolorRight,
                            kelvin: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full h-1.5 rounded bg-neutral-800 accent-sky-400 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] font-mono">
                    <span className="text-neutral-400">Brightness: {settings.bicolorRight.brightness}%</span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={settings.bicolorRight.brightness}
                      onChange={(e) =>
                        onChange({
                          bicolorRight: {
                            ...settings.bicolorRight,
                            brightness: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full h-1.5 rounded bg-neutral-800 accent-sky-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. DIFFUSION / FEATHERING */}
      <div className="flex flex-col gap-2 border-t border-neutral-800 pt-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
            Diffusion / Edge Feathering
          </label>
          <span className="text-xs font-mono font-bold text-neutral-400">
            {settings.feather}% {settings.feather === 0 ? '(Hard Cut)' : settings.feather > 70 ? '(Ultra Soft Diffused)' : '(Softbox Silk)'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.feather}
          onChange={(e) => onChange({ feather: Number(e.target.value) })}
          className="w-full h-2 rounded-lg bg-neutral-800 accent-neutral-300 cursor-pointer"
        />
        <p className="text-[11px] text-neutral-500">
          Controls the optical falloff gradient at the edges of the softbox aperture.
        </p>
      </div>
    </div>
  )
}
