import { useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import { useNavigate } from 'react-router-dom'
import { $payments } from '../../GlobalStates/AppSettingsStates'
import { $bits, $newFormId, $proModal } from '../../GlobalStates/GlobalStates'
import ut from '../../styles/2.utilities'
import { __ } from '../../Utils/i18nwrap'
import Btn from '../Utilities/Btn'
import Modal from '../Utilities/Modal'
import { compareVersions, getTemplateImagePath } from './templateHelpers'

export default function FormTemplateCard({ item }) {
  const { css } = useFela()
  const newFormId = useAtomValue($newFormId)
  const navigate = useNavigate()
  const bits = useAtomValue($bits)
  const setProModal = useSetAtom($proModal)
  const payments = useAtomValue($payments)
  const [showModal, setShowModal] = useState({
    show: false,
    title: '',
    warning: false,
  })

  const closeModal = () => {
    setShowModal({
      show: false,
      title: '',
      msg: false,
    })
  }

  const isPaymentFrom = () => {
    if (typeof item.paymentType !== 'undefined') {
      if (!payments) {
        setShowModal({
          show: true,
          title: __('Confirmation'),
          warning: true,
          url: '/app-settings/payments',
          msg: __('Please setup your payment settings before using this template.'),
        })
        return false
      }
    }
  }

  const isPaymentConfigured = () => {
    if (typeof item.paymentType !== 'undefined' && payments) {
      const paymentTypes = item.paymentType
      const allTypesExist = paymentTypes.every(type => payments.some(payment => payment.type === type))

      if (allTypesExist) {
        return true
      }

      const paymentsStr = paymentTypes.join(', ')
      let link = ''
      if (paymentTypes.length === 1) {
        link = `/${paymentTypes[0]}`
      }

      setShowModal({
        show: true,
        title: __('Confirmation'),
        warning: true,
        url: '/app-settings/payments'.concat(link),
        msg: __(`Please setup your ${paymentsStr} payment settings before using this template.`),
      })
      return false
    }
  }

  const checkRequiredProVersions = () => {
    if (item?.isPro && bits?.isPro && !compareVersions(bits?.proInfo.installedVersion, item?.proRequiredVersion)) {
      setShowModal({
        show: true,
        title: __('Confirmation'),
        warning: true,
        msg: __(`Please update your Pro Plugin to the latest version (${item?.proRequiredVersion}) to use this template.`),
      })
      return false
    }
  }

  const handleUseTemplate = () => {
    const slug = item?.slug
    if (item?.isPro) {
      if (!bits?.isPro) {
        setProModal({
          show: true,
          heading: __(`${item?.title} Template`),
          featureText: __('this feature'),
        })
        return
      }
      if (typeof checkRequiredProVersions() !== 'undefined' && !checkRequiredProVersions()) {
        return
      }
      if (typeof isPaymentFrom() !== 'undefined' && !isPaymentFrom()) {
        return
      }
      if (typeof isPaymentConfigured() !== 'undefined' && !isPaymentConfigured()) {
        return
      }
      navigate(`/form/builder/${slug}/${newFormId}/fields-list`, { replace: true, state: true })
    } else {
      navigate(`/form/builder/${slug}/${newFormId}/fields-list`, { replace: true, state: true })
    }
  }
  const navigateToPaymentSettings = () => {
    navigate(showModal.url, { replace: true, state: true })
  }
  return (
    <>
      <div className={`${css(cardStyles.card)} bf-template-card`}>
        {item?.isPro && !bits?.isPro && (
          <div className={css(cardStyles.pro)}>
            {__('PRO')}
          </div>
        )}
        {item?.isNew && (
          <div className={css(cardStyles.new)}>
            {__('New')}
          </div>
        )}
        <img
          className={css(cardStyles.card_img)}
          src={getTemplateImagePath(item?.img)}
          alt={item?.title}
        />
        <div className={`${css(cardStyles.card_content)} bf-template-card-content`}>
          <h4 className={`${css(cardStyles.template_title)} bf-template-card-title`}>{__(item?.title)}</h4>
          <p className={`${css(cardStyles.template_description)} bf-template-card-descp`}>{__(item?.description)}</p>
        </div>
        <div className={`${css(cardStyles.overlay)} bf-template-overlay`}>
          <div className={css(cardStyles.overlay_buttons)}>
            <Btn
              size="md"
              className={css({ w: '150px !important', mb: 10 })}
              onClick={handleUseTemplate}
            >
              {__('Use Template')}
            </Btn>
            {item?.demoURL && (
              <Btn size="md" className={css({ w: '150px !important' })}>
                <a
                  className={css(cardStyles.viewBtn)}
                  href={item?.demoURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {__('See Demo')}
                </a>
              </Btn>
            )}
          </div>
        </div>
      </div>
      <Modal
        sm
        show={showModal.show}
        setModal={closeModal}
        className={css({ w: '500px !important' })}
        title="Confirmation"
      >
        <div className="txt-center atn-btns flx flx-center flx-col">
          <div className={`content mb-2 ${css({ py: 20 })}`}>
            {__(showModal.msg)}
          </div>
          <div className={`d-flx flx-center ${showModal.warning && 'mt-3'}`}>
            {showModal?.url && (
              <Btn
                size="sm"
                width="200px"
                onClick={navigateToPaymentSettings}
                rounded
                variant="primary"
                className={css(ut.mr2, { fs: 15 })}
              >
                {__('Go to Payment Settings')}
              </Btn>
            )}
            <Btn
              size="sm"
              width="150px"
              onClick={closeModal}
              rounded
              variant="danger"
              className={css(ut.mr2, { fs: 15 })}
            >
              {__('Cancel')}
            </Btn>
          </div>
        </div>
      </Modal>
    </>
  )
}

const cardStyles = {
  overlay: {
    pn: 'absolute',
    tp: 0,
    lt: 0,
    bm: 0,
    rt: 0,
    vy: 'none',
    tn: '0.5s ease',
    bc: 'rgb(49 49 49 / 50%)',
    oy: 0,
    brs: 7,
  },
  overlay_buttons: {
    pn: 'absolute',
    lt: '50%',
    tp: '50%',
    '-webkit-transform': 'translate(-50%, -50%)',
    '-ms-transform': 'translate(-50%, -50%)',
    tm: 'translate(-50%, -50%)',
  },
  pro: {
    pn: 'absolute',
    tp: 0,
    rt: 0,
    bc: 'rgb(153, 153, 153)',
    cr: 'rgb(255, 255, 255)',
    p: 5,
    fs: 12,
    fw: 'bold',
    brs: '0 7px 0 7px',
  },
  new: {
    pn: 'absolute',
    tp: 0,
    lt: 0,
    bc: 'tomato',
    cr: 'rgb(255, 255, 255)',
    p: 5,
    fs: 12,
    fw: 'bold',
    brs: '7px 0 7px 0',
  },
  viewBtn: {
    cr: '#ffffff',
    ':hover': {
      cr: '#ffffff',
    },
  },
  card: {
    pn: 'relative',
    ow: 'hidden',
    b: '1px solid #ccc',
    brs: '10px',
    tn: 'transform 0.3s ease',
    ':hover': {
      bs: '0 0 0 2px var(--b-50) !important',
    },
    ':hover .bf-template-overlay': {
      oy: 1,
    },
  },
  card_img: {
    w: '100%',
    h: 'auto',
  },
  card_content: {
    p: '0 10px 10px',
    // ta: 'center',
  },
  template_title: {
    m: '10px 0',
    fs: '1rem',
  },
  template_description: {
    cr: '#555',
    mb: 0,
  },
}
