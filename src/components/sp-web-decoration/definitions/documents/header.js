import { createTypedSection } from '../factory.js'

const headerDocument = {
  type: 'header',
  sections: [
    {
      type: 'announcement-bar',
      settings: {
        full_width: false,
        auto_rotate: false,
        enable_country_selector: false,
        color_mode: 'light',
        show_line_separator: true,
        change_slides_speed: 5,
        color_style: 'pure',
        show_social: false,
        enable_language_selector: false
      },
      blocks: [
        {
          type: 'announcement',
          settings: {
            text: 'You are welcome to browse our store'
          }
        }
      ]
    },
    {
      type: 'header',
      fixedId: 'header',
      blocks: []
    }
  ]
}

export function createHeaderDocumentDsl() {
  const sections = {}
  const order = []

  ;(headerDocument.sections || []).forEach((item) => {
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
    pageType: 'header',
    pageId: 'header',
    sections,
    order
  }
}

export default headerDocument
