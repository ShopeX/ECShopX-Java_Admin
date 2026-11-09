<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :visible="visible"
    width="720px"
    append-to-body
    :title="$t('67a8e492.c7e4a1')"
    @close="close"
  >
    <el-table :data="rows" border max-height="420" size="small">
      <el-table-column prop="item_id" :label="$t('a7e61545.858526')" width="100" />
      <el-table-column prop="item_name" :label="$t('a7e61545.1fd1d5')" min-width="200" show-overflow-tooltip />
      <el-table-column prop="item_bn" :label="$t('a7e61545.b54bd0')" width="140" show-overflow-tooltip />
    </el-table>
    <span slot="footer">
      <el-button type="primary" @click="close">{{ $t('67a8e492.5f4112') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'MemberTaskSelectedGoodsViewDialog',
  props: {
    visible: Boolean,
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    rows() {
      return (this.items || []).map((row) => ({
        item_id: row.item_id,
        item_name: row.item_name || '',
        item_bn: row.item_bn || ''
      }))
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
