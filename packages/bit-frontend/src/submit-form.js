function bitFormSubmitAction(e) {
  e.preventDefault()
  const contentId = e.target.id.slice(e.target.id.indexOf('-') + 1)

  if (
    typeof validateForm !== 'undefined'
    && !validateForm({ form: contentId })
  ) {
    const validationEvent = new CustomEvent('bf-form-validation-error', {
      detail: { formId: contentId, fieldId: '', error: '' },
    })
    e.target.dispatchEvent(validationEvent)
    return
  }
  disabledSubmitButton(contentId, true)
  let formData = new FormData(e.target)
  const props = window.bf_globals[contentId]

  if (typeof advancedFileHandle !== 'undefined') formData = advancedFileHandle(props, formData)
  if (typeof decisionFldHandle !== 'undefined') formData = decisionFldHandle(props, formData)
  if (typeof hideChildFldHandle !== 'undefined') formData = hideChildFldHandle(props, formData)
  if (props.GCLID) {
    formData.set('GCLID', props.GCLID)
  }

  const hidden = []
  Object.entries(props?.fields || {}).forEach((fld) => {
    if (fld[1]?.valid?.hide) {
      hidden.push(fld[0])
    }
  })

  if (hidden.length) {
    formData.append('hidden_fields', hidden)
  }
  if (props?.gRecaptchaVersion === 'v3' && props?.gRecaptchaSiteKey) {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(props.gRecaptchaSiteKey, { action: 'submit' })
        .then((token) => {
          formData.append('g-recaptcha-response', token)
          const submitResp = bfSubmitFetch(props, formData)
          submitResponse(submitResp, contentId, formData)
        })
    })
  } else {
    const submitResp = bfSubmitFetch(props, formData)
    submitResponse(submitResp, contentId, formData)
  }
}

function bfSubmitFetch(props, formData) {
  const uri = new URL(props?.ajaxURL)
  const route = props?.entryId ? 'bitforms_update_form_entry' : 'bitforms_submit_form'
  uri.searchParams.append('action', route)
  if (props?.entryId) {
    uri.searchParams.append('_ajax_nonce', props.nonce || '')
    uri.searchParams.append('entryID', props.entryId)
    uri.searchParams.append('formID', props.formId)
    uri.searchParams.append('entryToken', props.entryToken || '')
  }
  return fetch(uri, {
    method: 'POST',
    body: formData,
  })
}
function submitResponse(resp, contentId, formData) {
  resp
    .then(
      (response) => new Promise((resolve, reject) => {
        if (response.staus > 400) {
          const errorEvent = new CustomEvent('bf-form-submit-error', {
            detail: { formId: contentId, errors: response.data },
          })
          bfSelect(`#form-${contentId}`).dispatchEvent(errorEvent)
          response.staus === 500
            ? reject(new Error('Mayebe Internal Server Error'))
            : reject(response.json())
        } else resolve(response.json())
      }),
    )
    .then((result) => {
      const successEvent = new CustomEvent('bf-form-submit-success', {
        detail: { formId: contentId, entryId: result.data.entry_id, formData },
      })
      bfSelect(`#form-${contentId}`).dispatchEvent(successEvent)
      let responsedRedirectPage = null
      let hitCron = null
      let newNonce = ''
      let redirectDelay = 1000
      const props = window.bf_globals[contentId]
      if (result !== undefined && result.success) {
        const form = bfSelect(`#form-${contentId}`)
        bfReset(contentId)
        if (typeof result.data === 'object') {
          if (form) {
            result?.data?.hidden_fields?.map(hdnFld => {
              setHiddenFld(hdnFld, form)
            })
          }
          responsedRedirectPage = result.data.redirectPage
          if (result.data.cron) {
            hitCron = result.data.cron
          }
          if (result.data.cronNotOk) {
            hitCron = result.data.cronNotOk
          }
          if (result.data.new_nonce) {
            newNonce = result.data.new_nonce
            props.nonce = newNonce
          }
          setBFMsg({
            contentId,
            msgId: result.data.msg_id,
            msg: result.data.message,
            duration: result.data.msg_duration,
            show: true,
            type: 'success',
            error: false,
          })
          redirectDelay = Number(result.data.msg_duration || 1000)
        } else {
          setBFMsg({
            contentId,
            msg: result.data,
            type: 'success',
            show: true,
            error: false,
          })
        }
        localStorage.removeItem(`bitform-partial-form-${props.formId}`)
        const entryIdElm = bfSelect('input[name="entryID"]', form)
        if (entryIdElm) entryIdElm.remove()
        delete props.entryId
      } else {
        const errorEvent = new CustomEvent('bf-form-submit-error', {
          detail: { formId: contentId, errors: result.data },
        })
        bfSelect(`#form-${contentId}`).dispatchEvent(errorEvent)
        bfValidationErrMsg(result, contentId)
      }

      triggerIntegration(hitCron, newNonce, contentId)
      if (responsedRedirectPage) {
        const timer = setTimeout(() => {
          window.location = decodeURI(responsedRedirectPage)
          if (timer) {
            clearTimeout(timer)
          }
        }, redirectDelay)
      }

      disabledSubmitButton(contentId, false)
    })
    .catch((error) => {
      const err = error?.message ? error.message : 'Unknown Error'
      setBFMsg({
        contentId,
        msg: err,
        show: true,
        type: 'error',
        error: true,
      })
      disabledSubmitButton(contentId, false)
    })
}

function triggerIntegration(hitCron, newNonce, contentId) {
  const props = window.bf_globals[contentId]
  if (hitCron) {
    if (typeof hitCron === 'string') {
      const uri = new URL(hitCron)
      if (uri.protocol !== window.location.protocol) {
        uri.protocol = window.location.protocol
      }
      fetch(uri)
    } else {
      const uri = new URL(props.ajaxURL)
      uri.searchParams.append('action', 'bitforms_trigger_workflow')
      const data = {
        cronNotOk: hitCron,
        token: newNonce || props.nonce,
        id: props.appID,
      }
      fetch(uri, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => response.json())
    }
  }
}

function disabledSubmitButton(contentId, disabled) {
  const submitButton = bfSelect('button[type="submit"]', bfSelect(`#form-${contentId}`))
  if (submitButton) submitButton.disabled = disabled
  const spinner = bfSelect('button[type="submit"] span', bfSelect(`#form-${contentId}`))
  if (spinner) spinner.classList.toggle('d-none')
}

export default function addSubmitEventToForms(formContentId = null) {
  const formIds = formContentId ? [formContentId] : Object.keys(window.bf_globals)
  formIds.forEach((contentId) => {
    const frm = bfSelect(`#form-${contentId}`)
    if (frm) {
      frm.addEventListener('submit', (e) => { bitFormSubmitAction(e) })
      bfSelect('button[type="reset"]', frm)
        ?.addEventListener('click', () => bfReset(frm.id.replace('form-', ''), true))
    }
  })

  document.querySelectorAll('.msg-backdrop,.bf-msg-close').forEach((elm) => {
    elm.addEventListener('click', e => {
      if (e.target === elm) {
        e.stopPropagation()
        bfSelect(`#${elm.dataset.contentid} .msg-container-${elm.dataset.msgid}`).classList.replace('active', 'deactive')
      }
    })
  })

  localStorage.setItem('bf-entry-id', '')
}
