import { useAtom } from 'jotai'
import { useFela } from 'react-fela'
import { $proModal } from '../../GlobalStates/GlobalStates'
import { __ } from '../../Utils/i18nwrap'
import Modal from './Modal'
import ProFeatureContent from './ProFeatureContent'

export default function ProModal({ warning }) {
  const { css } = useFela()
  const [proModal, setProModal] = useAtom($proModal)

  return (
    <Modal
      sm
      show={proModal.show}
      setModal={() => setProModal({ show: false })}
      className={css({ w: '500px !important' })}
      title={proModal.title || __('Upgrade to Pro')}
      warning={warning || false}
    >
      <ProFeatureContent heading={proModal.heading} featureText={proModal.featureText} />
    </Modal>
  )
}
