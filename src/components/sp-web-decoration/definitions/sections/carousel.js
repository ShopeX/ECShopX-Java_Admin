import { i18n } from '@/i18n'

export default {
  type: 'main-carousel',
  scope: 'template',
  name: i18n.t('d65dbcac.0c0180'),
  defaultBlocks: [{ type: 'image' }, { type: 'image' }, { type: 'image' }],
  blocks: {
    allowed: ['image', 'video'],
    addable: true,
    sortable: true,
    removable: true
  }
}
