/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useAtomValue } from 'jotai'
import { memo, useEffect, useRef, useState } from 'react'
import { $themeVars } from '../../GlobalStates/ThemeVarsState'
import { getCustomAttributes, getCustomClsName, observeElement, select } from '../../Utils/globalHelpers'
import validateForm from '../../user-frontend/validation'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'

function SliderField({ fieldKey, attr, onBlurHandler, resetFieldValue, formID, styleClasses }) {
  const type = attr.typ === 'url' ? 'text' : attr.typ
  const sliderFieldRef = useRef(null)
  const themeVars = useAtomValue($themeVars)
  const { '--dir': direction } = themeVars
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
  useEffect(() => {
    if (attr.hasWorkflow && attr.val === value && onBlurHandler && !attr.userinput) {
      const { current } = sliderFieldRef
      onBlurHandler(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const onChangeHandler = (event) => {
    const val = attr.typ === 'email' ? event.target.value.toLowerCase() : event.target.value
    setvalue(val)
  }

  useEffect(() => {
    const textFld = select(`#${fieldKey}`)
    if (textFld) {
      observeElement(textFld, 'value', (oldVal, newVal) => setvalue(attr.typ === 'email' ? newVal.toLowerCase() : newVal))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBlur = e => validateForm({ input: e.target })

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
          style={{ '--bfv-fld-val': `'${value || 50}'` }}
        >
          <input
            data-testid={fieldKey}
            data-dev-fld={fieldKey}
            id={fieldKey}
            list={`${fieldKey}-datalist`}
            ref={sliderFieldRef}
            className={`${fieldKey}-fld no-drg ${getCustomClsName(fieldKey, 'fld')}`}
            type={type}
            {...'req' in attr.valid && { required: attr.valid.req }}
            {...'disabled' in attr.valid && { disabled: attr.valid.disabled }}
            {...'mn' in attr && { min: attr.mn }}
            {...'mx' in attr && { max: attr.mx }}
            {...'step' in attr && { step: attr.step }}
            {...'ac' in attr && { autoComplete: attr.ac }}
            {...'name' in attr && { name: attr.name }}
            {...onBlurHandler && { onInput: onBlurHandler }}
            onBlur={handleBlur}
            {...{ value }}
            {...{ onChange: onChangeHandler }}
            {...getCustomAttributes(fieldKey, 'fld')}
            style={{
              '--bfv-fill-lower-track': value ? `${(((value) - (attr.mn || 0)) / ((attr.mx || 100) - (attr.mn || 0)) * 100)}%` : '50%',
              '--bfv-track-dir': direction === 'rtl' ? 'to left' : 'to right',
            }}
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

          <span className={`${fieldKey}-slider-val`}>Value: </span>
        </div>
        {attr.suggestions?.length && (
          <datalist id={`${fieldKey}-datalist`}>
            {attr.suggestions.map(sugg => (
              <option key={sugg.val || sugg.lbl} value={sugg.val || sugg.lbl}>{sugg.lbl}</option>
            ))}
          </datalist>
        )}
      </InputWrapper>
    </>
  )
}
export default memo(SliderField)
