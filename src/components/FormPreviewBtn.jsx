import { useAtom, useAtomValue } from 'jotai'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $bits, $previewWindow } from '../GlobalStates/GlobalStates'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import ut from '../styles/2.utilities'
import { __ } from '../Utils/i18nwrap'

export default function FormPreviewBtn() {
  const { css } = useFela()
  const { formID } = useParams()
  const bits = useAtomValue($bits)
  const [previewWindow, setPreviewWindow] = useAtom($previewWindow)

  // Handle the preview button click
  const handlePreviewClick = () => {
    const previewUrl = `${bits.siteURL}/bitform-form-view/${formID}`

    /// Case 1: No existing preview window or window was closed
    if (!previewWindow || previewWindow.closed) {
      const newWindow = window.open(previewUrl, '_blank')
      if (newWindow) {
        setPreviewWindow(newWindow)
      }
      return
    }
    try {
      // Case 2: Existing window has different form ID
      if (!previewWindow.location.href.includes(`/bitform-form-view/${formID}`)) {
        previewWindow.location.href = previewUrl
      }
      // Case 3: Existing window has same form ID
      previewWindow.focus()
      previewWindow.location.reload(true)
    } catch (error) {
      // Handle cross-origin errors by opening new window
      const newWindow = window.open(previewUrl, '_blank')
      setPreviewWindow(newWindow)
    }
  }

  return (
    <button
      type="button"
      title="Preview Form"
      aria-label="Preview Form"
      onClick={handlePreviewClick}
      // href={`${bits.siteURL}/bitform-form-view/${formID}`}
      // target="_blank"
      className={css(style.shareIcn)}
    // rel="noreferrer"
    >
      <span>{__('Preview')}</span>
      <ExternalLinkIcn size={13} className={css(ut.ml1)} />
    </button>
  )
}

const style = {
  title: {
    fs: 14,
    mb: 5,
    fw: 600,
  },
  shareIcn: {
    bd: 'none',
    px: 15,
    py: 7,
    oe: 'none',
    b: 'none',
    cr: 'var(--white-100)',
    flx: 'align-center',
    fs: 12,
    fw: 400,
    tn: 'background 0.2s',
    my: 5,
    brs: 8,
    curp: 1,
    ':hover': { bd: 'var(--b-35-33)', cr: 'var(--white-100)' },
    ':visited': { bd: 'var(--b-35-33)', cr: 'var(--white-100)' },
  },
  downmenu: {
    w: 200,
    px: 5,
    py: 8,
  },
  downmenuinput: {
    w: '100% !important',
    fs: 12,
  },
}
