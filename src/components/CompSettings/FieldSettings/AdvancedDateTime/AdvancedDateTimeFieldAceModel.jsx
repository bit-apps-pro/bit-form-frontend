/* eslint-disable no-param-reassign */
import 'ace-builds'
import { useAtom } from 'jotai'
import { create } from 'mutative'
import { useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields } from '../../../../GlobalStates/GlobalStates'
import app from '../../../../styles/app.style'
import { addToBuilderHistory } from '../../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../../Utils/Helpers'
import { __ } from '../../../../Utils/i18nwrap'
import Modal from '../../../Utilities/Modal'
// modes
import 'ace-builds/src-min-noconflict/mode-css'
import 'ace-builds/src-min-noconflict/mode-javascript'
// snippets
import 'ace-builds/src-min-noconflict/snippets/css'
import 'ace-builds/src-min-noconflict/snippets/javascript'
// themes
import 'ace-builds/src-min-noconflict/theme-tomorrow'
import 'ace-builds/src-min-noconflict/theme-twilight'
// extensions
import 'ace-builds/src-min-noconflict/ext-emmet'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import { sanitizeHTML } from '../../../../Utils/globalHelpers'

export default function AdvancedDateTimeFieldAceModel({ labelModal, setLabelModal }) {
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const fieldData = deepCopy(fields[fldKey])
  const { css } = useFela()
  const content = fieldData?.config?.advancedConfig
  const [value, setValue] = useState(content)

  useEffect(() => {
    if (labelModal) setValue(content)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelModal])

  const customConfigHandler = (val) => {
    const filteredVal = sanitizeHTML(val)
    const allFields = create(fields, draft => { draft[fldKey].config.advancedConfig = filteredVal })
    setFields(allFields)
    addToBuilderHistory({
      event: `Modify Type : ${fieldData.lbl || fldKey}`,
      type: 'advancedConfig',
      state: { fldKey, fields: allFields },
    })
  }

  const cancelModal = () => {
    const allFields = create(fields, draft => { draft[fldKey].config.advancedConfig = value })
    setFields(allFields)
    setLabelModal(false)
    addToBuilderHistory({
      event: 'Cancel Advanced Config',
      type: 'cancel_advancedConfig',
      state: { fields: allFields, fldKey },
    })
  }

  return (
    <Modal
      md
      show={labelModal}
      setModal={cancelModal}
      title={__('Advanced Configuration')}
    >
      <AceEditor
        placeholder="Write your custom configuration here"
        mode="javascript"
        theme="twilight"
        name="blah2"
        value={fieldData?.config?.advancedConfig || ''}
        onChange={(val) => customConfigHandler(val)}
        fontSize={14}
        lineHeight={19}
        height="400px"
        width="100%"
        showPrintMargin
        showGutter={false}
        highlightActiveLine
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          enableMobileMenu: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <div className="mt-2 f-right">
        <button type="button" className={`${css(app.btn)} mr-2`} onClick={cancelModal}>Cancel</button>
        <button type="button" className={`${css(app.btn)} blue`} onClick={() => setLabelModal(false)}>Save</button>
      </div>
    </Modal>
  )
}
