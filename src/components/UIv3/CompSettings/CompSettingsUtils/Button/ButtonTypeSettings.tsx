import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../../GlobalStates/StylesState'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { IS_PRO, deepCopy } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

/**
 * Button Type Settings Component
 * Handles button type selection (Submit, Reset, Button, Save Draft)
 */
export default function ButtonTypeSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)
  const [error, setError] = useState<{ btnTyp?: string }>({})

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const { btnTyp } = fieldData

  const checkSubmitBtn = () => {
    const btns = Object.values(fields).filter(
      (fld: any) => fld.typ === 'button' && fld.btnTyp === 'submit'
    )
    return btns.length >= 1
  }

  const type = [
    { name: 'Reset', value: 'reset', disabled: false },
    { name: 'Button', value: 'button', disabled: false },
  ]

  if (IS_PRO) {
    type.push({ name: 'Save Draft', value: 'save-draft', disabled: false })
  }

  if (!checkSubmitBtn() || btnTyp === 'submit') {
    type.push({ name: 'Submit', value: 'submit', disabled: true })
  }

  const setBtnTyp = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    fieldData.btnTyp = value
    if (fieldData.btnTyp === 'submit' && checkSubmitBtn()) {
      setError({ btnTyp: __('Already have a submit button') })
      setTimeout(() => {
        setError({ btnTyp: '' })
      }, 3000)
      return
    }

    if (error.btnTyp) {
      setError({ btnTyp: '' })
    }

    let bgClr = 'var(--btn-bg)'
    let clr = 'var(--btn-c)'
    let bdrClr = 'var(--btn-bdr-clr)'
    let bdrStl = 'var(--btn-bdr)'
    let bdrWdth = 'var(--btn-bdr-width)'

    if (value === 'reset') {
      bgClr = 'hsla(240, 12%, 94%, 100)'
      clr = 'hsla(208, 46%, 25%, 100)'
    }

    if (value === 'save-default') {
      bgClr = 'hsla(0, 0%, 100%, 100)'
      clr = 'var(--btn-bgc)'
      bdrClr = 'var(--btn-bgc)'
      bdrStl = 'solid'
      bdrWdth = '1px'
    }

    setStyles(preStyle => create(preStyle, drftStyle => {
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`].background = bgClr
      drftStyle.fields[fldKey].classes[`.${fldKey}-btn`].color = clr
      if (value !== 'save-draft') {
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['border-color'] = bdrClr
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['border-style'] = bdrStl
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn`]['border-width'] = bdrWdth
        drftStyle.fields[fldKey].classes[`.${fldKey}-btn:hover`].color = 'var(--btn-c)'
      }
    }))

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Button Type updated to ${value}: ${fieldData.txt}`,
      type: 'set_btn_typ',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="btn-typ"
      title={__('Button Type')}
      className={css(FieldStyle.fieldSection)}
      open
    >
      <div className={css(FieldStyle.placeholder)}>
        <select
          data-testid="btn-typ-slct"
          className={css(FieldStyle.input)}
          value={btnTyp}
          onChange={setBtnTyp}
        >
          {type.map(itm => (
            <option
              key={`btcd-k-${itm.name}`}
              value={itm.value}
            >
              {itm.name}
            </option>
          ))}
        </select>
      </div>
      {error.btnTyp && (
        <span className={css({ cr: 'red', ml: 10 })}>
          {error.btnTyp}
        </span>
      )}
    </SimpleAccordion>
  )
}