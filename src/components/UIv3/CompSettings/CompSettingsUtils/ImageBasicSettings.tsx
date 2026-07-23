import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../GlobalStates/StylesState'
import ut from '../../../../styles/2.utilities'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import AutoResizeInput from '../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import FieldSettingsDivider from '../../../CompSettings/CompSettingsUtils/FieldSettingsDivider'
import Icons from '../../../CompSettings/Icons'
import SimpleAccordion from '../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import { assignNestedObj } from '../../../style-new/styleHelpers'
import Modal from '../../../Utilities/Modal'
import Tip from '../../../Utilities/Tip'

/**
 * Image Basic Settings Component
 * Handles background image URL, dimensions, and alt text settings
 */
export default function ImageBasicSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const setStyles = useSetAtom($styles)
  const [icnMdl, setIcnMdl] = useState(false)

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const alt = fieldData.alt || ''

  const setAlt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value === '') {
      delete fieldData.alt
    } else {
      fieldData.alt = value.replace(/\\\\/g, '$_bf_$')
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Field alt Change ${fieldData.alt || fldKey}`,
      type: 'field_alt_change',
      state: { fields: allFields, fldKey },
    })
  }

  const setImgUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value === '') {
      delete fieldData.bg_img
    } else {
      fieldData.bg_img = value.replace(/\\\\/g, '$_bf_$')
    }
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Field Image Change ${fieldData.bg_img || fldKey}`,
      type: 'field_img_change',
      state: { fields: allFields, fldKey },
    })
  }

  const sizeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    fieldData[name] = Number(value)
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)

    const getPropertyPath = (cssProperty: string) =>
      `fields->${fldKey}->classes->.${fldKey}-fld-wrp->${cssProperty}`

    addToBuilderHistory({
      event: `Field ${name} Change ${fieldData.lbl || fldKey}`,
      type: `field_${name}_change`,
      state: { fields: allFields, fldKey },
    })

    reCalculateFldHeights()

    setStyles(prvStyle => create(prvStyle, drftStyle => {
      assignNestedObj(drftStyle, getPropertyPath(name), `${Number(value)}px`)
      if (name === 'height') {
        assignNestedObj(drftStyle, getPropertyPath('max-height'), `${Number(value)}px`)
      }
    }))
  }

  return (
    <>
      <SimpleAccordion
        id="nam-stng"
        title={__('Background Image')}
        className={css(FieldStyle.fieldSection)}
      >
        <div className={css(ut.flxc, { jc: 'end' })}>
          <Tip msg="Change">
            <button
              data-testid="img-edt-btn"
              type="button"
              onClick={() => setIcnMdl(true)}
              className={css(btnStyle.browseBtn)}
            >
              Browse
            </button>
          </Tip>
        </div>

        <div className={css({ w: '97%', mx: 5 })}>
          <AutoResizeInput
            id="fld-lbl-stng"
            ariaLabel="Label input"
            changeAction={setImgUrl}
            value={fieldData.bg_img?.replace(/\$_bf_\$/g, '\\')}
            placeholder="e.g: https://ps.w.org/bit-form/assets/icon-256x256.png?rev=2376144"
          />
        </div>

        <div className={css(ut.flxcb, ut.ml1)}>
          <label htmlFor="alt" className={css(ut.mr1)}>
            {__('Width')}
          </label>
          <input
            type="number"
            name="width"
            data-testid="img-width"
            aria-label="Image Width"
            placeholder="auto"
            className={css(FieldStyle.input, ut.w4)}
            value={fieldData.width}
            onChange={sizeHandler}
          />
        </div>
        <div className={css(ut.flxcb, ut.ml1)}>
          <label htmlFor="alt" className={css(ut.mr1)}>
            {__('Height')}
          </label>
          <input
            type="number"
            name="height"
            data-testid="img-height"
            aria-label="Image Height"
            placeholder="auto"
            className={css(FieldStyle.input, ut.w4)}
            value={fieldData.height}
            onChange={sizeHandler}
          />
        </div>
      </SimpleAccordion>

      <FieldSettingsDivider />

      <SimpleAccordion
        id="nam-stng"
        title={__('Image Alt Text')}
        className={css(FieldStyle.fieldSection)}
      >
        <div>
          <div className={css({ w: '97%', mx: 5 })}>
            <AutoResizeInput
              id="fld-lbl-stng"
              ariaLabel="Label input"
              changeAction={setAlt}
              value={alt.replace(/\$_bf_\$/g, '\\')}
              placeholder="Alternative Text"
            />
          </div>
        </div>
      </SimpleAccordion>

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title="Image"
      >
        <div className="pos-rel" />
        <Icons
          iconType="bg_img"
          selected="Upload Image"
          uploadLbl="Upload Image"
          setModal={setIcnMdl}
          unsplash
        />
      </Modal>
    </>
  )
}

const btnStyle = {
  browseBtn: {
    b: 'none',
    bd: 'none',
    p: '5px 10px',
    tn: 'all ease-in-out 0.2s',
    '&:hover': {
      bd: 'var(--b-79-96)',
      cr: 'var(--b-50)',
      brs: '8px',
    },
  },
}