import { i18n } from '@/i18n'

export default {
  type: 'header',
  scope: 'header',
  fixedId: 'header',
  name: i18n.t('d65dbcac.917f14'),
  defaultSettings: {
    color_mode: 'dark',
    sticky_header_type: 'none',
    padding_top: 'xs',
    menu_color_style: 'pure',
    menu_type_desktop: 'dropdown',
    show_line_separator: true,
    menu: 'main-menu',
    color_style: 'pure',
    layout: 'middle',
    margin_bottom: 0,
    enable_country_selector: true,
    mobile_logo_position: 'center',
    menu_color_mode: 'dark',
    logo_position: 'center',
    enable_customer_avatar: true,
    padding_bottom: 'xs',
    menu_color_scheme: 'scheme-1',
    enable_language_selector: true
  },
  defaultBlocks: [],
  blocks: {
    allowed: ['header_product_list', 'header_collection_product_list', 'mega_menu'],
    addable: true,
    sortable: true,
    removable: true
  }
}
