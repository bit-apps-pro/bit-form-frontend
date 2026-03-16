import { useFela } from 'react-fela'
import { __ } from '../../Utils/i18nwrap'
import RenderHtml from '../Utilities/RenderHtml'

export default function Guide({ msg, fs = 18 }) {
  const { css } = useFela()
  return (
    <div className={css(paymentStyle.guide, { fs })}>
      <span className={css(paymentStyle.pb)}>
        <RenderHtml html={__(msg)} />
      </span>
    </div>
  )
}

const paymentStyle = {
  main: {
    mt: '30px',
    fs: 20,
  },
  guide: {
    flx: 'align-center',
    mt: 5,
  },
  pb: {
    pb: 7,
  },
}
