/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react'
import { getCustomAttributes, getCustomClsName } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'
import RenderHtml from '../Utilities/RenderHtml'

export default function GDPRAgreement({ attr, onBlurHandler, resetFieldValue, formID, fieldKey, styleClasses }) {
  let { checked } = attr.valid
  const defaultValue = attr.val || (checked ? attr.msg.checked : attr.msg.unchecked)
  const [value, setvalue] = useState(defaultValue)
  if (value === attr.msg.unchecked) {
    checked = false
  } else if (value === attr.msg.checked) {
    checked = true
  }
  const onChangeHandler = (event) => {
    if (attr.valid.disabled) {
      return
    }
    if (event.target.checked) {
      setvalue(attr.msg.checked)
    } else {
      setvalue(attr.msg.unchecked)
    }

    const { form } = event.target
    validateForm({ input: { name: attr.name, form, value: event.target.checked ? attr.msg.checked : attr.msg.unchecked } })
  }

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />

      <InputWrapper
        formID={formID}
        // fieldKey={attr.name}
        fieldKey={fieldKey}
        fieldData={attr}
        noLabel
      >
        <div
          data-dev-cc={fieldKey}
          className={`${fieldKey}-cc ${getCustomClsName(fieldKey, 'cc')}`}
          {...getCustomAttributes(fieldKey, 'cc')}
        >
          <svg className={`${fieldKey}-cks`}>
            <symbol id={`${fieldKey}-ck-svg`} viewBox="0 0 12 10">
              <polyline
                className={`${fieldKey}-ck-svgline`}
                points="1.5 6 4.5 9 10.5 1"
              />
            </symbol>
          </svg>

          <div
            data-dev-cw={fieldKey}
            className={`${fieldKey}-cw ${getCustomClsName(fieldKey, 'cw')}`}
            {...getCustomAttributes(fieldKey, 'cw')}
          >
            <input
              data-testid={fieldKey}
              id={`${fieldKey}-decision`}
              type="checkbox"
              className={`${fieldKey}-ci`}
              {...'req' in attr.valid && { required: attr.valid.req }}
              {...'disabled' in attr.valid && { disabled: attr.valid.disabled }}
              {...'readonly' in attr.valid && { readOnly: attr.valid.readonly }}
              defaultValue={attr?.info?.lbl}
              {...'name' in attr && { name: attr.name }}
              {...{ checked }}
              {...{ value }}
              {...{ onChange: onChangeHandler }}
            />
            <label
              data-dev-cl={fieldKey}
              data-cl
              htmlFor={`${fieldKey}-decision`}
              className={`${fieldKey}-cl ${getCustomClsName(fieldKey, 'cl')}`}
              {...getCustomAttributes(fieldKey, 'cl')}
            >
              <span
                data-dev-bx={fieldKey}
                data-bx
                className={`${fieldKey}-bx ${getCustomClsName(fieldKey, 'bx')}`}
                {...getCustomAttributes(fieldKey, 'bx')}
              >
                <svg width="12" height="10" viewBox="0 0 12 10" className={`${fieldKey}-svgwrp`}>
                  <use data-ck-icn href={`#${fieldKey}-ck-svg`} className={`${fieldKey}-ck-icn`} />
                </svg>
              </span>
              <span
                data-dev-ct={fieldKey}
                className={`${fieldKey}-ct ${getCustomClsName(fieldKey, 'ct')}`}
                {...getCustomAttributes(fieldKey, 'ct')}
              >
                <RenderHtml html={attr.lbl || attr?.info?.lbl} />
              </span>
            </label>
          </div>
        </div>
      </InputWrapper>
    </>
  )
}
