function createDecorationMessenger(websiteUrl) {
  const previewOrigin = websiteUrl ? new URL(websiteUrl).origin : ''

  function getPreviewUrl({ templateId, pageType = 'home' }) {
    const pageId = templateId || pageType
    return `${websiteUrl}/?preview=true&pageType=${pageType}&pageId=${pageId}`
  }

  function send(type, iframeWindow, payload) {
    if (!iframeWindow || typeof iframeWindow.postMessage !== 'function') return
    iframeWindow.postMessage({ type, payload }, previewOrigin)
  }

  function sendInit(iframeWindow, payload) {
    send('DECORATION_INIT', iframeWindow, payload)
  }

  function sendUpdate(iframeWindow, payload) {
    send('DECORATION_UPDATE', iframeWindow, payload)
  }

  function isAllowedOrigin(origin) {
    return Boolean(previewOrigin) && origin === previewOrigin
  }

  function onMessage(handler) {
    if (typeof window === 'undefined') {
      return () => {}
    }
    const listener = (event) => {
      if (!isAllowedOrigin(event.origin)) return
      handler(event)
    }
    window.addEventListener('message', listener)
    return () => {
      window.removeEventListener('message', listener)
    }
  }

  return {
    previewOrigin,
    getPreviewUrl,
    sendInit,
    sendUpdate,
    isAllowedOrigin,
    onMessage
  }
}

module.exports = {
  createDecorationMessenger
}
