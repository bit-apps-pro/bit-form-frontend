import { useFela } from 'react-fela'
import proHelperData from '../../Utils/StaticData/proHelperData'
import ProFeatureContent from './ProFeatureContent'

export default function ProOverlay({
  style,
  className,
  heading,
  description,
  proProperty,
  featureIcon,
}) {
  const { css } = useFela()

  const title = heading || proHelperData[proProperty]?.heading
  const desc = description || proHelperData[proProperty]?.featureText

  return (
    <div className={`pro-blur flx ${css(s.defaultStyle)} ${className ? ` ${className}` : ''}`} style={style}>
      <div className={css(s.card)}>
        <ProFeatureContent heading={title} featureText={desc} featureIcon={featureIcon} />
      </div>
    </div>
  )
}

const s = {
  card: {
    bc: 'var(--white)',
    p: '24px 28px',
    brs: 'var(--bf-bdr-radius-md)',
    bs: '0px 4px 24px -8px var(--b-37-18)',
    w: 'max-content',
    // mxw: '360px',
    zx: 10,
  },
  defaultStyle: { h: '100%', lt: -15, w: '104%', mt: 15, mnh: '400px' },
}
