export default function scriptLoader(src, integrity, attrs, id, initFunc) {
  const script = document.createElement('script')
  script.src = src
  script.id = id
  if (integrity) {
    script.integrity = integrity
    script.crossOrigin = 'anonymous'
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, val]) => {
      script.setAttribute(key, val)
    })
  }
  script.onload = function () {
    initFunc && initFunc()
  }
  const alreadyExistScriptElm = document.querySelector(`script#${id}`)
  if (alreadyExistScriptElm) {
    initFunc && initFunc()
  } else {
    document.body.appendChild(script)
  }
}
