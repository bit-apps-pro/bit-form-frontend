/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useFela } from 'react-fela'
import DocIcn from '../Icons/DocIcn'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import FacebookIcn from '../Icons/FacebookIcn'
import MailIcn from '../Icons/MailIcn'
import MessagesCircle from '../Icons/MessagesCircle'
import ReviewStarIcn from '../Icons/ReviewStarIcn'
import YoutubeIcnOutline from '../Icons/YoutubeIcnOutline'
import ut from '../styles/2.utilities'
import { __ } from '../Utils/i18nwrap'

export default function DocNSupport() {
  const { css } = useFela()
  return (
    <>
      <div className={css(style.main)}>
        {/* <img className={css(style.logo)} src={logo} alt="bit form logo" />
        <h2 className={css(style.title)}>Bit Form</h2> */}
      </div>
      <div className={css(style.container)}>
        <h2 className={css(style.sbtitl)}>{__('Professional & Easy To Use WordPress Form Builder')}</h2>
        <p className={css(style.fs)}>{__('Drag and Drop WordPress Form Builder will allow you to build any kind of forms for WordPress website that you can imagine. The Professional design of Bit Form keeps all the tools right where you want them! You can make integration among various CRM and application with no zero experience.')}</p>
        <h2 className={css(style.sbtitl)}>{__('Documentation')}</h2>
        <p className={css(style.fs)}>
          {__('Explore our extensive documentation. From beginners to developers - everyone will get an answer')}
          {' '}
          <a target="_blank" href="https://bitapps.pro/docs/bit-form/" rel="noreferrer" className={css(style.linkTxt)}>
            {__('here')}
            <ExternalLinkIcn size="12" />
          </a>
        </p>
        <h2 className={css(style.sbtitl)}>{__('Support')}</h2>
        <p className={css(style.fs)}>{__("In Bit Apps, we provide all kind product support for any types of customer, it doesn't matter FREE or PRO user. We actively provide support through Email and Live Chat. Our support team is always ready to help you. We are here to answer your questions and help you with any issues you may have.")}</p>
        <div className={css(style.suprt, { mt: 20 })}>
          <span className={css(ut.mr2, style.icnW)}>
            <DocIcn size="18" />
          </span>
          <span className={css(style.pb)}>
            <a href="https://bitapps.pro/docs/bit-form/" rel="noreferrer" target="_blank" className={css(style.linkTxt)}>
              {__('Documentation')}
              {' '}
              <ExternalLinkIcn size="12" />
            </a>
          </span>
        </div>
        <div className={css(style.suprt)}>
          <span className={css(ut.mr2, style.icnW)}>
            <FacebookIcn size="18" />
          </span>
          <span className={css(style.pb)}>
            <a href="https://www.facebook.com/groups/3308027439209387" target="_blank" className={css(style.linkTxt)} rel="noreferrer">
              {__('Facebook support group')}
              {' '}
              <ExternalLinkIcn size="12" />
            </a>
          </span>
        </div>
        <div className={css(style.suprt)}>
          <span className={css(ut.mr2, style.icnW)}>
            <YoutubeIcnOutline size="20" />
          </span>
          <span className={css(style.pb)}>
            <a href="https://www.youtube.com/channel/UCjUl8UGn-G6zXZ-Wpd7Sc3g" target="_blank" className={css(style.linkTxt)} rel="noreferrer">
              {__('YouTube channel')}
              {' '}
              <ExternalLinkIcn size="12" />
            </a>
          </span>
        </div>
        <div className={css(style.suprt)}>
          <span className={css(ut.mr2, style.icnW)}>
            <MessagesCircle size="18" />
          </span>
          <span className={css(style.pb)}>
            <a href="https://tawk.to/chat/60eac4b6d6e7610a49aab375/1faah0r3e" target="_blank" className={css(style.linkTxt)} rel="noreferrer">
              {__('Chat here')}
              {' '}
              <ExternalLinkIcn size="12" />
            </a>
          </span>
        </div>
        <div className={css(style.suprt)}>
          <span className={css(ut.mr2, style.icnW)}>
            <MailIcn size="18" />
          </span>
          <span className={css(style.pb)}>
            <a href="mailto:support@bitapps.pro" rel="noreferrer" className={css(style.linkTxt)}>
              support@bitapps.pro
            </a>
          </span>
        </div>
        <div className={css(style.suprt)}>
          <span className={css(ut.mr2, style.icnW)}>
            <ReviewStarIcn size="18" />
          </span>
          <span className={css(style.pb)}>
            <a href="https://wordpress.org/support/plugin/bit-form/reviews/#new-post" target="_blank" className={css(style.linkTxt)} rel="noreferrer">
              {__('Rate us on WordPress')}
              {' '}
              <ExternalLinkIcn size="12" />
            </a>
          </span>
        </div>
        {/* <h2 className={css(style.sbtitl)}>Improvement</h2>
        <TableCheckBox title="Allow to collect javascript errors to improve application." /> */}
      </div>
    </>
  )
}
const style = {
  main: {
    flx: 'align-center',
  },
  logo: {
    w: 30,
    h: 30,
    ml: 10,
    mt: 10,
  },
  title: {
    fs: 20,
    fw: 600,
    m: 10,
  },
  sbtitl: {
    fs: 14,
    fw: 700,
    // mt: 20,
    mb: 5,
  },
  container: {
    m: 10,
    p: '5px 30px',
    w: '60%',
    ff: 'Outfit,sans-serif!important',
  },
  fs: {
    fs: 14,
    my: 5,
  },
  suprt: {
    flx: 'align-center',
    fs: 14,
    mt: 5,
  },
  pb: {
    pb: 7,
  },
  linkTxt: {
    td: 'underline !important',
  },
  icnW: {
    w: 20,
  },
}
