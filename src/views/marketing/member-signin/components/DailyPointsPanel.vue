<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="loading" class="flex flex-col gap-4 bg-white border border-[#e6e6e6] rounded-lg p-5 h-full">
    <div>
      <h3 class="m-0 text-base font-medium text-[#212121]">{{ $t('a170bbe8.df9514') }}</h3>
      <p class="mt-2 mb-0 text-xs text-[#999] leading-5">
        {{ $t('a170bbe8.d855d7') }}
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
        <span class="text-sm text-[#606266]">{{ $t('a170bbe8.9f68a8') }}</span>
      </div>
    </div>
    <div>
      <div class="mb-2 text-sm font-medium text-[#212121]">{{ $t('a170bbe8.11d416') }}</div>
      <div class="min-h-[180px] rounded">
        <SpRichText v-model="rule_desc" :disabled="saving" />
      </div>
    </div>
    <div class="flex justify-center pt-2">
      <el-button
        type="primary"
        :loading="saving"
        :disabled="loading || loadError || !loaded"
        @click="onSave"
      >
        {{ $t('a170bbe8.4323be') }}
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

const WEEK_LABEL_KEYS = [
  'a170bbe8.1603b0',
  'a170bbe8.b5a6a0',
  'a170bbe8.e60725',
  'a170bbe8.170fc8',
  'a170bbe8.eb79ce',
  'a170bbe8.245751',
  'a170bbe8.562d74'
]

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

function normalizeRuleDesc(payload) {
  if (!payload || typeof payload !== 'object') return ''
  const val = payload.rule_desc
  return val != null ? String(val) : ''
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
      rule_desc: ''
    }
  },
  computed: {
    weekFields() {
      return WEEK_KEYS.map((key, index) => ({
        key,
        label: this.$t(WEEK_LABEL_KEYS[index])
      }))
    }
  },
  mounted() {
    this.loadDailyPoints()
  },
  methods: {
    applyDailyPoints(payload) {
      this.points = normalizePoints(payload)
      this.rule_desc = normalizeRuleDesc(payload)
    },
    buildSavePayload() {
      const payload = {
        rule_desc: this.rule_desc || ''
      }
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
        this.applyDailyPoints(unwrap(res))
        this.loaded = true
        this.loadError = false
      } catch (e) {
        this.loadError = true
        this.loaded = false
        this.$message.error(apiErrorMessage(e, this.$t('a170bbe8.866b79')))
      } finally {
        this.loading = false
      }
    },
    async onSave() {
      this.saving = true
      try {
        const res = await saveDailyPoints(this.buildSavePayload())
        this.applyDailyPoints(unwrap(res))
        this.$message.success(this.$t('a170bbe8.3b1083'))
      } catch (e) {
        this.$message.error(apiErrorMessage(e, this.$t('a170bbe8.6de920')))
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
