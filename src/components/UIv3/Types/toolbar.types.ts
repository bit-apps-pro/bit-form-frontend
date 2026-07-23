import { ReactNode } from 'react'

// export interface ToolItem {
//   name: string
//   keywords: string
//   icn: ReactNode
//   pos: { h: number; w: number; i: string; minW?: number; x?: number }
//   new?: boolean
//   pro?: string
//   elm: any
//   tip?: string
//   category?: 'basic' | 'advanced' | 'payment' | 'others'
// }

// export interface ToolCategory {
//   id: 'basic' | 'advanced' | 'payment' | 'others'
//   title: string
//   tools: ToolItem[]
// }



// Interfaces
export interface FiledCategory {
  category: 'basic' | 'advanced' | 'payment' | 'captcha' | 'element' | 'others' | 'option'
  title: string
}

export const fieldCategories: FiledCategory[] = [
  { category: 'basic', title: 'Basic Fields' },
  { category: 'option', title: 'Option/Choice Fields' },
  { category: 'advanced', title: 'Advanced Fields' },
  { category: 'payment', title: 'Payment Fields' },
  { category: 'captcha', title: 'Spam Protection/Captcha' },
  { category: 'element', title: 'Elements' },
  // { category: 'others', title: 'Other Fields and Elements' },
] as const


export interface ToolConfig {
  name: string
  keywords: string
  icn: ReactNode
  pos: {
    h: number
    w: number
    minW?: number
    x?: number
    i: string
  }
  new?: boolean
  pro?: string
  elm: Record<string, any>
  category: FiledCategory['category']
}

export interface GlobalMessages {
  err?: {
    [key: string]: {
      [key: string]: string
    }
  }
}
export interface ToolbarProps {
  setNewData: (data: {
    fieldData: Record<string, any>
    fieldSize: {
      h: number
      w: number
      minW?: number
      x?: number
      i: string
    }
  }) => void
  // width?: number
}

// Create a type from FiledCategory's category values
export interface CategoryData {
  [K in FiledCategory['category']]: ToolConfig[]
}

export interface SearchEvent {
  target: {
    value: string
  }
}

export interface ScrollEvent {
  target: {
    scrollTop: number
  }
}