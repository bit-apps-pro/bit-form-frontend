import { useAtomValue } from "jotai"
import { Fragment } from "react/jsx-runtime"
import { $fields } from "../../../GlobalStates/GlobalStates"
import FieldSettingsDivider from "../../CompSettings/CompSettingsUtils/FieldSettingsDivider"
import { getComponent } from "./FieldSettingsComponentMap"
import { fieldSettingsRegistry } from "./FieldSettingsRegistry"

type FieldSettingsRendererProps = {
  tab: 'basic' | 'advanced'
  fieldKey: string
  fieldType: string
}

export const FieldSettingsRenderer = ({
  tab,
  fieldKey,
  fieldType
}: FieldSettingsRendererProps) => {
  const fields = useAtomValue($fields) as Record<string, any>
  const fieldData = fields[fieldKey]

  const config = fieldSettingsRegistry[fieldType]
  if (!config) return null

  const settings = config[tab]

  // Handle legacy component
  if (settings === 'component' && config.legacyComponent) {
    const legacyComponentPath = `../../CompSettings/${config.legacyComponent}`
    const LegacyComponent = getComponent(config.legacyComponent, legacyComponentPath)
    if (!LegacyComponent) return null

    // Key forces new instance when fieldKey changes
    return <LegacyComponent key={fieldKey} />
  }

  // Handle registry-based settings
  if (Array.isArray(settings)) {
    const sortedSettings = [...settings].sort((a, b) => a.order - b.order)

    return (
      <>
        {sortedSettings.map((setting, index) => {
          const SettingComponent = getComponent(setting.componentName)

          if (!SettingComponent) return null

          const { condition, props = {} } = setting

          if (condition && !condition(fieldData)) {
            return null
          }

          return (
            // Key ensures fresh instance per field
            <Fragment key={`${fieldKey}-${setting.componentName}-${index}`}>
              <SettingComponent {...props} />
              <FieldSettingsDivider />
            </Fragment>
          )
        })}
      </>
    )
  }

  return null
}