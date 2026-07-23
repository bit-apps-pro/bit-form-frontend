import { CategoryData, FiledCategory, ToolConfig } from "./toolbar.types"

export interface FieldTabsProps {
  allTools: ToolConfig[]
  categorizedTools: CategoryData
  recentTools: ToolConfig[]
  hasRecentFields: boolean
  onFieldSelect: (tool: ToolConfig) => void
  setNewData: (data: {
    fieldData: Record<string, any>
    fieldSize: {
      h: number
      w: number
      minW?: number
      x?: number
      i: string
    }
  }) => void,
  activeTab: TabKey
  setActiveTab: (tab: TabKey) => void
}

export type TabKey = FiledCategory['category']
