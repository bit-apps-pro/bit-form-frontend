/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../GlobalStates/StylesState'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

/**
 * Options Column Settings Component
 * 
 * Manages the column layout for radio/checkbox options.
 * Allows users to specify the number of columns to display options in.
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function OptionsColumnSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const optionCol = fieldData?.optionCol === undefined ? '' : fieldData?.optionCol

  const setColumn = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value === '') {
      delete fieldData.optionCol
    } else {
      fieldData.optionCol = value
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })

    const newStyles = create(styles, drft => {
      const gridStyle = {
        display: 'grid',
        'grid-template-columns': `repeat(${value}, 1fr)`,
        width: '100%',
        'grid-row-gap': '10px',
        'column-gap': '10px',
      }

      const flxStyle = {
        display: 'flex',
        'flex-wrap': 'wrap',
        'margin-top': '8px',
      }

      drft.fields[fldKey].classes[`.${fldKey}-cc`] = value === '' ? flxStyle : gridStyle
    })

    setFields(allFields)
    setStyles(newStyles)
    addToBuilderHistory({
      event: `Column Update to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'columns_update',
      state: { fields: allFields, styles: newStyles, fldKey },
    })
    reCalculateFldHeights(fldKey)
  }

  return (
    <SimpleAccordion
      id="opt-clm-stng"
      title={__('Options Column')}
      className={css(FieldStyle.fieldSection)}
      proProperty="optionColumn"
      tip={__('Specify the number of columns to display the options in. Leave blank to display the options as needed space.')}
    >
      <div className={css(FieldStyle.placeholder)}>
        <input
          data-testid="opt-clm-stng-inp"
          aria-label="Option Column"
          className={css(FieldStyle.input)}
          min="1"
          type="number"
          value={optionCol}
          onChange={setColumn}
        />
      </div>
    </SimpleAccordion>
  )
}