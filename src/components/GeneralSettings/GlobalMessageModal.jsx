import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import app from '../../styles/app.style'
import { __ } from '../../Utils/i18nwrap'
import Modal from '../Utilities/Modal'
import TinyMCE from '../Utilities/TinyMCE'


export default function GlobalMessageModal({ messageContent, showModal, setShowModal, msgType, saveAction, closeAction = () => { } }) {
  const { fieldKey: fldKey } = useParams()
  const { css } = useFela()
  const [value, setValue] = useState(messageContent)

  const setMessage = () => {
    saveAction(value)
    setShowModal(false)
  }

  const cancelModal = () => {
    closeAction()
    setShowModal(false)
  }

  return (
    <Modal
      md
      show={showModal}
      setModal={cancelModal}
      title={__(`Edit Global Message (Type: ${msgType})`)}
    >
      <TinyMCE
        id={`${fldKey}-${msgType}`}
        menubar={false}
        value={value}
        onChangeHandler={setValue}
        shortCodeList={shortcodeFormatList}
        smartTags={false}
      />
      <div className="mt-2 f-right">
        <button type="button" className={`${css(app.btn)} mr-2`} onClick={cancelModal}>Cancel</button>
        <button type="button" className={`${css(app.btn)} blue`} onClick={setMessage}>Save</button>
      </div>
    </Modal>
  )
}

const shortcodeFormatList = [
  { label: 'Field Label', format: '${field.label}' },
  { label: 'Minimum', format: '${field.minimum}' },
  { label: 'Maximum', format: '${field.maximum}' },
  { label: 'Minimum File', format: '${field.minimum_file}' },
  { label: 'Maximum File', format: '${field.maximum_file}' },
  { label: 'Maximum Size', format: '${field.maximum_size}' },
  // { label: 'Minimum Amount', format: '${field.minimum_amount}' }, //Minimum amount is applied to Currency field only
  // { label: 'Maximum Amount', format: '${field.maximum_amount}' },
]
