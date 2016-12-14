// state
let lastIdInserted = null

// Force single-tag solution on IE6-9, which has a hard limit
// on the # of <style> tags it will allow on a page
const createSingleTag = /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())

module.exports = {
  inject(css,id) {

    // check if css is already injected
    if (document.getElementById(id)) {
      return
    }

    // find <head>
    const head = document.head || document.getElementsByTagName("head")[0]

    // inject
    const style = document.createElement('style')
    style.type = 'text/css'
    style.id = id

    style.appendChild(document.createTextNode(`/* ${id} */ ${css}`))

    const lastStyleInserted = lastIdInserted ? document.getElementById(lastIdInserted) : null

    if (lastStyleInserted) {
        if (createSingleTag) {
          if (lastStyleInserted.styleSheet) {
            lastStyleInserted.styleSheet.cssText = `${lastStyleInserted.styleSheet.cssText}\n/* ${id} */\n${css}`
          } else {
            lastStyleInserted.appendChild(document.createTextNode(`/* ${id} */ ${css}`))
          }
        } else {
          if (lastStyleInserted.nextSibling) {
            head.insertBefore(style, lastStyleInserted.nextSibling)
          } else {
            head.appendChild(style)
          }

          // remember the last element we added
          lastIdInserted = id
        }
    } else {
      head.insertBefore(style, head.firstChild)

      // remember the last element we added
      lastIdInserted = id
    }
  }
}
