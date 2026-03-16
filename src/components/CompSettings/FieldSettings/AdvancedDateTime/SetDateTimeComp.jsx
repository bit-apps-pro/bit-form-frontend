import { useFela } from 'react-fela'
import ut from '../../../../styles/2.utilities'
import FieldStyle from '../../../../styles/FieldStyle.style'
import { __ } from '../../../../Utils/i18nwrap'
import Cooltip from '../../../Utilities/Cooltip'

export default function SetDateTimeComp({
  compRef, label, onChangeHandler, fieldData, typeName, tipMsg, cls,
}) {
  const { css } = useFela()

  return (
    <div className={css(ut.flxc, FieldStyle.labelTip) + cls}>
      <div className={css(ut.flxb)}>
        <div className={css(ut.fw500, { fs: 12, ml: 5 })}>{__(label)}</div>
        <Cooltip width={250} icnSize={17} className={css(ut.ml2)}>
          <div className={css(ut.tipBody)}>
            {__(tipMsg)}
          </div>
        </Cooltip>
      </div>
      <input
        data-testid="alw-mltpl-max-inp"
        ref={compRef}
        className={`${css(FieldStyle.input, ut.w5, ut.mt1)} advanced-date-time-min-date`}
        name={typeName}
        value={fieldData?.config?.[typeName] || ''}
        onChange={onChangeHandler}
        autoComplete="off"
      />
    </div>
  )
}
