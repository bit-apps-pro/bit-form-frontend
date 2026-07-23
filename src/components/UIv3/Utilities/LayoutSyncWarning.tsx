import { __ } from '../../../Utils/i18nwrap'

interface LayoutSyncWarningProps {
  breakpoint: string
  respectLGLayoutOrder: boolean
  warningDismissed: boolean
  setWarningDismissed: (dismissed: boolean) => void
}

export default function LayoutSyncWarning({
  breakpoint,
  respectLGLayoutOrder,
  warningDismissed,
  setWarningDismissed,
}: LayoutSyncWarningProps) {
  if (breakpoint === 'lg' || !respectLGLayoutOrder || warningDismissed) {
    return null
  }

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    const banner = e.currentTarget.parentElement
    if (banner) {
      banner.style.animation = 'slideDown 0.3s ease-in'
      setTimeout(() => {
        sessionStorage.setItem('btcd-hide-sync-warning', 'true')
        setWarningDismissed(true)
      }, 300)
    }
  }

  return (
    <div className="sync-warning-banner">
      <span className="sync-warning-banner__message">
        <span className="sync-warning-banner__icon">⚠️</span>
        <span>
          {__('Any field order change on this breakpoint will be reflected in other breakpoints after switching views or updating the form.')}
        </span>
      </span>
      <button
        type="button"
        onClick={handleClose}
        className="sync-warning-banner__close"
        aria-label="Close"
        title={__('Dismiss warning')}
      >
        ×
      </button>
    </div>
  )
}
