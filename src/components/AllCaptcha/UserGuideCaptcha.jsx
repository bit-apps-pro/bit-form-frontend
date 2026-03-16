import { useFela } from 'react-fela'
import { __ } from '../../Utils/i18nwrap'
import Guide from '../PaymentSetting/Guide'
import ShowMoreLess from '../Utilities/ShowMoreLess'
import captchaGuide from './captchaGuide'

export default function UserGuideCaptcha({ type }) {
  const { css } = useFela()
  const allGuides = captchaGuide[type.toLowerCase()] || []
  return (
    <ShowMoreLess minVisibleHeigh="150px">
      <div className={css({ fs: 16, w: '80%' })}>
        <h4 className={css({ m: 0 })}>{__(`How to set up ${type}?`)}</h4>
        <ol className="txt-dp">
          {allGuides.map((msg, i) => (
            <li key={`guide-id-${i + 8}`}>
              <Guide msg={msg} fs={16} />
            </li>
          ))}
        </ol>
      </div>
    </ShowMoreLess>
  )
}
