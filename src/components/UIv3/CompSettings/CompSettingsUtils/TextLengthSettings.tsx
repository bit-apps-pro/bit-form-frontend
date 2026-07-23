/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $globalMessages } from '../../../../GlobalStates/AppSettingsStates'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import ErrorMessageSettings from '../../../CompSettings/CompSettingsUtils/ErrorMessageSettings'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import { addDefaultStyleClasses } from '../../../style-new/styleHelpers'

export default function TextLengthSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const globalMessages = useAtomValue($globalMessages)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const adminLabel = fieldData.adminLbl || ''
  const minLength = fieldData.valid?.minlength || ''
  const maxLength = fieldData.valid?.maxlength || ''
  const maxWord = fieldData.valid?.maxword || ''
  const minWord = fieldData.valid?.minword || ''
  const globalErrMsg = globalMessages.err || {}

  const updateHelperText = (fldData: any) => {
    const helperParts: string[] = []

    if (fldData.valid?.minlength) {
      helperParts.push(`Minimum \${field.minlength} character required.`)
    }

    if (fldData.valid?.maxlength) {
      helperParts.push(`\${field.value_length} of \${field.maxlength} Max Characters.`)
    }

    if (fldData.valid?.minword) {
      helperParts.push(`Minimum \${field.minword} word required.`)
    }

    if (fldData.valid?.maxword) {
      helperParts.push(`\${field.value_wordlength} of \${field.maxword} Max Word.`)
    }
    if (helperParts.length > 0) {
      fldData.helperTxt = helperParts.join(' ')
      fldData.hlpTxtHide = true
      addDefaultStyleClasses(fldKey, 'hlpTxt')
    }
  }

  const setMinLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      if (fieldData.valid?.minlength) {
        delete fieldData.valid.minlength
      }
      if (fieldData.err?.minlength) {
        delete fieldData.err.minlength
      }
      // Clear helper text if no length validations
      if (!fieldData.valid?.maxlength && !fieldData.valid?.maxword && !fieldData.valid?.minword && fieldData.helperTxt.includes('${field.minlength}')) {
        delete fieldData.helperTxt
        delete fieldData.hlpTxtHide
      } else {
        updateHelperText(fieldData)
      }
    } else {
      if (!fieldData.valid) fieldData.valid = {}
      fieldData.valid.minlength = value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.minlength) fieldData.err.minlength = {}
      fieldData.err.minlength.dflt = globalErrMsg.minlength || `<p style="margin:0">Minimum ${value} character required.</p>`
      fieldData.err.minlength.show = true

      // Set helper text automatically
      updateHelperText(fieldData)
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Min length updated to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_minlength',
      state: { fields: allFields, fldKey },
    })
  }

  const setMaxLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      if (fieldData.valid?.maxlength) {
        delete fieldData.valid.maxlength
      }
      if (fieldData.err?.maxlength) {
        delete fieldData.err.maxlength
      }
      // Clear helper text if no length validations
      if (!fieldData.valid?.minlength && !fieldData.valid?.maxword && !fieldData.valid?.minword) {
        delete fieldData.helperTxt
        delete fieldData.hlpTxtHide
      } else {
        updateHelperText(fieldData)
      }
    } else {
      if (!fieldData.valid) fieldData.valid = {}
      fieldData.valid.maxlength = value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.maxlength) fieldData.err.maxlength = {}
      fieldData.err.maxlength.dflt = globalErrMsg.maxlength || `<p style="margin:0">Maximum ${value} character allowed.</p>`
      fieldData.err.maxlength.show = true

      // Set helper text automatically
      updateHelperText(fieldData)
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Max length updated to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_maxlength',
      state: { fields: allFields, fldKey },
    })
  }

  const setMaxWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      if (fieldData.valid?.maxword) {
        delete fieldData.valid.maxword
      }
      if (fieldData.err?.maxword) {
        delete fieldData.err.maxword
      }
      // Clear helper text if no length validations
      if (!fieldData.valid?.minlength && !fieldData.valid?.maxlength && !fieldData.valid?.minword) {
        delete fieldData.helperTxt
        delete fieldData.hlpTxtHide
      } else {
        updateHelperText(fieldData)
      }
    } else {
      if (!fieldData.valid) fieldData.valid = {}
      fieldData.valid.maxword = value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.maxword) fieldData.err.maxword = {}
      fieldData.err.maxword.dflt = globalErrMsg.maxword || `<p style="margin:0">Maximum ${value} word allowed.</p>`
      fieldData.err.maxword.show = true

      // Set helper text automatically
      updateHelperText(fieldData)
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Max word updated to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_maxword',
      state: { fields: allFields, fldKey },
    })
  }

  const setMinWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      if (fieldData.valid?.minword) {
        delete fieldData.valid.minword
      }
      if (fieldData.err?.minword) {
        delete fieldData.err.minword
      }
      // Clear helper text if no length validations
      if (!fieldData.valid?.minlength && !fieldData.valid?.maxlength && !fieldData.valid?.maxword) {
        delete fieldData.helperTxt
        delete fieldData.hlpTxtHide
      } else {
        updateHelperText(fieldData)
      }
    } else {
      if (!fieldData.valid) fieldData.valid = {}
      fieldData.valid.minword = value
      if (!fieldData.err) fieldData.err = {}
      if (!fieldData.err.minword) fieldData.err.minword = {}
      fieldData.err.minword.dflt = globalErrMsg.minword || `<p style="margin:0">Minimum ${value} word required.</p>`
      fieldData.err.minword.show = true

      // Set helper text automatically
      updateHelperText(fieldData)
    }

    const allFields = create(fields, draft => {
      draft[fldKey] = fieldData
    })
    setFields(allFields)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Min word updated to ${value}: ${fieldData.lbl || adminLabel || fldKey}`,
      type: 'set_minword',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <SimpleAccordion
      id="text-length-stng"
      title={__('Min/Max Text Length:')}
      className={css(FieldStyle.fieldSection)}
    >
      <div className={css({ mx: 5 })}>
        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Min Length:')}</span>
          <input
            data-testid="text-length-stng-min-inp"
            title="Minimum character length for this field"
            aria-label="Minimum character length for this field"
            placeholder="Type minimum length here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type="number"
            min="0"
            value={minLength}
            onChange={setMinLength}
          />
        </div>
        {fieldData.valid?.minlength && (
          <ErrorMessageSettings
            id="char-length-stng-min"
            type="minlength"
            title="Min Length Error Message"
            tipTitle={`${__('By enabling this feature, user will see the error message when input length is less than')} ${fieldData.valid.minlength}`}
            allowIcons={false}
          />
        )}

        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Max Length:')}</span>
          <input
            data-testid="char-length-stng-max-inp"
            title="Maximum character length for this field"
            aria-label="Maximum character length for this field"
            placeholder="Type maximum length here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type="number"
            min="0"
            value={maxLength}
            onChange={setMaxLength}
          />
        </div>
        {fieldData.valid?.maxlength && (
          <ErrorMessageSettings
            id="char-length-stng-max"
            type="maxlength"
            title="Max Length Error Message"
            tipTitle={`${__('By enabling this feature, user will see the error message when input length is greater than')} ${fieldData.valid.maxlength}`}
            allowIcons={false}
          />
        )}

        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Min Word:')}</span>
          <input
            data-testid="char-length-stng-minword-inp"
            title="Minimum word count for this field"
            aria-label="Minimum word count for this field"
            placeholder="Type minimum word count here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type="number"
            min="0"
            value={minWord}
            onChange={setMinWord}
          />
        </div>
        {fieldData.valid?.minword && (
          <ErrorMessageSettings
            id="char-length-stng-minword"
            type="minword"
            title="Min Word Error Message"
            tipTitle={`${__('By enabling this feature, user will see the error message when word count is less than')} ${fieldData.valid.minword}`}
            allowIcons={false}
          />
        )}

        <div className={css(FieldStyle.fieldNumber, { py: '0px !important' })}>
          <span>{__('Max Word:')}</span>
          <input
            data-testid="char-length-stng-maxword-inp"
            title="Maximum word count for this field"
            aria-label="Maximum word count for this field"
            placeholder="Type maximum word count here..."
            className={css(FieldStyle.input, FieldStyle.w140)}
            type="number"
            min="0"
            value={maxWord}
            onChange={setMaxWord}
          />
        </div>
        {fieldData.valid?.maxword && (
          <ErrorMessageSettings
            id="char-length-stng-maxword"
            type="maxword"
            title="Max Word Error Message"
            tipTitle={`${__('By enabling this feature, user will see the error message when word count is greater than')} ${fieldData.valid.maxword}`}
            allowIcons={false}
          />
        )}
      </div>
    </SimpleAccordion>
  )
}
