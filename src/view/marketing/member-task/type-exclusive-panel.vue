<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="w-full max-w-[550px] rounded border border-[#ebeef6] bg-[#f6f7fa] p-5">
    <div class="flex flex-col gap-5">
      <template v-if="needPurchaseRule">
        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="w-2 shrink-0 text-center text-[#f56c6c]">*</span>
            <span>{{ $t('67a8e492.3258c5') }}</span>
          </div>
          <div :class="controlClass">
            <el-radio-group
              :value="form.goods_scope"
              :disabled="disabled"
              @input="(v) => setField('goods_scope', v)"
            >
              <el-radio v-for="opt in goodsScopeOptions" :key="opt.value" :label="opt.value">
                {{ opt.label }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <div v-if="showGoodsItems" class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="w-2 shrink-0 text-center text-[#f56c6c]">*</span>
            <span>{{ $t('67a8e492.43d1e2') }}</span>
          </div>
          <div :class="controlClass">
            <PickerListField
              :value="form.goods_items"
              :disabled="disabled"
              :empty-text="$t('67a8e492.1c652d')"
              :pick-text="$t('67a8e492.43d1e2')"
              :unit="$t('67a8e492.9897d8')"
              @input="(v) => setField('goods_items', v)"
              @pick="$emit('pick-goods')"
            />
          </div>
        </div>

        <div v-if="showGoodsCategory" class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="w-2 shrink-0 text-center text-[#f56c6c]">*</span>
            <span>{{ $t('67a8e492.302aab') }}</span>
          </div>
          <div :class="controlClass">
            <PickerSingleField
              :value="form.goods_category"
              :disabled="disabled"
              :empty-text="$t('67a8e492.05bfa7')"
              :pick-text="$t('67a8e492.5fcb1e')"
              :unit="$t('67a8e492.d0771a')"
              @input="(v) => setField('goods_category', v)"
              @pick="$emit('pick-category')"
            />
            <div class="mt-1 text-[12px] leading-5 text-[#909399]">
              {{ $t('67a8e492.cf823a') }}
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="invisible w-2 shrink-0">*</span>
            <span>{{ $t('67a8e492.986ed7') }}</span>
          </div>
          <div :class="controlClass">
            <PickerListField
              :value="form.stores"
              :disabled="disabled"
              :empty-text="$t('67a8e492.a9b31e')"
              :pick-text="$t('67a8e492.afa2e6')"
              :unit="$t('67a8e492.295713')"
              @input="(v) => setField('stores', v)"
              @pick="$emit('pick-stores')"
            />
          </div>
        </div>
      </template>

      <div v-if="showTaskJumpPage" class="flex items-start gap-3">
        <div :class="labelClass">
          <span class="invisible w-2 shrink-0">*</span>
          <span>{{ $t('67a8e492.13d0bf') }}</span>
        </div>
        <div :class="controlClass">
          <el-input
            :value="form.jump_page"
            clearable
            :disabled="disabled"
            placeholder="/pages/xxx"
            @input="(v) => setField('jump_page', v)"
          />
        </div>
      </div>

      <template v-if="needPurchaseRule">
        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="invisible w-2 shrink-0">*</span>
            <span>{{ $t('67a8e492.581d6b') }}</span>
          </div>
          <div :class="controlClass">
            <el-input-number
              :value="form.amount_yuan"
              :min="0"
              :precision="2"
              :step="1"
              :disabled="disabled"
              @input="(v) => setField('amount_yuan', v)"
            />
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="invisible w-2 shrink-0">*</span>
            <span>{{ $t('67a8e492.77d09f') }}</span>
          </div>
          <div :class="controlClass">
            <div class="flex h-8 items-center">
              <el-switch
                :value="form.need_receipt"
                :disabled="disabled"
                @input="(v) => setField('need_receipt', v)"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-if="needShareCard">
        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="w-2 shrink-0 text-center text-[#f56c6c]">*</span>
            <span>{{ $t('67a8e492.f81b3e') }}</span>
          </div>
          <div :class="controlClass">
            <SpImagePicker
              :value="form.share_cover"
              :disabled="disabled"
              @input="(v) => setField('share_cover', v)"
            />
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="w-2 shrink-0 text-center text-[#f56c6c]">*</span>
            <span>{{ $t('67a8e492.c3adb3') }}</span>
          </div>
          <div :class="controlClass">
            <el-input
              :value="form.share_title"
              clearable
              maxlength="60"
              show-word-limit
              :disabled="disabled"
              :placeholder="$t('67a8e492.633833')"
              @input="(v) => setField('share_title', v)"
            />
          </div>
        </div>

        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="w-2 shrink-0 text-center text-[#f56c6c]">*</span>
            <span>{{ $t('67a8e492.f35af8') }}</span>
          </div>
          <div :class="controlClass">
            <el-input
              :value="form.share_jump_page"
              clearable
              :disabled="disabled"
              placeholder="/pages/xxx"
              @input="(v) => setField('share_jump_page', v)"
            />
          </div>
        </div>
      </template>

      <template v-if="needBrowseRule">
        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="w-2 shrink-0 text-center text-[#f56c6c]">*</span>
            <span>{{ $t('67a8e492.3324c9') }}</span>
          </div>
          <div :class="controlClass">
            <el-input
              :value="form.browse_page"
              clearable
              :disabled="disabled"
              placeholder="/pages/xxx"
              @input="(v) => setField('browse_page', v)"
            />
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="invisible w-2 shrink-0">*</span>
            <span>{{ $t('67a8e492.5278b1') }}</span>
          </div>
          <div :class="controlClass">
            <el-input-number
              :value="form.browse_stay_seconds"
              :min="0"
              :precision="0"
              :step="1"
              :disabled="disabled"
              @input="(v) => setField('browse_stay_seconds', v)"
            />
          </div>
        </div>
      </template>

      <template v-if="needFavoriteRule">
        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="invisible w-2 shrink-0">*</span>
            <span>{{ $t('67a8e492.a4ca1e') }}</span>
          </div>
          <div :class="controlClass">
            <PickerListField
              :value="form.favorite_items"
              :disabled="disabled"
              :empty-text="$t('67a8e492.1c652d')"
              :pick-text="$t('67a8e492.43d1e2')"
              :unit="$t('67a8e492.9897d8')"
              @input="(v) => setField('favorite_items', v)"
              @pick="$emit('pick-favorite-goods')"
            />
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div :class="labelClass">
            <span class="invisible w-2 shrink-0">*</span>
            <span>{{ $t('67a8e492.1aea21') }}</span>
          </div>
          <div :class="controlClass">
            <PickerListField
              :value="form.favorite_stores"
              :disabled="disabled"
              :empty-text="$t('67a8e492.562297')"
              :pick-text="$t('67a8e492.afa2e6')"
              :unit="$t('67a8e492.295713')"
              @input="(v) => setField('favorite_stores', v)"
              @pick="$emit('pick-favorite-stores')"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import PickerListField from './picker-list-field.vue'
import PickerSingleField from './picker-single-field.vue'

// 与 Figma _form_label 一致：左对齐（勿 justify-end，短标签会整体右偏显「没对齐」）
// 132px：容纳「设置任务跳转页面」+ 必填星号占位
const LABEL_CLASS =
  'box-border flex h-8 w-[132px] shrink-0 items-center gap-1 whitespace-nowrap text-[14px] leading-[22px] text-[#606266]'
const CONTROL_CLASS = 'min-w-0 flex-1'

export default {
  name: 'TypeExclusivePanel',
  components: { PickerListField, PickerSingleField },
  props: {
    form: {
      type: Object,
      required: true
    },
    disabled: Boolean,
    needPurchaseRule: Boolean,
    needShareCard: Boolean,
    needBrowseRule: Boolean,
    needFavoriteRule: Boolean,
    needJumpPage: Boolean,
    goodsScopeOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labelClass: LABEL_CLASS,
      controlClass: CONTROL_CLASS
    }
  },
  computed: {
    showGoodsItems() {
      return this.needPurchaseRule && this.form.goods_scope === 'items'
    },
    showGoodsCategory() {
      return this.needPurchaseRule && this.form.goods_scope === 'category'
    },
    showTaskJumpPage() {
      return this.needJumpPage
    }
  },
  methods: {
    setField(key, value) {
      this.$emit('set-field', key, value)
    }
  }
}
</script>
