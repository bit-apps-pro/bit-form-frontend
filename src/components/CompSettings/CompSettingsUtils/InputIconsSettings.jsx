import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../GlobalStates/GlobalStates'
import { $styles } from '../../../GlobalStates/StylesState'
import ut from '../../../styles/2.utilities'
import FieldStyle from '../../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { addDefaultStyleClasses, iconElementLabel, isStyleExist, paddingGenerator, setIconFilterValue, styleClasses } from '../../style-new/styleHelpers'
import Modal from '../../Utilities/Modal'
import Icons from '../Icons'
import FieldIconSettings from '../StyleCustomize/ChildComp/FieldIconSettings'
import SimpleAccordion from '../StyleCustomize/ChildComp/SimpleAccordion'

export default function InputIconsSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)
  const fieldData = deepCopy(fields[fldKey])
  const selectedFieldId = useAtomValue($selectedFieldId)
  const [icnMdl, setIcnMdl] = useState(false)
  const [icnType, setIcnType] = useState('')

  const removeIcon = (iconType) => {
    if (fieldData[iconType]) {
      delete fieldData[iconType]
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
      const newStyles = create(styles, draft => {
        const { padding } = styles.fields[selectedFieldId].classes[`.${selectedFieldId}-fld`]
        if (iconType === 'prefixIcn') draft.fields[selectedFieldId].classes[`.${selectedFieldId}-fld`].padding = paddingGenerator(padding, 'left', false)
        if (iconType === 'suffixIcn') draft.fields[selectedFieldId].classes[`.${selectedFieldId}-fld`].padding = paddingGenerator(padding, '', false)
      })
      setStyles(newStyles)
      addToBuilderHistory({ event: `${iconElementLabel[iconType]} Icon Deleted`, type: `delete_${iconType}`, state: { fldKey, fields: allFields, styles: newStyles } })
    }
  }

  const setIconModel = (typ) => {
    if (!isStyleExist(styles, fldKey, styleClasses[typ])) addDefaultStyleClasses(selectedFieldId, typ)
    setIconFilterValue(typ, fldKey)
    setIcnType(typ)
    setIcnMdl(true)
  }

  return (
    <SimpleAccordion
      id="inp-icn-stng"
      title={__('Input Icons')}
      className={css(FieldStyle.fieldSection)}
      toggleChecked
      isPro
      proProperty="inputIcons"
    >
      <div className={css(ut.mt2)}>
        <FieldIconSettings
          label="Leading Icon"
          iconSrc={fieldData?.prefixIcn}
          styleRoute="pre-i"
          setIcon={() => setIconModel('prefixIcn')}
          removeIcon={() => removeIcon('prefixIcn')}
        />
        <FieldIconSettings
          label="Trailing Icon"
          iconSrc={fieldData?.suffixIcn}
          styleRoute="suf-i"
          setIcon={() => setIconModel('suffixIcn')}
          removeIcon={() => removeIcon('suffixIcn')}
        />

      </div>
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
    </SimpleAccordion>
  )
}
