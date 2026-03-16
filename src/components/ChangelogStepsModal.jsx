/* eslint-disable jsx-a11y/control-has-associated-label */
import { useAtom } from 'jotai'
import { Fragment, useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { $bits } from '../GlobalStates/GlobalStates'
import ChangelogIcn from '../Icons/ChangeLogIcn'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import { IS_PRO } from '../Utils/Helpers'
import changelogInfo from '../Utils/StaticData/changelogInfo'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import christmasBanner from '../resource/img/christmas-banner.jpg'
import Grow from './CompSettings/StyleCustomize/ChildComp/Grow'
import Btn from './Utilities/Btn'
import Modal from './Utilities/Modal'

export default function ChangelogStepsModal() {
  const [bits, setBits] = useAtom($bits)
  const [show, setShow] = useState(bits.changelogVersion !== bits.version)
  const [showTerms, setShowTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const currentChangelog = '2.17.0'
  const currenChangelog = changelogInfo[currentChangelog]
  const { css } = useFela()
  const totalStep = 2
  const progress = ((currentStep - 1) * 100) / (totalStep - 1)

  const announcementLink = `https://bitapps.pro/christmas-wordpress-plugin-deal/#bit-form-pricing?link_type=promo&utm_source=bit-form${IS_PRO ? '-pro' : ''}&utm_medium=modal&utm_campaign=christmas&utm_content=change_log_modal`

  const setChangeLogVersion = () => {
    setShow(false)
    bitsFetch({
      version: bits.version,
    }, 'bitforms_changelog_version')
      .then(() => {
        setBits(prevBits => ({ ...prevBits, changelogVersion: prevBits.version }))
      })
  }

  if (!currenChangelog) return

  const permissionHandler = (permission) => {
    bitsFetch({
      permission,
    }, 'bitforms_analytics_permission')
      .then(() => {
        setBits(prevBits => ({ ...prevBits, permission }))
        setChangeLogVersion()
      })
    setShow(false)
  }

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }

  const jumpStepTo = (stepNo) => {
    if (stepNo < currentStep) {
      setCurrentStep(prevStep => stepNo)
    }
  }

  useEffect(() => {
    if (!show) {
      setCurrentStep(1)
      setShowTerms(false)
    }
    if (currentStep > totalStep) {
      setChangeLogVersion()
      setShow(false)
    }
  }, [show, currentStep])

  return (
    <div className="changelog-toggle">
      <button
        title={__('What\'s New')}
        type="button"
        className={css(styles.button)}
        onClick={() => setShow(true)}
      >
        <ChangelogIcn size={25} />
      </button>
      <Modal
        sm
        show={show}
        onCloseMdl={setChangeLogVersion}
        showCloseBtn={bits.permission && totalStep === currentStep}
        closeOnOutsideClick={!!bits.permission && totalStep === currentStep}
        escKeyEvent={bits.permission}
      >
        <div>
          <div className={`${css(styles.progressBar)} progress-bar`}>
            <div className={`${css(styles.progress)} progress`} style={{ width: `${progress}%` }} />
            <span
              onClick={() => jumpStepTo(1)}
              onKeyUp={() => { }}
              role="button"
              tabIndex={0}
              className={`${css(styles.stepHeader)} ${currentStep >= 1 ? 'active' : ''}`}
              data-title="Christmas Deal"
            />
            <span
              onClick={() => jumpStepTo(2)}
              onKeyUp={() => { }}
              role="button"
              tabIndex={0}
              className={`${css(styles.stepHeader)} ${currentStep >= 3 ? 'active' : ''}`}
              data-title="Changelog"
            />
          </div>

          <div className="content">
            <Grow overflw="" open={currentStep === 1}>
              <div className={css({ ta: 'center' })}>
                <a
                  href={announcementLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={christmasBanner}
                    alt="Bit Apps Promotional Banner"
                    width="100%"
                    height={443}
                  />
                </a>
                <a
                  className={css({ td: 'underline !important', fs: 14 })}
                  href={announcementLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {__('Get Christmas Deal!')}
                </a>
              </div>
            </Grow>

            <Grow overflw="" open={currentStep === 2}>
              <div>
                <h3 className={css({ m: 0 })}>
                  <a href="https://bitapps.pro/docs/bit-form/changelog/" target="_blank" rel="noreferrer">
                    {`Version ${currentChangelog}`}
                    <ExternalLinkIcn size="14" />
                  </a>
                </h3>
                <p className={css({ m: '0px 5px 5px' })}>{`Date: ${currenChangelog.date}`}</p>
              </div>
              <div className={css(styles.content)}>
                {Object.entries(currenChangelog.changes).map(([title, obj]) => (
                  <div className={css({ p: '0px 5px' })} key={title}>
                    <span className={css(styles.bdg, styles[title])}>{obj.label}</span>
                    {obj.tag && <span className={css(styles.tag)}>{obj.tag}</span>}
                    <ul className={css(styles.ul, { mt: 5 })}>
                      {obj.list.map((tempObj, index) => getChangesList(tempObj, css, `${title}-${index}`))}
                    </ul>
                  </div>
                ))}
              </div>
              <div>
                <span className={css({ m: '0px 5px 5px' })}>{__('For more details,')}</span>
                <a
                  href="https://bitapps.pro/docs/bit-form/changelog/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {__('Click here')}
                  {' '}
                  <ExternalLinkIcn size="14" />
                </a>
              </div>
              {!bits.permission && (
                <>
                  <hr />
                  <p className={css(styles.optinTitle)}>Build a better Bit Form </p>
                  <p className={css({ m: '5px 0px' })}>
                    <strong>{__('Note:')}</strong>
                    {' '}
                    {__('Accept and complete to share non-sensitive diagnostic data to help us improve your experience.')}
                  </p>
                  <button onClick={() => setShowTerms(prevShowTerms => !prevShowTerms)} className={css(styles.collectButton)} type="button">{__('What we collect?')}</button>

                  <Grow overflw="" open={showTerms}>
                    <p className={css({ mt: 2 })}>
                      Server details (PHP, MySQL, server, WordPress versions), plugin usage (active/inactive), site name and URL, your name and email. No sensitive data is tracked.

                      <a href="https://bitapps.pro/privacy-policy/" target="_blank" rel="noreferrer">
                        {__('Click here to see terms')}
                        {' '}
                        <ExternalLinkIcn size="12" />
                      </a>
                    </p>
                  </Grow>

                  <div className={css({ flx: 'center-between' })}>
                    <Btn
                      size="sm"
                      variant="secondary-outline"
                      onClick={() => permissionHandler(false)}
                      className={css({ b: 'none !important' })}
                    >
                      {__('Skip')}
                    </Btn>
                    <Btn
                      size="sm"
                      onClick={() => permissionHandler(true)}
                    >
                      {__('Accept And Continue')}
                    </Btn>
                  </div>
                </>
              )}
            </Grow>

            <div className={css({ dy: 'flex', jc: 'end' })}>
              {(currentStep !== totalStep || bits.permission) && (
                <Btn
                  size="sm"
                  onClick={() => nextStep()}
                >
                  {currentStep !== totalStep ? __('Next') : 'Continue'}
                </Btn>
              )}

            </div>
          </div>
          {/* <div className="flx flx-col flx-center">
            <h3 className={css({ m: 5 })}>{__('What\'s New?')}</h3>
          </div> */}

        </div>
      </Modal>
    </div>
  )
}

function getChangesList(listObj, css, parentKey = '') {
  if (typeof listObj === 'string') return <li key={parentKey}>{listObj}</li>
  if (Array.isArray(listObj)) return listObj.map((tempObj, index) => getChangesList(tempObj, css, `${parentKey}-${index}`))
  if (typeof listObj === 'object') {
    const { label, tag, list } = listObj
    return (
      <Fragment key={parentKey}>
        <li>
          {label}
          {tag && <span className={css(styles.tag)}>{tag}</span>}
        </li>
        {
          list && (
            <ul className={css(styles.ul)}>
              {list.map((tempObj, index) => getChangesList(tempObj, css, `${parentKey}-${index}`))}
            </ul>
          )
        }
      </Fragment>
    )
  }
}

const styles = {
  progressBar: {
    m: '0px 80px 30px',
    pn: 'relative',
    dy: 'flex',
    jc: 'space-between',
    counterReset: 'step',
    '&::before': {
      ct: '""',
      pn: 'absolute',
      tp: 'calc(50% - 2px)',
      // tn: 'translateY(-50%)',
      h: 4,
      w: '100%',
      bc: '#dcdcdc',
    },
  },
  progress: {
    bc: 'hsl(211, 100%, 50%)',
    w: 0,
    tp: 'calc(50% - 2px)',
    pn: 'absolute',
    h: 4,
    zx: '1',
  },
  stepHeader: {
    se: 30,
    bc: '#dcdcdc',
    flx: 'center',
    brs: '50%',
    zx: '1',
    '&::before': {
      counterIncrement: 'step',
      ct: 'counter(step)',
    },
    '&::after': {
      ct: 'attr(data-title)',
      pn: 'absolute',
      tp: 'calc(100% + 0.20rem)',
      fs: '0.85rem',
      cr: 'black !important',
      textWrap: 'nowrap',
    },
    '&.active': {
      curp: 'pointer',
      bd: 'hsl(211, 100%, 50%)',
      cr: 'hsl(0, 0%, 100%)',
      ':hover': { bd: 'hsl(211, 100%, 40%)' },
      ':active': { bd: 'hsl(211, 100%, 30%)' },
    },
  },
  content: {
    owy: 'scroll',
    mxh: '70vh',
  },
  button: {
    b: 'none',
    cr: 'white',
    brs: '10px',
    curp: 'pointer',
    flx: 'center',
    h: '40px',
    w: '40px',
    bd: '#70707085',
    mr: '10px',
    '&:hover': {
      bd: '#707070',
    },
  },
  collectButton: {
    mt: 5,
    b: 'none',
    bd: 'none',
    cr: 'var(--dp-blue)',
    p: 0,
    curp: 'pointer',
    td: 'underline',
    fs: 13,
  },
  ul: {
    ml: 20,
    '> li': {
      mb: 10,
      listStyle: 'circle',
      fs: 14,
      fw: 400,
    },
  },
  tag: {
    bd: '#f6cbff',
    brs: '20px',
    cr: '#161a2e !important',
    fs: '.75rem',
    fw: '500',
    lh: '1.4',
    p: '2px 13px',
    ml: '5px',
  },
  bdg: {
    brs: '5px',
    dy: 'inline-block',
    fw: '500',
    lh: '1.4',
    p: '2px 13px',
    pn: 'relative',
    '&::before': {
      bd: 'inherit',
      brs: '3px',
      ct: '',
      h: '20px',
      lt: '-6px',
      pn: 'absolute',
      tp: '3px',
      tm: 'rotate(45deg)',
      w: '20px',
      zx: '-1',
    },
  },
  added: {
    bd: '#0DB1FF',
    c: '#24292e',
  },
  imporovement: {
    bd: '#00FFBF',
    cr: '#24292e',
  },
  fixed: {
    bd: '#FFD000',
    cr: '#24292e',
  },
  coming: {
    bd: '#00ffe9',
    cr: '#24292e',
  },
  bitAppsNotice: {
    bd: '#00ffe9',
    cr: '#24292e',
  },
  optinTitle: {
    ta: 'center',
    m: '0px',
    fs: '14px',
    fw: '700',
  },
}
