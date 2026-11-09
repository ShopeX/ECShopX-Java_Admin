<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="720px"
    append-to-body
    :close-on-click-modal="false"
    @closed="onClosed"
  >
    <div v-loading="loading" class="flex flex-col gap-4">
      <el-form label-width="100px" class="mb-0">
        <el-form-item :label="$t('0ebad5e0.902a3d')" required>
          <el-input
            v-model="form.name"
            maxlength="50"
            show-word-limit
            :placeholder="$t('0ebad5e0.c0e2a5')"
            :disabled="saving"
          />
        </el-form-item>
        <el-form-item :label="$t('0ebad5e0.c799f5')" required>
          <el-date-picker
            v-model="form.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            :range-separator="$t('0ebad5e0.981cbe')"
            :start-placeholder="$t('0ebad5e0.b44c0f')"
            :end-placeholder="$t('0ebad5e0.1d468b')"
            class="w-full"
            :picker-options="datePickerOptions"
            :disabled="saving"
          />
        </el-form-item>
      </el-form>

      <div class="flex items-center justify-between">
        <div class="text-sm font-medium text-[#212121]">{{ $t('0ebad5e0.db4c5c') }}</div>
        <el-button type="primary" size="small" :disabled="saving" @click="addTier">
          + {{ $t('0ebad5e0.45d599') }}
        </el-button>
      </div>
      <p class="m-0 text-xs text-[#999] leading-5">
        {{ $t('0ebad5e0.364a15') }}
      </p>

      <div
        v-for="(tier, index) in form.tiers"
        :key="tier._uid"
        class="bg-[#fafafa] border border-[#e6e6e6] rounded px-4 py-3"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex flex-col gap-5 min-w-0 flex-1">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="inline-flex items-center gap-1 w-[108px] shrink-0 text-sm text-[#606266] leading-[32px]">
                {{ $t('0ebad5e0.bc0bf7') }}
                <i class="text-[#f56c6c] not-italic">*</i>
              </span>
              <el-input-number
                v-model="tier.tier_count"
                :min="0"
                :precision="0"
                :disabled="saving"
              />
              <span class="text-[13px] text-black">{{ $t('0ebad5e0.7229ec') }}</span>
            </div>

            <div class="flex flex-col gap-2.5">
              <div class="flex items-center gap-2.5 flex-wrap">
                <span class="inline-flex items-center gap-1 w-[108px] shrink-0 text-sm text-[#606266] leading-[32px]">
                  {{ $t('0ebad5e0.db4c5c') }}
                  <i class="text-[#f56c6c] not-italic">*</i>
                </span>
                <el-dropdown
                  trigger="click"
                  placement="bottom-start"
                  :disabled="saving || !tierRewardOptions(tier).length"
                  @command="(cmd) => addReward(index, cmd)"
                >
                  <el-button
                    size="small"
                    :type="tierRewardOptions(tier).length ? 'primary' : ''"
                    :plain="!!tierRewardOptions(tier).length"
                    :disabled="saving || !tierRewardOptions(tier).length"
                  >
                    {{ $t('0ebad5e0.485ffd') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="opt in tierRewardOptions(tier)"
                      :key="opt.value"
                      :command="opt.value"
                    >
                      {{ opt.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <span class="text-xs text-[#808080]">{{ $t('0ebad5e0.e6dee2') }}</span>
              </div>

              <div
                v-if="tierHasPoints(tier)"
                class="flex items-center gap-2.5 pl-[118px] flex-wrap"
              >
                <span class="inline-flex items-center gap-1 text-sm text-[#606266]">
                  {{ $t('0ebad5e0.9f68a8') }}
                  <i class="text-[#f56c6c] not-italic">*</i>
                </span>
                <el-input-number
                  v-model="tier.points_reward"
                  :min="0"
                  :precision="0"
                  :disabled="saving"
                />
                <span
                  class="text-[#f56c6c] cursor-pointer text-sm font-medium"
                  @click="removePointsReward(index)"
                >
                  {{ $t('0ebad5e0.2f4aad') }}
                </span>
              </div>

              <div
                v-if="tierHasCoupon(tier)"
                class="flex items-center gap-2.5 pl-[118px] flex-wrap"
              >
                <span class="inline-flex items-center gap-1 text-sm text-[#606266]">
                  {{ $t('0ebad5e0.2f3635') }}
                  <i class="text-[#f56c6c] not-italic">*</i>
                </span>
                <button
                  type="button"
                  class="inline-flex items-center justify-between gap-2 min-w-[160px] h-10 px-3 bg-white border border-[#dcdfe6] rounded text-sm leading-[40px] text-left"
                  :class="tier.coupon_id ? 'text-[#606266]' : 'text-[#a8abb2]'"
                  :disabled="saving"
                  @click="openCouponPicker(index)"
                >
                  <span class="truncate max-w-[180px]">{{ tier._couponTitle || $t('0ebad5e0.25508b') }}</span>
                  <i class="el-icon-arrow-down text-[#c0c4cc]" />
                </button>
                <span
                  class="text-[#f56c6c] cursor-pointer text-sm font-medium"
                  @click="removeCouponReward(index)"
                >
                  {{ $t('0ebad5e0.2f4aad') }}
                </span>
              </div>
            </div>
          </div>
          <span
            class="text-[#f56c6c] cursor-pointer text-sm font-medium shrink-0 leading-[32px]"
            @click="removeTier(index)"
          >
            {{ $t('0ebad5e0.3feff6') }}
          </span>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button :disabled="saving" @click="visible = false">{{ $t('0ebad5e0.625fb2') }}</el-button>
      <el-button type="primary" :loading="saving" :disabled="loading" @click="onSubmit">
        {{ $t('0ebad5e0.38cf16') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createActivity, updateActivity, getActivityDetail } from '@/api/memberSignin'
import { unwrap, dayStartUnix, dayEndUnix, activityDayCount, apiStatus, apiErrorMessage } from '../utils'

let tierUidSeed = 0

function nextTierUid() {
  tierUidSeed += 1
  return tierUidSeed
}

function emptyTier() {
  return {
    _uid: nextTierUid(),
    tier_count: 0,
    points_reward: null,
    coupon_id: null,
    _couponTitle: '',
    _showCoupon: false
  }
}

function emptyForm() {
  return {
    id: null,
    name: '',
    dateRange: null,
    tiers: [emptyTier()],
    config_version: null
  }
}

function pad(n) {
  return n < 10 ? `0${n}` : String(n)
}

function unixToDateStr(unix) {
  const d = new Date(unix * 1000)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default {
  name: 'ActivityDialog',
  data() {
    return {
      visible: false,
      loading: false,
      saving: false,
      mode: 'create',
      form: emptyForm()
    }
  },
  computed: {
    dialogTitle() {
      return this.mode === 'edit'
        ? this.$t('0ebad5e0.d133f0')
        : this.$t('0ebad5e0.b2861e')
    },
    datePickerOptions() {
      return {
        disabledDate(time) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          // 不含今天，只能选明天及以后
          return time.getTime() <= today.getTime()
        }
      }
    }
  },
  methods: {
    openCreate() {
      this.mode = 'create'
      this.form = emptyForm()
      this.visible = true
    },
    openEdit(id) {
      return this.loadDetail(id, false)
    },
    openCopy(id) {
      return this.loadDetail(id, true)
    },
    async loadDetail(id, isCopy) {
      this.loading = true
      this.visible = true
      try {
        const res = await getActivityDetail(id)
        const data = unwrap(res)
        this.form = this.mapDetailToForm(data)
        if (isCopy) {
          this.mode = 'create'
          this.form.id = null
          this.form.config_version = null
          this.form.dateRange = null
        } else {
          this.mode = 'edit'
        }
      } catch (e) {
        this.visible = false
        this.$message.error(this.$t('0ebad5e0.4efb2a'))
      } finally {
        this.loading = false
      }
    },
    mapDetailToForm(data) {
      const tiers = (data.tiers || []).map((t) => {
        const couponTitle = t.coupon_title || (t.coupon && t.coupon.title) || ''
        const couponId = t.coupon_id != null ? t.coupon_id : null
        return {
          _uid: nextTierUid(),
          tier_count: t.tier_count != null ? Number(t.tier_count) : 1,
          points_reward: t.points_reward != null ? Number(t.points_reward) : null,
          coupon_id: couponId,
          _couponTitle:
            couponTitle ||
            (couponId != null ? `${this.$t('0ebad5e0.4186a8')}${couponId}` : ''),
          _showCoupon: couponId != null
        }
      })
      const dateRange =
        data.begin_time && data.end_time
          ? [unixToDateStr(data.begin_time), unixToDateStr(data.end_time)]
          : null
      return {
        id: data.id != null ? data.id : null,
        name: data.name || '',
        dateRange,
        tiers: tiers.length ? tiers : [emptyTier()],
        config_version: data.config_version != null ? data.config_version : null
      }
    },
    tierHasPoints(tier) {
      return tier.points_reward != null
    },
    tierHasCoupon(tier) {
      return tier._showCoupon
    },
    tierRewardOptions(tier) {
      const opts = []
      if (!this.tierHasPoints(tier)) {
        opts.push({ value: 'points', label: this.$t('0ebad5e0.9f68a8') })
      }
      if (!this.tierHasCoupon(tier)) {
        opts.push({ value: 'coupon', label: this.$t('0ebad5e0.2f3635') })
      }
      return opts
    },
    addTier() {
      this.form.tiers.push(emptyTier())
    },
    removeTier(index) {
      this.form.tiers.splice(index, 1)
    },
    addReward(index, type) {
      const tier = this.form.tiers[index]
      if (type === 'points') {
        tier.points_reward = tier.points_reward != null ? tier.points_reward : 0
      } else if (type === 'coupon') {
        tier._showCoupon = true
      }
    },
    removePointsReward(index) {
      const tier = this.form.tiers[index]
      tier.points_reward = null
    },
    removeCouponReward(index) {
      const tier = this.form.tiers[index]
      tier.coupon_id = null
      tier._couponTitle = ''
      tier._showCoupon = false
    },
    async openCouponPicker(tierIndex) {
      const tier = this.form.tiers[tierIndex]
      try {
        const { data } = await this.$picker.couponV2({
          multiple: false,
          data: tier.coupon_id != null ? [tier.coupon_id] : [],
          params: {
            date_status: 2,
            store_self: false
          }
        })
        if (!data || !data.length) return
        const coupon = data[0]
        tier.coupon_id = coupon.card_id != null ? coupon.card_id : coupon.id
        tier._couponTitle =
          coupon.title ||
          coupon.card_name ||
          `${this.$t('0ebad5e0.4186a8')}${tier.coupon_id}`
        tier._showCoupon = true
      } catch (e) {
        // 用户取消弹框时 picker 会 reject，忽略即可
      }
    },
    validate() {
      const name = (this.form.name || '').trim()
      if (!name) {
        this.$message.warning(this.$t('0ebad5e0.c0e2a5'))
        return false
      }
      if (name.length > 50) {
        this.$message.warning(this.$t('0ebad5e0.fc120f'))
        return false
      }
      if (!this.form.dateRange || this.form.dateRange.length !== 2 || !this.form.dateRange[0] || !this.form.dateRange[1]) {
        this.$message.warning(this.$t('0ebad5e0.d8e0d0'))
        return false
      }
      if (!this.form.tiers.length) {
        this.$message.warning(this.$t('0ebad5e0.6ec354'))
        return false
      }

      const beginTime = dayStartUnix(this.form.dateRange[0])
      const endTime = dayEndUnix(this.form.dateRange[1])
      const maxDays = activityDayCount(beginTime, endTime)
      const seenCounts = new Set()

      for (let i = 0; i < this.form.tiers.length; i++) {
        const tier = this.form.tiers[i]
        const count = Number(tier.tier_count)
        if (!Number.isFinite(count) || count < 1) {
          this.$message.warning(this.$t('0ebad5e0.09f6e9'))
          return false
        }
        if (seenCounts.has(count)) {
          this.$message.warning(this.$t('0ebad5e0.33e3eb'))
          return false
        }
        seenCounts.add(count)
        if (count > maxDays) {
          this.$message.warning(this.$t('0ebad5e0.d3188b'))
          return false
        }
        const hasPoints = tier.points_reward != null
        const hasCoupon = tier.coupon_id != null
        if (!hasPoints && !hasCoupon) {
          this.$message.warning(this.$t('0ebad5e0.b26885'))
          return false
        }
      }
      return true
    },
    buildPayload() {
      const [start, end] = this.form.dateRange
      const payload = {
        name: this.form.name.trim(),
        begin_time: dayStartUnix(start),
        end_time: dayEndUnix(end),
        tiers: this.form.tiers.map((t) => ({
          tier_count: Number(t.tier_count),
          points_reward: t.points_reward != null ? Number(t.points_reward) : null,
          coupon_id: t.coupon_id != null ? t.coupon_id : null
        }))
      }
      if (this.mode === 'edit') {
        payload.config_version = this.form.config_version
      }
      return payload
    },
    async onSubmit() {
      if (!this.validate()) return
      this.saving = true
      const payload = this.buildPayload()
      try {
        if (this.mode === 'edit') {
          await updateActivity(this.form.id, payload)
        } else {
          await createActivity(payload)
        }
        this.$message.success(this.$t('0ebad5e0.3b1083'))
        this.visible = false
        this.$emit('success')
      } catch (e) {
        const status = apiStatus(e)
        if (status === 409 && this.mode === 'edit') {
          this.$message.error(this.$t('0ebad5e0.0a1986'))
          this.visible = false
          this.$emit('success')
          return
        }
        this.$message.error(apiErrorMessage(e, this.$t('0ebad5e0.6de920')))
      } finally {
        this.saving = false
      }
    },
    onClosed() {
      this.form = emptyForm()
      this.mode = 'create'
      this.loading = false
      this.saving = false
    }
  }
}
</script>
