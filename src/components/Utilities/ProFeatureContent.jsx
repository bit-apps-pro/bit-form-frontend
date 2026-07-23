import { useFela } from 'react-fela'
import CrownIcn from '../../Icons/CrownIcn'
import { __ } from '../../Utils/i18nwrap'
import Btn from './Btn'

export default function ProFeatureContent({
  heading,
  featureText,
  featureIcon,
}) {
  const { css } = useFela()

  return (
    <div className={css(s.wrapper)}>
      <CrownIcn size={30} stroke={2} />

      {featureIcon && (
        <div className={css(s.featIcn)}>
          {featureIcon}
        </div>
      )}

      <h3 className={css(s.heading)}>{`${heading || __('This feature')} ${__(' is available in Pro')}`}</h3>

      <p className={css(s.desc)}>
        {__('Thank you for using our product! We\'re sorry,')}
        {' '}
        {featureText || __('this feature')}
        {__(' is not available in your plan. ')}
        {__('Please upgrade to the PRO plan to unlock all these awesome features.')}
      </p>

      <div className={css(s.btns)}>
        <a
          href="https://bitapps.pro/?link_type=promo&target_site=https%3A%2F%2Fbit-form.com%2F%23pricing&utm_source=plugin_pro_modal&utm_medium=pro_modal_upgrade_button&utm_id=bitform-pro-modal"
          target="_blank"
          rel="noreferrer"
        >
          <Btn
            size="md"
            width="150px"
            variant="primary"
          >
            {__('Get 74% OFF')}
          </Btn>
        </a>

        <a
          href="https://towp.io/?demo&plugin=bit-form"
          target="_blank"
          rel="noreferrer"
        >
          <Btn
            size="md"
            width="150px"
            variant="secondary"
          >
            {__('Try Demo')}
          </Btn>
        </a>
      </div>

      <p className={css(s.footer)}>
        {__('Check out our')}
        <a
          href="https://towp.io/?demo&plugin=bit-form"
          className={css({ fw: 700 })}
          target="_blank"
          rel="noreferrer"
        >
          {__(' Demo ')}
        </a>
        {__('to see what can you do with Pro version.')}
      </p>
    </div>
  )
}

const s = {
  wrapper: {
    dy: 'flex',
    fd: 'column',
    ai: 'center',
    ta: 'center',
    gp: 8,
  },
  featIcn: {
    cr: 'var(--bf-text-clr-secondary)',
  },
  heading: {
    fs: 18,
    fw: 700,
    m: 0,
    mt: 4,
    lh: 1.4,
  },
  desc: {
    fs: 14,
    cr: 'var(--bf-text-clr-secondary)',
    m: 0,
    lh: 1.5,
    mxw: 400,
  },
  btns: {
    dy: 'flex',
    ai: 'center',
    jc: 'center',
    gp: 8,
    mt: 8,
  },
  footer: {
    fs: 12,
    cr: 'var(--bf-text-clr-secondary)',
    m: 0,
    mt: 4,
  },
}
