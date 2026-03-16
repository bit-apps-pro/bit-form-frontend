/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { handleUndoRedoShortcut } from './components/FormBuilderHistory'
import { searchKey } from './components/style-new/styleHelpers'
// import { isFirefox } from './Utils/Helpers'

// eslint-disable-next-line import/prefer-default-export
export const RenderPortal = ({ children, title, ...props }) => {
  const [contentRef, setContentRef] = useState(null)
  const mountNode = contentRef?.contentDocument?.body

  if (contentRef) {
    contentRef?.contentWindow?.addEventListener('keydown', searchKey)
    contentRef?.contentWindow?.addEventListener('keydown', handleUndoRedoShortcut)
  }

  const hasDoctype = (dom) => (dom?.doctype !== null)

  if (contentRef && !hasDoctype(contentRef?.contentDocument)) {
    const newDoctype = document.implementation.createDocumentType('html', '', '')
    contentRef.contentDocument.insertBefore(newDoctype, contentRef.contentDocument.childNodes[0])
  }

  useEffect(() => {
    contentRef?.contentDocument?.querySelectorAll('a').forEach((a) => {
      if (a.bfClickPrevented) return
      a.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
      })
      a.bfClickPrevented = true
    })
  }, [children])
  return (
    <iframe
      title={title}
      {...props}
      // {...isFirefox() && { onLoad: e => setContentRef(e.target) }}
      // {...isFirefox() && { ref: setContentRef }}
      ref={setContentRef}
      referrerPolicy="no-referrer"
    >
      {mountNode && hasDoctype(contentRef.contentDocument) && createPortal(children, mountNode)}
    </iframe>
  )
}
