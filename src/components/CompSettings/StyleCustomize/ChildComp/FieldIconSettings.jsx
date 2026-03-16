/* eslint-disable react/jsx-props-no-spreading */
import { useFela } from 'react-fela'
import CloseIcn from '../../../../Icons/CloseIcn'
import EditIcn from '../../../../Icons/EditIcn'
import ut from '../../../../styles/2.utilities'
import { IS_PRO } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import Tip from '../../../Utilities/Tip'
import IconStyleBtn from '../../IconStyleBtn'
import ProBadgeOverlay from './ProBadgeOverlay'

export default function FieldIconSettings({
  classNames, labelClass, label, alt, iconSrc, styleRoute, setIcon, removeIcon, isPro, proProperty,
}) {
  const { css } = useFela()
  const enableAction = !isPro || (isPro && IS_PRO)
  return (
    <div className={`${css(ut.flxcb)} ${classNames} pos-rel`}>
      <div className={css({ flx: 'align-center' })}>
        <span className={`${css(ut.fw500, ut.ml2)} ${labelClass}`}>{__(label)}</span>
        {isPro && !IS_PRO && <ProBadgeOverlay proProperty={proProperty} />}
      </div>
      <div className={css(ut.flxcb)}>
        {iconSrc && (
          <img
            src={iconSrc}
            title="Icon"
            alt={alt || label}
            width="22"
            height="22"
          />
        )}

        <div className={css(s.flx)}>

          <Tip msg="Change">
            <button
              data-testid={`${styleRoute}-edt-btn`}
              type="button"
              {...enableAction && { onClick: setIcon }}
              className={css(ut.icnBtn)}
            >
              <EditIcn size={18} />
            </button>
          </Tip>
          {iconSrc && (
            <Tip msg="Style">
              <IconStyleBtn route={styleRoute} />
            </Tip>
          )}
          {iconSrc && removeIcon && (
            <Tip msg="Remove">
              <button
                data-testid={`${styleRoute}-rmv-btn`}
                {...enableAction && { onClick: removeIcon }}
                className={css(ut.icnBtn)}
                type="button"
              >
                <CloseIcn size="13" />
              </button>
            </Tip>
          )}
        </div>

      </div>
    </div>
  )
}

const s = {
  flx: {
    dy: 'flex',
    bc: '#f7f7f7',
    brs: '5px',
  },

}
