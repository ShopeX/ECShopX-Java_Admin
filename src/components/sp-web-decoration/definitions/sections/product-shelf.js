import { i18n } from '@/i18n'

export default {
  type: 'product-shelf',
  scope: 'template',
  name: i18n.t('d65dbcac.4a02ad'),
  defaultSettings: {
    title: '',
    sourceMode: 'manual',
    itemIds: [],
    categoryId: '',
    columns: 4,
    limit: 8
  },
  defaultBlocks: [],
  blocks: {
    allowed: [],
    addable: false,
    sortable: false,
    removable: false
  }
}
