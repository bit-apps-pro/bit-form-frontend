import { useAtom } from 'jotai'
import { Fragment, useState } from 'react'
import { useFela } from 'react-fela'
import { $bits } from '../GlobalStates/GlobalStates'
import ChangelogIcn from '../Icons/ChangeLogIcn'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import changelogInfo from '../Utils/StaticData/changelogInfo'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import Modal from './Utilities/Modal'

export default function ChangelogToggle() {
  const [bits, setBits] = useAtom($bits)
  const currentChangelog = '2.21.0'
  const [show, setShow] = useState(bits.changelogVersion !== bits.version && (bits.version === currentChangelog || !bits.permission))
  const currenChangelog = changelogInfo[currentChangelog]
  const { css } = useFela()
  const changelogDocLink = 'https://bit-form.com/wp-docs/free-changelogs/'

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

  return (
    <div className="changelog-toggle">
      <button
        title={__('What\'s New')}
        type="button"
        className={css(styles.button)}
        onClick={() => setShow(true)}
      >
        {/* <QuestionIcn size={25} /> */}
        <ChangelogIcn size={25} />
      </button>
      <Modal
        sm
        show={show}
        onCloseMdl={setChangeLogVersion}
        // showCloseBtn={bits.permission}
        // closeOnOutsideClick={!!bits.permission}
        // escKeyEvent={bits.permission}
        showCloseBtn
        closeOnOutsideClick
        escKeyEvent
      >
        <div>
          <div className="flx flx-col flx-center">
            <h3 className={css({ m: 5 })}>{__('What\'s New?')}</h3>
          </div>
          <div>
            <h3 className={css({ m: 0 })}>
              <a href={changelogDocLink} target="_blank" rel="noreferrer">
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
              href={changelogDocLink}
              target="_blank"
              rel="noreferrer"
            >
              {__('Click here')}
              {' '}
              <ExternalLinkIcn size="14" />
            </a>
          </div>
          {/* {!bits.permission && (
            <>
              <hr />
              <p className={css(styles.optinTitle)}>Opt-In For Plugin Improvement</p>
              <p className={css({ m: '5px 0px' })}>
                <strong>{__('Note:')}</strong>
                {' '}
                {__('Accept and continue to share usage data for improvements, or skip for using the plugin.')}
                <a href="https://bitapps.pro/privacy-policy/" target="_blank" rel="noreferrer">
                  {__('Click here to see terms')}
                  {' '}
                  <ExternalLinkIcn size="12" />
                </a>
              </p>
              <div className={css({ flx: 'center-between' })}>
                <Btn
                  size="sm"
                  variant="secondary-outline"
                  onClick={() => permissionHandler(false)}
                >
                  {__('Skip')}
                </Btn>
                <Btn
                  onClick={() => permissionHandler(true)}
                >
                  {__('Accept And Continue')}
                </Btn>
              </div>
            </>
          )} */}
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
