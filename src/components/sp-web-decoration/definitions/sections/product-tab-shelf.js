export default {
  type: 'product-tab-shelf',
  scope: 'template',
  name: 'Tab产品系列',
  defaultSettings: {
    title: '',
    intro: '新品',
    size: 'medium',
    alignment: 'center',
    columns: 4,
    spacing: 'medium',
    full_width: true,
    show_price: true,
    show_add_cart: true,
    padding_top: 'm',
    padding_bottom: 'm'
  },
  defaultBlocks: [
    { type: 'product-tab', settings: { tab_label: '产品系列', product_ids: [], limit: 8 } }
  ],
  blocks: {
    allowed: ['product-tab'],
    addable: true,
    sortable: true,
    removable: true
  }
}
