import React from 'react'
import type { SoftboxSettings } from '../types/softbox'
import { kelvinToRgb, hslToRgb, formatRgbCss } from '../utils/color'

interface SoftboxRendererProps {
  settings: SoftboxSettings
  isBlackout?: boolean
  isPreview?: boolean
  className?: string
}

export const SoftboxRenderer: React.FC<SoftboxRendererProps> = ({
  settings,
  isBlackout = false,
  isPreview = false,
  className = '',
}) => {
  if (isBlackout) {
    return <div className={`w-full h-full bg-black ${className}`} />
  }

  // Calculate primary color
  const primaryRgb = settings.mode === 'cct'
    ? kelvinToRgb(settings.kelvin, settings.tint)
    : hslToRgb(settings.hue, settings.saturation, 50)

  const primaryCss = formatRgbCss(primaryRgb, settings.brightness / 100)

  // Calculate bicolor secondary color if needed
  const leftRgb = kelvinToRgb(settings.bicolorLeft.kelvin, 0)
  const leftCss = formatRgbCss(leftRgb, settings.bicolorLeft.brightness / 100)

  const rightRgb = kelvinToRgb(settings.bicolorRight.kelvin, 0)
  const rightCss = formatRgbCss(rightRgb, settings.bicolorRight.brightness / 100)

  // Feather factor
  const feather = Math.max(0, Math.min(100, settings.feather))

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-black flex items-center justify-center select-none ${className}`}
      style={{ backgroundColor: '#000000' }}
    >
      {/* 1. FULLSCREEN */}
      {settings.shape === 'fullscreen' && (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: primaryCss,
            ...(feather > 0
              ? {
                  boxShadow: `inset 0 0 ${feather * (isPreview ? 0.8 : 2.5)}px rgba(0,0,0,0.85)`,
                }
              : {}),
          }}
        />
      )}

      {/* 2. RECTANGULAR SOFTBOX */}
      {settings.shape === 'box' && (
        <div
          className="transition-all duration-150"
          style={{
            width: `${settings.boxWidth}%`,
            height: `${settings.boxHeight}%`,
            backgroundColor: primaryCss,
            borderRadius: `${Math.round(feather * 0.4)}%`,
            boxShadow: feather > 0
              ? `0 0 ${feather * (isPreview ? 0.6 : 2)}px ${feather * (isPreview ? 0.3 : 1)}px ${primaryCss}`
              : 'none',
          }}
        />
      )}

      {/* 3. OCTA / CIRCULAR SOFTBOX */}
      {settings.shape === 'octa' && (
        <div
          className="rounded-full transition-all duration-150"
          style={{
            width: isPreview ? `${settings.circleDiameter}%` : `min(${settings.circleDiameter}vw, ${settings.circleDiameter}vh)`,
            height: isPreview ? `${settings.circleDiameter}%` : `min(${settings.circleDiameter}vw, ${settings.circleDiameter}vh)`,
            background: feather > 0
              ? `radial-gradient(circle, ${primaryCss} 0%, ${primaryCss} ${Math.max(5, 100 - feather)}%, rgba(0,0,0,0) 100%)`
              : primaryCss,
            boxShadow: feather > 0
              ? `0 0 ${feather * (isPreview ? 0.7 : 2)}px ${primaryCss}`
              : 'none',
          }}
        />
      )}

      {/* 4. STRIP LIGHT LEFT */}
      {settings.shape === 'stripleft' && (
        <div
          className="absolute left-0 top-0 bottom-0 transition-all duration-150"
          style={{
            width: `${settings.boxWidth}%`,
            height: '100%',
            background: feather > 0
              ? `linear-gradient(to right, ${primaryCss} 0%, ${primaryCss} ${Math.max(10, 100 - feather)}%, rgba(0,0,0,0) 100%)`
              : primaryCss,
          }}
        />
      )}

      {/* 5. STRIP LIGHT RIGHT */}
      {settings.shape === 'stripright' && (
        <div
          className="absolute right-0 top-0 bottom-0 transition-all duration-150"
          style={{
            width: `${settings.boxWidth}%`,
            height: '100%',
            background: feather > 0
              ? `linear-gradient(to left, ${primaryCss} 0%, ${primaryCss} ${Math.max(10, 100 - feather)}%, rgba(0,0,0,0) 100%)`
              : primaryCss,
          }}
        />
      )}

      {/* 6. RING LIGHT */}
      {settings.shape === 'ring' && (
        <div
          className="rounded-full transition-all duration-150 flex items-center justify-center"
          style={{
            width: isPreview ? `${settings.circleDiameter}%` : `min(${settings.circleDiameter}vw, ${settings.circleDiameter}vh)`,
            height: isPreview ? `${settings.circleDiameter}%` : `min(${settings.circleDiameter}vw, ${settings.circleDiameter}vh)`,
            background: feather > 0
              ? `radial-gradient(circle, transparent ${Math.max(0, settings.ringInner - feather * 0.15)}%, ${primaryCss} ${settings.ringInner}%, ${primaryCss} ${Math.max(settings.ringInner + 5, 100 - feather * 0.25)}%, transparent 100%)`
              : `radial-gradient(circle, transparent ${settings.ringInner}%, ${primaryCss} ${settings.ringInner}%, ${primaryCss} 100%, transparent 100%)`,
          }}
        />
      )}

      {/* 7. BI-COLOR SPLIT (KEY & FILL) */}
      {settings.shape === 'bicolor' && (
        <div className="w-full h-full flex">
          <div
            className="h-full transition-all duration-150"
            style={{
              width: `${settings.splitRatio}%`,
              background: feather > 0
                ? `linear-gradient(to right, ${leftCss} 0%, ${leftCss} ${Math.max(10, 100 - feather * 0.5)}%, ${rightCss} 100%)`
                : leftCss,
            }}
          />
          <div
            className="h-full transition-all duration-150"
            style={{
              width: `${100 - settings.splitRatio}%`,
              backgroundColor: rightCss,
            }}
          />
        </div>
      )}
    </div>
  )
}
