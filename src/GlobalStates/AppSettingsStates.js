import { atom } from 'jotai'

// helper functions
const paymentsState = () => {
  if (!window.bits) return []
  if (window.bits?.allFormSettings?.payments) {
    const pays = window.bits.allFormSettings.payments
    if (Array.isArray(pays)) return pays
    return [pays]
  }
  return []
}

const getReCaptchaState = ver => {
  if (!window.bits) return { siteKey: '', secretKey: '' }
  let captcha
  if (ver === 'v2') captcha = window.bits?.allFormSettings?.gReCaptcha
  else if (ver === 'v3') captcha = window.bits?.allFormSettings?.gReCaptchaV3
  if (captcha) {
    if (Array.isArray(captcha)) {
      return captcha[0]
    }
    return captcha
  }
  return {
    siteKey: '',
    secretKey: '',
  }
}

const getTurnstileState = () => {
  if (!window.bits) return {}
  if (window.bits?.allFormSettings?.turnstileCaptcha) {
    const { turnstileCaptcha } = window.bits.allFormSettings
    if (Array.isArray(turnstileCaptcha)) return turnstileCaptcha[0]
    return turnstileCaptcha
  }
  return {
    siteKey: '',
    secretKey: '',
  }
}

const getHCaptchaState = () => {
  if (!window.bits) return {}
  if (window.bits?.allFormSettings?.hcaptcha) {
    const { hcaptcha } = window.bits.allFormSettings
    if (Array.isArray(hcaptcha)) return hcaptcha[0]
    return hcaptcha
  }
  return {
    siteKey: '',
    secretKey: '',
  }
}

const getConnectedIntegrationApps = () => {
  if (!window.bits) return []
  if (window.bits?.allFormSettings?.connectedIntegrationApps) {
    const connectedApps = window.bits?.allFormSettings?.connectedIntegrationApps || []
    if (Array.isArray(connectedApps)) return connectedApps
    return [connectedApps]
  }
  return []
}

const getDefaultGlobalMessages = () => {
  if (!window.bits) return {}
  if (window.bits?.appSettings?.globalMessages) {
    const globalMessages = window.bits?.appSettings?.globalMessages || {}
    return globalMessages
  }
  return {}
}

export const $payments = atom(paymentsState())
export const $reCaptchaV2 = atom(getReCaptchaState('v2'))
export const $reCaptchaV3 = atom(getReCaptchaState('v3'))
export const $turnstile = atom(getTurnstileState())
export const $hCaptcha = atom(getHCaptchaState())
export const $connectedApps = atom(getConnectedIntegrationApps())
export const $globalMessages = atom(getDefaultGlobalMessages())
