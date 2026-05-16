export const sectionDefaultSettings = {
  'main-carousel': {
    image_height: 'medium',
    paginate_type: 'point',
    paginate_size: 'medium',
    enable_auto_play: false,
    enable_arrow: true,
    full_width: false,
    interval: 5,
    show_text_below: false,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm'
  },
  'announcement-bar': {
    full_width: false,
    auto_rotate: false,
    enable_country_selector: false,
    color_mode: 'light',
    show_line_separator: true,
    change_slides_speed: 5,
    color_scheme: 'scheme-1',
    padding_top: 'none',
    padding_bottom: 'none',
    show_social: false,
    enable_language_selector: false
  },
  header: {
    color_mode: 'dark',
    full_width: false,
    sticky_header_type: 'none',
    padding_top: 'xs',
    menu_color_style: 'pure',
    menu_type_desktop: 'dropdown',
    show_line_separator: true,
    menu: null,
    color_scheme: 'scheme-1',
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
  footer: {
    content_alignment: 'center',
    title: '',
    copyright: '',
    newsletter_heading: '',
    color_mode: 'dark',
    margin_top: 48,
    padding_top: 'm',
    color_scheme: 'scheme-3',
    show_social: true,
    payment_enable: true,
    newsletter_enable: false,
    enable_country_selector: true,
    show_policy: true,
    padding_bottom: 'xs',
    enable_brand_information: true,
    enable_language_selector: true
  },
  'product-shelf': {
    title: '',
    sourceMode: 'manual',
    itemIds: [],
    categoryId: '',
    columns: 4,
    limit: 8,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm',
    full_width: false
  },
  'product-tab-shelf': {
    title: '',
    intro: '新品',
    size: 'medium',
    alignment: 'center',
    columns: 4,
    spacing: 'medium',
    full_width: true,
    show_price: true,
    show_add_cart: true,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm'
  },
  'image-hotspot': {
    pc_image: '',
    mobile_image: '',
    pc_hotspots: [],
    mobile_hotspots: [],
    full_width: true,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm'
  }
}

export const blockDefaultSettings = {
  announcement: {
    text: ''
  },
  header_product_list: {
    title: '',
    link: '',
    columns_desktop: 4,
    full_width: false,
    show_discount: false,
    image_ratio: 'square',
    show_secondary_image: false,
    color_mode: 'light',
    color_style: 'pure'
  },
  header_collection_product_list: {
    title: '',
    link: '',
    columns_desktop: 4,
    full_width: false,
    show_discount: false,
    image_ratio: 'adapt',
    show_secondary_image: false,
    color_mode: 'light',
    color_style: 'pure'
  },
  mega_menu: {
    mega_menu_item: '',
    alignment: 'page',
    image_position: 'right',
    image_length: 'one',
    enable_image_1_link: false,
    enable_image_2_link: false,
    enable_image_3_link: false,
    image_layout: 'outside',
    image_content_alignment: 'center',
    image_ratio: 1,
    image_shape: 'none',
    color_mode: 'light',
    color_style: 'pure'
  },
  image: {
    pc_image: '',
    mobile_image: '',
    introduction: '提供背景或介绍，吸引用户注意',
    introduction_size: 's',
    heading: '关键主题或焦点，简明直接',
    heading_size: 'm',
    description: '简要概述幻灯片内容，突出重点',
    description_size: 's',
    button_text: '按钮文字',
    button_size: 'large',
    button_style: 'primary',
    button_scheme: 'brand',
    content_alignment: 'left',
    content_layout: 'top-left',
    image_opacity: 20,
    color_mode: 'light',
    enable_card: false,
    color_style: 'pure'
  },
  video: {
    videoUrl: '',
    posterUrl: '',
    mobileVideoUrl: '',
    introduction: '<div>1231231</div>',
    introduction_size: 'l',
    heading: '关键主题或焦点，简明直接',
    heading_size: 'm',
    description: '简要概述幻灯片内容，突出重点',
    description_size: 'm',
    button_text: '按钮文字',
    button_size: 'small',
    button_style: 'primary',
    button_scheme: 'brand',
    content_alignment: 'left',
    content_layout: 'middle-left',
    image_opacity: 15,
    color_mode: 'light',
    enable_card: true,
    color_style: 'pure'
  },
  hotspot: {
    label: '',
    x: 0,
    y: 0,
    link: ''
  },
  'product-tab': {
    tab_label: '产品系列',
    product_ids: [],
    limit: 8
  },
  'footer-link': {
    label: '',
    url: '/help'
  },
  'footer-menu': {
    title: '',
    menu: null,
    size: 'small',
    alignment: 'left',
    column_span: 3
  },
  'footer-image': {
    image: '',
    alignment: 'left',
    width: '100',
    radius: 'medium',
    column_span: 4
  },
  'footer-text': {
    title: '',
    content: '',
    title_size: 'medium',
    content_size: 'small',
    alignment: 'left',
    column_span: 6
  },
  'nav-item': {
    label: '',
    url: '/'
  }
}
