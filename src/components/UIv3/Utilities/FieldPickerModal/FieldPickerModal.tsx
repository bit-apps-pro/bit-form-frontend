// FieldPickerModal.tsx
import { useAtom, useAtomValue } from 'jotai'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { $globalMessages } from '../../../../GlobalStates/AppSettingsStates'
import { $fieldPickerModal } from '../../../../GlobalStates/GlobalStates'
import SearchIcon from '../../../../Icons/SearchIcon'
import { __ } from '../../../../Utils/i18nwrap'

import { create } from 'mutative'
import { select } from '../../../../Utils/globalHelpers'
import { getToolsList, ToolConfig } from '../../LeftBars/toolsConfig'
import { TabKey } from '../../Types/fieldPicker.types'
import { CategoryData } from '../../Types/toolbar.types'
import { getInitialFieldCategoryData } from '../FormBuilderHelper'
import PositionedModal from '../PositionedModal'
import FieldTabs from './FieldTabs'
import SearchResults from './SearchResults'
import { useRecentFields } from './useRecentFields'

interface FieldPickerModalProps {
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
  onClose?: () => void
}

interface SearchEvent {
  target: {
    value: string
  }
}


function FieldPickerModal({ setNewData, onClose }: FieldPickerModalProps) {

  // State
  const [fieldPickerModal, setFieldPickerModal] = useAtom($fieldPickerModal)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const globalMessages = useAtomValue($globalMessages)
  const [activeTab, setActiveTab] = useState<TabKey>('basic')

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)

  const setIsModalOpen = (isOpen: boolean) => {
    setFieldPickerModal(prev => create(prev, draft => {
      draft.show = isOpen
      if (!isOpen) {
        draft.activeTriggerRef = null
        draft.position = { x: 0, y: 0 }
        draft.addAfterFieldKey = null
        draft.targetLayoutItem = null
        draft.parentFieldKey = null
        draft.newFieldPosition = null
      }
    }))
  }
  const gridWindow = select("#bit-grid-layout").contentWindow

  // Recent fields hook - use at parent level
  const { recentFields, addRecentField, getRecentTools, hasRecentFields } = useRecentFields()

  // Tools data
  const allTools = useMemo(() => getToolsList(globalMessages), [globalMessages])

  const initialFieldCategoryData = getInitialFieldCategoryData()

  // Categorized tools
  const categorizedTools = useMemo((): CategoryData => {
    return allTools.reduce(
      (acc, tool) => {
        acc[tool.category].push(tool)
        return acc
      },
      initialFieldCategoryData
    )
  }, [allTools])

  // Get recent tools at parent level
  const recentTools = useMemo(() => {
    return getRecentTools(allTools)
  }, [getRecentTools, allTools, recentFields])

  // Search results
  const searchResults = useMemo((): ToolConfig[] => {
    if (!searchTerm.trim()) return []

    const term = searchTerm.toLowerCase()
    return allTools.filter(
      tool =>
        tool.name.toLowerCase().includes(term) ||
        tool.keywords.toLowerCase().includes(term)
    )
  }, [allTools, searchTerm])

  // Handle search
  const handleSearch = useCallback((e: SearchEvent) => {
    setSearchTerm(e.target.value)
  }, [])

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    searchInputRef.current?.focus()
  }, [])

  // Handle field selection
  const handleFieldSelect = useCallback((tool: ToolConfig) => {
    // Add to recent fields
    addRecentField(tool)

    // Close modal if onClose is provided
    if (onClose) {
      onClose()
    }
  }, [addRecentField, onClose])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Ctrl+/ or Cmd+/
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      // Clear search on Escape
      if (e.key === 'Escape' && searchTerm) {
        e.preventDefault()
        handleClearSearch()
      }
    }

    gridWindow?.document.addEventListener('keydown', handleKeyDown)
    return () => gridWindow?.document.removeEventListener('keydown', handleKeyDown)
  }, [searchTerm, handleClearSearch])

  // Auto-focus search on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [fieldPickerModal])

  // Determine what to show
  const hasSearchTerm = searchTerm.trim().length > 0
  const hasSearchResults = searchResults.length > 0
  const showSearchResults = hasSearchTerm && hasSearchResults
  const showEmptySearch = hasSearchTerm && !hasSearchResults
  const showTabs = !hasSearchTerm

  return (
    <PositionedModal
      show={fieldPickerModal.show}
      setModal={setIsModalOpen}
      triggerRef={fieldPickerModal.activeTriggerRef || undefined}
      width={520}
      maxWidth="80vw"
      placement="auto"
      closeOnOutsideClick={true}
      referenceWindow={gridWindow}
    >
      <div className="field-picker-modal">

        {/* Search Section */}
        <div className="fpm__search-section">
          <div className="field-picker-modal__search-container">
            <div className="field-picker-modal__search-icon">
              <SearchIcon size="20" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              placeholder={__('Search fields...')}
              value={searchTerm}
              onChange={handleSearch}
              className="field-picker-modal__search-input"
            />

            {searchTerm ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="field-picker-modal__clear-button"
                title={__('Clear search')}
              >
                ×
              </button>
            ) : (
              <div className="field-picker-modal__shortcut">
                Ctrl+/
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="fpm__content">
          {/* Recent Fields - Only show when not searching */}

          {/* Search Results */}
          {showSearchResults && (
            <SearchResults
              searchTerm={searchTerm}
              searchResults={searchResults}
              onFieldSelect={handleFieldSelect}
              setNewData={setNewData}
            />
          )}

          {/* Empty Search State */}
          {showEmptySearch && (
            <SearchResults
              searchTerm={searchTerm}
              searchResults={[]}
              onFieldSelect={handleFieldSelect}
              setNewData={setNewData}
            />
          )}

          {/* Field Tabs - Show when not searching or when no search results */}
          {(showTabs || showEmptySearch) && (
            <FieldTabs
              allTools={allTools}
              categorizedTools={categorizedTools}
              recentTools={recentTools}
              hasRecentFields={hasRecentFields}
              onFieldSelect={handleFieldSelect}
              setNewData={setNewData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </PositionedModal>
  )
}

export default memo(FieldPickerModal)