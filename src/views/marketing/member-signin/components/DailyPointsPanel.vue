<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="loading" class="flex flex-col gap-4 bg-white border border-[#e6e6e6] rounded-lg p-5 h-full">
    <div>
      <h3 class="m-0 text-base font-medium text-[#212121]">签到设置</h3>
      <p class="mt-2 mb-0 text-xs text-[#999] leading-5">
        分别设置周一到周日的签到积分，设置为 0 时不赠送，也不在用户端显示。
      </p>
    </div>
    <div class="grid grid-cols-2 gap-x-6 gap-y-3 max-md:grid-cols-1">
      <div v-for="item in weekFields" :key="item.key" class="flex items-center gap-2">
        <span class="w-10 shrink-0 text-sm text-[#606266]">{{ item.label }}</span>
        <el-input-number
          v-model="points[item.key]"
          :min="0"
          :precision="0"
          :disabled="saving"
        />
        <span class="text-sm text-[#606266]">积分</span>
      </div>
    </div>
    <div>
      <div class="mb-2 text-sm font-medium text-[#212121]">签到规则说明</div>
      <div class="min-h-[180px] rounded">
        <SpRichText v-model="ruleHtml" :disabled="saving" />
      </div>
    </div>
    <div class="flex justify-center pt-2">
      <el-button
        type="primary"
        :loading="saving"
        :disabled="loading || loadError || !loaded"
        @click="onSave"
      >
        保存设置
      </el-button>
    </div>
  </div>
</template>

<script>
import { getDailyPoints, saveDailyPoints } from '@/api/memberSignin'
import { unwrap, apiErrorMessage } from '../utils'

const WEEK_KEYS = [
  'points_mon',
  'points_tue',
  'points_wed',
  'points_thu',
  'points_fri',
  'points_sat',
  'points_sun'
]

const WEEK_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

function emptyPoints() {
  return WEEK_KEYS.reduce((acc, key) => {
    acc[key] = 0
    return acc
  }, {})
}

function normalizePoints(payload) {
  const base = emptyPoints()
  if (!payload || typeof payload !== 'object') return base
  WEEK_KEYS.forEach((key) => {
    const val = payload[key]
    if (val != null && Number.isFinite(Number(val))) {
      base[key] = Math.max(0, Math.floor(Number(val)))
    }
  })
  return base
}

export default {
  name: 'DailyPointsPanel',
  data() {
    return {
      loading: false,
      saving: false,
      loaded: false,
      loadError: false,
      points: emptyPoints(),
      ruleHtml: ''
    }
  },
  computed: {
    weekFields() {
      return WEEK_KEYS.map((key, index) => ({
        key,
        label: WEEK_LABELS[index]
      }))
    }
  },
  mounted() {
    this.loadDailyPoints()
  },
  methods: {
    applyPoints(payload) {
      this.points = normalizePoints(payload)
    },
    buildSavePayload() {
      const payload = {}
      WEEK_KEYS.forEach((key) => {
        const val = this.points[key]
        payload[key] = val != null && Number.isFinite(Number(val))
          ? Math.max(0, Math.floor(Number(val)))
          : 0
      })
      return payload
    },
    async loadDailyPoints() {
      this.loading = true
      this.loadError = false
      try {
        const res = await getDailyPoints()
        this.applyPoints(unwrap(res))
        this.loaded = true
        this.loadError = false
      } catch (e) {
        this.loadError = true
        this.loaded = false
        this.$message.error(apiErrorMessage(e, '加载失败'))
      } finally {
        this.loading = false
      }
    },
    async onSave() {
      this.saving = true
      try {
        const res = await saveDailyPoints(this.buildSavePayload())
        this.applyPoints(unwrap(res))
        this.$message.success('保存成功')
      } catch (e) {
        this.$message.error(apiErrorMessage(e, '保存失败'))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
