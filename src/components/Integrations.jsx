/* eslint-disable-next-line no-undef */
// import { withQuicklink } from 'quicklink/dist/react/hoc'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { useFela } from 'react-fela'
import toast from 'react-hot-toast'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { $bits, $formId, $integrations } from '../GlobalStates/GlobalStates'
import CopyIcn from '../Icons/CopyIcn'
import EditIcn from '../Icons/EditIcn'
import PlusIcn from '../Icons/PlusIcn'
import TrashIcn from '../Icons/TrashIcn'
import { compareBetweenVersions, deepCopy, sortArrOfObj } from '../Utils/Helpers'
import tutorialLinks from '../Utils/StaticData/tutorialLinks'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'
import acf from '../resource/img/integ/ACF.svg'
import Acumbamail from '../resource/img/integ/Acumbamail.svg'
import oneDrive from '../resource/img/integ/OneDrive.svg'
import activeCampaign from '../resource/img/integ/activeCampaign.svg'
import advancedFormIntegration from '../resource/img/integ/advancedFormIntegration.svg'
import zohoAnalytics from '../resource/img/integ/analytics.svg'
import automatorWP from '../resource/img/integ/automatorWP.svg'
import autonami from '../resource/img/integ/autonami.svg'
import zohoBigin from '../resource/img/integ/bigin.svg'
import zohoCamp from '../resource/img/integ/campaigns.svg'
import zohoCreator from '../resource/img/integ/creator.svg'
import zohoCRM from '../resource/img/integ/crm.svg'
import zohoDesk from '../resource/img/integ/desk.svg'
import dropbox from '../resource/img/integ/dropbox.svg'
import elasticemail from '../resource/img/integ/elasticemail.svg'
import encharge from '../resource/img/integ/encharge .svg'
import flowmattic from '../resource/img/integ/flowmattic.svg'
import fluentcrm from '../resource/img/integ/fluentcrm.svg'
import getgist from '../resource/img/integ/getgist.svg'
import googleSheet from '../resource/img/integ/googleSheets.svg'
import groundhogg from '../resource/img/integ/groundhogg.svg'
import zohoHub from '../resource/img/integ/hub.svg'
import hubspot from '../resource/img/integ/hubspot.svg'
import ifttt from '../resource/img/integ/ifttt.svg'
import integrately from '../resource/img/integ/integrately.svg'
import integromat from '../resource/img/integ/integromat.svg'
import zohoMail from '../resource/img/integ/mail.svg'
import mailChimp from '../resource/img/integ/mailchimp.svg'
import mailerLite from '../resource/img/integ/mailerLite.svg'
import mailPoet from '../resource/img/integ/mailpoet.svg'
import metabox from '../resource/img/integ/metabox.svg'
import n8n from '../resource/img/integ/n8n.svg'
import pabbly from '../resource/img/integ/pabbly.svg'
import pods from '../resource/img/integ/pods.svg'
import zohoProjects from '../resource/img/integ/projects.svg'
import rapidmail from '../resource/img/integ/rapidmail.svg'
import zohoRecruit from '../resource/img/integ/recruit.svg'
import sendfox from '../resource/img/integ/sendfox.svg'
import sendinblue from '../resource/img/integ/sendinblue.svg'
import zohoSheet from '../resource/img/integ/sheet.svg'
import zohoSign from '../resource/img/integ/sign.svg'
import sperseio from '../resource/img/integ/sperseio.svg'
import sureTriggers from '../resource/img/integ/sureTriggers.svg'
import telegram from '../resource/img/integ/telegram.svg'
import thriveAutomator from '../resource/img/integ/thriveAutomator.svg'
import twilio from '../resource/img/integ/twilio.svg'
import uncannyAutomator from '../resource/img/integ/uncannyAutomator.svg'
import webhooks from '../resource/img/integ/webhooks.svg'
import wooCommerce from '../resource/img/integ/woocommerce.svg'
import zohoWorkdrive from '../resource/img/integ/workdrive.svg'
import wpWebhooks from '../resource/img/integ/wpWebhooks.svg'
import zapier from '../resource/img/integ/zapier.svg'
import zohoflow from '../resource/img/integ/zohoflow.svg'
import style from '../styles/integrations.style'
import ConnectedAppInfo from './AllIntegrations/ConnectedAppInfo'
import EditInteg from './AllIntegrations/EditInteg'
import IntegInfo from './AllIntegrations/IntegInfo'
import NewInteg from './AllIntegrations/NewInteg'
import ErrorBoundary from './ErrorBoundary'
import ConfirmModal from './Utilities/ConfirmModal'
import Modal from './Utilities/Modal'
import SnackMsg from './Utilities/SnackMsg'
import Tip from './Utilities/Tip'

function Integrations() {
  const [integrs, setIntegration] = useAtom($integrations)
  const integrations = deepCopy(integrs)
  const [showMdl, setShowMdl] = useState(false)
  const [confMdl, setconfMdl] = useState({ show: false })
  const [snack, setSnackbar] = useState({ show: false })
  const { formType } = useParams()
  const formID = useAtomValue($formId)
  const navigate = useNavigate()
  const bits = useAtomValue($bits)
  const { isPro, proInfo } = bits
  const { css } = useFela()

  const allIntegURL = `/form/settings/${formType}/${formID}/integrations`

  const integs = [
    { type: 'Zoho CRM', logo: zohoCRM },
    { type: 'Web Hooks', logo: webhooks },
    { type: 'Zapier', logo: zapier },
    { type: 'Integromat', logo: integromat, title: 'Make(Integromat)' },
    { type: 'Integrately', logo: integrately },
    { type: 'Pabbly', logo: pabbly },
    { type: 'Zoho Flow', logo: zohoflow },
    { type: 'Google Sheet', logo: googleSheet },
    { type: 'Mail Chimp', logo: mailChimp },
    { type: 'ACF', logo: acf },
    { type: 'MetaBox', logo: metabox },
    { type: 'Pods', logo: pods },
    { type: 'Mail Poet', logo: mailPoet },
    { type: 'Brevo(SendinBlue)', logo: sendinblue, title: 'Brevo(SendinBlue)' },
    { type: 'WooCommerce', logo: wooCommerce },
    { type: 'ActiveCampaign', logo: activeCampaign },
    { type: 'Telegram', logo: telegram },
    { type: 'Fluent CRM', logo: fluentcrm },
    { type: 'Autonami', logo: autonami },
    { type: 'Acumbamail', logo: Acumbamail },
    { type: 'OneDrive', logo: oneDrive },
    { type: 'Dropbox', logo: dropbox },
    { type: 'Encharge', logo: encharge },
    { type: 'Rapidmail', logo: rapidmail },
    { type: 'Hubspot', logo: hubspot },
    { type: 'Getgist', logo: getgist },
    { type: 'ElasticEmail', logo: elasticemail },
    { type: 'Groundhogg', logo: groundhogg },
    { type: 'SendFox', logo: sendfox },
    { type: 'Zoho Recruit', logo: zohoRecruit },
    { type: 'Zoho Analytics', logo: zohoAnalytics },
    { type: 'Zoho Campaigns', logo: zohoCamp },
    { type: 'Zoho WorkDrive', logo: zohoWorkdrive },
    { type: 'Zoho Desk', logo: zohoDesk },
    { type: 'Zoho Mail', logo: zohoMail },
    { type: 'Zoho Sheet', logo: zohoSheet },
    { type: 'Zoho Projects', logo: zohoProjects },
    { type: 'Zoho Sign', logo: zohoSign },
    { type: 'Zoho Marketing Hub', logo: zohoHub },
    { type: 'Zoho Creator', logo: zohoCreator },
    { type: 'Zoho Bigin', logo: zohoBigin },
    { type: 'MailerLite', logo: mailerLite },
    { type: 'Twilio', logo: twilio },
    { type: 'FlowMattic', logo: flowmattic },
    { type: 'AutomatorWP', logo: automatorWP },
    { type: 'Uncanny Automator', logo: uncannyAutomator },
    { type: 'Automate Hub SperseIO', logo: sperseio },
    { type: 'Thrive Automator', logo: thriveAutomator },
    { type: 'WP Webhooks', logo: wpWebhooks },
    { type: 'Advanced Form Integration', logo: advancedFormIntegration },
    { type: 'IFTTT', logo: ifttt },
    { type: 'N8NIO', logo: n8n },
    { type: 'SureTriggers', logo: sureTriggers },
  ]

  const [availableIntegs, setAvailableIntegs] = useState(sortArrOfObj(integs, 'type'))

  const removeInteg = i => {
    const tempIntegration = { ...integrations[i] }
    const newInteg = [...integrations]
    newInteg.splice(i, 1)
    setIntegration(newInteg)
    bitsFetch({ formID, id: tempIntegration.id }, 'bitforms_delete_integration')
      .then(response => {
        if (response && response.success) {
          toast.success(response.data.message)
        } else if (response?.data?.data) {
          newInteg.splice(i, 0, tempIntegration)
          setIntegration(newInteg)
          toast.error(`${__('Integration deletion failed Cause')}:${response.data.data}. ${__('please try again')}`)
        } else {
          newInteg.splice(i, 0, tempIntegration)
          setIntegration(newInteg)
          toast.error(__('Integration deletion failed. please try again'))
        }
      })
  }

  const inteDelConf = i => {
    confMdl.btnTxt = __('Delete')
    confMdl.body = __('Are you sure to delete this integration?')
    confMdl.btnClass = ''
    confMdl.action = () => { removeInteg(i); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const getLogo = type => {
    for (let i = 0; i < integs.length; i += 1) {
      if (integs[i].type === type) {
        return (
          <img
            tabIndex={-1}
            className={css(style.integLogo)}
            alt={type || 'bitform integration logo'}
            loading="lazy"
            src={integs[i].logo}
          />
        )
      }
    }
    return null
  }

  const getStrInsideParenthesis = (str) => {
    const startIndex = str.indexOf('(')
    const endIndex = str.indexOf(')')
    return str.slice(startIndex + 1, endIndex)
  }

  const setNewInteg = inte => {
    if (inte.pro && !proInfo?.installedVersion && !isPro) {
      toast.error('This integration is only available in Bit Form Pro.')
      return false
    }
    if (inte.proVer && isPro && proInfo?.installedVersion && compareBetweenVersions(inte?.proVer, proInfo.installedVersion) === 1) {
      toast.error('Please update to the latest version of Bit Form Pro.')
      return false
    }
    const { type } = inte

    const action = type.includes('(') || type.includes(')') ? getStrInsideParenthesis(type) : type
    closeIntegModal()
    navigate(`${allIntegURL}/new/${action}`)
  }

  const closeIntegModal = () => {
    setShowMdl(false)
    setTimeout(() => setAvailableIntegs(sortArrOfObj(integs, 'type')), 500)
  }

  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }

  const searchInteg = e => {
    const { value } = e.target
    const filtered = integs.filter(integ => {
      const integName = (integ.title || integ.type).toLowerCase()
      return integName.includes(value.toLowerCase())
    })
    setAvailableIntegs(sortArrOfObj(filtered, 'type'))
  }

  const inteCloneConf = i => {
    confMdl.btnTxt = __('Clone')
    confMdl.body = __('Are you sure to clone this integration?')
    confMdl.btnClass = ''
    confMdl.action = () => { inteClone(i); closeConfMdl() }
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const inteClone = (i) => {
    const existInteg = { ...integrations[i] }
    const tmpInteg = [...integrations]
    toast.loading('cloning...')
    bitsFetch({ formID, id: existInteg.id }, 'bitforms_clone_integration')
      .then(response => {
        if (response && response.success) {
          existInteg.id = response.data
          existInteg.name = `Duplicate of ${existInteg.name}`
          tmpInteg.push(existInteg)
          setIntegration(tmpInteg)
          toast.success('Integration clone successfully done.')
        } else {
          toast.error(`${__('Integration clone failed Cause')}: ${response.data} ${__('please try again')}`)
        }
      }).catch(() => toast.error(__('Integration clone failed.')))
  }

  const avoidIntegsForInfo = ['WooCommerce']

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ConfirmModal
        show={confMdl.show}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btnClass={confMdl.btnClass}
        body={confMdl.body}
        action={confMdl.action}
      />
      <ErrorBoundary>
        <Routes>
          <Route
            index
            element={(
              <>
                {integrations.length === 0 && (
                  <div>
                    <h3>{__('Available Integrations')}</h3>
                    <p>
                      {__('Integrate your form with your favorite apps and services.')}
                    </p>
                    <div className=" btcd-inte-wrp txt-center">
                      <input
                        aria-label="Search Ingegration"
                        type="search"
                        className="btcd-paper-inp w-5 mt-3"
                        onChange={searchInteg}
                        placeholder="Search platforms for integrate..."
                        style={{ height: 37 }}
                        autoFocus
                      />
                      <div className="flx flx-center flx-wrp pb-3">
                        {availableIntegs.map((inte, i) => (
                          <div
                            key={`inte-sm-${i + 2}`}
                            onClick={() => !inte.disable && setNewInteg(inte)}
                            onKeyDown={() => !inte.disable && setNewInteg(inte)}
                            role="button"
                            tabIndex="0"
                            className={`${css(style.thumb)} ${inte.disable && !inte.pro && css(style.integCardDisabled)}`}
                          >
                            {/* {(inte.pro && !isPro) && (
                            <div className={css(style.thumbPro)}>
                              <a className={css(style.thumbProTxt)} href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                                {__('Available on')}
                                <br />
                                {__('Pro')}
                              </a>
                            </div>
                          )} */}
                            <img className={css(style.thumbImg)} loading="lazy" src={inte.logo} alt="" />
                            <div className={css(style.thumbTitle)}>
                              {inte.title || inte.type}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {integrations.length > 0 && (
                  <>
                    <h2>{__('Integrations')}</h2>
                    <h5>
                      {__("How to setup Integrations:")}
                      &nbsp;
                      <a href={tutorialLinks.integrations.link} target="_blank" rel="noreferrer" className="yt-txt ml-1 mr-1">
                        {__("YouTube")}
                      </a>
                      <a href={tutorialLinks.integrations.link} target="_blank" rel="noreferrer" className="doc-txt">
                        {__("Documentation")}
                      </a>
                    </h5>
                    <div className={css(style.integWrp)}>
                      <Modal
                        title={__('Available Integrations')}
                        show={showMdl}
                        setModal={closeIntegModal}
                        style={{ width: 1000 }}
                      >
                        <div className=" btcd-inte-wrp txt-center">
                          <input
                            aria-label="Search Ingegration"
                            type="search"
                            className="btcd-paper-inp w-5 mt-3"
                            onChange={searchInteg}
                            placeholder="Search Integrations..."
                            style={{ height: 37 }}
                            autoFocus
                          />
                          <div className="flx flx-center flx-wrp pb-3">
                            {availableIntegs.map((inte, i) => (
                              <div
                                key={`inte-sm-${i + 2}`}
                                onClick={() => !inte.disable && setNewInteg(inte)}
                                onKeyDown={() => !inte.disable && setNewInteg(inte)}
                                role="button"
                                tabIndex="0"
                                className={`${css(style.thumb)} ${inte.disable && !inte.pro && css(style.integCardDisabled)}`}
                              >
                                {/* {(inte.pro && !isPro) && (
                            <div className={css(style.thumbPro)}>
                              <a className={css(style.thumbProTxt)} href="https://www.bitapps.pro/bit-form" target="_blank" rel="noreferrer">
                                {__('Available on')}
                                <br />
                                {__('Pro')}
                              </a>
                            </div>
                          )} */}
                                <img className={css(style.thumbImg)} loading="lazy" src={inte.logo} alt="" />
                                <div className={css(style.thumbTitle)}>
                                  {inte.title || inte.type}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Modal>

                      <div
                        role="button"
                        className={css(style.itegCard)}
                        tabIndex="0"
                        onClick={() => setShowMdl(true)}
                        onKeyDown={() => setShowMdl(true)}
                      >
                        <div className={css(style.integPlus)}><PlusIcn size={80} /></div>
                      </div>

                      {integrations.map((inte, i) => (
                        <div role="button" className={css(style.itegCard)} key={`inte-${i + 3}`}>
                          {!avoidIntegsForInfo.includes(inte.type) ? (
                            <Link to={`${allIntegURL}/info/${i}`}>
                              {getLogo(inte.type)}
                            </Link>
                          ) : (
                            <>{getLogo(inte.type)}</>
                          )}
                          <div className="py-1" title={`${inte.name} | ${inte.type}`}>
                            {!avoidIntegsForInfo.includes(inte.type) ? (
                              <Link
                                to={`${allIntegURL}/info/${i}`}
                                className={css(style.integTitle)}
                              >
                                {inte.name}
                              </Link>
                            ) : (
                              <p className={css(style.integTitle)}>{inte.name}</p>
                            )}
                            <small className={css(style.integSubtitle)}>{inte.type}</small>
                          </div>
                          <div className={`${css(style.actionWrp)} action-wrp`}>
                            <Tip msg={__('Delete')}>
                              <button
                                className={`${css(style.actionBtn)}`}
                                onClick={() => inteDelConf(i)}
                                type="button"
                              >
                                <TrashIcn size={18} />
                              </button>
                            </Tip>
                            <Tip msg={__('Clone')}>
                              <button
                                className={`${css(style.actionBtn)}`}
                                onClick={() => inteCloneConf(i)}
                                type="button"
                              >
                                <CopyIcn stroke={2.5} size="18" />
                              </button>
                            </Tip>
                            {typeof (integs.find(int => int.type === inte.type)?.info) !== 'boolean' && (
                              <Tip msg={__('Edit')}>
                                <Link
                                  to={`${allIntegURL}/edit/${i}`}
                                  className={`${css(style.actionBtn)}`}
                                  type="button"
                                >
                                  <EditIcn size={19} />
                                </Link>
                              </Tip>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

              </>
            )}
          />
          <Route path="new/:integUrlName/*" element={<NewInteg allIntegURL={allIntegURL} />} />
          <Route path="/app-info/:id/*" element={<ConnectedAppInfo allIntegURL={allIntegURL} />} />
          {integrations?.length
            && (<Route path="/edit/:id/*" element={<EditInteg allIntegURL={allIntegURL} />} />)}
          {integrations && integrations.length > 0
            && (<Route path="/info/:id/*" element={<IntegInfo allIntegURL={allIntegURL} />} />)}
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default Integrations
