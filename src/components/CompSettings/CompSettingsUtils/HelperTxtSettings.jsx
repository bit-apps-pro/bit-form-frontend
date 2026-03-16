/* eslint-disable no-console */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../GlobalStates/GlobalStates'
import { $styles } from '../../../GlobalStates/StylesState'
import { addToBuilderHistory, reCalculateFldHeights } from '../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../Utils/Helpers'
import tippyHelperMsg from '../../../Utils/StaticData/tippyHelperMsg'
import { sanitizeHTML } from '../../../Utils/globalHelpers'
import { __ } from '../../../Utils/i18nwrap'
import FieldStyle from '../../../styles/FieldStyle.style'
import Modal from '../../Utilities/Modal'
import { addDefaultStyleClasses, isStyleExist, setIconFilterValue, styleClasses } from '../../style-new/styleHelpers'
import Icons from '../Icons'
import FieldIconSettings from '../StyleCustomize/ChildComp/FieldIconSettings'
import SimpleAccordion from '../StyleCustomize/ChildComp/SimpleAccordion'
import AutoResizeInput from './AutoResizeInput'

export default function HelperTxtSettings({ defaultText }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const selectedFieldId = useAtomValue($selectedFieldId)
  const [styles, setStyles] = useAtom($styles)
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')
  const { css } = useFela()

  const adminLabel = fieldData.adminLbl || ''
  const helperTxt = fieldData.helperTxt || ''

  const hideHelperTxt = ({ target: { checked } }) => {
    if (checked) {
      fieldData.helperTxt = defaultText || 'Helper Text'
      fieldData.hlpTxtHide = true
      addDefaultStyleClasses(selectedFieldId, 'hlpTxt')
    } else {
      fieldData.hlpTxtHide = false
      delete fieldData.helperTxt
    }

    const req = checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    // recalculate builder field height
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Helper Text ${req}:  ${fieldData.lbl || adminLabel || fldKey}`,
      type: `helpetTxt_${req}`,
      state: { fields: allFields, fldKey },
    })
  }

  const setHelperTxt = ({ target: { value } }) => {
    if (value === '') {
      delete fieldData.helperTxt
      // recalculate builder field height
      reCalculateFldHeights(fldKey)
    } else {
      const val = sanitizeHTML(value)
      fieldData.helperTxt = val
    }

    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    reCalculateFldHeights(fldKey)
    addToBuilderHistory({
      event: `Helper Text updated: ${adminLabel || fieldData.lbl || fldKey}`,
      type: 'change_helperTxt',
      state: { fields: allFields, fldKey },
    })
  }

  const setIconModel = (typ) => {
    if (!isStyleExist(styles, fldKey, styleClasses[typ])) addDefaultStyleClasses(selectedFieldId, typ)
    setIconFilterValue(typ, fldKey)
    setIcnType(typ)
    setIcnMdl(true)
  }

  const removeIcon = (iconType) => {
    if (fieldData[iconType]) {
      delete fieldData[iconType]
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      setStyles(prvStyle => create(prvStyle, draft => {
        if (iconType === 'prefixIcn') delete draft.fields[selectedFieldId].classes[`.${selectedFieldId}-fld`]['padding-left']
        if (iconType === 'suffixIcn') delete draft.fields[selectedFieldId].classes[`.${selectedFieldId}-fld`]['padding-right']
      }))
      reCalculateFldHeights(fldKey)
    }
  }

  return (
    <>
      <SimpleAccordion
        id="hlpr-txt-stng"
        title={__('Helper Text')}
        className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
        switching
        tip={tippyHelperMsg.helpText}
        tipProps={{ width: 250, icnSize: 17 }}
        toggleAction={hideHelperTxt}
        toggleChecked={fieldData?.hlpTxtHide}
        open={fieldData?.hlpTxtHide}
        disable={!fieldData?.hlpTxtHide}
      >
        <div className={css(FieldStyle.placeholder)}>
          <AutoResizeInput
            id="hlpr-txt-stng"
            aria-label="Helper text for this Field"
            placeholder="Type Helper text here..."
            value={helperTxt}
            changeAction={setHelperTxt}
          />
        </div>
        <FieldIconSettings
          label="Leading Icon"
          iconSrc={fieldData?.hlpPreIcn}
          styleRoute="hlp-txt-pre-i"
          setIcon={() => setIconModel('hlpPreIcn')}
          removeIcon={() => removeIcon('hlpPreIcn')}
          isPro
          proProperty="leadingIcon"
        />
        <FieldIconSettings
          label="Trailing Icon"
          iconSrc={fieldData?.hlpSufIcn}
          styleRoute="hlp-txt-suf-i"
          setIcon={() => setIconModel('hlpSufIcn')}
          removeIcon={() => removeIcon('hlpSufIcn')}
          isPro
          proProperty="trailingIcon"
        />

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
