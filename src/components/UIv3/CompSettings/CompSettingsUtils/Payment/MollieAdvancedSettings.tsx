/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import { addFormUpdateError, addToBuilderHistory, removeFormUpdateError } from '../../../../../Utils/FormBuilderHelper'
import { __ } from '../../../../../Utils/i18nwrap'
import { locale } from '../../../../../Utils/StaticData/mollieData'
import tippyHelperMsg from '../../../../../Utils/StaticData/tippyHelperMsg'
import AutoResizeInput from '../../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import FieldSettingsDivider from '../../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import Cooltip from '../../../../Utilities/Cooltip'
import RenderHtml from '../../../../Utilities/RenderHtml'

interface MollieAdvancedSettingsProps {
  /**
   * Additional CSS class names
   */
  className?: string
}

const style = {
  amountType: {
    dy: 'flex !important',
    fw: 600,
    '& .hover-tip': { oy: 0 },
  },
}

export default function MollieAdvancedSettings({
  className = ''
}: MollieAdvancedSettingsProps) {
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()

  if (!fldKey) return null

  const fieldData = fields[fldKey]
  const config = fieldData.config || {}
  const fieldLabel = fieldData?.lbl ?? ''

  const handleInput = (name: string, value: string): void => {
    const updatedFields = create(fields, draft => {
      if (!draft[fldKey].config) {
        draft[fldKey].config = {}
      }

      if (value) {
        const keys = name.split('->')
        let current: any = draft[fldKey]

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = value
          } else {
            if (!current[key]) current[key] = {}
            current = current[key]
          }
        })
      }

      // Validation for description
      if (name === 'config->description') {
        if (value) {
          removeFormUpdateError(fldKey, 'mollieDescriptionMissing')
        } else {
          addFormUpdateError({
            fieldKey: fldKey,
            errorKey: 'mollieDescriptionMissing',
            errorMsg: __('Mollie Description is Required'),
            errorUrl: `field-settings/${fldKey}`,
          })
        }
      }
    })

    setFields(updatedFields)
    addToBuilderHistory({
      event: `${name} changed to ${value}: ${fieldLabel || fldKey}`,
      type: `${name}_changed`,
      state: { fields: updatedFields, fldKey }
    })
  }

  return (
    <div className={className}>
      {/* Description */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <label htmlFor="description">
          <b className={css(style.amountType)}>
            {__('Description')}
            <Cooltip>
              <div className="txt-body">
                <RenderHtml html={tippyHelperMsg.mollieDescription || ''} />
              </div>
            </Cooltip>
          </b>
          <AutoResizeInput
            id="description"
            aria-label="Mollie description text"
            placeholder="Type text here..."
            value={config.description || ''}
            changeAction={e => handleInput('config->description', e.target.value)}
          />
        </label>
      </div>
      <FieldSettingsDivider />

      {/* Locale */}
      <div className={css(ut.ml2, ut.mr2, ut.p1)}>
        <label htmlFor="locale">
          <b className={css(style.amountType)}>
            {__('Locale')}
            <Cooltip>
              <div className="txt-body">
                <RenderHtml html={tippyHelperMsg.mollieLocale || ''} />
              </div>
            </Cooltip>
          </b>
          <select
            data-testid="prfil-locale-slct"
            onChange={e => handleInput('config->locale', e.target.value)}
            className={css(FieldStyle.input)}
            value={config.locale || ''}
          >
            <option value="">{__('Select Locale')}</option>
            {Object.entries(locale).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}