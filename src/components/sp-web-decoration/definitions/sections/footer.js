import { i18n } from '@/i18n'

export default {
  type: 'footer',
  scope: 'footer',
  fixedId: 'footer',
  name: i18n.t('d65dbcac.4eb88f'),
  defaultBlocks: [
    {
      type: 'footer-menu'
    }
  ],
  blocks: {
    allowed: ['footer-menu', 'footer-image', 'footer-text'],
    addable: true,
    sortable: true,
    removable: true
  }
}
