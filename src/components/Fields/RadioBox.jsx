/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { createRef, useRef, useState } from 'react'
import validateForm from '../../user-frontend/validation'
import { reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { getCustomAttributes, getCustomClsName } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'
import RenderHtml from '../Utilities/RenderHtml'

export default function RadioBox({ attr, onBlurHandler, resetFieldValue, formID, fieldKey, styleClasses }) {
  const [value, setvalue] = useState(attr.val || '')
  const radioRef = useRef([])
  const [otherOptValue, setOtherOptValue] = useState('')
  radioRef.current = attr.opt.map((_, i) => radioRef.current[i] ?? createRef())
  // useEffect(() => {
  //   if (attr.val && !attr.userinput) {
  //     setvalue(attr.val)
  //   } else if (!attr.val && !attr.userinput) {
  //     let defaultChecked
  //     if (attr.opt) {
  //       attr.opt.forEach(radioElment => {
  //         if (radioElment.check) {
  //           defaultChecked = radioElment.lbl
  //         }
  //       })
  //     }
  //     setvalue(defaultChecked || '')
  //   } else if (attr.conditional) {
  //     setvalue(attr.val)
  //   }
  // }, [attr.val, attr.userinput, attr.conditional, attr.opt])
  // useEffect(() => {
  //   if (resetFieldValue) {
  //     setvalue('')
  //   }
  // }, [resetFieldValue])
  // useEffect(() => {
  //   if (attr.hasWorkflow && attr.val === value && onBlurHandler && !attr.userinput) {
  //     const radioElm = radioRef.current.find(elm => elm.current.checked && elm.current.value === value)
  //     if (radioElm) {
  //       const { current } = radioElm
  //       onBlurHandler(current)
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [value])

  const onChangeHandler = (event) => {
    if (attr.valid.disabled) {
      return
    }
    setvalue(event.target.value)
    if (onBlurHandler) {
      onBlurHandler(event)
    }
    reCalculateFldHeights(fieldKey)
  }

  const handleBlur = e => {
    const { name, form } = e.target
    validateForm({ input: { name, form, value } })
  }

  const handleOtherOptInput = (e) => {
    setvalue(e.target.value)
    setOtherOptValue(e.target.value)
  }
  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        fieldKey={fieldKey}
        fieldData={attr}
      >
        <div
          data-testid={`${fieldKey}-cc`}
          data-dev-cc={fieldKey}
          className={`${fieldKey}-cc ${getCustomClsName(fieldKey, 'cc')}`}
          {...getCustomAttributes(fieldKey, 'cc')}
        >
          {attr.opt.map((itm, i) => (
            <div
              data-testid={`${fieldKey}-cw`}
              data-dev-cw={fieldKey}
              key={`opr-${i + 22}`}
              className={`${fieldKey}-cw ${getCustomClsName(fieldKey, 'cw')}`}
              {...getCustomAttributes(fieldKey, 'cw')}
            >
              <input
                data-testid={`${fieldKey}-ci`}
                id={`${fieldKey}-chk-${i}`}
                type="radio"
                className={`${fieldKey}-ci ${getCustomClsName(fieldKey, 'ci')}`}
                ref={radioRef.current[i]}
                name={fieldKey}
                value={itm.val || itm.lbl}
                {...itm.check && { checked: true }}
                {...(attr.valid.disabled || itm.disabled) && { disabled: true }}
                {...attr.valid.req && { required: true }}
                {...'name' in attr && { name: attr.name }}
                // {...{ checked: value === (itm.val || itm.lbl) }}
                // {...'readonly' in attr.valid && { readOnly: attr.valid.readonly }}
                checked={(value === (itm.val || itm.lbl)) || (!value && itm.check)}
                onChange={onChangeHandler}
                onBlur={handleBlur}
                {...getCustomAttributes(fieldKey, 'ci')}
              />
              <label
                data-testid={`${fieldKey}-cl`}
                data-dev-cl={fieldKey}
                data-cl
                htmlFor={`${fieldKey}-chk-${i}`}
                className={`${fieldKey}-cl ${getCustomClsName(fieldKey, 'cl')}`}
                {...getCustomAttributes(fieldKey, 'cl')}
              >
                {/* <span data-bx className={`${fieldKey}-bx`} /> */}
                <span
                  data-testid={`${fieldKey}-bx`}
                  data-dev-bx={fieldKey}
                  data-bx
                  className={`${fieldKey}-bx ${getCustomClsName(fieldKey, 'bx')}`}
                  {...getCustomAttributes(fieldKey, 'bx')}
                >
                  <svg width="12" height="10" viewBox="0 0 12 10" className={`${fieldKey}-svgwrp ${getCustomClsName(fieldKey, 'svgwrp')}`}>
                    <use data-ck-icn href={`#${fieldKey}-ck-svg`} className={`${fieldKey}-ck-icn ${getCustomClsName(fieldKey, 'ck-icn')}`} />
                  </svg>
                </span>
                <span
                  data-testid={`${fieldKey}-ct`}
                  data-dev-ct={fieldKey}
                  className={`${fieldKey}-ct ${getCustomClsName(fieldKey, 'ct')}`}
                  {...getCustomAttributes(fieldKey, 'ct')}
                >
                  <RenderHtml html={itm.lbl} />
                </span>
              </label>
            </div>
          ))}
          {attr.addOtherOpt && (
            <div
              data-testid={`${fieldKey}-cw`}
              data-dev-cw={fieldKey}
              key={`opt-${attr.opt.length + 24}`}
              className={`${fieldKey}-cw ${getCustomClsName(fieldKey, 'cw')}`}
              {...getCustomAttributes(fieldKey, 'cw')}
            >
              <input
                data-testid={`${fieldKey}-ci`}
                data-oopt={fieldKey}
                id={`${fieldKey}-chk-${attr.opt.length}`}
                type="radio"
                className={`${fieldKey}-ci ${getCustomClsName(fieldKey, 'ci')}`}
                ref={radioRef.current[attr.opt.length]}
                name={fieldKey}
                value={otherOptValue}
                {...attr.valid.req && { required: true }}
                {...'name' in attr && { name: attr.name }}
                disabled={attr.valid.disabled}
                onChange={onChangeHandler}
                onBlur={handleBlur}
                {...getCustomAttributes(fieldKey, 'ci')}
              />
              <label
                data-testid={`${fieldKey}-cl`}
                data-dev-cl={fieldKey}
                data-cl
                htmlFor={`${fieldKey}-chk-${attr.opt.length}`}
                className={`${fieldKey}-cl ${getCustomClsName(fieldKey, 'cl')}`}
                {...getCustomAttributes(fieldKey, 'cl')}
              >
                <span
                  data-testid={`${fieldKey}-bx`}
                  // data-dev-ck={fieldKey}
                  data-dev-bx={fieldKey}
                  data-bx
                  // className={`${fieldKey}-bx ${fieldKey}-rdo ${getCustomClsName(fieldKey, 'rdo')}`}
                  // {...getCustomAttributes(fieldKey, 'rdo')}
                  className={`${fieldKey}-bx  ${getCustomClsName(fieldKey, 'bx')}`}
                  {...getCustomAttributes(fieldKey, 'bx')}
                >
                  <svg width="12" height="10" viewBox="0 0 12 10" className={`${fieldKey}-svgwrp ${getCustomClsName(fieldKey, 'svgwrp')}`}>
                    <use data-ck-icn href={`#${fieldKey}-ck-svg`} className={`${fieldKey}-ck-icn ${getCustomClsName(fieldKey, 'ck-icn')}`} />
                  </svg>
                </span>
                <span
                  data-testid={`${fieldKey}-ct`}
                  data-dev-ct={fieldKey}
                  className={`${fieldKey}-ct ${getCustomClsName(fieldKey, 'ct')}`}
                  {...getCustomAttributes(fieldKey, 'ct')}
                >
                  {attr.otherOptLbl || 'Other...'}
                </span>
              </label>
              <div data-oinp-wrp className={`${fieldKey}-other-inp-wrp`}>
                <input
                  data-testid={`${fieldKey}-other-inp`}
                  data-dev-other-inp={fieldKey}
                  type="text"
                  className={`${fieldKey}-other-inp ${getCustomClsName(fieldKey, 'other-inp')}`}
                  {...attr.valid.otherOptReq && { required: true }}
                  {...'otherInpPh' in attr && { placeholder: attr.otherInpPh }}
                  {...!('otherInpPh' in attr) && { placeholder: 'Other...' }}
                  value={otherOptValue}
                  onChange={handleOtherOptInput}
                />
              </div>
            </div>
          )}
        </div>
      </InputWrapper>
    </>
  )
}
