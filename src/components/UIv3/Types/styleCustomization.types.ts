// Style-related types
export interface StyleState {
  fields?: Record<string, FieldStyle>
  font?: FontConfig
  [key: string]: any
}

export interface FieldStyle {
  classes: Record<string, CSSProperties>
  fieldType: string
  [key: string]: any
}

export interface CSSProperties {
  [key: string]: string | undefined
}

export interface FontConfig {
  fontWeightVariants: number[]
  fontStyle: string[]
  fontType?: 'Google' | 'Custom'
  [key: string]: any
}

// Field-related types
export interface FieldObject {
  typ: string
  prefixIcn?: boolean
  suffixIcn?: boolean
  [key: string]: any
}

// Component Props
export interface IndividualCustomStyleProps {
  elementKey: string
  fldKey: string
}

// Handler types
export interface SpacingHandlerParams {
  value: number
  unit: string
}

export type SpacingHandler = (
  params: SpacingHandlerParams,
  prop: string,
  prevUnit: string,
  state?: string
) => void

export type FontPropertyUpdateHandler = (
  property: string,
  value: string,
  state?: string
) => void

export type PreDefinedValueHandler = (
  value: string,
  property: string,
  state?: string
) => void

export type DelPropertyHandler = (property: string, state?: string) => void

export type DelMultiPropertyHandler = (
  propertyPaths: string[],
  state?: string
) => void

export type ClearHandler = (property: string, state?: string) => void

export type SetAlignHandler = (alignValue: string) => void

// State options
export interface StateOption {
  label: string
  icn: string
  show: string[]
  tip: string
}

// Editor Config types
export interface EditorConfigState {
  states?: string[]
  properties: Record<string, any>
}

export interface EditorConfig {
  [fieldType: string]: {
    [elementKey: string]: EditorConfigState
  }
}

// Title mapping type
export type ElementTitleMap = Record<string, string>

// Object Paths type for property controls
export interface ObjectPaths {
  object: string
  paths: Record<string, string>
}

// CSS Property Menu Context
export interface CssPropertyMenuContext {
  fldTitle: string
  fldKey: string
  elementKey: string
  existCssPropsObj: CSSProperties
  objectPaths: ObjectPaths
  themeColors: any
  themeVars: any
  styles: StyleState
  state?: string

  // Handlers
  delPropertyHandler: DelPropertyHandler
  delMultiPropertyHandler: DelMultiPropertyHandler
  clearHandler: ClearHandler
  spacingHandler: SpacingHandler
  fontPropertyUpdateHandler: FontPropertyUpdateHandler
  preDefinedValueHandler: PreDefinedValueHandler
  setAlign: SetAlignHandler
  fldZIndexHandler: (value: number) => void

  // Values
  getStyleValueAndUnit: (prop: string) => [number, string]
  txtAlignValue: string
  fldZIndex: number
  fontweightVariants: Record<string, string>
  fontStyleVariants: Record<string, string>
}

// Size Control types
export interface SizeControlParams {
  unit: string
  value: number
}

export interface SizeControlUnitParams {
  unitKey: string
  unitValue: number
}

// Property Control Component Props
export interface BasePropertyControlProps {
  title: string
  subtitle: string
  value: any
  objectPaths: ObjectPaths
  delPropertyHandler: () => void
  clearHandler?: () => void
  existCssPropsObj?: CSSProperties
  themeColors?: any
  themeVars?: any
  styles?: StyleState
  fldKey?: string
}

export interface DimensionPropertyProps extends BasePropertyControlProps {
  sizeValue: number
  sizeUnit: string
  spacingHandler: SpacingHandler
  propertyKey: string
  state?: string
}

export interface FontPropertyProps extends BasePropertyControlProps {
  fontPropertyUpdateHandler: FontPropertyUpdateHandler
  fontVariants: Record<string, string>
  state?: string
  propertyKey: string
  showWarning?: boolean
  warningMessage?: string
}

export interface ColorPropertyProps extends BasePropertyControlProps {
  propertyKey: string
}

export interface ShadowPropertyProps extends BasePropertyControlProps {
  propertyKey: string
  defaultValue?: string
  propertyArray?: string[]
}

// Pseudo state types
export type PseudoState = 'hover' | 'focus' | 'active' | 'disabled' | 'checked' | 'selected' | 'before' | 'after' | 'read-only'

// Available CSS properties type
export type CSSPropertyName =
  | 'background'
  | 'background-color'
  | 'border'
  | 'border-image'
  | 'color'
  | 'accent-color'
  | '--bfv-upper-track-clr'
  | '--bfv-lower-track-clr'
  | 'line-height'
  | 'word-spacing'
  | 'letter-spacing'
  | 'margin'
  | 'padding'
  | 'size'
  | 'width'
  | 'max-width'
  | 'min-width'
  | 'height'
  | 'max-height'
  | 'min-height'
  | 'text-align'
  | 'text-decoration'
  | 'text-shadow'
  | 'box-shadow'
  | 'transition'
  | 'filter'
  | 'backdrop-filter'
  | 'font-size'
  | 'font-weight'
  | 'font-style'
  | 'white-space'
  | 'word-wrap'
  | 'opacity'
  | 'z-index'
  | 'transform'
  | 'color(filter)'