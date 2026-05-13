import { i18n } from '@/i18n'

export default {
  type: 'announcement-bar',
  scope: 'header',
  name: i18n.t('d65dbcac.3921b6'),
  defaultBlocks: [
    {
      type: 'announcement'
    }
  ],
  blocks: {
    allowed: ['announcement'],
    addable: true,
    sortable: true,
    removable: true
  }
}
