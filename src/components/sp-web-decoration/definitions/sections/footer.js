import { i18n } from '@/i18n'

export default {
  type: 'footer',
  scope: 'footer',
  fixedId: 'footer',
  name: i18n.t('d65dbcac.4eb88f'),
  defaultSettings: {
    title: '',
    copyright: '',
    backgroundColor: '#0f172a'
  },
  defaultBlocks: [
    {
      type: 'footer-link'
    }
  ],
  blocks: {
    allowed: ['footer-link'],
    addable: true,
    sortable: true,
    removable: true
  }
}
