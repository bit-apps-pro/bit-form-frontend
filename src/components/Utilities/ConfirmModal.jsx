import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useFela } from 'react-fela'
import { $alertModal } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import ut from '../../styles/2.utilities'
import LoaderSm from '../Loaders/LoaderSm'
import Btn from './Btn'
import Modal from './Modal'

function ConfirmModal({
  close, action, mainMdlCls, show, btnTxt, body, btn2Txt, btn2Action, btnClass, title, className, children, warning, isLoading = false, cancelBtn = true,
}) {
  const { css } = useFela()
  const [alertMdl, setAlertMdl] = useAtom($alertModal)

  useEffect(() => {
    const handleNavigation = () => {
      const tmpAlert = { ...alertMdl }
      tmpAlert.show = false
      setAlertMdl(tmpAlert)
    }

    window.addEventListener('popstate', handleNavigation)
  }, [])
  return (
    <Modal
      sm
      show={show}
      setModal={close}
      className={mainMdlCls}
      title={title || __('Confirmation')}
      warning={warning || false}
    >
      <div className={`txt-center atn-btns flx flx-center ${className || 'flx-col'}`}>
        <div className={`content mb-2 ${!className && 'confirm-content'}`}>
          {body}
          {children}
        </div>
        <div className={`d-flx flx-center ${warning && 'mt-3'}`}>
          {(!btn2Txt && cancelBtn) && (
            <Btn size="md" width="150px" onClick={close} rounded variant="default" className={css(ut.mr2)}>
              {__('Cancel')}
            </Btn>
          )}
          {btn2Txt && (
            <Btn size="md" width="150px" variant="success" rounded onClick={btn2Action}>
              {btn2Txt}
            </Btn>
          )}

          <Btn size="md" width="200px" variant="danger" rounded onClick={action} className={`${css(ut.mr2)} ${btnClass}`} disabled={isLoading}>
            {btnTxt}
            {isLoading && <LoaderSm size={17} clr="#fff" className="ml-2" />}
          </Btn>
        </div>
      </div>
    </Modal>

  )
}

export default ConfirmModal
