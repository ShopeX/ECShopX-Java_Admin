<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="m-0 text-lg font-medium text-gray-800">{{ pageTitle }}</h2>
    </div>

    <el-alert
      v-if="readonly"
      class="!mb-6"
      type="info"
      :closable="false"
      show-icon
      :title="$t('67a8e492.7a8e2e')"
    />

    <div v-loading="pageLoading" class="min-h-[200px]">
      <SpFormPlus
        ref="formRef"
        v-model="form"
        form-type="normalForm"
        label-width="140px"
        :form-items="formItems"
        :show-default-actions="false"
      />
    </div>

    <div class="mt-6 flex justify-center gap-3 border-t border-gray-200 pt-5">
      <el-button @click="onCancel">{{ readonly ? $t('67a8e492.5f4112') : $t('67a8e492.625fb2') }}</el-button>
      <el-button
        v-if="!readonly"
        type="primary"
        :loading="saving"
        :disabled="!detailLoaded"
        @click="onSave"
      >{{ $t('67a8e492.be5fbb') }}</el-button>
    </div>
  </SpPage>
</template>

<script>
import {
  AUDIENCE_COMBINE_OPTIONS,
  AUDIENCE_MODE_OPTIONS,
  BROWSE_RULE_DETAILS,
  FAVORITE_RULE_DETAILS,
  FREQUENCY_PERIOD_OPTIONS,
  FREQUENCY_RESET_TIPS,
  FREQUENCY_TYPE_OPTIONS,
  GOODS_SCOPE_OPTIONS,
  PURCHASE_RULE_DETAILS,
  TYPE_CASCADER_OPTIONS,
  findTypeCategory,
  getTypeExclusiveFlags
} from './constants'
import PickerListField from './picker-list-field.vue'
import PickerSingleField from './picker-single-field.vue'
import TypeExclusivePanel from './type-exclusive-panel.vue'
import { memberTaskPathValidateKey } from './path-value'

const TYPE_CATEGORY_I18N = {
  newcomer: '67a8e492.09eec2',
  purchase: '67a8e492.bdc336',
  share: '67a8e492.0124a9',
  behavior: '67a8e492.90dff0'
}

const TYPE_DETAIL_I18N = {
  first_order: '67a8e492.8ae1fe',
  profile: '67a8e492.818feb',
  single_spend: '67a8e492.e4001a',
  total_spend: '67a8e492.5ea0f4',
  share_order: '67a8e492.717f36',
  invite_register: '67a8e492.131dc2',
  sign_in: '67a8e492.c9da9b',
  browse: '67a8e492.8920f2',
  favorite: '67a8e492.ae336c'
}

const GOODS_SCOPE_I18N = {
  unlimited: '67a8e492.d4dc06',
  items: '67a8e492.289811',
  category: '67a8e492.2533b7'
}

const FREQUENCY_TYPE_I18N = {
  once: '67a8e492.68490b',
  cycle: '67a8e492.b7a078'
}

const FREQUENCY_PERIOD_I18N = {
  daily: '67a8e492.ce2210',
  weekly: '67a8e492.09b03b',
  monthly: '67a8e492.aa3d57'
}

const FREQUENCY_RESET_TIME_I18N = {
  daily: '67a8e492.856d21',
  weekly: '67a8e492.8af23c',
  monthly: '67a8e492.4b4463'
}

const AUDIENCE_MODE_I18N = {
  unlimited: '67a8e492.ef8c99',
  visible: '67a8e492.ceabf7',
  hidden: '67a8e492.e5b43f'
}

const AUDIENCE_COMBINE_I18N = {
  intersection: '67a8e492.c05ad5',
  union: '67a8e492.2b57f4'
}

/** SpFormPlus 托管字段（会被替换成内部 formData） */
function createEmptyForm() {
  return {
    name: '',
    timeRange: [],
    type_cascader: [],
    frequency_type: 'once',
    frequency_period: 'daily',
    audience_mode: 'unlimited',
    audience_tags: [],
    audience_tag_combine: 'union',
    reward_points: '',
    reward_coupon: null,
    task_rule: ''
  }
}

/**
 * 类型专属设置：独立响应式对象，勿并入 SpFormPlus v-model。
 * SpFormPlus 会用内部 formData 覆盖外层 form，后挂字段在 Vue2 下非响应式，导致 radio 无法切换。
 */
function createEmptyRuleForm() {
  return {
    goods_scope: 'unlimited',
    goods_items: [],
    goods_category: null,
    stores: [],
    amount_yuan: 0,
    need_receipt: false,
    share_cover: '',
    share_title: '',
    share_jump_page: '',
    browse_page: '',
    browse_stay_seconds: 0,
    favorite_items: [],
    favorite_stores: [],
    jump_page: ''
  }
}

function toIntOrNull(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null
  const num = Number(value)
  return Number.isNaN(num) ? null : num
}

export default {
  name: 'MemberTaskEditor',
  data() {
    return {
      pageLoading: false,
      saving: false,
      taskId: null,
      configVersion: null,
      detailStatus: null,
      detailLoaded: false,
      form: createEmptyForm(),
      ruleForm: createEmptyRuleForm()
    }
  },
  computed: {
    isEdit() {
      return !!this.taskId
    },
    readonly() {
      // 详情接口返回的 display_status 最准；加载前先用列表带过来的值兜底
      const status = this.detailStatus || this.$route.query.display_status
      if (!status) return false
      return status !== 'draft'
    },
    fieldDisabled() {
      return this.readonly || this.saving
    },
    pageTitle() {
      if (this.$route.query.clone_id) return this.$t('67a8e492.92afcf')
      if (this.readonly) return this.$t('67a8e492.13f931')
      if (this.isEdit) return this.$t('67a8e492.8e1a91')
      return this.$t('67a8e492.482d9d')
    },
    typeCascaderOptions() {
      return TYPE_CASCADER_OPTIONS.map((cat) => ({
        ...cat,
        label: this.$t(TYPE_CATEGORY_I18N[cat.value] || cat.label),
        children: (cat.children || []).map((child) => ({
          ...child,
          label: this.$t(TYPE_DETAIL_I18N[child.value] || child.label)
        }))
      }))
    },
    goodsScopeOptions() {
      return this.mapFlatOptions(GOODS_SCOPE_OPTIONS, GOODS_SCOPE_I18N)
    },
    frequencyTypeOptions() {
      return this.mapFlatOptions(FREQUENCY_TYPE_OPTIONS, FREQUENCY_TYPE_I18N)
    },
    frequencyPeriodOptions() {
      return this.mapFlatOptions(FREQUENCY_PERIOD_OPTIONS, FREQUENCY_PERIOD_I18N)
    },
    audienceModeOptions() {
      return this.mapFlatOptions(AUDIENCE_MODE_OPTIONS, AUDIENCE_MODE_I18N)
    },
    audienceCombineOptions() {
      return this.mapFlatOptions(AUDIENCE_COMBINE_OPTIONS, AUDIENCE_COMBINE_I18N)
    },
    typeCategory() {
      const path = this.form.type_cascader
      return Array.isArray(path) && path.length >= 2 ? path[0] : ''
    },
    typeDetail() {
      const path = this.form.type_cascader
      return Array.isArray(path) && path.length >= 2 ? path[1] : ''
    },
    typeExclusiveFlags() {
      return getTypeExclusiveFlags(this.typeDetail)
    },
    needPurchaseRule() {
      return this.typeExclusiveFlags.needPurchaseRule
    },
    needShareCard() {
      return this.typeExclusiveFlags.needShareCard
    },
    needBrowseRule() {
      return this.typeExclusiveFlags.needBrowseRule
    },
    needFavoriteRule() {
      return this.typeExclusiveFlags.needFavoriteRule
    },
    needJumpPage() {
      return this.typeExclusiveFlags.needJumpPage
    },
    hasTypeExclusive() {
      return this.typeExclusiveFlags.hasTypeExclusive
    },
    frequencyResetTip() {
      const period = this.form.frequency_period
      const timeKey = FREQUENCY_RESET_TIME_I18N[period]
      if (!timeKey || !FREQUENCY_RESET_TIPS[period]) return ''
      return this.$t('67a8e492.384aa8', { time: this.$t(timeKey) })
    },
    formItems() {
      const vm = this
      const t = vm.$t.bind(vm)
      const items = []

      // ---------- 基础信息 ----------
      items.push(
        {
          fieldName: 'name',
          label: t('67a8e492.78caf7'),
          component: 'input',
          formItemClass: 'w-full max-w-xl',
          componentProps: {
            clearable: true,
            maxlength: 100,
            showWordLimit: true,
            disabled: this.fieldDisabled,
            placeholder: t('67a8e492.64615c')
          },
          rules: [{ required: true, whitespace: true, message: t('67a8e492.64615c'), trigger: 'blur' }]
        },
        {
          fieldName: 'timeRange',
          label: t('67a8e492.b341f9'),
          component: 'datetimepicker',
          formItemClass: 'w-full max-w-xl',
          tip: t('67a8e492.677a18'),
          componentProps: {
            type: 'datetimerange',
            disabled: this.fieldDisabled
          },
          rules: [
            {
              required: true,
              validator: (_rule, value, callback) => {
                if (!Array.isArray(value) || value.length !== 2 || !value[0] || !value[1]) {
                  callback(new Error(t('67a8e492.de56fc')))
                  return
                }
                callback()
              },
              trigger: 'change'
            }
          ]
        },
        {
          fieldName: 'type_cascader',
          label: t('67a8e492.bb763c'),
          component: 'cascader',
          formItemClass: 'w-full max-w-xl',
          componentProps: {
            disabled: this.isEdit || this.fieldDisabled,
            clearable: !this.isEdit,
            placeholder: t('67a8e492.217528'),
            options: this.typeCascaderOptions,
            props: {
              expandTrigger: 'hover',
              emitPath: true
            }
          },
          rules: [
            {
              required: true,
              validator: (_rule, value, callback) => {
                if (!Array.isArray(value) || value.length < 2) {
                  callback(new Error(t('67a8e492.217528')))
                  return
                }
                callback()
              },
              trigger: 'change'
            }
          ]
        }
      )

      // ---------- 类型专属设置（嵌套浅灰面板，对齐 Figma） ----------
      if (this.hasTypeExclusive) {
        items.push({
          fieldName: '__type_exclusive',
          label: '',
          formItemClass: 'w-full',
          component: ({ h }) =>
            h(TypeExclusivePanel, {
              props: {
                form: vm.ruleForm,
                disabled: vm.fieldDisabled,
                needPurchaseRule: vm.needPurchaseRule,
                needShareCard: vm.needShareCard,
                needBrowseRule: vm.needBrowseRule,
                needFavoriteRule: vm.needFavoriteRule,
                needJumpPage: vm.needJumpPage,
                goodsScopeOptions: vm.goodsScopeOptions
              },
              on: {
                'set-field': (key, value) => vm.setExclusiveField(key, value),
                'pick-goods': () => vm.pickGoods(),
                'pick-category': () => vm.pickCategory(),
                'pick-stores': () => vm.pickStores(),
                'pick-favorite-goods': () => vm.pickFavoriteGoods(),
                'pick-favorite-stores': () => vm.pickStores('favorite_stores')
              }
            }),
          rules: [
            {
              validator: (_rule, _value, callback) => {
                const err = vm.validateTypeExclusive()
                if (err) {
                  callback(new Error(err))
                  return
                }
                callback()
              },
              trigger: 'change'
            }
          ]
        })
      }

      // ---------- 完成频次 ----------
      items.push({
        fieldName: 'frequency_type',
        label: t('67a8e492.d92d64'),
        component: 'radio',
        formItemClass: 'w-full',
        componentProps: {
          disabled: this.fieldDisabled,
          options: this.frequencyTypeOptions
        },
        rules: [{ required: true, message: t('67a8e492.2af176'), trigger: 'change' }]
      })

      if (this.form.frequency_type === 'cycle') {
        items.push({
          fieldName: 'frequency_period',
          label: t('67a8e492.a12389'),
          component: 'radio',
          formItemClass: 'w-full',
          tip: this.frequencyResetTip,
          componentProps: {
            disabled: this.fieldDisabled,
            options: this.frequencyPeriodOptions
          },
          rules: [{ required: true, message: t('67a8e492.acb9d6'), trigger: 'change' }]
        })
      }

      // ---------- 人群设置 ----------
      // audience_tags / combine 始终注册进 formItems，保证 SpFormPlus formData 初始即响应式；
      // 用 isShow 控制显隐（勿按 mode 动态 push，否则字段后挂上会丢响应式，选完不刷新）
      // 读取 audience_mode / audience_tags，让切换模式、选完标签后 formItems 重算（「已选 n 个」立刻更新）
      const audienceMode = this.form.audience_mode
      const audienceTags = Array.isArray(this.form.audience_tags) ? this.form.audience_tags : []
      items.push(
        {
          fieldName: 'audience_mode',
          label: t('67a8e492.1b8a59'),
          component: 'radio',
          formItemClass: 'w-full',
          componentProps: {
            disabled: this.fieldDisabled,
            options: this.audienceModeOptions
          },
          rules: [{ required: true, message: t('67a8e492.813982'), trigger: 'change' }]
        },
        {
          fieldName: 'audience_tags',
          label: t('67a8e492.d2a769'),
          isShow: () => audienceMode !== 'unlimited',
          component: ({ value, onInput, props, h }) =>
            h(PickerListField, {
              key: `audience-tags-${audienceTags.length}-${audienceMode}`,
              props: {
                value: audienceTags.length ? audienceTags : value || [],
                disabled: props.disabled,
                emptyText: t('67a8e492.5d736e'),
                pickText: t('67a8e492.d2a769'),
                unit: t('67a8e492.14d342')
              },
              on: {
                input: (v) => {
                  onInput(v)
                  vm.setFormField('audience_tags', v)
                },
                pick: () => vm.pickCrowds(onInput)
              }
            }),
          formItemClass: 'w-full',
          componentProps: { disabled: this.fieldDisabled },
          rules: [
            {
              required: true,
              validator: (_rule, value, callback) => {
                if (vm.form.audience_mode === 'unlimited') return callback()
                if (!Array.isArray(value) || !value.length) {
                  callback(new Error(t('67a8e492.804a0f')))
                  return
                }
                callback()
              },
              trigger: 'change'
            }
          ]
        },
        {
          fieldName: 'audience_tag_combine',
          label: t('67a8e492.ff16be'),
          isShow: () => audienceMode !== 'unlimited',
          component: 'radio',
          formItemClass: 'w-full',
          componentProps: {
            disabled: this.fieldDisabled,
            options: this.audienceCombineOptions
          },
          rules: [{ required: true, message: t('67a8e492.cc0034'), trigger: 'change' }]
        }
      )

      // ---------- 完成奖励 ----------
      items.push(
        {
          fieldName: 'reward_points',
          label: t('67a8e492.d7e49f'),
          component: 'input',
          formItemClass: 'w-full max-w-xl',
          tip: t('67a8e492.4dfb80'),
          componentProps: {
            clearable: true,
            disabled: this.fieldDisabled,
            placeholder: t('67a8e492.190729')
          },
          rules: [
            {
              validator: (_rule, value, callback) => {
                if (value === '' || value === null || value === undefined) return callback()
                if (!/^[1-9]\d*$/.test(String(value).trim())) {
                  callback(new Error(t('67a8e492.e0917a')))
                  return
                }
                callback()
              },
              trigger: 'blur'
            }
          ]
        },
        {
          fieldName: 'reward_coupon',
          label: t('67a8e492.9322ca'),
          component: ({ value, onInput, props, h }) =>
            h(PickerSingleField, {
              props: {
                value,
                disabled: props.disabled,
                emptyText: t('67a8e492.ddea92'),
                pickText: t('67a8e492.45bcee'),
                unit: t('67a8e492.f2b421')
              },
              on: { input: onInput, pick: () => vm.pickCoupon() }
            }),
          formItemClass: 'w-full',
          tip: t('67a8e492.1c975d'),
          componentProps: { disabled: this.fieldDisabled }
        }
      )

      // ---------- 任务规则 ----------
      items.push({
        fieldName: 'task_rule',
        label: t('67a8e492.b09129'),
        component: 'textarea',
        formItemClass: 'w-full max-w-xl',
        componentProps: {
          rows: 4,
          maxlength: 500,
          showWordLimit: true,
          disabled: this.fieldDisabled,
          placeholder: t('67a8e492.cc2d6c')
        },
        rules: [{ required: true, whitespace: true, message: t('67a8e492.e8f5de'), trigger: 'blur' }]
      })

      return items
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    mapFlatOptions(options, keyMap) {
      return options.map((option) => ({
        ...option,
        label: keyMap[option.value] ? this.$t(keyMap[option.value]) : option.label
      }))
    },
    async initPage() {
      const routeId = this.$route.params.id
      const cloneId = this.$route.query.clone_id
      if (routeId) {
        this.taskId = routeId
        this.configVersion = toIntOrNull(this.$route.query.config_version) || null
        await this.loadDetail(routeId, { keepIdentity: true })
        return
      }
      if (cloneId) {
        await this.loadDetail(cloneId, { keepIdentity: false })
        return
      }
      // 新建：无需拉详情
      this.detailLoaded = true
    },
    async loadDetail(id, { keepIdentity }) {
      this.pageLoading = true
      try {
        const data = await this.$api.memberTask.getMemberTaskDetail(id)
        this.applyDetail(data || {}, { keepIdentity })
        this.detailLoaded = true
        await this.hydrateTagNames()
      } catch (err) {
        const msg =
          (err && err.data && err.data.message) ||
          (err && err.message) ||
          this.$t('67a8e492.8f07bd')
        this.$message.error(msg)
      } finally {
        this.pageLoading = false
      }
    },
    /** 详情只回传 audience_tag_ids，用标签组接口补齐 tag_name / group_id（弹框回显依赖 group_id） */
    async hydrateTagNames() {
      const tags = this.form.audience_tags
      if (!tags.length) return
      const needHydrate = tags.some((tag) => !tag.tag_name || tag.group_id == null)
      if (!needHydrate) return
      try {
        const { list = [] } = await this.$api.member.getTagGroupList({
          page: 1,
          page_size: 200,
          country_code: 'zh-CN'
        })
        const metaMap = {}
        ;(list || []).forEach((group) => {
          let groupTags = group.tags || []
          if (typeof groupTags === 'string') {
            try {
              groupTags = JSON.parse(groupTags)
            } catch (e) {
              groupTags = []
            }
          }
          ;(Array.isArray(groupTags) ? groupTags : []).forEach((tag) => {
            metaMap[String(tag.tag_id)] = {
              tag_name: tag.tag_name,
              group_id: group.group_id,
              tag_color: tag.tag_color,
              font_color: tag.font_color
            }
          })
        })
        this.setFormField(
          'audience_tags',
          tags.map((tag) => {
            const id = tag.tag_id != null ? tag.tag_id : tag.id
            const meta = metaMap[String(id)] || {}
            const groupId =
              tag.group_id != null && tag.group_id !== ''
                ? tag.group_id
                : meta.group_id
            return {
              ...tag,
              tag_id: id,
              tag_name: tag.tag_name || meta.tag_name || '',
              group_id: groupId != null && groupId !== '' ? String(groupId) : groupId,
              tag_color: tag.tag_color || meta.tag_color,
              font_color: tag.font_color || meta.font_color
            }
          })
        )
      } catch (e) {
        /* 标签名解析失败时降级展示 #id */
      }
    },
    /** 经 SpFormPlus handleFieldChange 写入，避免直接赋值丢响应式 */
    setFormField(key, value) {
      const formRef = this.$refs.formRef
      if (formRef && typeof formRef.handleFieldChange === 'function') {
        formRef.handleFieldChange(key, value)
      }
      // form 与 formData 偶发不同引用时，两边都写，保证列表立刻回显
      if (this.form && this.form[key] !== value) {
        this.$set(this.form, key, value)
      }
    },
    toArray(value) {
      return Array.isArray(value) ? value : []
    },
    /** 详情里同一字段可能是对象数组，也可能只有 id 数组 */
    toKeyedList(list, ids, key) {
      if (Array.isArray(list) && list.length) return list
      if (Array.isArray(ids) && ids.length) {
        return ids.map((id) => ({ [key]: id }))
      }
      return []
    },
    toCategory(rule, categoryIds) {
      const list = this.toArray(rule.categories || rule.category_list)
      if (list.length) return list[0]
      if (Array.isArray(categoryIds) && categoryIds.length) return { id: categoryIds[0] }
      return null
    },
    applyDetail(data, { keepIdentity }) {
      if (keepIdentity) {
        this.taskId = data.task_id || this.taskId
        this.configVersion = data.config_version || this.configVersion || 1
        this.detailStatus = data.display_status || this.detailStatus
      } else {
        this.taskId = null
        this.configVersion = null
        this.detailStatus = null
      }

      const typeCategory = data.type_category || findTypeCategory(data.type_detail)
      const typeDetail = data.type_detail || ''
      const rule = data.rule_config || {}
      const reward = data.reward_config || {}

      // 复制任务：活动时间需手动重新填写（PRD 1.1）
      let timeRange = []
      if (keepIdentity && data.begin_time && data.end_time) {
        timeRange = [this.toDateMs(data.begin_time), this.toDateMs(data.end_time)]
      }

      this.form = {
        ...createEmptyForm(),
        name: data.name || '',
        timeRange,
        type_cascader: typeCategory && typeDetail ? [typeCategory, typeDetail] : [],
        frequency_type: data.frequency_type || 'once',
        frequency_period: data.frequency_period || 'daily',
        audience_mode: data.audience_mode || 'unlimited',
        audience_tags: (Array.isArray(data.audience_tag_ids) ? data.audience_tag_ids : []).map(
          (tagId) => (typeof tagId === 'object' ? tagId : { tag_id: tagId })
        ),
        audience_tag_combine: data.audience_tag_combine || 'union',
        task_rule: data.task_rule || '',
        reward_points: reward.points != null && reward.points !== '' ? reward.points : '',
        reward_coupon:
          reward.coupon_id != null && reward.coupon_id !== ''
            ? { card_id: reward.coupon_id, title: reward.coupon_title || '' }
            : null
      }

      this.ruleForm = {
        ...createEmptyRuleForm(),
        goods_scope: rule.goods_scope || 'unlimited',
        goods_items: PURCHASE_RULE_DETAILS.includes(typeDetail)
          ? this.toKeyedList(rule.items || rule.item_list, rule.item_ids, 'item_id')
          : [],
        goods_category: PURCHASE_RULE_DETAILS.includes(typeDetail)
          ? this.toCategory(rule, rule.category_ids)
          : null,
        stores: PURCHASE_RULE_DETAILS.includes(typeDetail)
          ? this.toKeyedList(
              rule.stores || rule.distributor_list,
              rule.distributor_ids,
              'distributor_id'
            )
          : [],
        amount_yuan:
          rule.amount_fen != null && rule.amount_fen !== '' ? Number(rule.amount_fen) / 100 : 0,
        need_receipt: !!rule.need_receipt,
        share_cover: rule.share_cover || '',
        share_title: rule.share_title || '',
        share_jump_page: rule.share_jump_page || '',
        browse_page: BROWSE_RULE_DETAILS.includes(typeDetail)
          ? rule.page || rule.browse_page || ''
          : '',
        browse_stay_seconds:
          rule.stay_seconds != null && rule.stay_seconds !== '' ? Number(rule.stay_seconds) : 0,
        favorite_items: FAVORITE_RULE_DETAILS.includes(typeDetail)
          ? this.toKeyedList(
              rule.favorite_items || rule.items,
              rule.item_ids || rule.favorite_item_ids,
              'item_id'
            )
          : [],
        favorite_stores: FAVORITE_RULE_DETAILS.includes(typeDetail)
          ? this.toKeyedList(
              rule.favorite_stores || rule.distributors,
              rule.distributor_ids || rule.favorite_distributor_ids,
              'distributor_id'
            )
          : [],
        jump_page: data.jump_page || ''
      }
    },
    toDateMs(value) {
      const num = Number(value)
      if (Number.isNaN(num)) return value
      return num < 1e12 ? num * 1000 : num
    },
    toUnixSeconds(value) {
      if (value === null || value === undefined || value === '') return undefined
      if (typeof value === 'object' && typeof value.getTime === 'function') {
        return Math.floor(value.getTime() / 1000)
      }
      const num = Number(value)
      if (Number.isNaN(num)) return undefined
      return num > 1e12 ? Math.floor(num / 1000) : Math.floor(num)
    },
    buildRewardConfig() {
      const config = {}
      const points = Number(this.form.reward_points)
      if (this.form.reward_points !== '' && !Number.isNaN(points) && points > 0) {
        config.points = points
      }
      const coupon = this.form.reward_coupon
      const couponId = coupon ? Number(coupon.card_id || coupon.id) : NaN
      if (!Number.isNaN(couponId) && couponId > 0) {
        config.coupon_id = couponId
      }
      return config
    },
    buildRuleConfig() {
      const rule = this.ruleForm
      const config = {}
      if (this.needPurchaseRule) {
        config.goods_scope = rule.goods_scope || 'unlimited'
        config.need_receipt = !!rule.need_receipt
        if (config.goods_scope === 'items') {
          config.item_ids = rule.goods_items.map((item) => Number(item.item_id || item.id))
        }
        if (config.goods_scope === 'category' && rule.goods_category) {
          config.category_ids = [Number(rule.goods_category.id)]
        }
        if (rule.stores.length) {
          config.distributor_ids = rule.stores.map((item) =>
            Number(item.distributor_id || item.id)
          )
        }
        const yuan = Number(rule.amount_yuan)
        config.amount_fen =
          rule.amount_yuan === '' ||
          rule.amount_yuan === null ||
          rule.amount_yuan === undefined ||
          Number.isNaN(yuan)
            ? 0
            : Math.round(yuan * 100)
      }
      if (this.needShareCard) {
        config.share_cover = rule.share_cover || ''
        config.share_title = (rule.share_title || '').trim()
        config.share_jump_page = (rule.share_jump_page || '').trim()
      }
      if (this.needBrowseRule) {
        config.page = (rule.browse_page || '').trim()
        config.stay_seconds = toIntOrNull(rule.browse_stay_seconds) || 0
      }
      if (this.needFavoriteRule) {
        // 与购买类共用字段名；两端皆空表示任意收藏均算完成
        if (rule.favorite_items.length) {
          config.item_ids = rule.favorite_items.map((item) => Number(item.item_id || item.id))
        }
        if (rule.favorite_stores.length) {
          config.distributor_ids = rule.favorite_stores.map((item) =>
            Number(item.distributor_id || item.id)
          )
        }
      }
      return config
    },
    buildPayload() {
      const [type_category, type_detail] = this.form.type_cascader || []
      const payload = {
        name: (this.form.name || '').trim(),
        begin_time: this.toUnixSeconds(this.form.timeRange[0]),
        end_time: this.toUnixSeconds(this.form.timeRange[1]),
        type_category,
        type_detail,
        frequency_type: this.form.frequency_type,
        audience_mode: this.form.audience_mode,
        task_rule: (this.form.task_rule || '').trim(),
        reward_config: this.buildRewardConfig(),
        rule_config: this.buildRuleConfig()
      }

      if (this.form.frequency_type === 'cycle') {
        payload.frequency_period = this.form.frequency_period
      }

      if (this.form.audience_mode !== 'unlimited') {
        payload.audience_tag_ids = this.form.audience_tags
          .map((tag) => Number(tag.tag_id != null ? tag.tag_id : tag.id))
          .filter((id) => !Number.isNaN(id) && id > 0)
        payload.audience_tag_combine = this.form.audience_tag_combine || 'union'
      }

      payload.jump_page = (this.ruleForm.jump_page || '').trim() || null

      if (this.isEdit) {
        payload.config_version = this.configVersion || 1
      }

      return payload
    },
    validateTime() {
      const range = this.form.timeRange
      const start = this.toUnixSeconds(range && range[0])
      const end = this.toUnixSeconds(range && range[1])
      if (!start || !end) {
        this.$message.warning(this.$t('67a8e492.de56fc'))
        return false
      }
      if (end <= start) {
        this.$message.warning(this.$t('67a8e492.89ee92'))
        return false
      }
      if (end <= Math.floor(Date.now() / 1000)) {
        this.$message.warning(this.$t('67a8e492.784b6c'))
        return false
      }
      return true
    },
    validateReward() {
      const reward = this.buildRewardConfig()
      if (!reward.points && !reward.coupon_id) {
        this.$message.warning(this.$t('67a8e492.8d1d74'))
        return false
      }
      return true
    },
    validateTypeExclusive() {
      const t = this.$t.bind(this)
      const rule = this.ruleForm
      if (this.needPurchaseRule) {
        if (!rule.goods_scope) return t('67a8e492.33cf7f')
        if (rule.goods_scope === 'items' && !rule.goods_items.length) {
          return t('67a8e492.c5c5f2')
        }
        if (rule.goods_scope === 'category' && !rule.goods_category) {
          return t('67a8e492.e4e928')
        }
      }
      if (this.needShareCard) {
        if (!rule.share_cover) return t('67a8e492.a911f5')
        if (!(rule.share_title || '').trim()) return t('67a8e492.633833')
        if (!(rule.share_jump_page || '').trim()) return t('67a8e492.24e938')
        const sharePathKey = memberTaskPathValidateKey(rule.share_jump_page)
        if (sharePathKey) return t(sharePathKey)
      }
      if (this.needBrowseRule) {
        if (!(rule.browse_page || '').trim()) return t('67a8e492.2ff70d')
        const browsePathKey = memberTaskPathValidateKey(rule.browse_page)
        if (browsePathKey) return t(browsePathKey)
      }
      if (this.needJumpPage && (rule.jump_page || '').trim()) {
        const jumpPathKey = memberTaskPathValidateKey(rule.jump_page)
        if (jumpPathKey) return t(jumpPathKey)
      }
      return ''
    },
    setExclusiveField(key, value) {
      this.$set(this.ruleForm, key, value)
    },
    // ---------- 选择器 ----------
    async pickGoods(target = 'goods_items') {
      try {
        const selected = this.ruleForm[target] || []
        const { data } = await this.$picker.goods({
          multiple: true,
          data: selected.map((item) => item.item_id || item.id)
        })
        if (data) {
          this.$set(
            this.ruleForm,
            target,
            data.map((item) => ({
              ...item,
              item_id: item.item_id || item.id,
              item_name: item.item_name || item.name
            }))
          )
        }
      } catch (e) {
        /* 选择器取消（$picker 取消时 promise 不会 settle） */
      }
    },
    pickFavoriteGoods() {
      return this.pickGoods('favorite_items')
    },
    async pickCategory() {
      try {
        const current = this.ruleForm.goods_category
        const res = await this.$picker.category({
          multiple: false,
          data: current ? current.id : undefined
        })
        const list = (res && res.data) || []
        const category = list[0]
        if (category) {
          this.$set(this.ruleForm, 'goods_category', {
            ...category,
            id: category.id || category.category_id
          })
        }
      } catch (e) {
        /* 取消 */
      }
    },
    async pickStores(target = 'stores') {
      try {
        const selected = this.ruleForm[target] || []
        // picker-store 按对象的 distributor_id 回显，不能只传 id 数组
        const { data } = await this.$picker.store({
          multiple: true,
          data: selected.map((item) => ({
            ...item,
            distributor_id: item.distributor_id || item.id,
            distributor_name: item.distributor_name || item.name
          }))
        })
        if (data) {
          this.$set(
            this.ruleForm,
            target,
            data.map((item) => ({
              ...item,
              distributor_id: item.distributor_id || item.id,
              distributor_name: item.distributor_name || item.name
            }))
          )
        }
      } catch (e) {
        /* 取消 */
      }
    },
    async pickCrowds(onInput) {
      try {
        // 传完整标签对象（含 group_id），弹框才能按组回显已选
        const { data } = await this.$picker.crowds({
          multiple: true,
          data: (this.form.audience_tags || []).map((item) => ({
            ...item,
            tag_id: item.tag_id != null ? item.tag_id : item.id,
            tag_name: item.tag_name || item.name,
            group_id: item.group_id
          }))
        })
        if (data) {
          const next = data.map((item) => ({
            ...item,
            tag_id: item.tag_id || item.id,
            tag_name: item.tag_name || item.name,
            group_id: item.group_id != null ? String(item.group_id) : item.group_id
          }))
          // 与优惠券选择一致：走 setFormField，确保 SpFormPlus / 外层 form 同步刷新
          this.setFormField('audience_tags', next)
          if (typeof onInput === 'function') {
            onInput(next)
          }
        }
      } catch (e) {
        /* 取消 */
      }
    },
    async pickCoupon() {
      try {
        const current = this.form.reward_coupon
        const { data } = await this.$picker.couponV2({
          multiple: false,
          data: current ? [current.card_id || current.id] : [],
          params: { date_status: 2 }
        })
        const coupon = data && data[0]
        if (coupon) {
          this.setFormField('reward_coupon', {
            ...coupon,
            card_id: coupon.card_id || coupon.id,
            title: coupon.title || coupon.card_name
          })
        }
      } catch (e) {
        /* 取消 */
      }
    },
    // ---------- 提交 ----------
    /** 通知 SpRouterView 保活的列表刷新（新建 resetPage=true 回第 1 页） */
    notifyListRefresh(resetPage = false) {
      let parent = this.$parent
      while (parent) {
        if (typeof parent.onActivated === 'function') {
          parent.onActivated(resetPage)
          return
        }
        parent = parent.$parent
      }
    },
    goBackToList({ refresh = false, resetPage = false } = {}) {
      if (refresh) this.notifyListRefresh(resetPage)
      const path = (this.$route.path || '').replace(/\/editor(?:\/[^/]+)?\/?$/, '')
      this.$router.push({ path: path || '/marketing/interactive/member-tasks' })
    },
    onCancel() {
      this.goBackToList()
    },
    async onSave() {
      if (this.readonly) return
      if (!this.detailLoaded) {
        this.$message.warning(this.$t('67a8e492.4f97fa'))
        return
      }
      try {
        await this.$refs.formRef.validate()
      } catch (e) {
        return
      }
      if (!this.validateTime()) return
      if (!this.validateReward()) return

      const payload = this.buildPayload()
      this.saving = true
      try {
        if (this.isEdit) {
          await this.$api.memberTask.updateMemberTask(this.taskId, payload)
          this.$message.success(this.$t('67a8e492.3b1083'))
        } else {
          await this.$api.memberTask.createMemberTask(payload)
          this.$message.success(this.$t('67a8e492.04a691'))
        }
        // 列表被 SpRouterView v-show 保活，需主动刷新才能看到新建/编辑结果
        this.goBackToList({ refresh: true, resetPage: !this.isEdit })
      } catch (err) {
        const msg =
          (err && err.data && err.data.message) || (err && err.message) || this.$t('67a8e492.69bba2')
        this.$message.error(msg)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

