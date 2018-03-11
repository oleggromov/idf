(function (window) {
  const htmlEndpoint = 'https://test.information-architecture.org/widgets/ux-daily-v2?ep=mads_soegaard'

  const fonts = '<link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Condensed:400,700" rel="stylesheet">'
  const styles = '<link rel="stylesheet" href="./widget.css" />'

  const createIframe = ({ parent, content, width, height }) => {
    const iframe = document.createElement('iframe')
    iframe.width = width
    iframe.height = height
    iframe.style.cssText = 'border: none;'
    iframe.srcdoc = `<!doctype html>
    <html>
    <head>
      <title></title>
      ${fonts}
      ${styles}
    </head>
    <body>${content}</body>
    </html>`
    parent.appendChild(iframe)
    return iframe
  }

  const createLoadingMessage = ({ parent }) => {
    const div = document.createElement('div')
    div.innerHTML = 'Loading, please wait...'
    parent.appendChild(div)
    return div
  }

  const createError = ({ parent, content, action }) => {
    const div = document.createElement('div')
    div.innerHTML = `Error:\n${content}<br>Press this message to try again`
    div.addEventListener('click', action)
    parent.appendChild(div)
    return {
      remove: () => {
        div.removeEventListener('click', action)
        parent.removeChild(div)
      }
    }
  }

  class IDFWidget {
    constructor (options) {
      this.node = options.node
      this.iframeWidth = options.width
      this.iframeHeight = options.height
      this.render()
    }

    render () {
      this.loading = createLoadingMessage({ parent: this.node })
      this.pullData()
        .then(data => this.renderData(data))
        .catch(error => this.renderError(error))
    }

    pullData () {
      return window.fetch(htmlEndpoint)
        .then(data => data.json())
    }

    removeMessages () {
      this.node.removeChild(this.loading)
      if (this.error) {
        this.error.remove()
        this.error = null
      }
    }

    renderData (data) {
      this.removeMessages()
      this.iframe = createIframe({
        parent: this.node,
        content: data.body,
        width: this.iframeWidth,
        height: this.iframeHeight
      })
    }

    renderError (error) {
      this.removeMessages()
      this.error = createError({
        parent: this.node,
        content: error.message,
        action: () => this.render()
      })
    }
  }

  window.IDFWidget = IDFWidget
})(window)
