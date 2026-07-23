import { useRef } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import CopyIcn from '../../Icons/CopyIcn'
import { __ } from '../../Utils/i18nwrap'
import Tip from './Tip'

export default function CoolCopy({
  id, className, cls, value, inpWidth = 100, readOnly = true, copyOnInputClick = false, title = '',
}) {
  const { css } = useFela()
  const copyInput = useRef(null)
  const copyToClipboard = () => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value)
    }
    copyInput.current.focus()
    copyInput.current.select()
    return new Promise((res, rej) => {
      if (document.execCommand('copy')) res()
      else rej()
    })
  }

  const copyText = () => {
    copyToClipboard()
      .then(() => toast.success(__('Copied on clipboard.')))
      .catch(() => toast.error(__('Failed to Copy, Try Again.')))
  }
  return (
    <div className={`${css(style.wrapper)} ${className}`} title={title}>
      <input
        aria-label="Copy field key"
        ref={copyInput}
        style={{ width: parseInt(inpWidth, 10) }}
        className={`${css(style.input)} ${cls}`}
        id="text-copy"
        type="text"
        value={value}
        readOnly={readOnly}
        onClick={copyOnInputClick ? copyText : undefined}
      />
      <Tip msg="Copy">
        <button data-testid={`${id}-col-cpy-btn`} onClick={copyText} className={`${css(style.btn)}`} type="button" aria-label="Copy field key">
          <CopyIcn w="20" />
        </button>
      </Tip>
    </div>
  )
}

const style = {
  wrapper: {
    pn: 'relative',
    b: '1px solid var(--bf-stroke-clr) !important',
    brs: 'var(--bf-bdr-radius-sm) !important',
  },
  input: {
    oe: 'none',
    b: 'none !important',
    bd: 'var(--bf-bg-white) !important',
    p: '2px 40px 2px 10px !important',
    // w: 100,
    lh: '1 !important',
    fw: '500 !important',
    bs: 'none !important',
    ':focus-visible': { bs: '0 0 0 2px var(--bf-tertiary) !important' },
    h: 'inherit',
  },
  btn: {
    pn: 'absolute !important',
    b: 'none',
    bl: '1px solid var(--bf-stroke-clr) !important',
    oe: 'none',
    bd: 'var(--bf-bg-offwhite)',
    tp: '50%',
    tm: 'translateY(-50%)',
    rt: 0,
    cur: 'pointer',
    tn: 'color 0.2s',
    cr: 'var(--white-0-61)',
    flx: 'center-between',
    brs: '0 var(--bf-bdr-radius-sm) var(--bf-bdr-radius-sm) 0',
    h: 'calc(100% - 2px)',
    '&:hover': { cr: 'var(--b-50)' },
  },
}
