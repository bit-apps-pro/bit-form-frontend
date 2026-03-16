/* eslint-disable no-param-reassign */
/* eslint-disable react/button-has-type */
import { useAtom, useAtomValue } from 'jotai'
import { create } from 'mutative'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useParams } from 'react-router-dom'
import { $fields, $selectedFieldId } from '../../../GlobalStates/GlobalStates'
import { $styles } from '../../../GlobalStates/StylesState'
import EditIcn from '../../../Icons/EditIcn'
import ut from '../../../styles/2.utilities'
import ErrorMessages from '../../../styles/ErrorMessages.style'
import { addToBuilderHistory } from '../../../Utils/FormBuilderHelper'
import { deepCopy } from '../../../Utils/Helpers'
import { __ } from '../../../Utils/i18nwrap'
import { addDefaultStyleClasses, isStyleExist, setIconFilterValue, styleClasses, truncatedString } from '../../style-new/styleHelpers'
import CheckBoxMini from '../../Utilities/CheckBoxMini'
import Cooltip from '../../Utilities/Cooltip'
import Modal from '../../Utilities/Modal'
import RenderHtml from '../../Utilities/RenderHtml'
import Icons from '../Icons'
import FieldIconSettings from '../StyleCustomize/ChildComp/FieldIconSettings'
import CustomErrorMessageModal from './CustomErrorMessageModal'

export default function ErrorMessageSettings({
  className, id, type, title, tipTitle, defaultMsg, allowIcons = true,
}) {
  const [errorModal, setErrorModal] = useState(false)
  const { fieldKey: fldKey } = useParams()
  const [fields, setFields] = useAtom($fields)
  const { css } = useFela()
  const fieldData = deepCopy(fields[fldKey])
  const errMsg = fieldData?.err?.[type]?.custom ? fieldData?.err?.[type]?.msg : fieldData?.err?.[type]?.dflt
  const styles = useAtomValue($styles)
  const [icnType, setIcnType] = useState('')
  const [icnMdl, setIcnMdl] = useState(false)
  const selectedFieldId = useAtomValue($selectedFieldId)

  const setCustomErrMsg = e => {
    const { name, checked } = e.target
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err[name]) fieldData.err[name] = {}
    if (checked) {
      fieldData.err[name].custom = true
      if (!fieldData.err[name].msg) fieldData.err[name].msg = fieldData.err[name].dflt
    } else {
      delete fieldData.err[name].custom
    }
    // eslint-disable-next-line no-param-reassign
    // setFields(allFields => create(allFields, draft => { draft[fldKey] = fieldData }))
    const req = checked ? 'on' : 'off'
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: `Custom error message ${req}`, type: `custom_error_message_${req}`, state: { fields: allFields, fldKey } })
  }

  const setShowErrMsg = e => {
    const { name, checked } = e.target
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err[name]) fieldData.err[name] = {}
    if (checked) {
      fieldData.err[name].show = true
      if (!fieldData.err[name].dflt) fieldData.err[name].dflt = defaultMsg
    } else {
      delete fieldData.err[name].show
    }
    // eslint-disable-next-line no-param-reassign
    // setFields(allFields => create(allFields, draft => { draft[fldKey] = fieldData }))
    const allFields = create(fields, draft => { draft[fldKey] = fieldData })
    setFields(allFields)
    addToBuilderHistory({ event: 'Custom error message updated', type: 'change_custom_error_message', state: { fields: allFields, fldKey } })
  }

  const openErrorModal = () => {
    if (!fieldData.err) fieldData.err = {}
    if (!fieldData.err[type]) fieldData.err[type] = {}
    fieldData.err[type].custom = true
    if (!fieldData.err[type].msg) fieldData.err[type].msg = fieldData.err[type].dflt
    setTimeout(() => {
      // eslint-disable-next-line no-param-reassign
      setFields(allFields => create(allFields, draft => { draft[fldKey] = fieldData }))
      setErrorModal(true)
    })
  }

  const setIconModel = (typ) => {
    if (!isStyleExist(styles, fldKey, styleClasses[typ])) addDefaultStyleClasses(selectedFieldId, typ)
    setIconFilterValue(typ, fldKey)
    setIcnType(typ)
    setIcnMdl(true)
  }

  const removeIcon = (iconType) => {
    if (fieldData[iconType]) {
      delete fieldData[iconType]
      const allFields = create(fields, draft => { draft[fldKey] = fieldData })
      setFields(allFields)
    }
  }

  return (
    <div className={`${css(ErrorMessages.wrapper)} err-msg-wrapper ${className}`}>
      <div className={`${css(ErrorMessages.flxBetween)} ${css(ErrorMessages.checked)}`}>
        {/* flx flx-between mt-1 mb-1 mr-2 */}
        <div className={`${css(ErrorMessages.flx)}`}>
          <CheckBoxMini
            id={`${id}-shw-err-msg`}
            className={`${css(ut.mr2)} ${css(ut.fw500)} `}
            name={type}
            checked={fieldData?.err?.[type]?.show || false}
            title={__('Show Error Message')}
            onChange={setShowErrMsg}
          />
          <Cooltip width={250} icnSize={13} className={`${css(ut.mr2)} hovertip`}>
            <div className={css(ErrorMessages.tipBody)}>
              Check the box to enable the custom error message.
              <br />
              Note: You can edit the message by clicking on edit icon.
            </div>
          </Cooltip>
        </div>
      </div>
      {fieldData?.err?.[type]?.show && (
        <>
          {/* <div className="flx flx-between mt-1 mb-1 mr-2"> */}
          <div className={`${css(ErrorMessages.flxBetween)} ${css(ErrorMessages.checked)}`}>
            <div className={css(ErrorMessages.flx)}>
              <CheckBoxMini
                id={`${id}-cstm-err-msg`}
                className={`${css(ut.mr2)} ${css(ut.fw500)} `}
                name={type}
                checked={fieldData?.err?.[type]?.custom || false}
                title={__('Custom Error Message')}
                onChange={setCustomErrMsg}
              />
              <Cooltip width={250} icnSize={13} className={`${css(ut.mr2)} hovertip`}>
                <div className={css(ErrorMessages.tipBody)}>
                  Check the box to enable the custom error message.
                  <br />
                  Note: You can edit the message by clicking on edit icon.
                </div>
              </Cooltip>
            </div>
            <button
              data-testid={`${id}-err-msg-edt-btn`}
              tabIndex="-1"
              className={css(ErrorMessages.btn)}
              onClick={openErrorModal}
              onKeyDown={openErrorModal}
            >
              <EditIcn size={19} />
            </button>
          </div>
          <div
            className={`${css(ErrorMessages.errMsgBox)} ${css(ut.mt2)}`}
            tabIndex="0"
            role="button"
            onClick={openErrorModal}
            onKeyDown={openErrorModal}
          >
            <RenderHtml html={truncatedString(errMsg, 200)} />
          </div>

          {allowIcons && (
            <div className={css(ut.mt1)}>
              <FieldIconSettings
                label="Leading Icon"
                iconSrc={fieldData?.errPreIcn}
                styleRoute="err-txt-pre-i"
                setIcon={() => setIconModel('errPreIcn')}
                removeIcon={() => removeIcon('errPreIcn')}
                isPro
                proProperty="leadingIcon"
              />

              <FieldIconSettings
                label="Trailing Icon"
                iconSrc={fieldData?.errSufIcn}
                styleRoute="err-txt-suf-i"
                setIcon={() => setIconModel('errSufIcn')}
                removeIcon={() => removeIcon('errSufIcn')}
                isPro
                proProperty="trailingIcon"
              />
            </div>
          )}

          <CustomErrorMessageModal
            errorModal={errorModal}
            setErrorModal={setErrorModal}
            type={type}
          />

          <Modal
            md
            autoHeight
            show={icnMdl}
            setModal={setIcnMdl}
            className="o-v"
            title={__('Icons')}
          >
            <div className="pos-rel" />
            <Icons iconType={icnType} setModal={setIcnMdl} addPaddingOnSelect={false} />
          </Modal>
        </>
      )}
    </div>
  )
}
