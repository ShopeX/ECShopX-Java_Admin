<template>
  <SpDialogPlus
    :is-show="visible"
    :value="{ title }"
    width="1100px"
    :button-cancel="{ text: $t('recommendRules.cancel') }"
    :button-confirm="{ text: $t('recommendRules.save') }"
    @close="beforeClose"
    @confirm="submit"
  >
    <template slot="body">
      <SpFormPlus
        ref="form"
        v-model="form"
        form-type="normalForm"
        label-width="100px"
        :form-items="formItems"
        :show-default-actions="false"
      />
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </template>
  </SpDialogPlus>
</template>

<script>
import SpDialogPlus from '@/components/sp-dialog-plus/main.vue'
import SpFormPlus from '@/components/sp-form-plus'
import { GoodsPicker } from '@/components/sp-picker-plus'
import SelectedGoods from './SelectedGoods'

function normalizeItem(item) {
  if (typeof item !== 'object') return { itemId: item, itemName: String(item) }
  let pics = item.pics
  if (typeof pics === 'string') {
    try {
      pics = JSON.parse(pics)
    } catch (error) {
      pics = [pics]
    }
  }
  if (!Array.isArray(pics)) pics = []
  return {
    ...item,
    itemId: item.itemId || item.item_id || item.id,
    itemName: item.itemName || item.item_name || item.name || String(item.itemId || item.id),
    image: item.image || item.pic || pics[0]
  }
}

const ProductRelationField = {
  components: { SelectedGoods },
  props: ['value'],
  computed: {
    data() {
      return this.value || { main_items: [], recommend_items: [] }
    }
  },
  methods: {
    update(key, items) {
      this.$emit('input', { ...this.data, [key]: items })
      this.$emit('dirty')
    },
    remove(key, id) {
      this.update(
        key,
        this.data[key].filter((item) => item.itemId !== id)
      )
    },
    async pick(key) {
      const result = await this.$dialog.open(GoodsPicker, {
        parent: this,
        title:
          key === 'main_items'
            ? this.$t('recommendRules.selectMainGoods')
            : this.$t('recommendRules.selectRecommendGoods'),
        props: { multiple: true, initialSelected: this.data[key] }
      })
      if (result) this.update(key, result.map(normalizeItem))
    }
  },
  template: `<div><p class="relation-tip">{{ $t('recommendRules.mainUniqueTip') }}</p><div class="goods-columns"><SelectedGoods :title="$t('recommendRules.mainItems')" :items="data.main_items" :empty-text="$t('recommendRules.noMainItems')" :add-text="$t('recommendRules.addProducts')" :item-id-label="$t('recommendRules.itemIdLabel')" :price-label="$t('recommendRules.priceLabel')" :total-label="$t('recommendRules.totalLabel')" @add="pick('main_items')" @remove="remove('main_items', $event)" /><SelectedGoods :title="$t('recommendRules.recommendItems')" :items="data.recommend_items" :empty-text="$t('recommendRules.noRecommendItems')" :add-text="$t('recommendRules.addProducts')" :item-id-label="$t('recommendRules.itemIdLabel')" :price-label="$t('recommendRules.priceLabel')" :total-label="$t('recommendRules.totalLabel')" @add="pick('recommend_items')" @remove="remove('recommend_items', $event)" /></div></div>`
}

export default {
  name: 'RuleForm',
  components: { SpDialogPlus, SpFormPlus },
  props: {
    value: { type: Boolean, default: false },
    rule: { type: Object, default: null },
    mode: { type: String, default: 'create' }
  },
  data() {
    return {
      dirty: false,
      saving: false,
      errorMessage: '',
      form: { rule_name: '', relation: { main_items: [], recommend_items: [] } }
    }
  },
  computed: {
    visible: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    title() {
      return this.mode === 'edit'
        ? this.$t('recommendRules.editRule')
        : this.mode === 'copy'
        ? this.$t('recommendRules.copyRule')
        : this.$t('recommendRules.addRule')
    },
    formItems() {
      return [
        {
          fieldName: 'rule_name',
          label: this.$t('recommendRules.ruleName'),
          component: 'input',
          formItemClass: 'rule-name-field',
          componentProps: {
            maxlength: 50,
            showWordLimit: true,
            clearable: true,
            placeholder: this.$t('recommendRules.ruleNamePlaceholder')
          },
          rules: [
            {
              required: true,
              whitespace: true,
              message: this.$t('recommendRules.ruleNameRequired'),
              trigger: 'blur'
            },
            { min: 1, max: 50, message: this.$t('recommendRules.ruleNameLength'), trigger: 'blur' }
          ]
        },
        {
          fieldName: 'relation',
          label: this.$t('recommendRules.productRelation'),
          component: ({ value, onInput }) => (
            <ProductRelationField
              value={value}
              on-input={onInput}
              on-dirty={() => {
                this.dirty = true
              }}
            />
          )
        }
      ]
    },
    relation() {
      return this.form.relation || { main_items: [], recommend_items: [] }
    }
  },
  watch: {
    value(value) {
      if (value) this.reset()
    }
  },
  methods: {
    reset() {
      const rule = this.rule || {}
      const originalMain = (rule.main_items || rule.mainItems || rule.main_item_ids || []).map(
        normalizeItem
      )
      const recommend = (
        rule.recommend_items ||
        rule.recommendItems ||
        rule.recommend_item_ids ||
        []
      ).map(normalizeItem)
      this.form = {
        rule_name:
          this.mode === 'copy'
            ? `${rule.rule_name || ''} - ${this.$t('recommendRules.copySuffix')}`
            : rule.rule_name || '',
        relation: {
          main_items: originalMain,
          recommend_items: recommend
        }
      }
      this.dirty = false
      this.errorMessage = ''
    },
    beforeClose() {
      if (!this.dirty) {
        this.visible = false
        return
      }
      this.$confirm(
        this.$t('recommendRules.discardConfirm'),
        this.$t('recommendRules.discardTitle'),
        {
          type: 'warning',
          cancelButtonText: this.$t('recommendRules.cancel'),
          confirmButtonText: this.$t('recommendRules.confirm')
        }
      )
        .then(() => {
          this.dirty = false
          this.visible = false
        })
        .catch(() => {})
    },
    async submit(done) {
      try {
        await this.$refs.form.validate()
      } catch (error) {
        done()
        return
      }
      {
        const mainIds = this.relation.main_items.map((item) => item.itemId)
        const recommendIds = this.relation.recommend_items.map((item) => item.itemId)
        if (!mainIds.length || !recommendIds.length) {
          this.errorMessage = this.$t('recommendRules.itemsRequired')
          return done()
        }
        if (mainIds.some((id) => recommendIds.includes(id))) {
          this.errorMessage = this.$t('recommendRules.itemsDuplicate')
          return done()
        }
        this.saving = true
        this.$emit(
          'submit',
          {
            rule_name: this.form.rule_name.trim(),
            main_item_ids: mainIds,
            recommend_item_ids: recommendIds
          },
          () => {
            this.saving = false
            this.dirty = false
            this.visible = false
            done()
          },
          (error) => {
            this.saving = false
            this.errorMessage = error?.msg || this.$t('recommendRules.saveRuleFailed')
            done()
          }
        )
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .rule-name-field .el-input {
  width: 480px;
  max-width: 100%;
}
::v-deep .relation-tip {
  margin: 0 0 12px;
  color: #909399;
}
::v-deep .goods-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.error-message {
  margin-top: 12px;
  color: #f56c6c;
}
@media (max-width: 1100px) {
  ::v-deep .goods-columns {
    grid-template-columns: 1fr;
  }
}
</style>
