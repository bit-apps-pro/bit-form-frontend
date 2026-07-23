import { useMemo } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import TabsView from '../Utilities/TabsView'
import { fieldSettingsRegistry } from './FieldSettingsRegistry'


import { useAtomValue } from 'jotai'
import { $builderRightPanelScroll } from '../../../GlobalStates/GlobalStates'
import { FieldSettingsRenderer } from './FieldSettingsRenderer'
import BasicConditionalLogic from './Workflows/BasicConditionalLogic'



/**
 * Basic tab content - Common settings for all field types
 */
const BasicTabContent = ({ fieldKey, fieldType }: { fieldKey: string, fieldType: string }) => (
  <FieldSettingsRenderer tab="basic" fieldKey={fieldKey} fieldType={fieldType} />
)

/**
 * Advanced tab content - Field type specific settings
 */
const AdvancedTabContent = ({ fieldKey, fieldType }: { fieldKey: string, fieldType: string }) => (
  <FieldSettingsRenderer tab="advanced" fieldKey={fieldKey} fieldType={fieldType} />
)

/**
 * Get field settings tabs configuration
 * ✅ Now a React Component (not a function) so hooks work correctly
 */
export function FieldSettingsTabs({ fieldKey, fieldType }: { fieldKey: string, fieldType: string }): JSX.Element | null {
  const { css } = useFela()
  const { formID } = useParams<Record<string, string>>()
  const scrollTo = useAtomValue($builderRightPanelScroll)

  const config = fieldSettingsRegistry[fieldType]
  const showConditionalLogic = config?.conditional !== false

  const fieldSettingsTabs = useMemo(
    () => [
      {
        id: 'basic',
        label: __('Basic'),
        content: <BasicTabContent fieldKey={fieldKey} fieldType={fieldType} />,
      },
      {
        id: 'advanced',
        label: __('Advanced'),
        content: <AdvancedTabContent fieldKey={fieldKey} fieldType={fieldType} />,
      },
      ...(showConditionalLogic ? [{
        id: 'conditional-logic',
        label: __('Conditional Logic'),
        content: <BasicConditionalLogic fieldKey={fieldKey} formID={formID} />,
      }] : []),
    ],
    [fieldKey, fieldType, formID, showConditionalLogic]
  )

  return (
    <TabsView
      tabs={fieldSettingsTabs}
      defaultTab="basic"
      // variant="rounded-bottom-tertiary"
      variant='tertiary-segment'
      classNames={css({ mx: 10 })}
      fixedHeader={true}
      fixedHeaderTop={65}
      showHeaderShadow={scrollTo}
    />
  )
}