console.log('inject-style-tag loaded!!.')

let lastIdInserted = null

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
let createSingleTag = /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())

module.exports = {
  inject(css,id) {
    console.log('inject',css,id)

    // check if css is already injected exists
    if (document.getElementById(id)) {
      console.log('css already added')
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
          console.log('handling IE9')
          if (lastStyleInserted.styleSheet) {
            console.log('first case, replace text')
            lastStyleInserted.styleSheet.cssText = `${lastStyleInserted.styleSheet.cssText}\n/* ${id} */\n${css}`
          } else {
            console.log('second case, append child text node')
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
