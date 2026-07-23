import { useCallback, useState } from 'react'

interface BuilderConfig {
  leftPanelCollapsed: boolean
  rightPanelCollapsed: boolean
  leftPanelWidth: number
  leftPanelWidthOnStyleMode?: number
  rightPanelWidth: number
}

interface CalculateGridWidthParams {
  referenceWidth: number
  leftWidth: number
  rightWidth: number
  splitBarWidth?: number
  gridPadding?: number
  styleMode?: boolean
}


const CONFIG_KEY = 'bit-form-config'
const COLLAPSED_WIDTH = 0
const SPLIT_BAR_WIDTH = 8
const GRID_PADDING = 28
const DEFAULT_LEFT_PANEL_WIDTH = 450
const DEFAULT_LEFT_PANEL_WIDTH_ON_STYLE_MODE = 225
const DEFAULT_RIGHT_PANEL_WIDTH = 400

const DEFAULT_CONFIG: BuilderConfig = {
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  leftPanelWidth: DEFAULT_LEFT_PANEL_WIDTH,
  leftPanelWidthOnStyleMode: DEFAULT_LEFT_PANEL_WIDTH_ON_STYLE_MODE,
  rightPanelWidth: DEFAULT_RIGHT_PANEL_WIDTH,
}


export const useBuilderConfig = () => {
  const [config, setConfig] = useState<BuilderConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Migrate old format if needed
        if (parsed.toolbarOff !== undefined) {
          parsed.leftPanelCollapsed = parsed.toolbarOff
        }
        return { ...DEFAULT_CONFIG, ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load builder config:', error)
    }
    return DEFAULT_CONFIG
  }, [])

  const updateConfig = useCallback((updates: Partial<BuilderConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates }
      try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig))
      } catch (error) {
        console.warn('Failed to save builder config:', error)
      }
      return newConfig
    })
  }, [])

  const toggleLeftPanel = useCallback(() => {
    updateConfig({
      leftPanelCollapsed: !config.leftPanelCollapsed,
    })
  }, [config.leftPanelCollapsed, updateConfig])

  const toggleRightPanel = useCallback(() => {
    updateConfig({ rightPanelCollapsed: !config.rightPanelCollapsed })
  }, [config.rightPanelCollapsed, updateConfig])

  const setLeftPanelWidth = useCallback((width: number, styleMode: boolean = false) => {
    if (styleMode) {
      updateConfig({ leftPanelWidthOnStyleMode: width })
    } else {
      updateConfig({ leftPanelWidth: width })
    }
  }, [updateConfig])

  const setRightPanelWidth = useCallback((width: number) => {
    updateConfig({ rightPanelWidth: width })
  }, [updateConfig])

  const getLeftPanelWidth = useCallback((styleMode: boolean = false, referenceWidth: number = window.innerWidth) => {
    if (config.leftPanelCollapsed) return COLLAPSED_WIDTH
    if (styleMode && config.leftPanelWidthOnStyleMode !== undefined) {
      return config.leftPanelWidthOnStyleMode
    }
    if (referenceWidth < 1200) {
      return config.leftPanelWidthOnStyleMode || DEFAULT_LEFT_PANEL_WIDTH_ON_STYLE_MODE
    }
    return config.leftPanelWidth
  }, [config.leftPanelCollapsed, config.leftPanelWidth])

  const getRightPanelWidth = useCallback((styleMode: boolean = false, referenceWidth: number = window.innerWidth) => {
    if (!styleMode) return 0
    return config.rightPanelCollapsed ? COLLAPSED_WIDTH : config.rightPanelWidth
  }, [config.rightPanelCollapsed, config.rightPanelWidth])

  // Calculate grid width based on reference width
  const calculateGridWidth = useCallback(({
    referenceWidth,
    leftWidth,
    rightWidth,
    splitBarWidth = SPLIT_BAR_WIDTH,
    gridPadding = GRID_PADDING,
    styleMode = false
  }: CalculateGridWidthParams) => {
    const splitBars = splitBarWidth * 2
    const padding = gridPadding * 2

    const gridWidth = referenceWidth - leftWidth - rightWidth - splitBars - padding

    return gridWidth
  }, [])

  // Get calculated grid width with current config
  const getCalculatedGridWidth = useCallback((
    referenceWidth: number = window.innerWidth,
    styleMode: boolean = false
  ) => {
    return calculateGridWidth({
      referenceWidth,
      leftWidth: getLeftPanelWidth(styleMode, referenceWidth),
      rightWidth: getRightPanelWidth(styleMode, referenceWidth),
      styleMode,
    })
  }, [calculateGridWidth, getLeftPanelWidth, getRightPanelWidth])

  const getCenterWidth = useCallback((referenceWidth: number = window.innerWidth, styleMode: boolean = false) => {
    const leftWidth = getLeftPanelWidth(styleMode, referenceWidth)
    const rightWidth = getRightPanelWidth(styleMode, referenceWidth)
    return referenceWidth - leftWidth - rightWidth;
  }, [getCalculatedGridWidth])

  return {
    config,
    GRID_PADDING,
    updateConfig,
    toggleLeftPanel,
    toggleRightPanel,
    setLeftPanelWidth,
    setRightPanelWidth,
    getLeftPanelWidth,
    getRightPanelWidth,
    calculateGridWidth,
    getCenterWidth,
    getCalculatedGridWidth,
    isLeftCollapsed: config.leftPanelCollapsed,
    isRightCollapsed: config.rightPanelCollapsed,
  }
}
