/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { IS_PRO } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import ErrorMessageSettings from '../../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import SingleToggle from '../../../../Utilities/SingleToggle'

interface MultipleSelectSettingsProps {
  className?: string
}

/**
 * Multiple Select Settings Component
 * 
 * Allows users to enable multiple selection in dropdown fields and configure
 * minimum/maximum selection limits. This is a PRO feature.
 * 
 * Features:
 * - Enable/disable multiple selection
 * - Set minimum selection requirement
 * - Set maximum selection limit
 * - Configure error messages for min/max validation
 * - Option to disable field when max is reached
 */
export default function AllowMultipleSelectSettings({
  className = ''
}: MultipleSelectSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const multipleSelect = fieldData?.config?.multipleSelect ?? false
  const minValue = fieldData?.mn ?? 0
  const maxValue = fieldData?.mx ?? 0
  const adminLabel = fieldData?.adminLbl ?? ''
  const globalErrMsg = globalMessages?.err || {}

  const handleToggleMultipleSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      const field = draft[fldKey]
      field.config.multipleSelect = checked
      field.config.showChip = checked
      field.config.closeOnSelect = !checked
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Multiple Select ${checked ? 'On' : 'Off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'multipleSelect_change',
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleMinMaxValue = (propName: 'mn' | 'mx', val: string): void => {
    const value = isNaN(Number(val)) ? 0 : Number(val)

    if (value < 0) return

    const updatedFields = create(fields, draft => {
      const field = draft[fldKey]

      // Initialize error objects if they don't exist
      if (!field.err.mn && propName === 'mn') {
        field.err.mn = { show: true }
      }
      if (!field.err.mx && propName === 'mx') {
        field.err.mx = { show: true }
      }

      // Handle min/max relationship
      if (propName === 'mx' && minValue && value < minValue) {
        field.mn = value
        field.err.mn.dflt = globalErrMsg?.[field.typ]?.mn || `Minimum ${value} Option Required`
      } else if (propName === 'mn' && maxValue && value > maxValue) {
        field.mx = value
        field.err.mx.dflt = globalErrMsg?.[field.typ]?.mx || `Maximum ${value} Option can select.`
      }

      // Set error messages
      if (propName === 'mn') {
        field.err.mn.dflt = globalErrMsg?.[field.typ]?.mn || `Minimum ${value} Option Required`
      } else if (propName === 'mx') {
        field.err.mx.dflt = globalErrMsg?.[field.typ]?.mx || `Maximum ${value} Option can select.`
      }

      field[propName] = value
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${propName === 'mn' ? 'Minimum Option' : 'Maximum Option'} '${String(value || 'Off').replace('true', 'On')}': ${fieldData.lbl || fldKey}`,
      type: `${propName}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  const handleDisabledOnMax = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!IS_PRO) return

    const { checked } = e.target

    const updatedFields = create(fields, draft => {
      const field = draft[fldKey]
      if (checked) {
        field.valid.disableOnMax = true
      } else {
        delete field.valid.disableOnMax
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `Disable on max selected ${checked ? 'on' : 'off'}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_disable_on_max',
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="alw-mltpl-stng"
      title={__('Allow Multiple Select:')}
      toggleAction={handleToggleMultipleSelect}
      toggleChecked={multipleSelect}
      className={`${css(FieldStyle.fieldSection, FieldStyle.hover_tip)} ${className}`}
      switching
      tip="By enabling this feature, you will enable to select Multiple Options"
      tipProps={{ width: 200, icnSize: 17 }}
      open={multipleSelect}
      disable={!multipleSelect}
      isPro
      allowToggle
      proProperty="minMaxOpt"
    >
      <div className={css(ut.ml1, ut.mr1)}>
        <div className={css(ut.flxc)}>
          <span>Minimum Option</span>
          <input
            data-testid="alw-mltpl-min-inp"
            className={css(FieldStyle.input, ut.w5, ut.mt1)}
            type="number"
            value={minValue}
            onChange={e => handleMinMaxValue('mn', e.target.value)}
          />
        </div>
        {!!minValue && (
          <ErrorMessageSettings
            className={css(ut.mt0)}
            id="min-fil-err-msg"
            type="mn"
            defaultMsg={`Minimum ${minValue} Option Required`}
            allowIcons={false}
          />
        )}
        <div className={css(ut.flxc, ut.mt2)}>
          <span>Maximum Option</span>
          <input
            data-testid="alw-mltpl-max-inp"
            className={css(FieldStyle.input, ut.w5, ut.mt1)}
            type="number"
            value={maxValue}
            onChange={e => handleMinMaxValue('mx', e.target.value)}
          />
        </div>
        {!!maxValue && (
          <>
            <ErrorMessageSettings
              className={css(ut.mt0)}
              id="max-fil-err-msg"
              type="mx"
              defaultMsg={`Maximum ${maxValue} Option can select`}
              allowIcons={false}
            />
            <SingleToggle
              id="mxmm-slctd"
              title={__('Disable if maximum selected:')}
              action={handleDisabledOnMax}
              isChecked={fieldData.valid.disableOnMax}
              disabled={!IS_PRO}
              className="mt-3 mb-2"
            />
          </>
        )}
      </div>
    </SimpleAccordion>
  )
}