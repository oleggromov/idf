(function () {
  const htmlEndpoint = 'https://test.information-architecture.org/widgets/ux-daily-v2?ep=mads_soegaard'

  const fonts = '<link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Condensed" rel="stylesheet">'
  const style = `body { font: normal 14px Roboto; }
  .idf-ux-daily-widget__header,
  .idf-article__published-time { font-family: 'Roboto Condensed' }`

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
      <style>${style}</style>
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
    const pre = document.createElement('div')
    pre.innerHTML = `Error:\n${content}<br>Press this message to try again`
    pre.addEventListener('click', action)
    parent.appendChild(pre)
    return {
      remove: () => {
        pre.removeEventListener('click', action)
        parent.removeChild(pre)
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
