import { useAtom } from "jotai"
import { create } from 'mutative'
import { useFela } from "react-fela"
import { useParams } from "react-router-dom"
import { $fields } from "../../../../GlobalStates/GlobalStates"
import FieldStyle from "../../../../styles/FieldStyle.style"
import { deepCopy } from "../../../../Utils/Helpers"
import { __ } from "../../../../Utils/i18nwrap"
import tippyHelperMsg from "../../../../Utils/StaticData/tippyHelperMsg"
import AutoResizeInput from "../../../CompSettings/CompSettingsUtils/AutoResizeInput"
import SimpleAccordion from "../../../CompSettings/StyleCustomize/ChildComp/SimpleAccordion"

export default function ContainerClassSettings() {
  const { css } = useFela()
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)

  if (!fldKey) return null

  const fieldData = deepCopy((fields as any)[fldKey])
  const { customClasses } = fieldData

  const customClsNamHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!fldKey) return
    const { value } = e.target
    const allFields = create(fields, (drftFld: any) => {
      if (!drftFld[fldKey].customClasses) drftFld[fldKey].customClasses = {}
      drftFld[fldKey].customClasses['fld-wrp'] = value
    })
    setFields(allFields)
  }
  return (
    <SimpleAccordion
      id="inp-mod-stng"
      title={__('Container Class')}
      className={css(FieldStyle.fieldSection, FieldStyle.hover_tip)}
      tip={tippyHelperMsg.containerClass}
      tipProps={{ width: 250, icnSize: 17 }}
      proProperty="containerClass"
      toggleChecked={true}
    >
      <div className={css(FieldStyle.placeholder)}>
        <AutoResizeInput
          id="custom-cls-input"
          name="custom-cls-input"
          ariaLabel="Custom Class Names"
          placeholder="e.g. class1 class2 class3"
          value={customClasses?.['fld-wrp'] || ''}
          changeAction={customClsNamHandler}
          rows={3}
        />
      </div>
    </SimpleAccordion>
  )
}