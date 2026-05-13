import { i18n } from '@/i18n'

export default {
  type: 'header',
  scope: 'header',
  fixedId: 'header',
  name: i18n.t('d65dbcac.917f14'),
  defaultBlocks: [],
  blocks: {
    // allowed: ['header_product_list', 'header_collection_product_list', 'mega_menu'],
    allowed: [],
    addable: true,
    sortable: true,
    removable: true
  }
}
