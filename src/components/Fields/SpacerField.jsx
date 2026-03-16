/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { useAtomValue } from 'jotai'
import { $flags } from '../../GlobalStates/GlobalStates'
import { getCustomAttributes, getCustomClsName } from '../../Utils/globalHelpers'
import RenderStyle from '../style-new/RenderStyle'

export default function SpacerField({
  fieldKey, attr, onBlurHandler, resetFieldValue, formID, styleClasses,
}) {
  const { styleMode } = useAtomValue($flags)
  const isHidden = attr.valid?.hide || false
  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <div
        data-dev-fld-wrp={fieldKey}
        className={`${fieldKey}-fld-wrp drag ${styleMode ? '' : 'drag'} ${isHidden ? 'fld-hide' : ''} spacer-field-bg ${getCustomClsName(fieldKey, 'fld-wrp')}`}
        {...getCustomAttributes(fieldKey, 'fld-wrp')}
        data-admin-label={attr.adminLbl || attr.lbl || fieldKey}
      />
    </>
  )
}
