<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div v-loading="pageLoading" class="ecx9887-deposit__section">
    <div class="ecx9887-deposit__section-head">
      <div>
        <h1>{{ $t('ecx9887.settings.sectionTitle') }}</h1>
        <p>{{ $t('ecx9887.settings.sectionDesc') }}</p>
      </div>
      <div class="ecx9887-deposit__switch-box">
        <el-switch
          :value="draft.enabled"
          :disabled="switchLoading || pageLoading"
          active-color="#8d4df4"
          inactive-color="#dfe1e8"
          @change="onToggleEnabled"
        />
        <strong>{{ $t('ecx9887.settings.enableStrong') }}</strong>
        <span class="ecx9887-deposit__switch-state">{{ enabledStatusText }}</span>
      </div>
    </div>

    <div class="ecx9887-deposit__toolbar">
      <span class="ecx9887-deposit__hint">{{ $t('ecx9887.settings.toolbarHint') }}</span>
    </div>

    <div class="ecx9887-deposit__denom-list-head">
      <h2>{{ $t('ecx9887.settings.denomRulesTitle') }}</h2>
      <button
        type="button"
        class="ecx9887-deposit__btn is-primary"
        :disabled="formDisabled || saving"
        @click="addRow"
      >
        {{ $t('ecx9887.settings.addRowBtn') }}
      </button>
    </div>

    <div class="ecx9887-deposit__denom-table">
      <div v-if="draft.denominations.length" class="ecx9887-deposit__denom-head">
        <div>{{ $t('ecx9887.settings.amountRequired') }}</div>
        <div>{{ $t('ecx9887.settings.benefitType') }}</div>
        <div>{{ $t('ecx9887.settings.benefitAmount') }}</div>
        <div>{{ $t('ecx9887.settings.actionCol') }}</div>
      </div>

      <div
        v-if="!draft.denominations.length"
        class="ecx9887-deposit__empty"
      >
        <strong>{{ $t('ecx9887.settings.emptyTitle') }}</strong>
        <span>{{ $t('ecx9887.settings.emptyHint') }}</span>
      </div>

      <div
        v-for="(row, index) in draft.denominations"
        :key="row._key"
        class="ecx9887-deposit__denom-row"
        :class="{ 'is-disabled': formDisabled }"
      >
        <div class="ecx9887-deposit__cell">
          <label>{{ $t('ecx9887.settings.amount') }}</label>
          <el-input
            v-model="row.amount_yuan"
            :disabled="formDisabled"
            :placeholder="$t('ecx9887.settings.amountPh')"
            @input="clearRowError(row, 'amount_yuan')"
          />
          <span v-if="row.errors.amount_yuan" class="ecx9887-deposit__error">
            {{ row.errors.amount_yuan }}
          </span>
        </div>

        <div class="ecx9887-deposit__cell">
          <label>{{ $t('ecx9887.settings.benefitType') }}</label>
          <el-select
            v-model="row.benefit_type"
            :disabled="formDisabled"
            class="w-full"
            @change="onBenefitTypeChange(row)"
          >
            <el-option :label="$t('ecx9887.settings.benefitNone')" value="none" />
            <el-option :label="$t('ecx9887.settings.benefitMoney')" value="money" />
            <el-option :label="$t('ecx9887.settings.benefitPoint')" value="point" />
          </el-select>
        </div>

        <div class="ecx9887-deposit__cell">
          <label>{{ $t('ecx9887.settings.benefitAmount') }}</label>
          <el-input
            v-if="row.benefit_type !== 'none'"
            v-model="row.benefit_amount"
            :disabled="formDisabled"
            :placeholder="$t('ecx9887.settings.benefitAmountPh')"
            @input="clearRowError(row, 'benefit_amount')"
          />
          <div v-else style="height: 38px" />
          <span v-if="row.errors.benefit_amount" class="ecx9887-deposit__error">
            {{ row.errors.benefit_amount }}
          </span>
        </div>

        <div>
          <button
            type="button"
            class="ecx9887-deposit__row-action"
            :disabled="formDisabled"
            @click="removeRow(index)"
          >
            {{ $t('ecx9887.settings.delete') }}
          </button>
        </div>
      </div>
    </div>

    <div class="ecx9887-deposit__save-bar">
      <span v-if="isDirty" class="ecx9887-deposit__dirty">{{ $t('ecx9887.settings.unsaved') }}</span>
      <button
        type="button"
        class="ecx9887-deposit__btn is-primary"
        :disabled="!canUnifiedSave"
        @click="onUnifiedSave"
      >
        {{ saving ? '...' : $t('ecx9887.settings.unifiedSave') }}
      </button>
    </div>
  </div>
</template>

<script>
import { getDepositSettings, saveDepositSettings } from '@/api/deposit'

let rowKeySeed = 1

function nextRowKey() {
  rowKeySeed += 1
  return `row-${rowKeySeed}`
}

function emptyRow(partial = {}) {
  return {
    _key: nextRowKey(),
    id: partial.id ?? null,
    amount_yuan: partial.amount_yuan ?? '',
    benefit_type: partial.benefit_type ?? 'none',
    benefit_amount: partial.benefit_amount ?? '',
    errors: {}
  }
}

function normalizeRowFromApi(item) {
  const benefitType = item.benefit_type || 'none'
  return emptyRow({
    id: item.id ?? null,
    amount_yuan: item.amount_yuan != null ? String(item.amount_yuan) : '',
    benefit_type: benefitType,
    benefit_amount:
      benefitType === 'none'
        ? ''
        : item.benefit_amount != null
          ? String(item.benefit_amount)
          : ''
  })
}

function snapshotDenominations(rows) {
  return JSON.stringify(
    rows.map((r) => ({
      id: r.id,
      amount_yuan: r.amount_yuan,
      benefit_type: r.benefit_type,
      benefit_amount: r.benefit_type === 'none' ? '' : r.benefit_amount
    }))
  )
}

function parseAmountYuan(text) {
  const trimmed = String(text ?? '').trim()
  if (!trimmed) return { ok: false }
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return { ok: false }
  const num = Number(trimmed)
  if (!Number.isFinite(num) || num <= 0 || num > 1000) return { ok: false }
  return { ok: true, value: trimmed }
}

function parseBenefitAmount(text) {
  const trimmed = String(text ?? '').trim()
  if (!/^[1-9]\d*$/.test(trimmed)) return { ok: false }
  return { ok: true, value: trimmed }
}

export default {
  name: 'MemberDepositSettings',
  data() {
    return {
      pageLoading: false,
      saving: false,
      switchLoading: false,
      saved: {
        enabled: true,
        denominations: []
      },
      draft: {
        enabled: true,
        denominations: []
      }
    }
  },
  computed: {
    formDisabled() {
      return !this.draft.enabled
    },
    enabledStatusText() {
      return this.draft.enabled
        ? this.$t('ecx9887.settings.enabledOn')
        : this.$t('ecx9887.settings.enabledOff')
    },
    isDirty() {
      return snapshotDenominations(this.draft.denominations) !== snapshotDenominations(this.saved.denominations)
    },
    canUnifiedSave() {
      return this.draft.enabled && this.isDirty && !this.saving && !this.pageLoading
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    unwrapPayload(res) {
      return res?.data?.data != null ? res.data.data : res?.data ?? res
    },
    applySettings(payload) {
      const enabled = payload?.enabled !== false
      const list = Array.isArray(payload?.denominations) ? payload.denominations : []
      const denominations = list.map(normalizeRowFromApi)
      this.saved = { enabled, denominations: JSON.parse(JSON.stringify(denominations)) }
      this.draft = {
        enabled,
        denominations: JSON.parse(JSON.stringify(denominations))
      }
    },
    async loadSettings() {
      this.pageLoading = true
      try {
        const res = await getDepositSettings()
        this.applySettings(this.unwrapPayload(res))
      } catch (e) {
        this.applySettings({ enabled: true, denominations: [] })
      } finally {
        this.pageLoading = false
      }
    },
    async onToggleEnabled(nextEnabled) {
      if (nextEnabled === this.draft.enabled) return
      const prevEnabled = this.draft.enabled
      if (!nextEnabled) {
        try {
          await this.$confirm(
            this.$t('ecx9887.settings.closeConfirm'),
            this.$t('ecx9887.settings.enableLabel'),
            {
              confirmButtonText: this.$t('ecx9887.settings.confirmContinue'),
              cancelButtonText: this.$t('ecx9887.settings.cancelClose'),
              type: 'warning'
            }
          )
        } catch {
          return
        }
        this.switchLoading = true
        try {
          await saveDepositSettings({ enabled: false })
          await this.loadSettings()
          this.$message.success(this.$t('ecx9887.settings.closeTip'))
        } catch (e) {
          this.draft.enabled = prevEnabled
          this.$message.error(this.$t('ecx9887.settings.saveFail'))
        } finally {
          this.switchLoading = false
        }
        return
      }
      this.switchLoading = true
      try {
        await saveDepositSettings({ enabled: true })
        await this.loadSettings()
        this.$message.success(this.$t('ecx9887.settings.openTip'))
      } catch (e) {
        this.draft.enabled = prevEnabled
        this.$message.error(this.$t('ecx9887.settings.saveFail'))
      } finally {
        this.switchLoading = false
      }
    },
    addRow() {
      this.draft.denominations.push(emptyRow())
    },
    removeRow(index) {
      if (this.draft.denominations.length <= 1) {
        this.$message.warning(this.$t('ecx9887.settings.err.minOne'))
        return
      }
      this.draft.denominations.splice(index, 1)
    },
    onBenefitTypeChange(row) {
      if (row.benefit_type === 'none') {
        row.benefit_amount = ''
      }
      this.clearRowError(row, 'benefit_amount')
    },
    clearRowError(row, field) {
      if (row.errors && row.errors[field]) {
        this.$set(row.errors, field, '')
      }
    },
    validateDraft() {
      let valid = true
      const amountSeen = new Map()
      this.draft.denominations.forEach((row) => {
        row.errors = {}
        const amountResult = parseAmountYuan(row.amount_yuan)
        if (!amountResult.ok) {
          row.errors.amount_yuan = this.$t('ecx9887.settings.err.amount')
          valid = false
        } else {
          const dupKey = Number(amountResult.value).toFixed(2)
          if (amountSeen.has(dupKey)) {
            row.errors.amount_yuan = this.$t('ecx9887.settings.err.duplicate')
            valid = false
          } else {
            amountSeen.set(dupKey, true)
          }
        }
        if (row.benefit_type !== 'none') {
          const benefitResult = parseBenefitAmount(row.benefit_amount)
          if (!benefitResult.ok) {
            row.errors.benefit_amount = this.$t('ecx9887.settings.err.benefit')
            valid = false
          }
        }
      })
      if (!this.draft.denominations.length) {
        this.$message.error(this.$t('ecx9887.settings.err.empty'))
        valid = false
      }
      return valid
    },
    buildSavePayload() {
      return {
        enabled: true,
        denominations: this.draft.denominations.map((row) => {
          const item = {
            amount_yuan: String(row.amount_yuan).trim(),
            benefit_type: row.benefit_type
          }
          if (row.id) {
            item.id = row.id
          }
          if (row.benefit_type !== 'none') {
            item.benefit_amount = String(row.benefit_amount).trim()
          }
          return item
        })
      }
    },
    async onUnifiedSave() {
      if (!this.validateDraft()) return
      this.saving = true
      try {
        const res = await saveDepositSettings(this.buildSavePayload())
        this.applySettings(this.unwrapPayload(res))
        this.$message.success(this.$t('ecx9887.settings.saveSuccess'))
        this.$emit('saved')
      } catch (e) {
        this.$message.error(this.$t('ecx9887.settings.saveFail'))
      } finally {
        this.saving = false
      }
    },
    hasUnsavedChanges() {
      return this.isDirty
    },
    revertToSaved() {
      this.draft = JSON.parse(JSON.stringify(this.saved))
    }
  }
}
</script>
