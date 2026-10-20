export type LightMode = 'cct' | 'hsi'

export type AreaShape = 
  | 'fullscreen'
  | 'box'
  | 'octa'
  | 'stripleft'
  | 'stripright'
  | 'ring'
  | 'bicolor'

export interface SoftboxSettings {
  mode: LightMode
  brightness: number       // 1 - 100%
  kelvin: number           // 1800 - 10000 K
  tint: number             // -50 to +50
  hue: number              // 0 - 360 deg
  saturation: number       // 0 - 100 %
  shape: AreaShape
  boxWidth: number         // 10 - 100 %
  boxHeight: number        // 10 - 100 %
  circleDiameter: number   // 10 - 100 %
  feather: number          // 0 - 100 %
  ringInner: number        // 20 - 80 %
  // Bi-Color split mode specific
  splitRatio: number       // 20 - 80 % (default 50)
  bicolorLeft: {
    kelvin: number
    brightness: number
  }
  bicolorRight: {
    kelvin: number
    brightness: number
  }
}

export interface LightingPreset {
  id: string
  name: string
  category: 'cinema' | 'portrait' | 'streaming' | 'creative'
  description: string
  settings: Partial<SoftboxSettings>
}
