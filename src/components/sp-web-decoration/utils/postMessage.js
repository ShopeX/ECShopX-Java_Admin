function createDecorationMessenger(websiteUrl) {
  let previewOrigin = ''
  try {
    previewOrigin = websiteUrl ? new URL(websiteUrl).origin : ''
  } catch {
    previewOrigin = ''
  }

  /**
   * websiteUrl 可能已带 query（如 …?preview=true&designMode=1），不能再拼接 `/${'?'}…`，
   * 否则会出现 …designMode=1/?preview=true… 的非法 URL，iframe 加载失败并触发 X-Frame-Options 错误页。
   */
  function getPreviewUrl({ templateId, pageType = 'home' }) {
    if (!websiteUrl) return ''
    const pageId = templateId || pageType
    try {
      const base =
        typeof window !== 'undefined' && window.location?.href
          ? new URL(websiteUrl, window.location.href)
          : new URL(websiteUrl)
      if (!base.pathname || base.pathname === '') {
        base.pathname = '/'
      }
      base.searchParams.set('preview', 'true')
      base.searchParams.set('pageType', pageType)
      base.searchParams.set('pageId', String(pageId))
      return base.toString()
    } catch {
      const originOnly = String(websiteUrl).split('?')[0].replace(/\/+$/, '') || ''
      const qs = new URLSearchParams({
        preview: 'true',
        pageType: String(pageType),
        pageId: String(pageId)
      })
      return `${originOnly}/?${qs.toString()}`
    }
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
