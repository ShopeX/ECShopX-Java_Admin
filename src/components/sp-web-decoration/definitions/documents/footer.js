import { createTypedSection } from '../factory.js'

const footerDocument = {
  type: 'footer',
  sections: [
    {
      type: 'footer',
      fixedId: 'footer',
      blocks: [
        {
          type: 'footer-text',
          settings: {
            title: 'PERSPECTIVE',
            content:
              '<p><strong>Brand information title</strong></p><p>All products in this store are for demo purposes only.</p>',
            column_span: 4
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: 'Shop',
            menu: null,
            menu_items: [
              { label: 'New Arrivals', url: '#' },
              { label: 'Best Sellers', url: '#' },
              { label: 'Performance', url: '#' },
              { label: 'Pricing', url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: 'Company',
            menu: null,
            menu_items: [
              { label: 'About us', url: '#' },
              { label: 'Careers', url: '#' },
              { label: 'Press', url: '#' },
              { label: 'Sustainability', url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-menu',
          settings: {
            title: 'Customer',
            menu: null,
            menu_items: [
              { label: 'Contact us', url: '#' },
              { label: 'Returns', url: '#' },
              { label: 'Terms of Service', url: '#' },
              { label: 'Shipping policy', url: '#' }
            ],
            column_span: 2
          }
        },
        {
          type: 'footer-text',
          settings: {
            title: '订阅我们的电子邮件',
            content: '<p>请留下您的邮箱以获取最新资讯。</p>',
            column_span: 4
          }
        },
        {
          type: 'footer-image',
          settings: {
            image: '',
            link: '',
            alt: 'footer image',
            column_span: 12
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
