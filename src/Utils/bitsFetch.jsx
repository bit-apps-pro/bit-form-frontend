/* eslint-disable no-undef */

export default async function bitsFetch(data, action, contentType = null, queryParam = null) {
  if (!action) return
  const uri = new URL(typeof bits === 'undefined' ? bitFromsFront?.ajaxURL : bits.ajaxURL)
  // uri.searchParams.append('action', action)
  // uri.searchParams.append('_ajax_nonce', typeof bits === 'undefined' ? '' : bits.nonce)
  const payload = new FormData()
  if (data instanceof FormData) {
    data.entries().forEach(([key, value]) => {
      payload.append(key, value)
    })
  } else {
    payload.append('data', JSON.stringify(data))
  }
  // payload.append('data', data instanceof FormData ? data : JSON.stringify(data))  // FormData nesting - if the data is an instance of formdata, sets [object FormData] to data property of payload.
  payload.append('action', action)
  payload.append('_ajax_nonce', typeof bits === 'undefined' ? '' : bits.nonce)

  // append query params in url
  if (queryParam) {
    for (const key in queryParam) {
      if (key) {
        uri.searchParams.append(key, queryParam[key])
      }
    }
  }
  return fetch(uri, {
    method: 'POST',
    headers: {},
    // body: data instanceof FormData ? data : JSON.stringify(data),
    body: payload,
  })
    .then(res => res.json())
}
