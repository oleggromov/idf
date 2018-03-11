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

  class IDFWidget {
    constructor (options) {
      this.node = options.node
      this.iframeWidth = options.width
      this.iframeHeight = options.height
      this.pullData()
        .then(data => this.renderData(data))
        .catch(error => this.renderError(error))
    }

    pullData () {
      return window.fetch(htmlEndpoint)
        .then(data => data.json())
    }

    renderData (data) {
      this.iframe = createIframe({
        parent: this.node,
        content: data.body,
        width: this.iframeWidth,
        height: this.iframeHeight
      })
    }

    renderError (error) {
      console.error(error)
    }
  }

  window.IDFWidget = IDFWidget
})(window)
