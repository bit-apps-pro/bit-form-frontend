/* eslint-disable import/no-duplicates */
/* eslint-disable func-names */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
// import BitFlatpickr from 'bit-flatpickr/src/bit-flatpickr'
import flatpickrCSS from 'flatpickr/dist/flatpickr.min.css?inline'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { $fields, $flags } from '../../GlobalStates/GlobalStates'
import { getCustomAttributes, getCustomClsName, selectInGrid } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

export default function AdvancedDateTimeField({ attr, formID, fieldKey, styleClasses }) {
  const [fields] = useAtom($fields)
  const fieldData = fields[fieldKey]
  const { config } = fieldData
  const type = attr.typ
  const [value, setvalue] = useState(attr.val !== undefined ? attr.val : '')

  const advanceFileFieldRef = useRef(null)
  const container = useRef(null)
  const flags = useAtomValue($flags)
  const { styleMode } = flags

  useEffect(() => {
    const iFrame = document.getElementById('bit-grid-layout')
    const iFrameWindow = iFrame?.contentWindow
    const iFrameDocument = iFrame?.contentDocument

    if (!iFrameWindow || !iFrameDocument) return

    const existingStyle = iFrameDocument.querySelector('style[data-flatpickr-style]')
    if (!existingStyle) {
      const style = iFrameDocument.createElement('style')
      style.setAttribute('data-flatpickr-style', 'true')
      style.textContent = flatpickrCSS
      iFrameDocument.head.appendChild(style)
    }

    const configuration = {
      configSetting: config,
      fieldKey,
      window: iFrameWindow,
      document: iFrameDocument,
    }

    if (!container?.current) {
      container.current = selectInGrid(`#${fieldKey}-advanced-datetime`)
    }
    const fldConstructor = advanceFileFieldRef.current
    const fldElm = container.current

    if (fldConstructor) {
      if (fldElm?.firstChild) fldElm.removeChild(fldElm.firstChild)
    }

    // advanceFileFieldRef.current = new BitAdvancedDateTimeUpload(container.current, configuration)
  }, [fieldData?.config])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={attr}
      >
        <div
          data-testid={`${fieldKey}-inp-fld-wrp`}
          // data-dev-inp-fld-wrp={fieldKey}
          className={`${fieldKey}-inp-fld-wrp ${getCustomClsName(fieldKey, 'inp-fld-wrp')}`}
          {...getCustomAttributes(fieldKey, 'inp-fld-wrp')}
        >
          <input
            data-testid={fieldKey}
            data-dev-fld={fieldKey}
            id={`${fieldKey}-advanced-datetime`}
            list={`${fieldKey}-datalist`}
            ref={container}
            className={`${fieldKey}-advanced-datetime ${fieldKey}-fld no-drg ${getCustomClsName(fieldKey, 'fld')} bf-advanced-datetime-hidden-input`}
            type="text"
            autoComplete="off"
            {...'req' in attr.valid && { required: attr.valid.req }}
            {...'disabled' in attr.valid && { disabled: attr.valid.disabled }}
            {...'readonly' in attr.valid && { readOnly: attr.valid.readonly }}
            {...'ph' in attr && { placeholder: attr.ph }}
            {...'name' in attr && { name: attr.name }}
            {...'ac' in attr && { autoComplete: attr.ac }}
            {...{ value }}
            {...getCustomAttributes(fieldKey, 'fld')}
          />

          {attr.prefixIcn && (
            <img
              data-testid={`${fieldKey}-pre-i`}
              data-dev-pre-i={fieldKey}
              className={`${fieldKey}-pre-i ${getCustomClsName(fieldKey, 'pre-i')}`}
              height="90%"
              src={attr.prefixIcn}
              alt=""
              {...getCustomAttributes(fieldKey, 'pre-i')}
            />
          )}
          {attr.suffixIcn && (
            <img
              data-testid={`${fieldKey}-suf-i`}
              data-dev-suf-i={fieldKey}
              className={`${fieldKey}-suf-i ${getCustomClsName(fieldKey, 'suf-i')}`}
              height="90%"
              src={attr.suffixIcn}
              alt=""
              {...getCustomAttributes(fieldKey, 'suf-i')}
            />
          )}
        </div>
      </InputWrapper>
    </>
  )
}
