/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { createRef, useRef, useState } from 'react'
import { reCalculateFldHeights } from '../../Utils/FormBuilderHelper'
import { getCustomAttributes, getCustomClsName } from '../../Utils/globalHelpers'
import InputWrapper from '../InputWrapper'
import RenderHtml from '../Utilities/RenderHtml'
import RenderStyle from '../style-new/RenderStyle'

export default function ImageSelectField({ attr, onBlurHandler, resetFieldValue, formID, fieldKey, styleClasses }) {
  const [value, setvalue] = useState(attr.val || '')
  const imgSelectRef = useRef([])
  const [checkBoxes, setCheckBoxes] = useState({ checked: [] })

  imgSelectRef.current = attr.opt.map((_, i) => imgSelectRef.current[i] ?? createRef())

  const onChangeHandler = (e, optKey) => {
    const { checked } = e.target
    if (checked && attr.inpType === 'checkbox') {
      checkBoxes.checked.push(optKey)
      setvalue(null)
    } else {
      const getIndx = checkBoxes.checked.indexOf(optKey)
      checkBoxes.checked.splice(getIndx, 1)
      setCheckBoxes({ checked: checkBoxes.checked })
    }
    // for radio
    if (checked && attr.inpType === 'radio') {
      checkBoxes.checked = []
      setvalue(e.target.value)
    } else {
      setvalue('')
    }
    reCalculateFldHeights(fieldKey)
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
          data-testid={`${fieldKey}-inp-fld-wrp`}
          data-dev-inp-fld-wrp={fieldKey}
          className={`${fieldKey}-inp-fld-wrp ${getCustomClsName(fieldKey, 'inp-fld-wrp')}`}
          {...getCustomAttributes(fieldKey, 'inp-fld-wrp')}
        >
          <div
            data-testid={`${fieldKey}-ic`}
            data-dev-ic={fieldKey}
            className={`${fieldKey}-ic ${getCustomClsName(fieldKey, 'ic')}`}
            {...getCustomAttributes(fieldKey, 'ic')}
          >
            {attr.opt.map((itm, i) => (
              <div
                data-testid={`${fieldKey}-inp-opt`}
                data-dev-inp-opt={fieldKey}
                key={`opr-${i + 22}`}
                className={`${fieldKey}-inp-opt ${getCustomClsName(fieldKey, 'inp-opt')}`}
                {...getCustomAttributes(fieldKey, 'inp-opt')}
              >
                <input
                  className={`${fieldKey}-img-inp ${getCustomClsName(fieldKey, 'img-inp')}`}
                  type={attr.inpType}
                  aria-label={itm.lbl}
                  id={`${fieldKey}-img-wrp-${i}`}
                  name={fieldKey}
                  value={itm.val || itm.lbl}
                  {...attr.valid.req && { required: true }}
                  checked={(value === itm.val) || checkBoxes.checked.includes(i) || itm?.check}
                  disabled={attr.valid.disabled}
                  onChange={(e) => onChangeHandler(e, i)}
                  {...getCustomAttributes(fieldKey, 'img-inp')}
                  data-dev-img-inp={fieldKey}
                />
                <label
                  data-testid={`${fieldKey}-img-wrp`}
                  data-dev-img-wrp={fieldKey}
                  htmlFor={`${fieldKey}-img-wrp-${i}`}
                  className={`${fieldKey}-img-wrp ${getCustomClsName(fieldKey, 'img-wrp')}`}
                  {...getCustomAttributes(fieldKey, 'img-wrp')}
                >
                  <span
                    data-testid={`${fieldKey}-check-box`}
                    data-dev-check-box={fieldKey}
                    className={`${fieldKey}-check-box ${getCustomClsName(fieldKey, 'check-box')}`}
                    {...getCustomAttributes(fieldKey, 'check-box')}
                  >
                    <img
                      src={attr.tickImgSrc}
                      alt=""
                      data-testid={`${fieldKey}-check-img`}
                      data-dev-check-img={fieldKey}
                      className={`${fieldKey}-check-img ${getCustomClsName(fieldKey, 'check-img')}`}
                      {...getCustomAttributes(fieldKey, 'check-img')}
                    />
                  </span>

                  <span
                    data-testid={`${fieldKey}-img-card-wrp`}
                    data-dev-img-card-wrp={fieldKey}
                    className={`${fieldKey}-img-card-wrp ${getCustomClsName(fieldKey, 'img-card-wrp')}`}
                    {...getCustomAttributes(fieldKey, 'img-card-wrp')}
                  >
                    <img
                      src={itm.img}
                      alt={itm.lbl}
                      aria-label={itm.lbl}
                      data-testid={`${fieldKey}-select-img`}
                      data-dev-select-img={fieldKey}
                      className={`${fieldKey}-select-img ${getCustomClsName(fieldKey, 'select-img')}`}
                      {...getCustomAttributes(fieldKey, 'select-img')}
                    />
                    {!attr.optLblHide && (
                      <div
                        data-testid={`${fieldKey}-tc`}
                        data-dev-tc={fieldKey}
                        className={`${fieldKey}-tc ${getCustomClsName(fieldKey, 'tc')}`}
                        {...getCustomAttributes(fieldKey, 'tc')}
                      >
                        <span
                          data-testid={`${fieldKey}-img-title`}
                          data-dev-img-title={fieldKey}
                          className={`${fieldKey}-img-title ${getCustomClsName(fieldKey, 'img-title')}`}
                          {...getCustomAttributes(fieldKey, 'img-title')}
                        >
                          <RenderHtml html={itm.lbl} />
                        </span>
                      </div>
                    )}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </InputWrapper>
    </>
  )
}
