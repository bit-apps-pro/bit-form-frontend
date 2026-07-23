/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../GlobalStates/AppSettingsStates'
import { $fields, $selectedFieldId } from '../../../../GlobalStates/GlobalStates'
import ut from '../../../../styles/2.utilities'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { deepCopy, IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import TableCheckBox from '../../../Utilities/TableCheckBox'
import { addDefaultStyleClasses } from '../../../style-new/styleHelpers'

interface PasswordValidations {
  digit?: string
  lower?: string
  upper?: string
  special?: string
  limit?: {
    mn?: number
    mx?: number
  }
}

export default function PasswordValidationSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)
  const selectedFieldId = useAtomValue($selectedFieldId)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const globalErrMsg = globalMessages.err || {}

  const generatePasswordPattern = (validations: PasswordValidations): string => {
    return `^${validations.digit || ''}${validations.lower || ''}${validations.upper || ''}${validations.special || ''}.{${validations?.limit?.mn || 0},${validations?.limit?.mx || ''}}$`
  }

  const generatePasswordErrMsg = (validations: PasswordValidations): string => {
    const parts = Object.keys(validations).map((vld) => {
      if (vld === 'digit') {
        return 'one number'
      }
      if (vld === 'lower') {
        return 'one lowercase character'
      }
      if (vld === 'upper') {
        return 'one uppercase character'
      }
      if (vld === 'special') {
        return 'one special character'
      }
      if (vld === 'limit' && validations.limit) {
        return `${validations.limit.mn}${validations.limit.mx ? ` to ${validations.limit.mx}` : ''} characters`
      }
      return ''
    }).filter(Boolean)

    const message = parts.join(', ').replace(/, ([^,]*)$/, ' and $1')
    return `<p style="margin:0">Password must consist at least ${message}</p>`
  }

  const setPasswordValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!IS_PRO) return

    const { checked, name, value } = e.target
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err.regexr) fieldData.err.regexr = {}
    if (!fieldData.valid.validations) fieldData.valid.validations = {}
    const { validations } = fieldData.valid

    if (checked) {
      if (name === 'limit') {
        validations.limit = { mn: 8, mx: 32 }
      } else {
        validations[name as keyof PasswordValidations] = value
      }
    } else {
      delete validations[name as keyof PasswordValidations]
    }

    fieldData.valid.validations = validations

    if (Object.keys(validations).length) {
      fieldData.valid.regexr = generatePasswordPattern(validations)
      fieldData.err.regexr.dflt = generatePasswordErrMsg(validations)
      fieldData.err.regexr.show = true
    } else {
      fieldData.err.regexr.dflt = globalErrMsg[fieldData.typ]?.regexr || globalErrMsg?.regexr || '<p style="margin:0">Pattern not matched</p>'
      delete fieldData.valid.regexr
      delete fieldData.err.regexr.show
    }
    updateHelperText(fieldData)

    const allFields = create(fields, draft => {
      if (!fieldData.valid.regexr) {
        fieldData.hlpTxtHide = false
        delete fieldData.helperTxt
      }
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Password validation updated: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `set_password_validation_${validations}`,
      state: { fields: allFields, fldKey },
    })
  }

  const setPasswordLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!IS_PRO) return

    const { name, value } = e.target
    const { validations } = fieldData.valid

    if (value) {
      if (!fieldData.valid.validations.limit) {
        fieldData.valid.validations.limit = {}
      }
      fieldData.valid.validations.limit[name as 'mn' | 'mx'] = Number(value)
    } else {
      delete fieldData.valid.validations.limit?.[name as 'mn' | 'mx']
    }

    fieldData.valid.regexr = generatePasswordPattern(validations)
    fieldData.err.regexr.dflt = generatePasswordErrMsg(validations)

    const limit = name === 'mx' ? 'max' : 'min'
    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    addToBuilderHistory({
      event: `Password ${limit} limit updated to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: `change_password_${limit}_limit`,
      state: { fields: allFields, fldKey },
    })
  }

  const updateHelperText = (fieldData: any) => {
    const validations = fieldData.valid?.validations || {}
    const helperTextPart: Record<string, string> = {}
    console.log('pass validation pattern', validations, name);
    if (Object.keys(validations).length) {
      Object.keys(validations).forEach((vld) => {
        if (vld === 'digit') {
          helperTextPart[vld as keyof PasswordValidations] = '${isNumberExistIcn} One number'
        }
        if (vld === 'lower') {
          helperTextPart[vld as keyof PasswordValidations] = '${isLowercaseExistIcn} One lowercase character'
        }
        if (vld === 'upper') {
          helperTextPart[vld as keyof PasswordValidations] = '${isUppercaseExistIcn} One uppercase character'
        }
        if (vld === 'special') {
          helperTextPart[vld as keyof PasswordValidations] = '${isSpecialExistIcn} One special character'
        }
        if (vld === 'limit' && validations.limit) {
          helperTextPart[vld as keyof PasswordValidations] = `\${isLimitValidIcn} ${validations.limit.mn}${validations.limit.mx ? ` to ${validations.limit.mx}` : ''} characters`
        }
      })
    } else {
      fieldData.helperTxt = ''
    }
    fieldData.helperTxt = Object.values(helperTextPart).map(part => `<span style="margin-right:20px;">${part}</span>`).join('')
    fieldData.hlpTxtHide = true
    addDefaultStyleClasses(selectedFieldId, 'hlpTxt')
    reCalculateFldHeights(fldKey)

    console.log('helper text part', helperTextPart);
  }

  return (
    <SimpleAccordion
      id="pass-vldsn-stng"
      title={__('Validations')}
      className={css(FieldStyle.fieldSection)}
      isPro
      proProperty="validation"
    >
      <div className={css(ut.mt1, ut.flxClm)}>
        <TableCheckBox
          id="pass-vldsn-stng-dgt"
          className={css(ut.w10)}
          cls={css(ut.mr2)}
          name="digit"
          checked={fieldData.valid?.validations?.digit || false}
          value="(?=.*[0-9])"
          title={__('At least one digit (0-9)')}
          onChange={setPasswordValidation}
          disabled={!IS_PRO}
        />
        <TableCheckBox
          id="pass-vldsn-stng-lwr"
          className={css(ut.w10, ut.mt2)}
          cls={css(ut.mr2)}
          name="lower"
          checked={fieldData.valid?.validations?.lower || false}
          value="(?=.*[a-z])"
          title={__('At least one lowercase character (a-z)')}
          onChange={setPasswordValidation}
          disabled={!IS_PRO}
        />
        <TableCheckBox
          id="pass-vldsn-stng-upr"
          className={css(ut.w10, ut.mt2)}
          cls={css(ut.mr2)}
          name="upper"
          checked={fieldData.valid?.validations?.upper || false}
          value="(?=.*[A-Z])"
          title={__('At least one uppercase character (A-Z)')}
          onChange={setPasswordValidation}
          disabled={!IS_PRO}
        />
        <TableCheckBox
          id="pass-vldsn-stng-spcl"
          className={css(ut.w10, ut.mt2)}
          cls={css(ut.mr2)}
          name="special"
          checked={fieldData.valid?.validations?.special || false}
          value="(?=.*[~!@#$%^&*(){}[$_bf_$]<>+$_bf_$-_=$_bf_$$_bf_$/|;:,.])"
          title={__('At least one special character (~!@#$%^&*(){}[]<>+-_=/\\|;:,.)')}
          onChange={setPasswordValidation}
          disabled={!IS_PRO}
        />
        <TableCheckBox
          id="pass-vldsn-stng-lmt"
          className={css(ut.w10, ut.mt2)}
          cls={css(ut.mr2)}
          name="limit"
          checked={fieldData.valid?.validations?.limit || false}
          value=".{8,32}"
          title={__('Limit Password Length')}
          onChange={setPasswordValidation}
          disabled={!IS_PRO}
        />
        {fieldData.valid?.validations?.limit && (
          <div>
            <div className={css(FieldStyle.fieldNumber)}>
              <span>{__('Min:')}</span>
              <input
                data-testid="pass-vldsn-stng-lmt-min-inp"
                name="mn"
                aria-label="Minimum number for this field"
                placeholder="Type minimum number here..."
                className={css(FieldStyle.inputNumber)}
                type="number"
                value={fieldData.valid?.validations?.limit?.mn}
                onChange={setPasswordLimit}
              />
            </div>
            <div className={css(FieldStyle.fieldNumber)}>
              <span>{__('Max:')}</span>
              <input
                data-testid="pass-vldsn-stng-lmt-max-inp"
                name="mx"
                aria-label="Maximum number for this field"
                placeholder="Type maximum number here..."
                className={css(FieldStyle.inputNumber)}
                type="number"
                value={fieldData.valid?.validations?.limit?.mx}
                onChange={setPasswordLimit}
              />
            </div>
          </div>
        )}
      </div>
    </SimpleAccordion>
  )
}