export default function initAddOtherOpt(formContentId = null) {
  const contentIds = formContentId ? [formContentId] : Object.keys(bf_globals)
  contentIds.forEach(contentId => {
    bfSelect(`#form-${contentId}`).querySelectorAll('input[data-bf-other-inp]').forEach((el) => {
      el.addEventListener('keyup', (e) => {
        e.target.parentNode.parentNode.querySelector('input').value = el.value
        e.target.parentNode.parentNode.querySelector('input').dispatchEvent(new Event('input'))
      })
    })
  })
}
