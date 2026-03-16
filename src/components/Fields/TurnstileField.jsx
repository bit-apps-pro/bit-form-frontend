import { useAtomValue } from 'jotai'
import { $turnstile } from '../../GlobalStates/AppSettingsStates'
import { $breakpoint, $fields, $flags } from '../../GlobalStates/GlobalStates'
import turnstileImg from '../../resource/img/cloudflareRecaptcha.svg'
import RenderStyle from '../style-new/RenderStyle'

export default function TurnstileField({ fieldKey, styleClasses }) {
  const fields = useAtomValue($fields)
  const fieldData = fields[fieldKey]
  const breakpoint = useAtomValue($breakpoint)
  const turnstile = useAtomValue($turnstile)
  const { styleMode } = useAtomValue($flags)
  const isHidden = fieldData.hidden?.includes(breakpoint) || false
  return (
    <>
      <RenderStyle styleClasses={styleClasses} />
      <div
        data-dev-fld-wrp={fieldKey}
        className={`${fieldKey}-turnstile-container ${fieldKey}-fld-wrp ${styleMode ? '' : 'drag'} ${isHidden ? 'fld-hide' : ''}`}
      >
        <div className={`${fieldKey}-turnstile-wrp`}>
          {turnstile?.siteKey && turnstile?.secretKey ? (
            <img height="70" src={turnstileImg} alt="cloudflare turnstile reCaptcha" />
          ) : (
            <div>
              To Load Turnstile Field, Please Configure Site Key and Secret.
              {' '}
              <strong>Go to App Settings</strong>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
