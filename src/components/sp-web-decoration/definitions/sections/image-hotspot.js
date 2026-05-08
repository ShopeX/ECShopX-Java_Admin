import { i18n } from '@/i18n'

export default {
  type: 'image-hotspot',
  scope: 'template',
  name: i18n.t('d65dbcac.081a81'),
  defaultSettings: {
    title: '',
    imageUrl: ''
  },
  defaultBlocks: [],
  blocks: {
    allowed: ['hotspot'],
    addable: true,
    sortable: true,
    removable: true
  }
}
