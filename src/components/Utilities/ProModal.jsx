import { useAtom } from 'jotai'
import { useFela } from 'react-fela'
import { $proModal } from '../../GlobalStates/GlobalStates'
import ProBadgeIcn from '../../Icons/ProBadgeIcn'
import { __ } from '../../Utils/i18nwrap'
import Btn from './Btn'
import Modal from './Modal'

export default function ProModal({
  close, show, title, className, children, warning,
}) {
  const { css } = useFela()
  const [proModal, setProModal] = useAtom($proModal)

  return (
    <Modal
      sm
      show={proModal.show}
      setModal={() => setProModal({ show: false })}
      className={css({ w: '500px !important' })}
      title={proModal.title || 'Upgrade to Pro'}
      warning={warning || false}
    >
      <div className={`txt-center atn-btns flx flx-center ${className || 'flx-col'}`}>
        <div className={`content p-4 ${!className && 'confirm-content'}`}>
          <ProBadgeIcn size="30" />
          <h3>{__(`${proModal.heading || 'This feature'} is available in Pro`)}</h3>
          <p>
            {__('Thank you for using our product! We\'re sorry,')}
            {' '}
            {__(proModal.featureText || 'this feature')}
            {__(' is not available in your plan.')}
            {__('Please upgrade to the PRO plan to unlock all these awesome features.')}
          </p>
          {children}
          <div className={`d-flx flx-center ${warning && 'mt-3'}`}>
            {/* <div className={`${warning && 'mt-3'} ${css({ flx: 'align-center', fd: 'column' })} `}> */}
            <a
              href="https://bitapps.pro/?link_type=promo&target_site=https%3A%2F%2Fbit-form.com%2F%23pricing&utm_source=plugin_pro_modal&utm_medium=pro_modal_upgrade_button&utm_id=bitform-pro-modal"
              target="_blank"
              rel="noreferrer"
            >
              <Btn size="md" width="150px" variant="primary" rounded>
                {__('Get 74% OFF')}
              </Btn>
            </a>

            <a
              href="https://towp.io/?demo&plugin=bit-form"
              target="_blank"
              rel="noreferrer"
            >
              <Btn className="ml-1" size="md" width="150px" variant="secondary" rounded>
                {__('Try Demo')}
              </Btn>
            </a>
          </div>
          <p>
            {__('Check out our')}
            <a
              href="https://towp.io/?demo&plugin=bit-form"
              className={css({ fw: 700 })}
              target="_blank"
              rel="noreferrer"
            >
              {__(' Demo ')}
            </a>
            {__('to see what can you do with Pro version.')}
          </p>
        </div>
      </div>
    </Modal>
  )
}
