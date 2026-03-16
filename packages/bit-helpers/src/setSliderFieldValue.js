export default function setSliderFieldValue(formContentId = null) {
  const contentIds = formContentId ? [formContentId] : Object.keys(bf_globals)
  contentIds.forEach(contentId => {
    bfSelect(`#form-${contentId}`)?.querySelectorAll("input[type='range']").forEach((el) => {
      el.addEventListener('input', (e) => {
        e.target.parentNode.style.setProperty('--bfv-fld-val', JSON.stringify(el.value))
        const bfFill = ((el.value - (el.min || 0)) / ((el.max || 100) - (el.min || 0))) * 100
        e.target.style.setProperty('--bfv-fill-lower-track', `${bfFill}%`, 'important')
      })
      const style = window.getComputedStyle(el)
      el.style.setProperty('--bfv-track-dir', style.direction === 'rtl' ? 'to left' : 'to right')
    })
  })
}
