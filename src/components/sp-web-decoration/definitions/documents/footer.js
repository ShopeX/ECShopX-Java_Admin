import { createTypedSection } from '../factory.js'

const footerDocument = {
  type: 'footer',
  sections: [
    {
      type: 'footer',
      fixedId: 'footer',
      blocks: [
        {
          type: 'footer-link',
          settings: {
            label: '',
            url: '/help'
          }
        }
      ]
    }
  ]
}

export function createFooterDocumentDsl() {
  const sections = {}
  const order = []

  ;(footerDocument.sections || []).forEach((item) => {
    if (!item?.type) return
    const section = createTypedSection(item.type, {
      fixedId: item.fixedId,
      settings: item.settings,
      blocks: item.blocks
    })
    sections[section.id] = section
    order.push(section.id)
  })

  return {
    pageType: 'footer',
    pageId: 'footer',
    sections,
    order
  }
}

export default footerDocument
