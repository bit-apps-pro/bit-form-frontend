import { create } from 'mutative'
import { useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { useFela } from 'react-fela'
import { useAtomValue } from 'jotai'
import { $bits } from '../GlobalStates/GlobalStates'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import app from '../styles/app.style'
import Loader from './Loaders/Loader'
import LoaderSm from './Loaders/LoaderSm'
import Modal from './Utilities/Modal'

export default function EditEntryData(props) {
  const { formID, entryID, setAllResp, setSnackbar } = props
  const bits = useAtomValue($bits)
  const [showEdit, setshowEdit] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [isIframeLoading, setisIframeLoading] = useState(true)
  const [error, setError] = useState(null)
  const ref = useRef(null)
  const { css } = useFela()
  useEffect(() => {
    setshowEdit(true)
  }, [entryID, formID])

  const updateData = (event) => {
    event.preventDefault()
    setisLoading(true)
    const iframeWindow = ref.current.contentWindow
    const iframeDoc = iframeWindow.document
    const form = iframeDoc?.querySelector('form')
    const contentId = form.id.slice(form.id.indexOf('-') + 1)
    let formData = new FormData(form)
    const queryParam = { formID, entryID: props.entryID }
    const hidden = []
    const objProp = iframeWindow.bf_globals[contentId]
    if (typeof iframeWindow.advancedFileHandle !== 'undefined') {
      formData = iframeWindow.advancedFileHandle(objProp, formData)
    }
    if (typeof iframeWindow.decisionFldHandle !== 'undefined') {
      formData = iframeWindow.decisionFldHandle(objProp, formData)
    }
    Object.entries(objProp?.fields || {}).forEach((fld) => {
      if (fld[1]?.valid?.hide) {
        hidden.push(fld[0])
      }
    })
    if (hidden.length) {
      formData.append('hidden_fields', hidden)
    }
    bitsFetch(formData, 'bitforms_update_form_entry', undefined, queryParam)
      .then((response) => {
        if (response !== undefined && response.success) {
          if (response.data.cron || response.data.cronNotOk) {
            const hitCron = response.data.cron || response.data.cronNotOk
            if (typeof hitCron === 'string') {
              const uri = new URL(hitCron)
              if (uri.protocol !== window.location.protocol) {
                uri.protocol = window.location.protocol
              }
              fetch(uri)
            } else {
              const uri = new URL(bits.ajaxURL)
              uri.searchParams.append('action', 'bitforms_trigger_workflow')
              const triggerData = {
                cronNotOk: hitCron,
                id: `bitforms_${formID}`,
              }
              fetch(uri, {
                method: 'POST',
                body: JSON.stringify(triggerData),
                headers: { 'Content-Type': 'application/json' },
              }).then((res) => res.json())
            }
          }
          setSnackbar({ show: true, msg: response.data.message })
          setAllResp((oldResp) => create(oldResp, (draft) => {
            const entryIndex = draft.findIndex(
              (e) => e.entry_id === props.entryID,
            )
            draft[entryIndex] = {
              ...draft[entryIndex],
              ...response.data.updatedData,
            }
          }))
          props.close(false)
        } else if (response.data) {
          setError(response.data)
        }
      })
      .finally(() => setisLoading(false))
  }

  const mdlContentElm = document.querySelector('.btcd-modal-wrp')
  const mdlAutoHeight = mdlContentElm?.offsetHeight
    ? mdlContentElm.offsetHeight - 150
    : 0

  return (
    <Modal
      hdrActn={(
        <button
          onClick={updateData}
          disabled={isLoading}
          type="button"
          className={`${css(
            app.btn,
            app.blueGrd,
          )} btn-md blue btcd-mdl-hdr-btn`}
        >
          Update
          {isLoading && <LoaderSm size={20} clr="#fff" className="ml-2" />}
        </button>
      )}
      lg
      show={showEdit}
      setModal={props.close}
      title={__('Edit')}
    >
      {isIframeLoading && <Loader className={css({ ta: 'center' })} />}
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin={mdlAutoHeight}
        autoHeightMax={mdlAutoHeight}
      >
        <iframe
          ref={ref}
          title="Form Entry Edit"
          src={`${window.location.origin}?bitform-form-entry-edit=1&formId=${formID}&entryId=${entryID}`}
          className={css(style.iframe, style.body)}
          onLoad={() => setisIframeLoading(false)}
        />
      </Scrollbars>
    </Modal>
  )
}

const style = {
  iframe: {
    width: '100%',
    height: '80vh',
  },
  body: {
    '> body': {
      height: '80vh',
    },
    '> html': {
      height: '80vh',
    },
  },
}
