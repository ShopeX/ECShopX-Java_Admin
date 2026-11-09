<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :visible="visible"
    width="560px"
    append-to-body
    :title="$t('67a8e492.c7e4a2')"
    @close="close"
  >
    <el-table :data="rows" border max-height="420" size="small">
      <el-table-column prop="distributor_id" :label="$t('a7e61545.858526')" width="100" />
      <el-table-column
        prop="distributor_name"
        :label="$t('a523b3a5.0d4934')"
        min-width="200"
        show-overflow-tooltip
      />
    </el-table>
    <span slot="footer">
      <el-button type="primary" @click="close">{{ $t('67a8e492.5f4112') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'MemberTaskSelectedStoresViewDialog',
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
        distributor_id: row.distributor_id,
        distributor_name: row.distributor_name || ''
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
