/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-useless-escape */
/* eslint-disable object-property-newline */
/* eslint-disable no-undef */

import { useAtomValue } from 'jotai'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFela } from 'react-fela'
// import { $globalMessages } from '../../../../../GlobalStates/AppSettingsStates'
import { $globalMessages } from '../../../GlobalStates/AppSettingsStates'
import AtoZSortIcn from '../../../Icons/AtoZSortIcn'
import SearchIcon from '../../../Icons/SearchIcon'
import { IS_PRO } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import ut from '../../../styles/2.utilities'
import SimpleAccordion from '../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
// import Tools from '../../../LeftBars/Tools'
import DragIcn from '../../../Icons/DragIcn'
import Cooltip from '../../Utilities/Cooltip'
import ProBadge from '../../Utilities/ProBadge'
import RenderHtml from '../../Utilities/RenderHtml'
import { CategoryData, fieldCategories, ScrollEvent, SearchEvent, ToolbarProps, ToolConfig } from '../Types/toolbar.types'
import { getInitialFieldCategoryData } from '../Utilities/FormBuilderHelper'
import toolbarStyles from './Toolbar.styles'
import Tools from './Tools'
import { getToolsList } from './toolsConfig'

// // Interfaces
// interface ToolbarProps {
//   setNewData: (data: {
//     fieldData: Record<string, any>
//     fieldSize: {
//       h: number
//       w: number
//       minW?: number
//       x?: number
//       i: string
//     }
//   }) => void
//   // width?: number
// }

// interface CategoryData {
//   basic: ToolConfig[]
//   advanced: ToolConfig[]
//   payment: ToolConfig[]
// }

// interface SearchEvent {
//   target: {
//     value: string
//   }
// }

// interface ScrollEvent {
//   target: {
//     scrollTop: number
//   }
// }


function Toolbar({ setNewData }: ToolbarProps) {
  const { css } = useFela()
  const globalMessages = useAtomValue($globalMessages)

  // State management
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [focusSearch, setFocusSearch] = useState<boolean>(false)
  const [isSorted, setIsSorted] = useState<boolean>(false)
  const [isScroll, setIsScroll] = useState<boolean>(false)

  // Refs
  const searchInput = useRef<HTMLInputElement>(null)

  // Memoized data
  const toolsList = useMemo(() => getToolsList(globalMessages), [globalMessages])

  const initialFieldCategoryData = getInitialFieldCategoryData()

  // Categorized and sorted tools with search filtering
  const categorizedTools = useMemo((): CategoryData => {
    let tools = toolsList

    // Apply search filter first
    if (searchTerm) {
      tools = toolsList.filter(
        field =>
          field.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
          field.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting if needed
    if (isSorted) {
      tools = [...tools].sort((a, b) => a.name.localeCompare(b.name))
    }

    // Group by category
    return tools.reduce(
      (acc, tool) => {
        acc[tool.category].push(tool)
        return acc
      },
      initialFieldCategoryData
    )
  }, [toolsList, searchTerm, isSorted])

  // Search functionality
  const searchHandler = useCallback((e: SearchEvent) => {
    const value = e.target.value.trim()
    setSearchTerm(value)
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    if (searchInput.current) {
      searchInput.current.value = ''
    }
    setSearchTerm('')
    setFocusSearch(false)
  }, [])

  // Sort toggle
  const toggleSorting = useCallback(() => {
    setIsSorted(prev => !prev)
  }, [])

  // Scroll handler
  const onScrollHandler = useCallback((e: ScrollEvent) => {
    const { scrollTop } = e.target
    setIsScroll(scrollTop > 50)
  }, [])

  // Focus/blur handlers
  const handleSearchFocus = useCallback(() => setFocusSearch(true), [])
  const handleSearchBlur = useCallback(() => {
    setTimeout(() => setFocusSearch(false), 200)
  }, [])

  // Keyboard shortcut setup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        searchInput.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Custom scrollbar thumb
  const renderThumbVertical = ({ style, ...props }: any) => {
    const thumbStyle = {
      ...style,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
    }
    return <div style={thumbStyle} {...props} />
  }

  // Tool item renderer
  const renderToolItem = useCallback((tool: ToolConfig) => (
    <Tools
      key={tool.name}
      setNewData={setNewData}
      value={{ fieldData: tool.elm, fieldSize: tool.pos }}
      title={tool.name}
    >
      <div className={css(toolbarStyles.toolWrapper)} title={tool.name}>
        <span className={`${css(toolbarStyles.tool_icn, ut.mr1)} tool-icn`}>
          {tool.icn}
        </span>
        <span className={`${css(toolbarStyles.tool_label)} tool-label`}>{tool.name}</span>

        {tool.tip && (
          <Cooltip className="hover-tip" icnSize={15}>
            <div className="txt-body">{tool.tip}</div>
          </Cooltip>
        )}

        {!IS_PRO && tool.pro && (
          <ProBadge width="18">
            <div className="txt-body">
              <RenderHtml html={tool.pro} />
            </div>
          </ProBadge>
        )}

        {(IS_PRO || !tool.pro) && tool.new && (
          <ProBadge width="18" text="New" isNewBadge />
        )}
        <DragIcn size={13} classNames={`${css(toolbarStyles.dragIcon)} drag-icon`} />
      </div>
    </Tools>
  ), [setNewData, css])

  // Category renderer with search-aware logic
  const renderCategory = useCallback((
    categoryKey: keyof CategoryData,
    title: string,
    tools: ToolConfig[]
  ) => {
    // Don't render category if no tools match
    if (!tools.length) return null

    const categoryCount = tools.length
    const displayTitle = searchTerm
      ? `${title} (${categoryCount} ${__('found')})`
      : `${title} (${categoryCount})`

    return (
      <SimpleAccordion
        key={categoryKey}
        id={`${categoryKey}-fields`}
        title={displayTitle}
        className={css(toolbarStyles.categorySection)}
        open
      >
        <div className={`${css(toolbarStyles.twoColumnGrid)} bf-tool-grid`}>
          {tools.map(renderToolItem)}
        </div>
      </SimpleAccordion>
    )
  }, [css, renderToolItem, searchTerm])

  return (
    <div className={css(toolbarStyles.toolbarWrapper)} data-testid="toolbar-wrapper">
      {/* Search and Controls */}
      <div className={css(ut.flxc, toolbarStyles.searchSection, isScroll ? toolbarStyles.searchBar : {})}>
        <div className={css(toolbarStyles.fields_search)} style={{ width: focusSearch ? '100%' : 'calc(100% - 35px)' }}>
          <input
            ref={searchInput}
            title="Search Field"
            aria-label="Search Field"
            autoComplete="off"
            data-testid="tlbr-srch-inp"
            placeholder={__('Search fields..')}
            type="search"
            name="searchField"
            onChange={searchHandler}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className={css(toolbarStyles.search_field)}
          />

          {searchTerm && (
            <span
              title="clear"
              aria-label="Clear"
              className={css(toolbarStyles.clear_icn)}
              role="button"
              tabIndex={0}
              onClick={clearSearch}
              onKeyDown={(e) => e.key === 'Enter' && clearSearch()}
            />
          )}

          <span title="search" className={css(toolbarStyles.search_icn)}>
            <SearchIcon size="20" />
          </span>

          {!searchTerm && (
            <div
              className={`${css(toolbarStyles.shortcut)} shortcut`}
              title='Press "Ctrl+/" to focus search'
            >
              Ctrl+/
            </div>
          )}
        </div>

        {!focusSearch && (
          <button
            title="Sort by ascending order"
            data-testid="tlbr-sort-btn"
            className={`${css(toolbarStyles.sort_btn)} ${isSorted ? 'active' : ''}`}
            type="button"
            onClick={toggleSorting}
            aria-label="Sort Fields"
          >
            <AtoZSortIcn size={20} />
          </button>
        )}
      </div>

      {/* Content Area */}
      {/* <Scrollbars
        onScroll={onScrollHandler}
        style={{ maxWidth: 800 }}
        renderThumbVertical={renderThumbVertical}
      > */}
      <div className={css(toolbarStyles.categoriesWrapper)}>
        {/* Show search indicator when searching */}
        {searchTerm && (
          <div className={css({ mb: 10, fs: 14, fw: 500, cr: '#666', px: 5 })}>
            {__('Search results for:')} {searchTerm}
          </div>
        )}

        {/* Render categories */}
        {fieldCategories.map(cat => renderCategory(cat.category, __(cat.title), categorizedTools[cat.category]))}
        {/* {renderCategory('basic', __('Basic Fields'), categorizedTools.basic)}
        {renderCategory('advanced', __('Advanced Fields'), categorizedTools.advanced)}
        {renderCategory('payment', __('Payment Fields'), categorizedTools.payment)} */}

        {/* Empty state when search has no results */}
        {searchTerm && fieldCategories.every(cat => categorizedTools[cat.category].length === 0) && (
          <div className={css(toolbarStyles.emptyStateWrapper)}>
            <div className={css(toolbarStyles.emptyIcon)}>🔍</div>
            <h3 className={css(toolbarStyles.emptyStateTitle)}>
              {__('No fields found')}
            </h3>
            <div className={css(toolbarStyles.emptyStateDescription)}>
              {__("We couldn't find any fields matching")} <strong>{` "${searchTerm}"`}</strong>
              <div className={css({ fs: 12, mt: 5, cr: '#999' })}>
                {__('Try searching with different keywords')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      {/* <div className="mb-50" /> */}
      {/* </Scrollbars> */}
    </div>
  )
}

export default memo(Toolbar)
export type { ToolbarProps, ToolConfig }
