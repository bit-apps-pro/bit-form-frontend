/* eslint-disable no-param-reassign */
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useRef } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import BdrDottedIcn from '../../../../Icons/BdrDottedIcn'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import { SmartTagField } from '../../../../Utils/StaticData/SmartTagField'
import tippyHelperMsg from '../../../../Utils/StaticData/tippyHelperMsg'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Downmenu from '../../../Utilities/Downmenu'

const replaceFieldTypes: Record<string, string> = {
  range: 'number',
  textarea: 'text',
  hidden: 'text'
}

export default function DefaultValueSettings({ title, propsFldKey }: { title?: string, propsFldKey?: string }) {
  const { css } = useFela()
  const { fieldKey: paramKey } = useParams<{ fieldKey: string }>()
  const fldKey = propsFldKey ?? paramKey
  const [fields, setFields] = useAtom($fields)

  const patternTippy = useRef()

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const defaultValue = fieldData.defaultValue || ''
  const fieldType = fieldData.typ || 'text'
  const containsSmartTag = /\$\{.*?\}/.test(defaultValue)
  const inputFieldType = containsSmartTag ? 'text' : (replaceFieldTypes[fieldType] || fieldType)
  const hideDefaultValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (!IS_PRO) return

    if (e.target.checked) {
      fieldData.defaultValue = fieldData.lbl || fldKey
      fieldData.defaultValueHide = true
    } else {
      fieldData.defaultValueHide = false
      delete fieldData.defaultValue
    }

    const req = e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Default value ${req}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `${req.toLowerCase()}_defaultValue`,
      state: { fields: allFields, fldKey },
    })
  }

  const setDefaultValue = (value: string, smartTag: boolean) => {
    // if (!IS_PRO) return
    if (value === '') {
      delete fieldData.defaultValue
    } else {
      let newValue = value
      if (smartTag) {
        if (fieldData.defaultValue) {
          newValue = `${fieldData.defaultValue}\$\{${newValue}\}`
        } else {
          newValue = `\$\{${newValue}\}`
        }
      }
      fieldData.defaultValue = newValue
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Default value updated: ${value || fieldData.lbl || adminLabel || fldKey}`,
      type: 'change_defaultValue',
      state: { fields: allFields, fldKey },
    })
  }

  const ignoreSmartTag = ['bf_all_data', 'bf_all_data.onlyValues', '_bf_length()', '_bf_count()', '_bf_calc()', '_bf_number()', '_bf_math()', '_bf_concat()', '_bf_format_datetime()', '_bf_datetime_difference()', '_bf_add_subtract_datetime()', '_bf_query_param()', '_bf_user_meta_key()', '_bf_custom_date_format()', '_bf_entry_id']

  return (
    <SimpleAccordion
      id={`dflt-val-stng-${fldKey}`}
      title={title || __('Default value')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      switching
      tip={tippyHelperMsg.defaultValue}
      tipProps={{ width: 250, icnSize: 17 }}
      toggleAction={hideDefaultValue}
      toggleChecked={fieldData?.defaultValueHide}
      open={fieldData?.defaultValueHide}
      // {...(IS_PRO && { disable: !fieldData?.defaultValueHide })}
      disable={!fieldData?.defaultValueHide}
      // isPro
      proProperty="defaultValue"
    >
      <div className={css(FieldStyle.placeholder, { pn: 'relative' })}>
        <input
          data-testid="dflt-val-stng-inp"
          aria-label="Default value for this Field"
          placeholder="Type default value here..."
          className={css(FieldStyle.input,{pr: 40})}
          type={inputFieldType}
          value={defaultValue}
          onChange={({ target: { value } }) => setDefaultValue(value, false)}
        />
        <span className={css(style.dotBtnWrapper)}>
          <Downmenu instance={patternTippy}
            placement="bottom-end"
            popperOptions={{
              strategy: 'fixed', // Use fixed positioning
            }}>
            <button
              data-testid="ptrn-stng-exprsn-btn"
              data-close
              type="button"
              className={css(style.dotBtn)}
              unselectable="on"
              draggable="false"
              style={{ cursor: 'pointer' }}
              title={__('Fields')}
            >
              <BdrDottedIcn size="19" rotateDeg={90} />
            </button>
            <div className={css(style.menuListWrapper)}>
              <ul role="menu">
                {SmartTagField?.map(item => !ignoreSmartTag.includes(item.name) && (
                  <li
                    data-testid={`ptrn-stng-expn-itm-${item.id}`}
                    // eslint-disable-next-line react/no-array-index-key
                    key={item.id}
                    role="menuitem"
                    className={`${css(style.button)} btnHover`}
                    onKeyDown={() => setDefaultValue(item.name, true)}
                    onClick={() => setDefaultValue(item.name, true)}
                  >
                    <span>{item.label}</span>
                    <br />
                    {/* <small>{generateBackslashPattern(opt.val)}</small> */}
                  </li>
                ))}
              </ul>
              {/* {predefinedPatterns.map((opt, i) => <option key={`${i * 2}`} value={generateBackslashPattern(opt.val)}>{opt.lbl}</option>)} */}
            </div>
          </Downmenu>
        </span>
      </div>
    </SimpleAccordion>
  )
}


const style = {
  dotBtnWrapper: {
    pn: 'absolute',
    tp: 3,
    rt: 2,
    h: 35,
    flx: 'center',
    p: 5
  },
  dotBtn: {
    b: 0,
    brs: 'var(--bf-bdr-radius-sm)',
    curp: 1,
    se: 25,
    flx: 'center',
    bd: 'var(--bf-bg-offwhite)',
    cr: 'var(--bf-text-clr-darkgray)',
    '&:hover': {
      b: '1px solid var(--bf-stroke-clr)',
      cr: 'var(--bf-text-clr-dark)',
    },
    // h: 30
  },
  button: {
    dy: 'block',
    w: '100%',
    ta: 'left',
    b: 0,
    bd: 'none',
    p: 3,
    curp: 1,
    '&:hover':
    {
      bd: 'var(--white-0-95)',
      cr: 'var(--black-0)',
      brs: 8,
    },
    fs: 11,
  },
  menuListWrapper: {
    w: 180,
    mxh: 300,
    owy: 'auto'
  }
}