<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="lottery-editor" :class="{ 'is-preview-open': previewExpanded }">
    <div class="lottery-editor-body">
      <div class="lottery-editor-main">
        <SpForm
          ref="formBase"
          v-model="form"
          class="lottery-editor-form"
          :show-message="false"
          :submit="false"
          :form-list="formList"
        />
      </div>
      <div v-if="previewExpanded" class="lottery-editor-preview">
        <div class="lottery-editor-preview__toolbar">
          <span class="lottery-editor-preview__title">{{ $t('a066f499.645dbc') }}</span>
          <el-button type="text" @click="previewExpanded = false">
            {{ $t('7b53c26a.def9e9') }}
          </el-button>
        </div>
        <div class="lottery-editor-phone">
          <LuckyWheel :config="lotteryPreviewConfig" />
        </div>
      </div>
    </div>
    <div class="lottery-editor-footer">
      <el-button @click="cancel">{{ $t('bea3f44a.625fb2') }}</el-button>
      <el-button v-if="!formReadonly" type="primary" @click="onGroupFormSubmit">
        {{ $t('d8d84692.be5fbb') }}
      </el-button>
    </div>
    <SpDialog
      ref="hotAreasDialogRef"
      v-model="hotAreasDialogShow"
      :title="$t('d8d84692.ffa588')"
      :modal="false"
      class="base-form"
      :form="hotArea"
      :form-list="lotteryAreaSchema"
      @onSubmit="onHotAreaSubmit"
    />

    <SpDialog
      ref="ruleDialogRef"
      v-model="ruleDialogShow"
      :title="$t('d8d84692.f4f9e5')"
      :modal="false"
      class="base-form"
      :form="ruleForm"
      :form-list="ruleFormList"
      @onSubmit="onRuleFormSubmit"
    />

    <SpDialog
      ref="recordDialogRef"
      v-model="recordDialogShow"
      :title="$t('d8d84692.8a69c2')"
      :modal="false"
      class="base-form"
      :form="recordForm"
      :form-list="recordFormList"
      @onSubmit="onRecordFormSubmit"
    />
  </div>
</template>

<script lang="js">
import { formList, lotteryAreaSchema, ruleFormSchema, recordFormSchema } from './editorSchema.js'
import { generatorParams } from '@/utils/schemaHelper.js'
import moment from 'moment'
import api from '@/api'
import LuckyWheel from '@/components/LuckyWheel/index.vue'

import { defaultItem, defaultGameConfig } from './constants'

let prizeIndexSeed = 0

/** 按 INT-01 契约字段回填奖项（不做旧键兼容） */
const normalizePrize = (el = {}, index = 0, tplPrize = {}) => {
  const src = { ...tplPrize, ...el }
  const type = src.type || ''
  let value = src.value ?? ''
  if (type === 'coupon') {
    value = {
      card_id: src.prize_detail?.card_id || value,
      title: src.prize_detail?.title
    }
  } else if (type === 'coupons') {
    value = {
      package_id: src.prize_detail?.package_id || value,
      title: src.prize_detail?.title
    }
  }
  return {
    ...defaultItem,
    prize_id: src.prize_id,
    index,
    name: src.name || '',
    type,
    value,
    probability: src.probability ?? '',
    dailyStock: src.dailyStock ?? '',
    backgroundColor: src.backgroundColor || '',
    image: src.image || '',
    prize_detail: src.prize_detail
  }
}

const createDefaultPrizesPlaceholder = () => [
  {
    ...defaultItem,
    index: prizeIndexSeed++,
    type: 'thanks',
    name: '',
    probability: 0
  },
  { ...defaultItem, index: prizeIndexSeed++ }
]

export default {
  components: {
    LuckyWheel
  },
  data() {
    return {
      form: {
        ...generatorParams(formList(this)),
        cost_type: '2',
        cost_value: 1,
        limit_total: 0,
        limit_day: 0,
        quantity: '',
        prize_data: createDefaultPrizesPlaceholder(),
        background: '',
        backgroundColor: '#ffffff',
        gameMarginTop: 150,
        activity_type: 'wheel',
        config_version: undefined
      },
      hotArea: {
        ...generatorParams(lotteryAreaSchema(this)),
        padding: 20
      },
      hotAreasDialogShow: false,
      ruleDialogShow: false,
      ruleForm: generatorParams(ruleFormSchema(this)),
      recordDialogShow: false,
      recordForm: generatorParams(recordFormSchema(this)),
      hasSetHotArea: false,
      hasSetRule: false,
      hasSetRecord: false,
      formReadonly: false,
      loadingDetail: false,
      // 默认收起预览，保证奖项表完整展示
      previewExpanded: false
    }
  },
  computed: {
    isEditMode() {
      return !!this.$route.params.id
    },
    isCloneMode() {
      return !!this.$route.query.clone_id && !this.$route.params.id
    },
    options() {
      return [
        { label: this.$t('9f64e002.d7bc19'), value: 'thanks' },
        { label: this.$t('9f64e002.9f68a8'), value: 'points' },
        { label: this.$t('9f64e002.2f3635'), value: 'coupon' },
        { label: this.$t('9f64e002.7fac13'), value: 'coupons' }
      ]
    },
    formList() {
      return formList(this)
    },
    lotteryAreaSchema() {
      return lotteryAreaSchema(this)
    },
    ruleFormList() {
      return ruleFormSchema(this)
    },
    recordFormList() {
      return recordFormSchema(this)
    },
    lotteryPreviewConfig() {
      return {
        prizeData: this.form.prize_data || [],
        background: this.form.background,
        backgroundColor: this.form.backgroundColor,
        gameMarginTop: this.form.gameMarginTop,
        hotArea: this.hotArea,
        ruleBtnStyle: this.ruleForm,
        recordBtnStyle: this.recordForm,
        intro: this.form.intro,
        costValue: this.form.cost_value
      }
    }
  },
  created() {
    const thanks = this.form.prize_data.find((p) => p.type === 'thanks')
    if (thanks && !thanks.name) {
      thanks.name = this.$t('d8d84692.8ee30c')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    createDefaultPrizes() {
      return [
        {
          ...defaultItem,
          index: prizeIndexSeed++,
          type: 'thanks',
          name: this.$t('d8d84692.8ee30c'),
          probability: 0
        },
        { ...defaultItem, index: prizeIndexSeed++ }
      ]
    },
    init() {
      const editId = this.$route.params.id
      const cloneId = this.$route.query.clone_id
      const sourceId = editId || cloneId
      if (!sourceId) return

      this.loadingDetail = true
      api.marketing
        .getTurntableDetail({ id: sourceId })
        .then((res) => {
          this.applyDetail(res, { asClone: !!cloneId && !editId })
        })
        .catch((err) => {
          const code = err?.data?.code || err?.code
          if (code === 'LUCKY_DRAW_ENDED') {
            this.formReadonly = true
            this.$message.warning(this.$t('d8d84692.01c253'))
          } else {
            this.$message.error(err?.data?.message || err?.message || this.$t('d8d84692.3c6ea0'))
          }
        })
        .finally(() => {
          this.loadingDetail = false
        })
    },
    applyDetail(res, { asClone } = {}) {
      const tpl = res.activity_template_config || {}
      const tplPrizes = tpl.gameConfig?.prizes || []
      const prize_data = (res.prize_data || []).map((el, index) => {
        const tplPrize = tplPrizes.find((p) => p.prize_id && p.prize_id === el.prize_id) || {}
        return normalizePrize(el, index, tplPrize)
      })

      this.form = {
        ...generatorParams(formList(this), res),
        activity_name: asClone
          ? `${res.activity_name || ''}${this.$t('d8d84692.f483c2')}`.trim()
          : res.activity_name,
        start_time: asClone
          ? []
          : [
              moment(res.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              moment(res.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            ],
        limit_total: res.limit_total ?? 0,
        limit_day: res.limit_day ?? 0,
        cost_value: asClone
          ? Math.max(Number(res.cost_value) || 1, 1)
          : (res.cost_value ?? 0),
        cost_type: '2',
        intro: res.intro || '',
        activity_type: res.activity_type || 'wheel',
        backgroundColor: tpl.backgroundColor || '#ffffff',
        background: tpl.backgroundImage || '',
        gameMarginTop: parseInt(String(tpl.gameMarginTop || '150').replace('px', ''), 10) || 150,
        prize_data,
        config_version: asClone ? undefined : res.config_version
      }

      if (asClone) {
        delete this.form.id
      }

      const gameConfig = tpl.gameConfig || {}
      const blocks = gameConfig.blocks || []
      const buttons = gameConfig.buttons || []
      this.hotArea = blocks[0]?.imgs?.[0]?.src
        ? {
            backImg: blocks[0].imgs[0].src,
            // 配置里存的是 "20px"，number 输入框需纯数字才能回显
            padding:
              parseInt(String(blocks[0].padding ?? 20).replace(/px$/i, ''), 10) || 20,
            img: buttons[0]?.imgs?.[0]?.src || ''
          }
        : { ...generatorParams(lotteryAreaSchema(this)), padding: 20 }
      this.hasSetHotArea = !!blocks[0]?.imgs?.[0]?.src

      const ruleFormConfig = gameConfig.ruleFormConfig
      this.ruleForm = ruleFormConfig
        ? ruleFormConfig
        : generatorParams(ruleFormSchema(this))
      this.hasSetRule = !!ruleFormConfig

      const recordFormConfig = gameConfig.recordFormConfig
      this.recordForm = recordFormConfig
        ? recordFormConfig
        : generatorParams(recordFormSchema(this))
      this.hasSetRecord = !!recordFormConfig

      // 已结束：编辑态只读（终止后 end_time<=now）
      if (!asClone && res.end_time && res.end_time * 1000 <= Date.now()) {
        this.formReadonly = true
        this.$message.warning(this.$t('d8d84692.01c253'))
      }
    },
    cancel() {
      this.$router.push('/marketing/interactive/lottery')
    },
    onGroupFormSubmit() {
      if (this.formReadonly) return
      this.$refs.formBase
        .handleSubmit()
        .then(() => this.validateBusiness())
        .then(() => this.submitAfter())
        .catch((er) => {
          // SpForm 校验失败返回 errField 对象（无 message）；业务校验返回 Error
          if (er?.message) {
            this.$message.error(er.message)
            return
          }
          this.$message.error(this.$t('d8d84692.7a55ed'))
        })
    },
    validateBusiness() {
      const begin = this.form.start_time?.[0]
      const end = this.form.start_time?.[1]
      if (!begin || !end) {
        return Promise.reject(new Error(this.$t('d8d84692.d8e0d0')))
      }
      const beginUnix = moment(begin).unix()
      const endUnix = moment(end).unix()
      const now = moment().unix()
      if (endUnix <= beginUnix) {
        return Promise.reject(new Error(this.$t('d8d84692.c903b9')))
      }
      if (endUnix <= now) {
        return Promise.reject(new Error(this.$t('d8d84692.20d9a8')))
      }
      const limitTotal = Number(this.form.limit_total) || 0
      const limitDay = Number(this.form.limit_day) || 0
      if (limitTotal > 0 && limitDay > limitTotal) {
        return Promise.reject(new Error(this.$t('d8d84692.b12c1c')))
      }
      const cost = Number(this.form.cost_value)
      if (Number.isNaN(cost) || cost < 1) {
        return Promise.reject(new Error(this.$t('d8d84692.a9b89a')))
      }
      if (!this.form.intro || !String(this.form.intro).replace(/<[^>]+>/g, '').trim()) {
        return Promise.reject(new Error(this.$t('d8d84692.7c8c06')))
      }
      const prizes = (this.form.prize_data || []).filter((el) => el.name?.trim() && el.type)
      if (!prizes.some((el) => el.type === 'thanks')) {
        return Promise.reject(new Error(this.$t('d8d84692.8f5d36')))
      }
      const probSum = prizes.reduce((acc, item) => acc + (Number(item.probability) || 0), 0)
      if (probSum <= 0 || probSum > 100) {
        return Promise.reject(new Error(this.$t('d8d84692.a8387a')))
      }
      for (const p of prizes) {
        if (!p.name || String(p.name).length > 5) {
          return Promise.reject(new Error(this.$t('d8d84692.c3c560')))
        }
        if (['coupon', 'coupons'].includes(p.type)) {
          const stock = p.dailyStock
          if (stock !== '' && stock != null && Number(stock) < 0) {
            return Promise.reject(new Error(this.$t('d8d84692.1c874d')))
          }
          const maxQty = Number(p.prize_detail?.quantity)
          if (stock !== '' && stock != null && maxQty > 0 && Number(stock) > maxQty) {
            return Promise.reject(new Error(this.$t('d8d84692.1c6eab')))
          }
        }
      }
      if (!this.form.gameMarginTop && this.form.gameMarginTop !== 0) {
        this.form = { ...this.form, gameMarginTop: 150 }
      }
      const padding = this.hotArea?.padding
      if (padding === '' || padding == null) {
        this.hotArea = { ...this.hotArea, padding: 20 }
      }
      return Promise.resolve()
    },
    /** 奖项扇区底色：仅使用奖项自身 backgroundColor */
    resolvePrizeBackgroundColor(el = {}) {
      return el.backgroundColor || ''
    },
    buildPrizePayload() {
      return (this.form.prize_data || [])
        .filter((el) => el.name?.trim() && el.type)
        .map((el, index) => {
          let value = el.value
          if (el.type === 'coupon') {
            value = el.value?.card_id ?? el.value
          } else if (el.type === 'coupons') {
            value = el.value?.package_id ?? el.value
          }
          const backgroundColor = this.resolvePrizeBackgroundColor(el)
          const item = {
            sort: index,
            name: el.name,
            type: el.type,
            value: value ?? '',
            probability: Number(el.probability) || 0,
            backgroundColor,
            // 兼容只读 background 的 C 端映射
            background: backgroundColor,
            image: el.image || ''
          }
          if (el.prize_id) item.prize_id = el.prize_id
          if (['coupon', 'coupons'].includes(el.type)) {
            item.dailyStock =
              el.dailyStock !== '' && el.dailyStock != null ? Number(el.dailyStock) : 0
          }
          return item
        })
    },
    async submitAfter() {
      const limitTotal = Number(this.form.limit_total) || 0
      const limitDay = Number(this.form.limit_day) || 0
      const prizes = this.buildPrizePayload()
      const params = {
        activity_name: this.form.activity_name,
        intro: this.form.intro,
        activity_type: 'wheel',
        cost_value: Number(this.form.cost_value) || 0,
        limit_total: limitTotal,
        limit_day: limitDay,
        prize_data: JSON.stringify(prizes),
        begin_time: moment(this.form.start_time[0]).unix(),
        end_time: moment(this.form.start_time[1]).unix(),
        activity_template_config: JSON.stringify({
          ...defaultGameConfig,
          gameType: 'wheel',
          gameMarginTop: `${this.form.gameMarginTop || 150}px`,
          backgroundImage: this.form.background,
          backgroundColor: this.form.backgroundColor,
          gameConfig: {
            ...defaultGameConfig.gameConfig,
            // 与 prize_data 同源契约字段，供装修/C 端样式回显
            prizes,
            defaultStyle: {
              ...(defaultGameConfig.gameConfig.defaultStyle || {}),
              background: ''
            },
            // lucky-canvas imgs 默认宽高为 0/原图像素，需 100% 才能铺满父级（与预览一致）
            blocks: this?.hotArea?.backImg
              ? [
                  {
                    padding: `${String(this.hotArea.padding ?? 20).replace(/px$/i, '') || 20}px`,
                    imgs: [
                      {
                        src: this.hotArea.backImg,
                        top: '0px',
                        width: '100%',
                        height: '100%'
                      }
                    ]
                  }
                ]
              : [],
            // 中心按钮：有图用图；无图时使用独立按钮底色
            buttons: this.hotArea?.img
              ? [
                  {
                    background: '#e54d42',
                    imgs: [
                      {
                        src: this.hotArea.img,
                        top: '-50%',
                        width: '100%',
                        height: '100%'
                      }
                    ],
                    radius: '35%',
                    pointer: true,
                    fonts: []
                  }
                ]
              : [
                  {
                    background: '#e54d42',
                    imgs: [],
                    radius: '35%',
                    pointer: true,
                    fonts: [{ text: this.$t('d8d84692.a3e3b8'), top: '-10px' }]
                  }
                ],
            ruleFormConfig: this.ruleForm,
            recordFormConfig: this.recordForm
          }
        })
      }

      if (this.isEditMode) {
        params.id = this.$route.params.id
        params.config_version = this.form.config_version
        // 创建后不可改：开始时间、消耗 — 仍提交库内值由服务端强制；前端已锁定
      }

      try {
        const res = await api.marketing.editTurntableConfig(params)
        if (res?.result) {
          this.$message.success(this.$t('d8d84692.3b1083'))
          this.$router.push('/marketing/interactive/lottery')
          return
        }
        this.$message.error(this.$t('d8d84692.6de920'))
      } catch (err) {
        const code = err?.data?.code || err?.code
        if (code === 'LUCKY_DRAW_CONFIG_VERSION_CONFLICT') {
          this.$message.error(this.$t('d8d84692.ce663f'))
          this.init()
          return
        }
        if (code === 'LUCKY_DRAW_ENDED') {
          this.formReadonly = true
          this.$message.error(this.$t('d8d84692.01c253'))
          return
        }
        this.$message.error(err?.data?.message || err?.message || this.$t('d8d84692.6de920'))
      }
    },
    handleInput(val, row, index, key) {
      this.form = {
        ...this.form,
        prize_data: this.form.prize_data.map((el, i) => {
          if (i == index) {
            // 谢谢参与：名称与类型固定不可改
            if (el.type === 'thanks' && (key === 'type' || key === 'name')) {
              return el
            }
            if (key === 'type') {
              return { ...el, type: val, value: '', dailyStock: '' }
            }
            return { ...el, [key]: val }
          }
          return el
        })
      }
    },
    handleDateInput(val) {
      if (this.isEditMode) {
        // 编辑态仅允许改结束时间：保持开始时间不变
        const begin = this.form.start_time?.[0]
        if (val?.length && begin) {
          this.form = {
            ...this.form,
            start_time: [begin, val[1]],
            begin_time: moment(begin).unix(),
            end_time: moment(val[1]).unix()
          }
        }
        return
      }
      if (val?.length) {
        this.form = {
          ...this.form,
          begin_time: moment(val[0]).unix(),
          end_time: moment(val[1]).unix()
        }
      } else {
        this.form = {
          ...this.form,
          begin_time: '',
          end_time: ''
        }
      }
    },
    addHandle() {
      if (this.form.prize_data.length >= 8) {
        this.$message.error(this.$t('d8d84692.5ef360'))
        return
      }
      this.form = {
        ...this.form,
        prize_data: [
          ...this.form.prize_data,
          { ...defaultItem, index: this.form.prize_data.length }
        ]
      }
    },
    deleteHandle(row) {
      if (row?.type === 'thanks') {
        this.$message.warning(this.$t('d8d84692.799cea'))
        return
      }
      this.form = {
        ...this.form,
        prize_data: this.form.prize_data
          .filter((el, i) => i != row?.index)
          ?.map((el, index) => ({
            ...el,
            index
          }))
      }
    },
    onHotAreaSubmit() {
      if (this.hotArea.padding === '' || this.hotArea.padding == null) {
        this.hotArea.padding = 20
      }
      this.hasSetHotArea = true
      this.hotAreasDialogShow = false
    },
    onRuleFormSubmit() {
      this.hasSetRule = true
      this.ruleDialogShow = false
    },
    onRecordFormSubmit() {
      this.hasSetRecord = true
      this.recordDialogShow = false
    },
    async onCouponSubmit(row, index, key) {
      const { data } = await this.$picker.couponV2({
        multiple: false,
        data: [row.value?.card_id],
        params: {
          date_status: 2,
          store_self: false
        }
      })
      const coupon = data[0]
      const value = {
        ...coupon,
        card_id: coupon.card_id || coupon.id,
        title: coupon.title || coupon.card_name
      }
      const prizeDetail = {
        ...(row.prize_detail || {}),
        ...coupon,
        card_id: coupon.card_id || coupon.id,
        title: coupon.title || coupon.card_name,
        quantity: coupon.quantity ?? coupon.total_quantity ?? coupon.stock
      }
      this.form = {
        ...this.form,
        prize_data: this.form.prize_data.map((el, i) =>
          i === index ? { ...el, [key]: value, prize_detail: prizeDetail } : el
        )
      }
    },
    async onCouponPackSubmit(row, index, key) {
      const { data } = await this.$picker.couponPackage({
        multiple: false,
        data: [row.value?.package_id]
      })
      const pack = data[0]
      const value = {
        ...pack,
        package_id: pack.package_id || pack.id,
        title: pack.title || pack.package_name
      }
      const prizeDetail = {
        ...(row.prize_detail || {}),
        ...pack,
        package_id: pack.package_id || pack.id,
        title: pack.title || pack.package_name,
        quantity: pack.quantity ?? pack.total_quantity ?? pack.stock
      }
      this.form = {
        ...this.form,
        prize_data: this.form.prize_data.map((el, i) =>
          i === index ? { ...el, [key]: value, prize_detail: prizeDetail } : el
        )
      }
    }
  }
}
</script>

<style scoped>
.lottery-editor {
  position: relative;
}

.lottery-editor-body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
}

.lottery-editor-main {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow: visible;
}

.lottery-editor.is-preview-open .lottery-editor-main {
  max-width: calc(100% - 406px);
}

.lottery-editor-preview {
  flex: 0 0 390px;
  position: sticky;
  top: 16px;
  align-self: flex-start;
  /* 高于 vue-html5-editor 默认 z-index:1000，避免滑到活动说明时被工具栏盖住 */
  z-index: 1100;
  background: #f5f7fa;
  padding: 8px;
  border-radius: 12px;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
}

.lottery-editor-preview__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 4px;
}

.lottery-editor-preview__title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.lottery-editor-phone {
  width: 375px;
  height: 720px;
  border: 1px solid #dcdfe6;
  border-radius: 28px;
  overflow: hidden;
  background: #f5f5f5;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.lottery-editor-phone >>> .sp-game-preview {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 100%;
}

.lottery-editor-footer {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.imgWrap {
  height: 40px;
}

.prize_data {
  width: 100%;
  max-width: 100%;
}

.prize_data >>> .el-table {
  width: 100% !important;
}

.prize_data >>> .imgWrap .image-item {
  height: 40px !important;
}
</style>

<style>
/* schema JSX 不带 scoped 属性 */
.lottery-prize-select-btn {
  margin-left: 4px;
  color: var(--primary);
  cursor: pointer;
}

.lottery-style-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 280px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 14px;
}

.lottery-style-row__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--primary);
  cursor: pointer;
  white-space: nowrap;
}

.lottery-style-row__actions > span:hover {
  opacity: 0.85;
}

.lottery-bg-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lottery-bg-row__labels,
.lottery-bg-row__controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.lottery-bg-row__reset {
  margin-left: 20px;
  color: var(--primary);
  cursor: pointer;
}

/* Finder 操作列右侧留白；表格跟父级同宽，不出现横向滚动 */
.prize_data .el-table {
  padding-right: 12px;
  width: 100% !important;
}

/* 「抽奖配置」分组标题行：左侧标题，右侧预览按钮 */
.lottery-config-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.lottery-config-group .el-button {
  font-weight: 400;
}

.prize_data .el-table__body-wrapper,
.prize_data .el-table__header-wrapper {
  overflow-x: hidden !important;
}

.prize_data .el-table__fixed-right {
  right: 8px !important;
}
</style>
