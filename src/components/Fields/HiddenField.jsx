/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { memo, useEffect, useRef, useState } from 'react'
import { getCustomAttributes, getCustomClsName } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

function HiddenField({ fieldKey, attr, onBlurHandler, resetFieldValue, formID, styleClasses }) {
  const type = attr.typ === 'hidden' ? 'text' : attr.typ
  const textFieldRef = useRef(null)
  const [value, setvalue] = useState(attr.val !== undefined ? attr.val : '')
  useEffect(() => {
    if (attr.val !== undefined && !attr.userinput) {
      setvalue(attr.val)
    } else if (!attr.val && !attr.userinput) {
      setvalue(attr.defaultValue || '')
    } else if (attr.conditional) {
      setvalue(attr.val)
    }
  }, [attr.val, attr.defaultValue, attr.userinput, attr.conditional])

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={attr}
        noErrMsg
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
            id={fieldKey}
            list={`${fieldKey}-datalist`}
            ref={textFieldRef}
            className={`${fieldKey}-fld no-drg ${getCustomClsName(fieldKey, 'fld')}`}
            type={type}
            {...'ph' in attr && { placeholder: attr.ph }}
            {...'name' in attr && { name: attr.name }}
            {...onBlurHandler && { onInput: onBlurHandler }}
            {...{ value }}
            {...getCustomAttributes(fieldKey, 'fld')}
          />
        </div>
      </InputWrapper>
    </>
  )
}
export default memo(HiddenField)
