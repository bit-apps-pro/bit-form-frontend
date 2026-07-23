// Type definitions for ElementConfiguration

export interface FieldObject {
  typ: string
  logo?: boolean
  title?: string
  titlePreIcn?: boolean
  titleSufIcn?: boolean
  subtitle?: string
  subTitlPreIcn?: boolean
  subTitlSufIcn?: boolean
  subTlePreIcn?: boolean
  subTleSufIcn?: boolean
  lbl?: string
  lblPreIcn?: boolean
  lblSufIcn?: boolean
  helperTxt?: string
  hlpPreIcn?: boolean
  hlpSufIcn?: boolean
  adminLbl?: string
  adminLblPreIcn?: boolean
  adminLblSufIcn?: boolean
  prefixIcn?: boolean
  suffixIcn?: boolean
  placeholder?: string
  btnTxt?: string
  btnPreIcn?: boolean
  btnSufIcn?: boolean
  addBtnPreIcn?: boolean
  addBtnSufIcn?: boolean
  removeBtnPreIcn?: boolean
  removeBtnSufIcn?: boolean
  addToEndBtnPreIcn?: boolean
  addToEndBtnSufIcn?: boolean
  valid?: {
    req?: boolean
    reqShow?: boolean
  }
  addToEndBtn?: {
    show?: boolean
  }
  [key: string]: any
}

export interface NavBtnProps {
  route: string
  subRoute?: string
  cssSelector?: string
  label: string
  offset?: string | number
  icn?: React.ReactNode
  highlightSelector?: string
  styleOverride?: boolean
}

export interface ElementProps {
  fldKey: string
  fieldObj: FieldObject
  styles: any
  selectedFieldKey: string | null
  styleHandler: (route: string) => void
}

export interface ElementConfig {
  condition: (field: FieldObject) => boolean
  route: string
  label: string
  hasIcons?: boolean
  preIconKey?: keyof FieldObject
  sufIconKey?: keyof FieldObject
  preIconRoute?: string
  sufIconRoute?: string
  offset?: string
}

export interface AccordionConfig extends ElementConfig {
  accordionOffset?: string
  childOffset?: string
}