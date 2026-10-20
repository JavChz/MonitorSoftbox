/**
 * Color temperature (Kelvin) to RGB conversion
 * Based on Planckian locus / Tanner Helland algorithm with cinematography refinement
 */
export interface RgbColor {
  r: number
  g: number
  b: number
}

export function kelvinToRgb(kelvin: number, tint: number = 0): RgbColor {
  // Clamp kelvin between 1000K and 12000K
  const temp = Math.max(1000, Math.min(12000, kelvin)) / 100
  let r: number
  let g: number
  let b: number

  // Red
  if (temp <= 66) {
    r = 255
  } else {
    r = temp - 60
    r = 329.698727446 * Math.pow(r, -0.1332047592)
    r = Math.max(0, Math.min(255, r))
  }

  // Green
  if (temp <= 66) {
    g = temp
    g = 99.4708025861 * Math.log(g) - 161.1195681661
    g = Math.max(0, Math.min(255, g))
  } else {
    g = temp - 60
    g = 288.1221695283 * Math.pow(g, -0.0755148492)
    g = Math.max(0, Math.min(255, g))
  }

  // Blue
  if (temp >= 66) {
    b = 255
  } else if (temp <= 19) {
    b = 0
  } else {
    b = temp - 10
    b = 138.5177312231 * Math.log(b) - 305.0447927307
    b = Math.max(0, Math.min(255, b))
  }

  // Apply Green/Magenta tint offset (-50 to +50)
  // Positive tint adds green, negative tint adds magenta (decreases green, adds red/blue)
  if (tint !== 0) {
    const tintFactor = tint / 100
    g = Math.max(0, Math.min(255, g * (1 + tintFactor * 0.35)))
    if (tintFactor < 0) {
      r = Math.max(0, Math.min(255, r * (1 - tintFactor * 0.15)))
      b = Math.max(0, Math.min(255, b * (1 - tintFactor * 0.15)))
    }
  }

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  }
}

export function hslToRgb(h: number, s: number, l: number): RgbColor {
  const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100)
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l / 100 - c / 2

  let rPrime = 0
  let gPrime = 0
  let bPrime = 0

  if (h >= 0 && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0
  } else if (h >= 60 && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0
  } else if (h >= 120 && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x
  } else if (h >= 180 && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c
  } else if (h >= 240 && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c
  } else {
    rPrime = c; gPrime = 0; bPrime = x
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  }
}

export function formatRgbCss(rgb: RgbColor, brightnessMultiplier: number = 1): string {
  const r = Math.round(rgb.r * brightnessMultiplier)
  const g = Math.round(rgb.g * brightnessMultiplier)
  const b = Math.round(rgb.b * brightnessMultiplier)
  return `rgb(${r}, ${g}, ${b})`
}

export function rgbToHex(rgb: RgbColor): string {
  const hex = (c: number) => {
    const s = Math.max(0, Math.min(255, Math.round(c))).toString(16)
    return s.length === 1 ? '0' + s : s
  }
  return `#${hex(rgb.r)}${hex(rgb.g)}${hex(rgb.b)}`
}
