import BitConversationalForm from './class-conversational-form'

export default function bitConversationalFormInit() {
  const contentIds = Object.keys(window?.bf_globals || {})
  contentIds.forEach(contentId => {
    const props = window.bf_globals[contentId]
    const conversationalSettings = props.formInfo?.conversationalSettings
    if (conversationalSettings?.enable) {
      const { formId } = props
      const form = bfSelect(`#form-${contentId}`)
      const container = bfSelect(`.bc${formId}-steps-container`, form)
      if (!container) return
      props.inits.conversational_form = new BitConversationalForm(container, { contentId, formId, ...conversationalSettings })
    }
  })
}
