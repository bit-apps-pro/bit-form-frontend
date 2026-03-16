export default function handleConversationalFormMsg(msgObj) {
  const formWrpr = bfSelect(`#${msgObj.contentId}`)
  const msgWrpr = bfSelect(`#bc-form-msg-wrp-${msgObj.contentId}`)

  if (!msgWrpr) return false
  msgWrpr.innerHTML = `<div class="bc-form-msg bc-step-deactive ${msgObj.type} scroll">${msgObj.msg}</div>`
  const msgInnerWrpr = bfSelect('.bc-form-msg', msgWrpr)
  if (msgObj.type === 'error') {
    msgInnerWrpr.classList.add('error')
    msgInnerWrpr.classList.replace('bc-step-deactive', 'bc-step-fade-up')
  }

  if (msgObj.type === 'success') {
    msgInnerWrpr.classList.add('success')
    msgInnerWrpr.classList.replace('bc-step-deactive', 'bc-step-fade-up')
    formWrpr.innerHTML = msgWrpr.outerHTML
  }
  return true
}
