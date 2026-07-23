import { useAtomValue } from 'jotai'
import { useFela } from 'react-fela'

import ut from '../../../../styles/2.utilities'
import style from '../../../../styles/FieldSettingTitle.style'
import { __ } from '../../../../Utils/i18nwrap'
import CoolCopy from '../../../Utilities/CoolCopy'

import { $builderRightPanelScroll } from '../../../../GlobalStates/GlobalStates'
import Back2FldBtn from '../../../CompSettings/Back2FldBtn'
import HighlightFocusButton from '../StyleCustomize/ChildComp/HighlightFocusButton'

interface FieldSettingTitleProps {
  title: string
  subtitle?: string
  fieldKey: string
  highlightSelector?: string
}

export default function FieldSettingsTitle({ title, fieldKey, highlightSelector }: FieldSettingTitleProps) {
  const scrollTo = useAtomValue($builderRightPanelScroll)
  const { css } = useFela()

  return (
    <div className={css(style.section, style.flxColumn, style.fixed, scrollTo && style.shw)}>
      <Back2FldBtn size="16" className={css(style.btn, ut.fontBody)} />
      <div className={css(style.titleWrapper)}>
        <span className={css(style.mainTitle)}>{__(title)}</span>
        <div className={css({ flx: 'center', gap: 5 })}>
          {/* Focus/Highlight Button */}
          {highlightSelector && (
            <HighlightFocusButton highlightSelector={highlightSelector} />
          )}
          <span className={css(style.fieldKey)}>
            Field Key:
          </span>
          <CoolCopy id="fld-stng-key" value={fieldKey} />
        </div>
      </div>
    </div>
  )
}