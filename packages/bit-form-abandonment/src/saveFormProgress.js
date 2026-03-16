export default async function saveFormProgress(formContentId) {
  const contentIds = formContentId ? [formContentId] : Object.keys(window?.bf_globals || {})
  const responseData = {}
  await Promise.all(contentIds.map(async (contentId) => {
    const formId = `#form-${contentId}`
    const form = bfSelect(formId)
    const props = window?.bf_globals?.[contentId]
    if (form) {
      const uri = new URL(props?.ajaxURL)
      const route = 'bitforms_save_partial_form_progress'
      uri.searchParams.append('action', route)
      if (props?.entryId) {
        uri.searchParams.append('_ajax_nonce', props.nonce || '')
        uri.searchParams.append('entryID', props.entryId)
        uri.searchParams.append('formID', props.formId)
        uri.searchParams.append('entryToken', props.entryToken || '')
      }
      let formData = new FormData(form)
      if (typeof advancedFileHandle !== 'undefined') {
        formData = advancedFileHandle(props, formData)
      }
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
      const formSaveResponse = await fetch(uri, {
        method: 'POST',
        body: formData,
        keepalive: true,
      })
      const data = await formSaveResponse.json()
      responseData[contentId] = data
      if (data?.success) {
        if ('user_id' in (data?.data || {}) && !data?.data?.user_id) {
          // set local storage for partial form data by form id
          const partialFormData = data.data.fields || {}
          partialFormData.entryId = data.data.entry_id
          localStorage.setItem(`bitform-partial-form-${props.formId}`, JSON.stringify(partialFormData))
        }
        if (data?.data?.entry_id) {
          setHiddenFld({ name: 'entryID', value: data.data.entry_id, type: 'number' }, form)
          bf_globals[contentId].entryId = data.data.entry_id
        }
        if (data?.data?.entry_token) {
          bf_globals[contentId].entryToken = data.data.entry_token
        }
      }
    }
  }))
  return responseData
}
