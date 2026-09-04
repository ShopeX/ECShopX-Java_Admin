<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <!-- 操作区放在 SpFinder 外，接口失败时仍可见 -->
      <div class="action-container mb-3">
        <el-button type="primary" plain @click="addHandle">
          {{ $t('f178a6ca.23b46b') }}
        </el-button>
      </div>

      <el-tabs v-model="activeName" type="card" class="mb-3" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in audit_status"
          :key="item.value"
          :label="item.label"
          :name="item.value"
        />
      </el-tabs>

      <SpFinder
        ref="finder"
        url="/promotions/getturntableList"
        fixed-row-action
        row-actions-width="200px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="right"
        no-selection
        :split-count="4"
      />

      <SpDialog
        ref="pushLiveCouponDialogRef"
        v-model="lotteryDialogShow"
        :title="$t('f178a6ca.642149')"
        :modal="false"
        class="base-form"
        :form="form"
        :form-list="formList"
        :is-show-footer="false"
      />
    </SpRouterView>
  </SpPage>
</template>

<script lang="js">
import { tableSchema, statisticsFormSchema } from './schema'
import api from '@/api'
import { getExportListPathWithTab } from '@/utils'

import { audit_status as getAuditStatus, status_info_map } from './constants.js'

export default {
  data() {
    return {
      areas: [],
      activeName: 'all',
      lotteryDialogShow: false,
      form: {},
      dialogData: null,
      editRow: null
    }
  },
  computed: {
    audit_status() {
      return getAuditStatus((key, ...args) => this.$t(key, ...args))
    },
    tableSchema() {
      return tableSchema(this)
    },
    formList() {
      return statisticsFormSchema(this)
    }
  },
  watch: {
    $route() {
      this.refresh()
    }
  },
  mounted() {
    this.getAreas()
  },
  methods: {
    refresh() {
      this.$refs.finder?.refresh?.(true)
    },
    getAreas() {
      api.regionauth.getRegionauth().then((res) => {
        this.areas = res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name
        }))
      })
    },
    addHandle() {
      this.$router.push('/marketing/membermarket/wheel/editor')
    },
    editConfigHandle(row) {
      this.$router.push(`/marketing/membermarket/wheel/editor/${row.id}`)
    },
    stopHandle(row) {
      this.$confirm('确定终止该活动？终止后用户将无法继续抽奖。', '提示', {
        type: 'warning'
      })
        .then(() =>
          api.marketing.downLuckyDrawById({
            activity_id: row.id
          })
        )
        .then(() => {
          this.refresh()
          this.$message.success(this.$t('f178a6ca.dfb1d0'))
        })
        .catch((err) => {
          if (err === 'cancel' || err === 'close') return
          const msg = err?.data?.message || err?.message || this.$t('f178a6ca.5fa802')
          this.$message.error(msg)
        })
    },
    copyHandle(row) {
      this.$router.push(`/marketing/membermarket/wheel/editor?clone_id=${row.id}`)
    },
    async statisticsHandle(row) {
      this.editRow = row
      api.marketing
        .getTurntableCountById({
          activity_id: row.id
        })
        .then((res) => {
          this.dialogData = res
        })
      this.lotteryDialogShow = true
    },
    handleClick() {
      this.refresh()
    },
    exportReport() {
      api.marketing
        .exportLuckyDrawData({
          activity_id: this.editRow.id
        })
        .then(() => {
          // 与全局导出页路由一致：/data/report/export-record（不是 /companydata/...）
          this.$router.push(getExportListPathWithTab('export_luckdraw_log'))
        })
        .catch(() => {
          this.$message.error(this.$t('f178a6ca.dd51ab'))
        })
    },
    beforeSearch(params) {
      if (this.activeName === 'all') {
        delete params.status
      } else {
        params.status = status_info_map[this.activeName]
      }
      return {
        ...params
      }
    }
  }
}
</script>

<style scoped>
.base-form >>> .el-form {
  margin-right: 0px;
}
</style>
