/* eslint-disable no-param-reassign */
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $breakpoint, $builderHookStates, $fields, $layouts, $nestedLayouts } from '../../GlobalStates/GlobalStates'
import { $styles } from '../../GlobalStates/StylesState'
import ut from '../../styles/2.utilities'
import FieldStyle from '../../styles/FieldStyle.style'
import { addToBuilderHistory } from '../../Utils/FormBuilderHelper'
import { deepCopy } from '../../Utils/Helpers'
import { __ } from '../../Utils/i18nwrap'
import AdminLabelSettings from './CompSettingsUtils/AdminLabelSettings'
import FieldHideSettings from './CompSettingsUtils/FieldHideSettings'
import FieldSettingsDivider from './CompSettingsUtils/FieldSettingsDivider'
import FieldSettingTitle from './StyleCustomize/FieldSettingTitle'
import SizeAndPosition from './StyleCustomize/StyleComponents/SizeAndPosition'

function SpacerFieldSettings() {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const [styles, setStyles] = useAtom($styles)
  const [layouts, setLayouts] = useAtom($layouts)
  const nestedLayouts = useAtomValue($nestedLayouts)
  const breakpoint = useAtomValue($breakpoint)
  let fieldSize = layouts?.[breakpoint]?.find(fl => (fl.i === fldKey)) || {}
  const setBuilderHookStates = useSetAtom($builderHookStates)
  if (!fieldSize) {
    Object.values(nestedLayouts).forEach((lay) => {
      const field = lay?.[breakpoint]?.find(fl => (fl.i === fldKey))
      if (field) {
        fieldSize = field
      }
    })
  }
  const { css } = useFela()
  const fieldData = deepCopy(fields[fldKey])
  const sizeHandler = (e) => {
    const val = e.target.valueAsNumber
    if (val < 0) return

    const layout = create(layouts, draft => {
      const layIndex = draft[breakpoint].findIndex(fl => (fl.i === fldKey))
      draft[breakpoint][layIndex].h = val
    })

    setLayouts(layout)
    setBuilderHookStates(prv => ({ ...prv, reRenderGridLayoutByRootLay: prv.reRenderGridLayoutByRootLay + 1 }))
    addToBuilderHistory({ event: 'Update Field Height', state: { layouts: layout, fldKey } })
  }
  return (
    <div>
      <FieldSettingTitle
        title="Field Settings"
        subtitle={fieldData.typ}
        fieldKey={fldKey}
      />
      <AdminLabelSettings />
      <FieldSettingsDivider />
      <SizeAndPosition />
      <FieldSettingsDivider />
      <div className={css(FieldStyle.fieldSection, FieldStyle.hover_tip, ut.flxcb)}>
        <label htmlFor="alt" className={css(ut.mr1)}>
          {__('Height')}
        </label>
        <input
          type="number"
          name="height"
          data-testid="img-height"
          aria-label="Image Height"
          placeholder="auto"
          className={css(FieldStyle.input, ut.w5, ut.mt0, ut.mb0)}
          value={fieldSize.h || ''}
          onChange={sizeHandler}
          min={0}
        />
      </div>
      <FieldSettingsDivider />
      <FieldHideSettings />
      <FieldSettingsDivider />
    </div>
  )
}

export default SpacerFieldSettings
