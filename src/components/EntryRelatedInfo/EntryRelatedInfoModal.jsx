import { __ } from '../../Utils/i18nwrap'
import Modal from '../Utilities/Modal'
import EntryRelatedInfo from './EntryRelatedInfo'

function EntryRelatedInfoModal({ entryID, rowDtl, setSnackbar, close }) {
  return (
    <Modal lg show setModal={close} title={__('Related Info')}>
      <EntryRelatedInfo entryID={entryID} rowDtl={rowDtl} setSnackbar={setSnackbar} close={close} />

    </Modal>
  )
}
export default EntryRelatedInfoModal
