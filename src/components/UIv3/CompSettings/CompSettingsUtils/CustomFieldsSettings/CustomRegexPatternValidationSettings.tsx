import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useRef } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../../../GlobalStates/GlobalStates'
import BdrDottedIcn from '../../../../../Icons/BdrDottedIcn'
import { addToBuilderHistory, escapeBackslashPattern, generateBackslashPattern } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../../../Utils/Helpers'
import predefinedPatterns from '../../../../../Utils/StaticData/phonePatterns.json'
import tippyHelperMsg from '../../../../../Utils/StaticData/tippyHelperMsg'
import { __ } from '../../../../../Utils/i18nwrap'
import ut from '../../../../../styles/2.utilities'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import Downmenu from '../../../../Utilities/Downmenu'
import SingleInput from '../../../../Utilities/SingleInput'
import AutoResizeInput from '../../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import ErrorMessageSettings from '../../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'

/**
 * Custom Validation Pattern Settings Component
 * 
 * Provides RegEx pattern validation for phone number fields.
 * Features:
 * - Custom RegEx expression input
 * - Predefined pattern dropdown menu
 * - Flags input (e.g., 'g', 'i', 'gi')
 * - Error message customization
 * 
 * @returns {JSX.Element | null} - Returns the settings component or null if field key is missing
 */
export default function CustomValidationPatternSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const patternTippy = useRef<HTMLButtonElement>(null)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const globalErrMsg = globalMessages.err || {}
  const regexr = fieldData.valid.regexr || ''
  const flags = fieldData.valid.flags || ''

  const setRegexrValue = (value: string) => {
    // eslint-disable-next-line no-underscore-dangle
    (patternTippy?.current as any)?._tippy?.hide()
    if (!IS_PRO) return
    if (value === '') {
      delete fieldData.valid.regexr
    } else {
      const val = escapeBackslashPattern(value)
      fieldData.valid.regexr = val
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.regexr) fieldData.err.regexr = {}
      const ifPredefined = predefinedPatterns.find(opt => opt.val === val)
      fieldData.err.regexr.dflt = ifPredefined
        ? `<p style="margin:0">${ifPredefined.msg}</p>`
        : (globalErrMsg[fieldData.typ]?.regexr || globalErrMsg?.regexr || '<p style="margin:0">Pattern not matched</p>')
      fieldData.err.regexr.show = true
      if (fieldData.typ === 'password') {
        delete fieldData.valid.validations
      }
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Regex Pattern updated: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_regexr',
      state: { fields: allFields, fldKey }
    })
  }

  const setRegexr = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!IS_PRO) return
    const { value } = e.target
    if (value === '') {
      delete fieldData.valid.regexr
    } else {
      const val = escapeBackslashPattern(value)
      fieldData.valid.regexr = val
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.regexr) fieldData.err.regexr = {}
      const ifPredefined = predefinedPatterns.find(opt => opt.val === val)
      fieldData.err.regexr.dflt = ifPredefined
        ? `<p style="margin:0">${ifPredefined.msg}</p>`
        : (globalErrMsg[fieldData.typ]?.regexr || globalErrMsg?.regexr || '<p style="margin:0">Pattern not matched</p>')
      fieldData.err.regexr.show = true
      if (fieldData.typ === 'password') {
        delete fieldData.valid.validations
      }
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Regex Pattern updated: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_regexr',
      state: { fields: allFields, fldKey }
    })
  }

  const setFlags = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!IS_PRO) return
    if (e.target.value === '') {
      delete fieldData.valid.flags
    } else {
      fieldData.valid.flags = e.target.value
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Regex Pattern Flag updated: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_flags',
      state: { fields: allFields, fldKey }
    })
  }

  return (
    <SimpleAccordion
      id="ptrn-stng"
      title={__('Custom Validation (RegEx) Pattern')}
      className={css(FieldStyle.fieldSection)}
      isPro
      tip={tippyHelperMsg.pattern}
      proProperty="regexPattern"
    >
      <>
        <div className={css(ut.mr2, ut.mt3, ut.pl1)}>
          <div className={css(ut.flxcb, ut.ml1)}>
            <h4 className={css(ut.m0, FieldStyle.title)}>
              {__('Expression')}
              :
            </h4>
            <Downmenu instance={patternTippy}>
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
                <BdrDottedIcn size="19" />
              </button>
              <div>
                <ul role="menu">
                  {predefinedPatterns?.map((opt, i) => (
                    <li
                      data-testid={`ptrn-stng-expn-itm-${i}`}
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      role="menuitem"
                      className={`${css(style.button)} btnHover`}
                      onKeyDown={() => setRegexrValue(opt.val)}
                      onClick={() => setRegexrValue(opt.val)}
                    >
                      <span>{opt.lbl}</span>
                      <br />
                      <small>{generateBackslashPattern(opt.val)}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </Downmenu>
          </div>
          <AutoResizeInput
            id="ptrn-stng-expn"
            ariaLabel="Pattern for input field"
            placeholder="e.g. ([A-Z])\w+"
            list="patterns"
            disabled={!IS_PRO}
            value={generateBackslashPattern(regexr)}
            changeAction={setRegexr}
          />
        </div>
        <div className={css({ mr: 5 }, ut.pl1)}>
          <SingleInput
            id="ptrn-stng-flg"
            inpType="text"
            title={__('Flags:')}
            value={flags}
            action={setFlags}
            placeholder="e.g. g"
            cls={css(FieldStyle.input)}
            disabled={!IS_PRO}
          />
        </div>
        {regexr && (
          <ErrorMessageSettings
            id="ptrn-stng-expn"
            type="regexr"
            title="Error Message"
            tipTitle={tippyHelperMsg.patternsErrMsg}
          />
        )}
      </>
    </SimpleAccordion>
  )
}

const style = {
  dotBtn: {
    b: 0,
    brs: 5,
    mr: 15,
    curp: 1,
  },
  button: {
    dy: 'block',
    w: '100%',
    ta: 'left',
    b: 0,
    bd: 'none',
    p: 3,
    curp: 1,
    '&:hover': {
      bd: 'var(--white-0-95)',
      cr: 'var(--black-0)',
      brs: 8,
    },
    fs: 11,
  },
}