/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { $fields } from '../../GlobalStates/GlobalStates'
import { reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { getCustomAttributes, getCustomClsName } from '../../Utils/globalHelpers'
import { deepCopy } from '../../Utils/Helpers'
import InputWrapper from '../InputWrapper'
import RenderStyle from '../style-new/RenderStyle'
import RenderHtml from '../Utilities/RenderHtml'

export default function CheckBox({ attr, onBlurHandler, resetFieldValue, formID, fieldKey, styleClasses }) {
  const fields = useAtomValue($fields)
  const [checkBoxes, setCheckBoxes] = useState({ checked: [] })
  const fieldData = deepCopy(fields[fieldKey])
  const [otherOptValue, setOtherOptValue] = useState('')

  // let defaultValue
  // if ('val' in attr && attr.val && attr.val.length > 0) {
  //   if (typeof attr.val === 'string') {
  //     if (attr.val[0] === '[') {
  //       defaultValue = JSON.parse(attr.val)
  //     } else {
  //       defaultValue = attr.val.split(',')
  //     }
  //   } else if (Array.isArray(attr.val)) {
  //     defaultValue = attr.val
  //   }
  // } else {
  //   // defaultValue = attr.opt.map(checkBoxElement => checkBoxElement.check && checkBoxElement.lbl)
  //   defaultValue = attr.opt.filter(checkBoxElement => checkBoxElement.check).map(checkBoxElement => checkBoxElement.val || checkBoxElement.lbl)
  // }
  // const [value, setvalue] = useState(defaultValue || [])
  // const checkBoxRef = useRef(null)
  // useEffect(() => {
  //   if (defaultValue && JSON.stringify(defaultValue) !== JSON.stringify(value) && !attr.userinput) {
  //     setvalue(defaultValue)
  //   } else if (attr.conditional) {
  //     setvalue(defaultValue)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [attr.val, attr.userinput, attr.conditional, attr.opt])
  // useEffect(() => {
  //   if (resetFieldValue) {
  //     setvalue([])
  //   }
  // }, [resetFieldValue])
  // useEffect(() => {
  //   if (attr.hasWorkflow && JSON.stringify(defaultValue) === JSON.stringify(value) && onBlurHandler && !attr.userinput) {
  //     const { current } = checkBoxRef
  //     onBlurHandler(current)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [value])
  const onChangeHandler = (e, optKey) => {
    const { checked } = e.target
    if (checked) {
      checkBoxes.checked.push(optKey)
    } else {
      const getIndx = checkBoxes.checked.indexOf(optKey)
      checkBoxes.checked.splice(getIndx, 1)
      setCheckBoxes({ checked: checkBoxes.checked })
    }
    reCalculateFldHeights(fieldKey)
    // if (attr.valid.disabled) {
    //   return
    // }
    // let val = []
    // const index = value.indexOf(event.target.value)
    // console.log(value, index)
    // if (event.target.checked && index === -1) {
    //   val = [...value, event.target.value]
    // } else if (!event.target.checked && index >= 0) {
    //   val = value.filter(v => v !== event.target.value)
    // }
    // if (!attr.valid.disableOnMax || (attr.valid.disableOnMax && val.length <= Number(attr.mx))) {
    //   setvalue(val)
    // }

    // if (onBlurHandler) {
    //   onBlurHandler(event)
    // }
  }

  // const handleBlur = e => {
  //   const { name, form } = e.target
  //   validateForm({ input: { name, form, value: value.length ? value : '' } })
  // }
  // input ~ label

  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <InputWrapper
        formID={formID}
        // fieldKey={attr.name}
        fieldKey={fieldKey}
        fieldData={attr}
      >
        {/* cc for checkbox container */}
        <div
          data-testid={`${fieldKey}-cc`}
          data-dev-cc={fieldKey}
          className={`${fieldKey}-cc ${getCustomClsName(fieldKey, 'cc')}`}
          {...getCustomAttributes(fieldKey, 'cc')}
        >
          {/* <svg
            className={`${fieldKey}-cks ${getCustomClsName(fieldKey, 'cks')}`}
            {... { ...getCustomAttributes(fieldKey, 'cks') }}
          >
            <symbol id={`${fieldKey}-ck-svg ${getCustomClsName(fieldKey, 'ck-svg')}`} viewBox="0 0 12 10">
              <polyline
                className={`${fieldKey}-ck-svgline ${getCustomClsName(fieldKey, 'ck-svgline')}`}
                points="1.5 6 4.5 9 10.5 1"
              />
            </symbol>
          </svg> */}

          <svg className={`${fieldKey}-cks`}>
            <symbol id={`${fieldKey}-ck-svg`} viewBox="0 0 12 10">
              <polyline
                className={`${fieldKey}-ck-svgline`}
                points="1.5 6 4.5 9 10.5 1"
              />
            </symbol>
          </svg>

          {attr.opt.map((itm, i) => (
            <div
              data-testid={`${fieldKey}-cw`}
              data-dev-cw={fieldKey}
              key={`opt-${i + 24}`}
              className={`${fieldKey}-cw ${getCustomClsName(fieldKey, 'cw')}`}
              {...getCustomAttributes(fieldKey, 'cw')}
            >
              <input
                data-testid={`${fieldKey}-ci`}
                id={`${fieldKey}-chk-${i}`}
                type="checkbox"
                className={`${fieldKey}-ci ${getCustomClsName(fieldKey, 'ci')}`}
                {...(attr.valid.disabled || itm.disabled) && { disabled: true }}
                // disabled={attr.valid.disabled}
                // readOnly={attr?.valid?.readonly}
                // {...itm.check && { defaultChecked: true }}
                // {...value && value.indexOf(itm.lbl) >= 0 && { defaultChecked: true }}
                defaultValue={itm.val || itm.lbl}
                {...attr.valid.req && { required: true }}
                // {...'name' in attr && { name: `${attr.name}[]` }}
                name={`${fieldData.lbl}[]`}
                checked={checkBoxes.checked.includes(i) || itm?.check}
                onChange={(e) => onChangeHandler(e, i)}
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
                type="checkbox"
                className={`${fieldKey}-ci ${getCustomClsName(fieldKey, 'ci')}`}
                disabled={attr.valid.disabled}
                value={otherOptValue}
                {...attr.valid.req && { required: true }}
                name={`${fieldData.lbl}[]`}
                checked={checkBoxes.checked.includes(attr.opt.length)}
                onChange={(e) => onChangeHandler(e, attr.opt.length)}
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
                  data-dev-ck={fieldKey}
                  data-bx
                  className={`${fieldKey}-bx ${fieldKey}-ck ${getCustomClsName(fieldKey, 'ck')}`}
                  {...getCustomAttributes(fieldKey, 'ck')}
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
                  onChange={(e) => setOtherOptValue(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </InputWrapper>
    </>
  )
}
