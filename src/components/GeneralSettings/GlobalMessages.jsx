import { useAtom } from 'jotai'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { $globalMessages } from '../../GlobalStates/AppSettingsStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'
import { assignNestedObj, getValueByObjPath } from '../style-new/styleHelpers'
import GlobalMessageModal from './GlobalMessageModal'
import ValidationMessage from './ValidationMessage'

const GlobalMessages = ({ setLoading }) => {
  const [showModal, setShowModal] = useState(false)
  const [msgType, setMsgType] = useState('')
  const [msgPaths, setMsgPaths] = useState([''])
  const [globalMessages, setGlobalMessages] = useAtom($globalMessages)

  const openMessageModal = (messagePath, selectedMsgType) => {
    setShowModal(true)
    setMsgPaths(messagePath)
    setMsgType(selectedMsgType)
  }

  const modalCloseAction = () => {
    setMsgPaths([''])
    setMsgType('')
  }

  const handleMessageChangeAction = (value) => {
    setLoading(true)
    const newGlobalMessages = { ...globalMessages }

    msgPaths.forEach((path) => {
      assignNestedObj(newGlobalMessages, `${path}->${msgType}`, value)
    })
    setGlobalMessages(newGlobalMessages)

    const tempPromise = bitsFetch(
      globalMessages,
      'bitforms_save_global_messages',
    )
      .then((res) => {
        if (res !== undefined && res.success) {
          modalCloseAction()
          setLoading(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
    toast.promise(tempPromise, {
      success: __('Messages saved successfully.'),
      loading: __('Saving...'),
      error: __('Something went wrong, Try again.'),
    })
  }
  return (
    <div className="">
      <div className="">
        <p className="" style={{ textWrap: 'pretty', maxWidth: '575px' }}>
          {__('Note: This global message will be applied to all forms and fields unless a custom error message is set for an individual field. Also you can use the')}
          {' '}
          <strong>
            {__('Shortcode patterns (Ex:')}
            {' ${field.label}'}
            )
          </strong>
          {' '}
          {__('to dynamically replace field-specific labels/values.')}
        </p>
      </div>
      <hr />
      <div className="">
        <ValidationMessage
          label={__('Required Field')}
          message={globalMessages?.err?.req}
          path={['err']}
          msgType="req"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Invalid Email')}
          message={globalMessages?.err?.email?.invalid}
          path={['err->email']}
          msgType="invalid"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Invalid URL')}
          message={globalMessages?.err?.url?.invalid}
          path={['err->url']}
          msgType="invalid"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Invalid Number')}
          message={globalMessages?.err?.number?.invalid}
          path={['err->number']}
          msgType="invalid"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Invalid Phone Number')}
          message={globalMessages?.err?.['phone-number']?.invalid}
          path={['err->phone-number']}
          msgType="invalid"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Minimum Value')}
          message={globalMessages?.err?.mn}
          path={['err']}
          msgType="mn"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Maximum Value')}
          message={globalMessages?.err?.mx}
          path={['err']}
          msgType="mx"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Input mask')}
          message={globalMessages?.err?.inputMask}
          path={['err']}
          msgType="inputMask"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Regex Pattern')}
          message={globalMessages?.err?.regexr}
          path={['err']}
          msgType="regexr"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Minimum Option Count')}
          message={globalMessages?.err?.check?.mn}
          path={['err->check', 'err->select', 'err->image-select']}
          msgType="mn"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Maximum Option Count')}
          message={globalMessages?.err?.check?.mx}
          path={['err->check', 'err->select', 'err->image-select']}
          msgType="mx"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Minimum File Count')}
          message={globalMessages?.err?.minFile}
          path={['err']}
          msgType="minFile"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Maximum File Count')}
          message={globalMessages?.err?.maxFile}
          path={['err']}
          msgType="maxFile"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Maximum File Size')}
          message={globalMessages?.err?.maxSize}
          path={['err']}
          msgType="maxSize"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Other Option Required')}
          message={globalMessages?.err?.otherOptReq}
          path={['err']}
          msgType="otherOptReq"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Unique Entry Value')}
          message={globalMessages?.err?.entryUnique}
          path={['err']}
          msgType="entryUnique"
          openMessageModal={openMessageModal}
        />

        <ValidationMessage
          label={__('Unique User')}
          message={globalMessages?.err?.userUnique}
          path={['err']}
          msgType="userUnique"
          openMessageModal={openMessageModal}
        />
      </div>

      {
        showModal && (
          <GlobalMessageModal
            messageContent={getValueByObjPath(globalMessages, `${msgPaths[0]}->${msgType}`)}
            showModal={showModal}
            setShowModal={setShowModal}
            msgType={msgType}
            saveAction={handleMessageChangeAction}
            closeAction={modalCloseAction}
          />
        )
      }
    </div>
  )
}
export default GlobalMessages
