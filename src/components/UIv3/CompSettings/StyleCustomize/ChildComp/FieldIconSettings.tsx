import { useFela } from 'react-fela'
import ArrowAlignIcn from '../../../../../Icons/ArrowAlignIcn'
import CloseIcn from '../../../../../Icons/CloseIcn'
import EditIcn from '../../../../../Icons/EditIcn'
import ut from '../../../../../styles/2.utilities'
import { IS_PRO } from '../../../../../Utils/Helpers'
import { __ } from '../../../../../Utils/i18nwrap'
import IconStyleBtn from '../../../../CompSettings/IconStyleBtn'
import ProBadgeOverlay from '../../../../CompSettings/StyleCustomize/ChildComp/ProBadgeOverlay'
import Tip from '../../../../Utilities/Tip'

interface FieldIconSettingsProps {
  label: string
  iconSrc?: string
  position: 'prefix' | 'suffix'
  setIcon: () => void
  removeIcon: () => void
  styleRoute: string
  isPro?: boolean
  proProperty?: string
  alt?: string
  classNames?: string
}

export default function FieldIconSettings({
  label,
  iconSrc,
  position,
  setIcon,
  removeIcon,
  styleRoute,
  isPro,
  proProperty,
  alt,
  classNames = '',
}: FieldIconSettingsProps) {
  const { css } = useFela()
  const enableAction = !isPro || (isPro && IS_PRO)

  return (
    <div className={`${css(s.container)} ${classNames}`}>
      <div className={css(s.wrapper(position))}>
        {/* Icon Container - Clickable */}
        <div
          className={css(s.iconContainer(position))}
          onClick={enableAction ? setIcon : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (enableAction && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              setIcon()
            }
          }}
          title="Click to select icon"
        >
          {iconSrc ? (
            <img
              src={iconSrc}
              title="Icon"
              alt={alt || label}
              width="18"
              height="18"
            />
          ) : (
            <ArrowAlignIcn size={18} stroke={2} rotateDeg={position === 'prefix' ? 0 : 180} />
          )}
        </div>

        {/* Label (Hidden on Hover) */}
        <span className={`${css(s.label(position))} icon-label`}>{__(label)}</span>

        {/* Action Buttons (Visible on Hover) */}
        <div className={`${css(s.actions(position))} icon-actions`}>
          <Tip msg="Change" className="">
            <button
              data-testid={`${styleRoute}-edt-btn`}
              type="button"
              onClick={enableAction ? setIcon : undefined}
              className={css(ut.icnBtn, s.actionBtn)}
            >
              <EditIcn size={16} />
            </button>
          </Tip>
          {iconSrc && (
            <Tip msg="Style" className="">
              <div className={css(s.iconStyleBtnWrapper)}>
                <IconStyleBtn route={styleRoute} />
              </div>
            </Tip>
          )}
          {iconSrc && removeIcon && (
            <Tip msg="Remove" className="">
              <button
                data-testid={`${styleRoute}-rmv-btn`}
                onClick={enableAction ? removeIcon : undefined}
                className={css(ut.icnBtn, s.actionBtn)}
                type="button"
              >
                <CloseIcn size="12" />
              </button>
            </Tip>
          )}
        </div>
      </div>
      {isPro && !IS_PRO && <ProBadgeOverlay proProperty={proProperty} />}
    </div>
  )
}

const s = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: '8px 0',
  },
  wrapper: (position: 'prefix' | 'suffix') => ({
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    flexDirection: position === 'suffix' ? 'row-reverse' : 'row',
    gap: '8px',
    // Hover effect for label
    '&:hover': {
      '& .icon-label': {
        opacity: 0,
        visibility: 'hidden',
      },
      '& .icon-actions': {
        opacity: 1,
        visibility: 'visible',
        transform: 'translateX(0)',
      },
    },
  }),
  iconContainer: (position: 'prefix' | 'suffix') => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#718096',
    flexShrink: 0,
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  }),
  label: (position: 'prefix' | 'suffix') => ({
    fontSize: '13px',
    fontWeight: 500,
    color: '#4a5568',
    transition: 'opacity 0.2s ease, visibility 0.2s ease',
    flexGrow: 1,
    textAlign: position === 'suffix' ? 'right' : 'left',
    opacity: 1,
    visibility: 'visible',
  }),
  actions: (position: 'prefix' | 'suffix') => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    position: 'absolute',
    [position === 'prefix' ? 'left' : 'right']: '26px',
    opacity: 0,
    visibility: 'hidden',
    transform: position === 'prefix' ? 'translateX(-10px)' : 'translateX(10px)',
    transition: 'all 0.25s ease-out',
    backgroundColor: '#fff',
    padding: '2px 4px',
    borderRadius: '4px',
    zIndex: 10,
  }),
  actionBtn: {
    padding: '4px',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
    },
  },
  iconStyleBtnWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
