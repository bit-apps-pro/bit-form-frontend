// SearchResults.tsx
import { memo, useCallback } from 'react'
import { useFela } from 'react-fela'
import { IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import Cooltip from '../../../Utilities/Cooltip'
import ProBadge from '../../../Utilities/ProBadge'

import Tools from '../../../LeftBars/Tools'
import { ToolConfig } from '../../LeftBars/toolsConfig'


interface SearchResultsProps {
  searchTerm: string
  searchResults: ToolConfig[]
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
  }) => void
}

function SearchResults({ searchTerm, searchResults, onFieldSelect, setNewData }: SearchResultsProps) {
  const { css } = useFela()

  // Handle field selection
  const handleFieldClick = useCallback((tool: ToolConfig) => {
    onFieldSelect(tool)
  }, [onFieldSelect])

  // Highlight search term in text
  const highlightSearchTerm = useCallback((text: string, term: string): string => {
    if (!term.trim()) return text

    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark style="background-color: #fef3c7; padding: 1px 2px; border-radius: 2px;">$1</mark>')
  }, [])

  const renderFieldItem = useCallback((tool: ToolConfig) => {
    const highlightedName = highlightSearchTerm(tool.name, searchTerm)

    return (
      <Tools
        key={`search-${tool.name}`}
        setNewData={setNewData}
        value={{ fieldData: tool.elm, fieldSize: tool.pos }}
        title={tool.name}
      >
        <div
          className="search-results__item"
          onClick={() => handleFieldClick(tool)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleFieldClick(tool)
            }
          }}
        >
          <div className="search-results__icon">
            {tool.icn}
          </div>

          <div className="search-results__info">
            <div
              className="search-results__name"
              dangerouslySetInnerHTML={{ __html: highlightedName }}
            />
            <div className="search-results__meta">
              <span className="search-results__category">
                {tool.category}
              </span>
            </div>
          </div>

          <div className="search-results__badges">
            {tool.tip && (
              <Cooltip icnSize={14}>
                <div className="txt-body">{tool.tip}</div>
              </Cooltip>
            )}

            {!IS_PRO && tool.pro && (
              <ProBadge width="18" />
            )}

            {(IS_PRO || !tool.pro) && tool.new && (
              <ProBadge width="18" text="New" isNewBadge />
            )}
          </div>
        </div>
      </Tools>
    )
  }, [searchTerm, setNewData, handleFieldClick, highlightSearchTerm])

  // Empty state
  if (searchResults.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results__empty-state">
          <p className="search-results__empty-description">
            {`${__('No fields found by your search keywords:')} "${searchTerm}"`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results">
      {/* Results Header */}
      <div className="search-results__header">
        <p className="search-results__subtitle">
          {`${searchResults.length} ${__('fields found for')} "${searchTerm}"`}
        </p>
      </div>

      {/* Results Grid */}
      <div className="search-results__grid">
        {searchResults.map(renderFieldItem)}
      </div>
    </div>
  )
}

export default memo(SearchResults)