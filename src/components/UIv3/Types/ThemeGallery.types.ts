export interface ThemeFont {
  fontType: string
  fontURL: string
  fontWeightVariants: string[]
  fontStyle: string[]
}

export interface ThemeColors {
  lightThemeColors: Record<string, string>
  darkThemeColors: Record<string, string>
}

export interface ThemeVars {
  lgLightThemeVars: Record<string, string>
  lgDarkThemeVars: Record<string, string>
  mdLightThemeVars: Record<string, string>
  mdDarkThemeVars: Record<string, string>
  smLightThemeVars: Record<string, string>
  smDarkThemeVars: Record<string, string>
}

export interface ThemeStyles {
  lgLightStyles: Record<string, any>
  lgDarkStyles: Record<string, any>
  mdLightStyles: Record<string, any>
  mdDarkStyles: Record<string, any>
  smLightStyles: Record<string, any>
  smDarkStyles: Record<string, any>
}

export interface Theme {
  id: string
  name: string
  slug: string
  type: 'builtin' | 'custom'
  basedOn?: string
  created_at?: number
  updated_at?: number
  thumbnail?: string
  img?: string
  is_default?: boolean
  font?: ThemeFont
  themeColors?: ThemeColors
  themeVars?: ThemeVars
  styles?: ThemeStyles
}

export interface CustomTheme extends Omit<Theme, 'type'> {
  type: 'custom'
}

export interface BuiltinTheme extends Omit<Theme, 'type'> {
  type: 'builtin'
}