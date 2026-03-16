/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */

import { useAtomValue } from 'jotai'
import { $flags } from '../../GlobalStates/GlobalStates'
import { getCustomAttributes, getCustomClsName } from '../../Utils/globalHelpers'
import RenderStyle from '../style-new/RenderStyle'
import RenderHtml from '../Utilities/RenderHtml'

export default function ShortcodeField({ fieldKey, attr, styleClasses }) {
  const { styleMode } = useAtomValue($flags)
  const isHidden = attr.valid?.hide || false
  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <div
        data-dev-fld-wrp={fieldKey}
        className={`${fieldKey}-fld-wrp ${styleMode ? '' : 'drag'} ${getCustomClsName(fieldKey, 'fld-wrp')} ${isHidden ? 'fld-hide' : ''}`}
        {...getCustomAttributes(fieldKey, 'fld-wrp')}
      >
        <RenderHtml html={attr.content || attr?.info?.content} />
      </div>
    </>
  )
}
