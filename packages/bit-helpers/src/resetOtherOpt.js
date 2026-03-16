export default function resetOtherOpt(contentId) {
  bfSelect(`#form-${contentId}`).querySelectorAll('input[data-oopt]').forEach((el) => {
    el.value = ''
  })
}
