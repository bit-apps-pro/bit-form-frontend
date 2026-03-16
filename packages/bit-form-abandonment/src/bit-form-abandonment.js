export default function bitFormAbandonment(formContentId = null) {
  const contentIds = formContentId ? [formContentId] : Object.keys(window?.bf_globals || {})
  contentIds.forEach(contentId => {
    const props = window.bf_globals[contentId]
    // if local storage has partial form data, set it to form
    const partialFormData = localStorage.getItem(`bitform-partial-form-${props.formId}`)
    if (partialFormData) {
      const formData = JSON.parse(partialFormData)
      props.oldValues = formData
      if (!props.entryId) {
        props.entryId = formData.entryId
      }
    }
  })

  const buttons = document.querySelectorAll('.bf-trigger-form-abandonment')
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const form = button.closest('form')
      const spinner = bfSelect('.bf-spinner', button)
      spinner.classList.remove('d-none')
      const contentId = form.id.replace('form-', '')
      saveFormProgress(contentId)
        .then((response) => {
          if (response?.success) {
            spinner.classList.add('d-none')
          }
        })
        .finally(() => {
          spinner.classList.add('d-none')
        })
    })
  })
}
