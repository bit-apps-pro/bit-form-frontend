import { create } from 'mutative'
import { useCallback, useEffect, useState } from 'react'
import { ToolConfig } from '../../Types/toolbar.types'


const RECENT_FIELDS_KEY = 'bitform_recent_fields'
const MAX_RECENT_ITEMS = 10

interface RecentField {
  name: string
  category: string
  timestamp: number
}

export const useRecentFields = () => {
  const [recentFields, setRecentFields] = useState<RecentField[]>([])

  // Load recent fields from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_FIELDS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as RecentField[]
        setRecentFields(parsed)
      }
    } catch (error) {
      console.warn('Failed to load recent fields from localStorage:', error)
    }
  }, [])

  // Save recent fields to localStorage
  const saveToStorage = useCallback((fields: RecentField[]) => {
    try {
      localStorage.setItem(RECENT_FIELDS_KEY, JSON.stringify(fields))
    } catch (error) {
      console.warn('Failed to save recent fields to localStorage:', error)
    }
  }, [])

  // Add a field to recent history
  const addRecentField = useCallback((tool: ToolConfig) => {
    setRecentFields(prevFields => create(prevFields, draft => {
      // Remove existing entry if it exists
      const filteredFields = prevFields.filter(field => field.name !== tool.name)

      // Add new entry at the beginning
      const newField: RecentField = {
        name: tool.name,
        category: tool.category,
        timestamp: Date.now()
      }

      draft = [newField, ...filteredFields].slice(0, MAX_RECENT_ITEMS)
      saveToStorage(draft)

      return draft
    }))
  }, [saveToStorage, recentFields])

  // Get recent field tools from the full tools list
  const getRecentTools = useCallback((allTools: ToolConfig[]): ToolConfig[] => {
    const toolsMap = new Map(allTools.map(tool => [tool.name, tool]))

    return recentFields
      .map(recentField => toolsMap.get(recentField.name))
      .filter((tool): tool is ToolConfig => tool !== undefined)
  }, [recentFields])

  // Clear recent fields
  const clearRecentFields = useCallback(() => {
    setRecentFields([])
    localStorage.removeItem(RECENT_FIELDS_KEY)
  }, [])

  return {
    recentFields,
    addRecentField,
    getRecentTools,
    clearRecentFields,
    hasRecentFields: recentFields.length > 0,
  }
}