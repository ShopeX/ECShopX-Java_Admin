<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="picker-link">
    <SpFinder
      ref="finder"
      :show-pager="false"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': '580px'
      }"
      :data="list"
      :fixed-row-action="true"
      :setting="finderSetting"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from '@/components/sp-picker/pickers/base'
import PageMixin from '@/components/sp-picker/mixins/page'

/** 会员任务「页面」页签仅这三项，对齐路径弹层红框 */
const PAGE_ITEMS = [
  { id: 'recharge', titleKey: '223cc8af.1200d5' },
  { id: 'memberSign', titleKey: '6bfcaec0.8e34d0' },
  { id: 'registActivity', titleKey: '223cc8af.7fb92b' }
]

export default {
  name: 'MemberTaskPathPageList',
  extends: BasePicker,
  mixins: [PageMixin],
  props: ['value'],
  data() {
    return {
      multiple: false
    }
  },
  computed: {
    list() {
      const locale = this.$i18n && this.$i18n.locale
      void locale
      return PAGE_ITEMS.map((item) => ({
        id: item.id,
        title: this.$t(item.titleKey)
      }))
    },
    finderSetting() {
      return {
        columns: [
          { name: 'ID', key: 'id', width: 160 },
          { name: this.$t('223cc8af.b78454'), key: 'title' }
        ]
      }
    }
  },
  mounted() {
    const raw = this.value && this.value.data
    if (raw == null || raw === '') return
    const selectedIds = Array.isArray(raw) ? raw : [raw]
    const selectRows = this.list.filter((item) => selectedIds.map(String).includes(String(item.id)))
    if (!selectRows.length) return
    const finderTable = this.$refs.finder && this.$refs.finder.$refs && this.$refs.finder.$refs.finderTable
    if (!finderTable || !finderTable.$refs || !finderTable.$refs.finderTable) return
    setTimeout(() => {
      finderTable.$refs.finderTable.setSelection(selectRows)
    })
  },
  methods: {
    onSelect(selection, row) {
      const finderTable = this.$refs.finder.$refs.finderTable
      finderTable.clearSelection()
      setTimeout(() => {
        finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
      })
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
