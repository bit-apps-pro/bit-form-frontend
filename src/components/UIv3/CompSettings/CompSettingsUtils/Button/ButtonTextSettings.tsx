import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../../../GlobalStates/GlobalStates'
import { $styles } from '../../../../../GlobalStates/StylesState'
import { addToBuilderHistory } from '../../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../../Utils/Helpers'
import { sanitizeHTML } from '../../../../../Utils/globalHelpers'
import { __ } from '../../../../../Utils/i18nwrap'
import FieldStyle from '../../../../../styles/FieldStyle.style'
import AutoResizeInput from '../../../../CompSettings/CompSettingsUtils/AutoResizeInput'
import Icons from '../../../../CompSettings/Icons'
// import FieldIconSettings from '../../../../CompSettings/StyleCustomize/ChildComp/FieldIconSettings'
import SimpleAccordion from '../../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion'
import Modal from '../../../../Utilities/Modal'
import { addDefaultStyleClasses, iconElementLabel, isStyleExist, setIconFilterValue, styleClasses } from '../../../../style-new/styleHelpers'
import FieldIconSettings from '../../StyleCustomize/ChildComp/FieldIconSettings'

/**
 * Button Text Settings Component
 * Handles button text input and leading/trailing icon configuration
 */
export default function ButtonTextSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams<{ fieldKey: string }>()
  const [fields, setFields] = useAtom($fields)
  const [styles] = useAtom($styles)
  const selectedFieldId = useAtomValue($selectedFieldId)
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')

  if (!fldKey) return null

  const fieldData = deepCopy(fields[fldKey])
  const { txt } = fieldData

  const setSubBtnTxt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const val = sanitizeHTML(value)
    fieldData.txt = val
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({
      event: `Button text updated : ${fieldData.txt}`,
      type: 'change_btn_txt',
      state: { fields: allFields, fldKey }
    })
  }

  const setIconModel = (typ: string) => {
    if (!isStyleExist(styles, fldKey, styleClasses[typ])) {
      addDefaultStyleClasses(selectedFieldId, typ)
    }
    setIconFilterValue(typ, fldKey)
    setIcnType(typ)
    setIcnMdl(true)
  }

  const removeIcon = (iconType: string) => {
    if (fieldData[iconType]) {
      delete fieldData[iconType]
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      addToBuilderHistory({
        event: `${iconElementLabel[iconType]} Icon Deleted`,
        type: `delete_${iconType}`,
        state: { fldKey, fields: allFields }
      })
    }
  }

  return (
    <>
      <SimpleAccordion
        id="btn-txt-stng"
        title={__('Button Text')}
        className={css(FieldStyle.fieldSection)}
        open
      >
        <div className={css(FieldStyle.placeholder)}>
          <AutoResizeInput
            id="btn-txt"
            aria-label="Button text"
            placeholder="Type text here..."
            value={txt}
            changeAction={setSubBtnTxt}
          />
        </div>
        <div className={css(FieldStyle.iconLayoutHorizontal)}>


          <FieldIconSettings
            label={__('Prefix Icon')}
            iconSrc={fieldData?.btnPreIcn}
            styleRoute="btn-pre-i"
            setIcon={() => setIconModel('btnPreIcn')}
            removeIcon={() => removeIcon('btnPreIcn')}
            // isPro
            position='prefix'
          />

          <span className={css(FieldStyle.iconSeparator)}>|</span>

          <FieldIconSettings
            label={__('Suffix Icon')}
            iconSrc={fieldData?.btnSufIcn}
            styleRoute="btn-suf-i"
            setIcon={() => setIconModel('btnSufIcn')}
            removeIcon={() => removeIcon('btnSufIcn')}
            // isPro
            position='suffix'
          />
        </div>
      </SimpleAccordion>

      <Modal
        md
        autoHeight
        show={icnMdl}
        setModal={setIcnMdl}
        className="o-v"
        title={__('Icons')}
      >
        <div className="pos-rel" />
        <Icons
          iconType={icnType}
          addPaddingOnSelect={false}
          setModal={setIcnMdl}
        />
      </Modal>
    </>
  )
}