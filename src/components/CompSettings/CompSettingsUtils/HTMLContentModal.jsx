/* eslint-disable no-param-reassign */
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { useAtom } from 'jotai'
import { $fields } from '../../../GlobalStates/GlobalStates'
import app from '../../../styles/app.style'
import { addToBuilderHistory } from '../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import Modal from '../../Utilities/Modal'
import TinyMCE from '../../Utilities/TinyMCE'

export default function HTMLContentModal({ labelModal, setLabelModal }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()
  const content = fieldData.content || fieldData?.info?.content
  const [value, setValue] = useState(content)

  useEffect(() => {
    if (labelModal) setValue(content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelModal])

  const setContent = val => {
    const allFields = create(fields, draft => {
      draft[fldKey].content = val
    })
    setFields(allFields)
    addToBuilderHistory({ event: 'Modify HTML Content Label', type: 'html_content_label', state: { fields: allFields, fldKey } })
  }

  const cancelModal = () => {
    fieldData.content = value
    // eslint-disable-next-line no-param-reassign
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    setLabelModal(false)
    addToBuilderHistory({ event: 'Cancel HTML Content Label ', type: 'cancel_html_content_label', state: { fields: allFields, fldKey } })
  }

  return (
    <Modal
      md
      show={labelModal}
      setModal={cancelModal}
      title={__('Edit HTML Content')}
    >
      <TinyMCE
        id={fldKey}
        value={content}
        onChangeHandler={setContent}
      />
      <div className="mt-2 f-right">
        <button type="button" className={`${css(app.btn)} mr-2`} onClick={cancelModal}>Cancel</button>
        <button type="button" className={`${css(app.btn)} blue`} onClick={() => setLabelModal(false)}>Save</button>
      </div>
    </Modal>
  )
}
