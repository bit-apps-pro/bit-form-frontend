import { useFela } from 'react-fela'
import { __ } from '../../Utils/i18nwrap'
import ShowMoreLess from '../Utilities/ShowMoreLess'
import Guide from './Guide'
import guides from './guides'

export default function UserGuide({ type }) {
  const { css } = useFela()
  const allGuides = guides[type.toLowerCase()] || []
  return (
    <ShowMoreLess minVisibleHeigh="170px">
      <div className={css({ mt: '30px', fs: 16 })}>
        <h4>{__(`How to set up ${type} Payment Gateway?`)}</h4>
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
