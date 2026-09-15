<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <div
    v-loading="pageLoading"
    class="flex flex-col gap-5 bg-white border border-[#e5e7eb] rounded-lg p-8 max-md:p-5 max-md:px-4"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 whitespace-nowrap shrink-0">
        <strong class="text-[13px] font-medium text-[#1f2937]">{{ $t('ecx9887.settings.enableStrong') }}</strong>
        <el-switch
          :value="draft.enabled"
          :disabled="switchLoading || pageLoading"
          @change="onToggleEnabled"
        />
        <span class="text-[#9ca3af] text-[13px]">{{ enabledStatusText }}</span>
      </div>
    </div>

    <div class="h-px bg-[#e5e7eb]" />

    <div class="bg-[#f9fafb] border border-[#e5e7eb] rounded p-3">
      <span class="text-[#6b7280] text-[13px] leading-normal">{{ $t('ecx9887.settings.toolbarHint') }}</span>
    </div>

    <div class="flex items-center justify-between gap-3">
      <h2 class="m-0 text-[15px] font-normal text-[#1f2937]">{{ $t('ecx9887.settings.denomRulesTitle') }}</h2>
      <el-button
        type="primary"
        plain
        size="small"
        :disabled="formDisabled || saving"
        @click="addRow"
      >
        {{ $t('ecx9887.settings.addRowBtn') }}
      </el-button>
    </div>

    <SpTable
      class="[&_.el-table__row]:cursor-default"
      :data="draft.denominations"
      :columns="denomColumns"
      row-key="_key"
      :show-pager="false"
      :row-class-name="denomRowClassName"
    />

    <div class="flex items-center gap-3 justify-end pt-4 max-md:flex-wrap">
      <span v-if="isDirty" class="mr-auto text-[#f56c6c] text-[13px] max-md:w-full max-md:mr-0">{{ $t('ecx9887.settings.unsaved') }}</span>
      <el-button
        type="primary"
        size="small"
        :loading="saving"
        :disabled="!canUnifiedSave"
        @click="onUnifiedSave"
      >
        {{ $t('ecx9887.settings.unifiedSave') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import SpTable from '@/components/sp-table'
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
  components: {
    SpTable
  },
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
    },
    denomColumns() {
      const vm = this
      return [
        {
          prop: 'amount_yuan',
          label: this.$t('ecx9887.settings.amountRequired'),
          minWidth: 300,
          render: {
            functional: true,
            render(h, { props: { row } }) {
              return h('div', { class: 'w-full max-w-[120px] max-md:max-w-none' }, [
                h('el-input', {
                  props: {
                    value: row.amount_yuan,
                    disabled: vm.formDisabled,
                    placeholder: vm.$t('ecx9887.settings.amountPh')
                  },
                  on: {
                    input(val) {
                      row.amount_yuan = val
                      vm.clearRowError(row, 'amount_yuan')
                    }
                  }
                }),
                row.errors.amount_yuan
                  ? h('span', { class: 'block mt-1 text-[#f56c6c] text-xs' }, row.errors.amount_yuan)
                  : null
              ])
            }
          }
        },
        {
          prop: 'benefit_type',
          label: this.$t('ecx9887.settings.benefitType'),
          minWidth: 300,
          render: {
            functional: true,
            render(h, { props: { row } }) {
              return h('div', { class: 'w-full' }, [
                h(
                  'el-select',
                  {
                    props: {
                      value: row.benefit_type,
                      disabled: vm.formDisabled
                    },
                    class: 'w-full',
                    on: {
                      change(val) {
                        row.benefit_type = val
                        vm.onBenefitTypeChange(row)
                      }
                    }
                  },
                  [
                    h('el-option', {
                      props: { label: vm.$t('ecx9887.settings.benefitNone'), value: 'none' }
                    }),
                    h('el-option', {
                      props: { label: vm.$t('ecx9887.settings.benefitMoney'), value: 'money' }
                    }),
                    h('el-option', {
                      props: { label: vm.$t('ecx9887.settings.benefitPoint'), value: 'point' }
                    })
                  ]
                )
              ])
            }
          }
        },
        {
          prop: 'benefit_amount',
          label: this.$t('ecx9887.settings.benefitAmount'),
          minWidth: 300,
          render: {
            functional: true,
            render(h, { props: { row } }) {
              return h('div', { class: 'w-full' }, [
                row.benefit_type !== 'none'
                  ? h('el-input', {
                      props: {
                        value: row.benefit_amount,
                        disabled: vm.formDisabled,
                        placeholder: vm.$t('ecx9887.settings.benefitAmountPh')
                      },
                      on: {
                        input(val) {
                          row.benefit_amount = val
                          vm.clearRowError(row, 'benefit_amount')
                        }
                      }
                    })
                  : h('div', { style: { height: '32px' } }),
                row.errors.benefit_amount
                  ? h('span', { class: 'block mt-1 text-[#f56c6c] text-xs' }, row.errors.benefit_amount)
                  : null
              ])
            }
          }
        },
        {
          prop: 'action',
          label: this.$t('ecx9887.settings.actionCol'),
          width: 100,
          render: {
            functional: true,
            render(h, { props: { index } }) {
              return h(
                'el-link',
                {
                  props: {
                    type: 'danger',
                    underline: false,
                    disabled: vm.formDisabled
                  },
                  on: {
                    click: () => vm.removeRow(index)
                  }
                },
                vm.$t('ecx9887.settings.delete')
              )
            }
          }
        }
      ]
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
    denomRowClassName() {
      return this.formDisabled ? 'opacity-60' : ''
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
