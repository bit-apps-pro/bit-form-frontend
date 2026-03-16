import { useState } from 'react'
import { useFela } from 'react-fela'
import { IS_PRO } from '../Utils/Helpers'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import '../resource/css/announcement-modal.css'
import earlyBirdOffer from '../resource/img/bit-social-year-end-deal.png'
import app from '../styles/app.style'
import Modal from './Utilities/Modal'

export default function AnnouncementModal() {
  const [show, setShow] = useState(false)
  const { css } = useFela()
  const announcementLink = `https://bit-social.com/?utm_source=bit-form${IS_PRO ? '-pro' : ''}&utm_medium=inside-plugin&utm_campaign=year-end-deal`
  const handleDontShowAgain = () => {
    bitsFetch({ optionName: 'bitforms_hide_announcement', optionValue: true }, 'bitforms_handle_notice')
      .then(response => {
        if (response.success) {
          // reload the page
          setShow(false)
          window.location.reload()
        }
      })
  }

  return (
    <div className="announcement-modal">
      <button
        title={__('Announcement')}
        type="button"
        className="announcement-btn"
        onClick={() => setShow(true)}
      >
        New Product Launch
        <span className="star" />
        <span className="star" />
        <span className="star" />
      </button>
      <Modal sm show={show} onCloseMdl={() => setShow(false)} className="modal">
        <div className={css({ ta: 'center' })}>
          <a href={announcementLink} target="_blank" rel="noreferrer">
            <img src={earlyBirdOffer} alt="Year End Deal" width="100%" height={394} />
          </a>
          <a className={css({ td: 'underline !important', fs: 16 })} href={announcementLink} target="_blank" rel="noreferrer">
            {__('Get Year End Deal')}
          </a>
          <div className="">
            <button type="button" className={`${css(app.btn, { mb: 0, fs: 13, fw: 400 })} btcd-btn-o-gray`} onClick={handleDontShowAgain}> Don&apos;t show me again </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
