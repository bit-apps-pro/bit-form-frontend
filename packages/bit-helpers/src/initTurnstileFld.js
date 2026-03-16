export default function initTurnstileFld(contentId, fldKey) {
  const src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
  const attrs = {
    async: true,
    defer: true,
  }
  const id = `bit_turnstile_script-${contentId}`
  scriptLoader(src, '', attrs, id)
}
