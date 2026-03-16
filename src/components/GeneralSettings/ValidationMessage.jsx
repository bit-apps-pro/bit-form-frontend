import { useFela } from 'react-fela'
import EditIcon from '../../Icons/EditIcon'
import ut from '../../styles/2.utilities'
import { __ } from '../../Utils/i18nwrap'
import { truncatedString } from '../style-new/styleHelpers'
import Cooltip from '../Utilities/Cooltip'
import RenderHtml from '../Utilities/RenderHtml'
import tipsForGlobalMessages from './tipsForGlobalMessages'

const ValidationMessage = ({ label, message, path, msgType, openMessageModal }) => {
  const { css } = useFela()

  return (
    <div className={css(ut.mb2)}>
      <label htmlFor={`${msgType}-message`}>
        {__(label || 'Validation Message')}
        <Cooltip width={400} icnSize={13} className={`${css(ut.mr2)} hovertip`}>
          {__(tipsForGlobalMessages[`${path[0]}->${msgType}`] || 'Click to edit the message')}
        </Cooltip>
      </label>
      <div
        className={css(styles.errMsgBox)}
        aria-label={`Edit Message for ${msgType} validation`}
        tabIndex="0"
        role="button"
        onClick={() => openMessageModal(path, msgType)}
        onKeyDown={() => openMessageModal(path, msgType)}
      >
        <div>
          <RenderHtml html={truncatedString(message, 200)} />
        </div>
        <EditIcon size={20} />
      </div>

    </div>
  )
}
const styles = {
  errMsgBox: {
    brs: 8,
    bd: 'var(--b-79-96)',
    p: 10,
    fs: 13,
    mt: 5,
    curp: 1,
    pn: 'relative',
    flx: 'between',
    ai: 'center',
    '& p': { m: '0!important' },
  },
}

export default ValidationMessage
