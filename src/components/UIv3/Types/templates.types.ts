// Shared type definitions for Email / PDF template components

export interface FormField {
  key: string
  name: string
  type: string
  typ: string
  [key: string]: any
}

export interface MailRoute {
  to: string
  field: string
  operator: string
  value: string
}

export interface MailTemplateConfig {
  to?: string[]
  cc?: string[]
  bcc?: string[]
  from?: string
  from_name?: string
  replyto?: string[]
  attachment?: string[]
  mediaAttachment?: string[]
  pdfId?: string
  pdfIds?: string[]
  routing?: MailRoute[]
  [key: string]: any
}

export interface MailTemplate {
  id?: number | string
  clRef?: string
  title: string
  sub: string
  body: string
  status?: number
  updateTem?: number
  config?: MailTemplateConfig
  [key: string]: any
}

export interface PdfTemplateSetting {
  direction?: string
  font?: { name: string; fontFamily: string }
  fontColor?: string
  fontFamily?: string
  fontSize?: number | string
  orientation?: string
  paperSize?: string
  pdfFileName?: string
  watermark?: {
    active?: string
    txt?: string
    img?: {
      src?: string
      width?: number | string
      height?: number | string
      posX?: number | string
      posY?: number | string
      imgBehind?: string
    }
    alpha?: number | string
  }
  password?: { static?: boolean; pass?: string }
  override?: boolean
  allowDownload?: string
  [key: string]: any
}

export interface PdfTemplateConfig {
  status?: number | string
  header?: string
  footer?: string
  [key: string]: any
}

export interface PdfTemplate {
  id?: number | string
  title: string
  body: string
  status?: number
  updateTem?: number
  setting: PdfTemplateSetting
  pdf_config: PdfTemplateConfig
  [key: string]: any
}

export interface WorkflowInfo {
  type?: string
  action?: string
  targetId?: string | number
  [key: string]: any
}

export interface Workflow {
  info?: WorkflowInfo
  status?: number
  [key: string]: any
}

export interface Bits {
  isPro?: boolean
  allFormSettings?: {
    pdf?: PdfTemplateSetting
    [key: string]: any
  }
  proInfo?: {
    installedVersion?: string
    [key: string]: any
  }
  [key: string]: any
}

export interface MailOption {
  label: string
  value: string
}

export interface MailOptionGroup {
  title: string
  type: string
  childs: MailOption[]
}
