/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../GlobalStates/GlobalStates'
import { $styles } from '../../../GlobalStates/StylesState'
import ut from '../../../styles/2.utilities'
import FieldStyle from '../../../styles/FieldStyle.style'
import { addToBuilderHistory, escapeBackslashPattern, generateBackslashPattern, reCalculateFldHeights } from '../../../Utils/FormBuilderHelper'
import { sanitizeHTML } from '../../../Utils/globalHelpers'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import tippyHelperMsg from '../../../Utils/StaticData/tippyHelperMsg'
import {
  addDefaultStyleClasses,
  iconElementLabel,
  isStyleExist,
  setIconFilterValue,
  styleClasses,
} from '../../style-new/styleHelpers'
import Modal from '../../Utilities/Modal'
import Icons from '../Icons'
import FieldIconSettings from '../StyleCustomize/ChildComp/FieldIconSettings'
import SimpleAccordion from '../StyleCustomize/ChildComp/SimpleAccordion'
import AutoResizeInput from './AutoResizeInput'

export default function FieldLabelSettings({ hideIcons }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const styles = useAtomValue($styles)
  const label = fieldData.lbl || ''
  const { css } = useFela()
  const selectedFieldId = useAtomValue($selectedFieldId)
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')

  function setLabel(e) {
    const { value } = e.target
    if (value === '') {
      delete fieldData.lbl
    } else {
      const val = sanitizeHTML(value)
      fieldData.lbl = escapeBackslashPattern(val)
    }
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Field Label Change ${fieldData.lbl || fldKey}`,
      type: 'field_label_change',
      state: { fields: allFields, fldKey },
    })
  }

  const hideFieldLabel = e => {
    if (e.target.checked) {
      fieldData.lbl = 'Field Label'
      fieldData.valid.hideLbl = false
      addDefaultStyleClasses(selectedFieldId, 'lbl')
    } else {
      fieldData.valid.hideLbl = true
      delete fieldData.lbl
    }
    // eslint-disable-next-line no-param-reassign
    const req = !e.target.checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Field Label Hide ${req}: ${fieldData.lbl || fldKey}`,
      type: `field_label_hide_${req}`,
      state: { fields: allFields, fldKey },
    })
  }

  const removeIcon = (iconType) => {
    if (fieldData[iconType]) {
      delete fieldData[iconType]
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      reCalculateFldHeights(fldKey)
      addToBuilderHistory({
        event: `${iconElementLabel[iconType]} Icon Deleted`,
        type: `delete_${iconType}`,
        state: { fldKey, fields: allFields },
      })
    }
  }

  const setIconModel = (iconType) => {
    if (!isStyleExist(styles, fldKey, styleClasses[iconType])) addDefaultStyleClasses(selectedFieldId, iconType)
    setIconFilterValue(iconType, fldKey)
    setIcnType(iconType)
    setIcnMdl(true)
  }

  return (
    <>
      <SimpleAccordion
        id="fld-lbl-stng"
        title={__('Label')}
        className={`${css(FieldStyle.fieldSection)} ${css(FieldStyle.hover_tip)}`}
        switching
        tip={tippyHelperMsg.lbl}
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={hideFieldLabel}
        toggleChecked={!fieldData.valid.hideLbl}
        open={!fieldData.valid.hideLbl}
        disable={fieldData.valid.hideLbl}
        proTip="Use this feature? please buy pro version."
      >
        <div>
          <div className={css({ w: '97%', mx: 5 })}>
            <AutoResizeInput
              id="fld-lbl-stng"
              ariaLabel="Label input"
              changeAction={setLabel}
              value={generateBackslashPattern(label)}
            />
          </div>

          {!hideIcons && (
            <div className={css(ut.mt1)}>
              <FieldIconSettings
                label="Leading Icon"
                iconSrc={fieldData?.lblPreIcn}
                styleRoute="lbl-pre-i"
                setIcon={() => setIconModel('lblPreIcn')}
                removeIcon={() => removeIcon('lblPreIcn')}
                isPro
                proProperty="leadingIcon"
              />

              <FieldIconSettings
                label="Trailing Icon"
                iconSrc={fieldData?.lblSufIcn}
                styleRoute="lbl-suf-i"
                setIcon={() => setIconModel('lblSufIcn')}
                removeIcon={() => removeIcon('lblSufIcn')}
                isPro
                proProperty="trailingIcon"
              />
            </div>
          )}
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
        <Icons iconType={icnType} setModal={setIcnMdl} />
      </Modal>
    </>
  )
}
