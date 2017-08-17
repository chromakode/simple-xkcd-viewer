let callbackId = 0

export default function fetchJSONP(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `__JSONP${callbackId}__`
    window[callbackName] = resolve
    callbackId += 1

    const scriptEl = document.createElement('script')
    scriptEl.src = `${url}?callback=${callbackName}`
    scriptEl.onload = () => {
      document.head.removeChild(scriptEl)
      delete window[callbackName]
    }
    scriptEl.onerror = () => {
      document.head.removeChild(scriptEl)
      reject(new Error(`unable to load ${url}`))
    }
    document.head.appendChild(scriptEl)
  })
}
