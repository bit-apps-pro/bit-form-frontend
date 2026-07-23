// FieldTabs.tsx
import { memo, useCallback, useMemo } from 'react'
import { useFela } from 'react-fela'
import { IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import Tools from '../../../LeftBars/Tools'
import Cooltip from '../../../Utilities/Cooltip'
import ProBadge from '../../../Utilities/ProBadge'
import { FieldTabsProps, TabKey } from '../../Types/fieldPicker.types'
import { Tab } from '../../Types/TabsView.types'
import { fieldCategories, ToolConfig } from '../../Types/toolbar.types'
import TabsView from '../TabsView'


function FieldTabs({
  allTools,
  categorizedTools, recentTools, hasRecentFields, onFieldSelect, setNewData, activeTab, setActiveTab }: FieldTabsProps) {
  const { css } = useFela()


  // Handle field selection
  const handleFieldClick = useCallback((tool: ToolConfig) => {
    onFieldSelect(tool)
  }, [onFieldSelect])

  // Render field item
  const renderFieldItem = useCallback((tool: ToolConfig) => (
    <Tools
      key={`${activeTab}-${tool.name}`}
      setNewData={setNewData}
      value={{ fieldData: tool.elm, fieldSize: tool.pos }}
      title={tool.name}
    >
      <div
        className="field-tabs__item"
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
        <div className="field-tabs__icon">
          {tool.icn}
        </div>

        <div className="field-tabs__info">
          <div className="field-tabs__name">
            {tool.name}
          </div>
        </div>

        <div className="field-tabs__badges">
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
  ), [css, activeTab, setNewData, handleFieldClick])

  const handleTabChange = useCallback((tabId: TabKey) => {
    if (setActiveTab !== undefined) setActiveTab(tabId)
  }, [])


  const getTabContent = useCallback((tools: ToolConfig[]) => {

    return (
      <div className="field-tabs__content">
        {tools.length === 0 ? (
          <div className="field-tabs__empty-state">
            <p>{__('No fields available in this category')}</p>
          </div>
        ) : (
          <div className="field-tabs__grid">
            {tools.map(renderFieldItem)}
          </div>
        )}
      </div>


      // </Scrollbars>
    )
  }, [renderFieldItem])


  // Calculate tabs with counts
  const tabs = useMemo((): Tab[] => {
    return [
      // Recent tab - only show if there are recent tools
      ...(hasRecentFields ? [{
        id: 'recent',
        label: `${__('Recent')}(${recentTools.length})`,
        content: getTabContent(recentTools)
      }] : []),
      // Category tabs
      ...fieldCategories.map(cat => ({
        id: cat.category,
        label: `${__(cat.title.replace(' Fields', ''))}(${categorizedTools[cat.category].length})`,
        content: getTabContent(categorizedTools[cat.category])
      })),
    ]
  }, [categorizedTools, getTabContent, hasRecentFields, recentTools])

  return (<TabsView
    defaultTab={activeTab}
    onChange={handleTabChange}
    tabs={tabs}
    classNames='bf-fpmt' />)

}

export default memo(FieldTabs)