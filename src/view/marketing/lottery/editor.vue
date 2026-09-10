<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="lottery-editor">
    <SpForm
      ref="formBase"
      v-model="form"
      class="lottery-editor-form"
      show-message
      :submit="false"
      :form-list="formList"
    />
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

const createDefaultPrizes = () => [
  {
    ...defaultItem,
    index: prizeIndexSeed++,
    type: 'thanks',
    name: '谢谢参与',
    probability: 0
  },
  { ...defaultItem, index: prizeIndexSeed++ }
]

export default {
  data() {
    return {
      form: {
        ...generatorParams(formList(this)),
        cost_type: '2',
        cost_value: 0,
        limit_total: 0,
        limit_day: 0,
        quantity: '',
        prize_data: createDefaultPrizes(),
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
      ruleFormConfig: null,
      hasSetRecord: null,
      formReadonly: false,
      loadingDetail: false
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
    }
  },
  mounted() {
    this.init()
  },
  methods: {
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
            this.$message.warning('活动已结束，不可编辑')
          } else {
            this.$message.error(err?.data?.message || err?.message || '加载活动失败')
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
        activity_name: asClone ? `${res.activity_name || ''} 副本`.trim() : res.activity_name,
        start_time: asClone
          ? []
          : [
              moment(res.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              moment(res.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')
            ],
        limit_total: res.limit_total ?? 0,
        limit_day: res.limit_day ?? 0,
        cost_value: res.cost_value ?? 0,
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
            padding: blocks[0].padding ?? 20,
            background: buttons[0]?.background || '#ffffff',
            img: buttons[0]?.imgs?.[0]?.src || ''
          }
        : { ...generatorParams(lotteryAreaSchema(this)), padding: 20 }
      this.hasSetHotArea = !!blocks[0]?.imgs?.[0]?.src

      const recordFormConfig = gameConfig.recordFormConfig
      this.recordForm = recordFormConfig?.img
        ? recordFormConfig
        : generatorParams(recordFormSchema(this))
      this.hasSetRecord = !!recordFormConfig?.img

      // 已结束：编辑态只读（终止后 end_time<=now）
      if (!asClone && res.end_time && res.end_time * 1000 <= Date.now()) {
        this.formReadonly = true
        this.$message.warning('活动已结束，不可编辑')
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
          if (er?.message) this.$message.error(er.message)
        })
    },
    validateBusiness() {
      const begin = this.form.start_time?.[0]
      const end = this.form.start_time?.[1]
      if (!begin || !end) {
        return Promise.reject(new Error('请选择活动时间'))
      }
      const beginUnix = moment(begin).unix()
      const endUnix = moment(end).unix()
      const now = moment().unix()
      if (endUnix <= beginUnix) {
        return Promise.reject(new Error('结束时间必须大于开始时间'))
      }
      if (endUnix <= now) {
        return Promise.reject(new Error('结束时间必须大于当前时间'))
      }
      const limitTotal = Number(this.form.limit_total) || 0
      const limitDay = Number(this.form.limit_day) || 0
      if (limitTotal > 0 && limitDay > limitTotal) {
        return Promise.reject(new Error('每日限额不可大于总限额'))
      }
      const cost = Number(this.form.cost_value)
      if (Number.isNaN(cost) || cost < 0) {
        return Promise.reject(new Error('抽奖消耗须为大于等于 0 的数值'))
      }
      if (!this.form.intro || !String(this.form.intro).replace(/<[^>]+>/g, '').trim()) {
        return Promise.reject(new Error('请填写活动说明'))
      }
      const prizes = (this.form.prize_data || []).filter((el) => el.name?.trim() && el.type)
      if (!prizes.some((el) => el.type === 'thanks')) {
        return Promise.reject(new Error('至少配置一个「无奖品/谢谢参与」奖项'))
      }
      const probSum = prizes.reduce((acc, item) => acc + (Number(item.probability) || 0), 0)
      if (probSum <= 0 || probSum > 100) {
        return Promise.reject(new Error('全部奖项概率之和须大于 0 且不超过 100'))
      }
      for (const p of prizes) {
        if (!p.name || String(p.name).length > 5) {
          return Promise.reject(new Error('奖项名称必填且不超过 5 个字'))
        }
        if (['coupon', 'coupons'].includes(p.type)) {
          const stock = p.dailyStock
          if (stock !== '' && stock != null && Number(stock) < 0) {
            return Promise.reject(new Error('每日奖品库存不可为负数'))
          }
          const maxQty = Number(p.prize_detail?.quantity)
          if (stock !== '' && stock != null && maxQty > 0 && Number(stock) > maxQty) {
            return Promise.reject(new Error('每日库存不可大于该券总可用库存'))
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
          const item = {
            sort: index,
            name: el.name,
            type: el.type,
            value: value ?? '',
            probability: Number(el.probability) || 0,
            backgroundColor: el.backgroundColor || '',
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
            blocks: this?.hotArea?.backImg
              ? [
                  {
                    padding: this.hotArea.padding ?? 20,
                    imgs: [{ src: this.hotArea.backImg }]
                  }
                ]
              : [],
            buttons:
              this.hotArea?.img || this.hotArea?.background
                ? [
                    {
                      background: this.hotArea?.background,
                      imgs: this.hotArea?.img ? [{ src: this.hotArea.img }] : [],
                      radius: '35%',
                      pointer: true,
                      fonts: [{ text: '开始', top: '-10px' }]
                    }
                  ]
                : [],
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
          this.$message.success('保存成功')
          this.$router.push('/marketing/interactive/lottery')
          return
        }
        this.$message.error('保存失败')
      } catch (err) {
        const code = err?.data?.code || err?.code
        if (code === 'LUCKY_DRAW_CONFIG_VERSION_CONFLICT') {
          this.$message.error('配置已被他人更新，请刷新后重试')
          this.init()
          return
        }
        if (code === 'LUCKY_DRAW_ENDED') {
          this.formReadonly = true
          this.$message.error('活动已结束，不可编辑')
          return
        }
        this.$message.error(err?.data?.message || err?.message || '保存失败')
      }
    },
    handleInput(val, row, index, key) {
      this.form = {
        ...this.form,
        prize_data: this.form.prize_data.map((el, i) => {
          if (i == index) {
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
        this.$message.error('最多添加8项')
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
      this.ruleFormConfig = this.ruleForm
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

.lottery-editor-footer {
  display: flex;
  justify-content: center;
}

.lottery-editor-content {
  position: relative;
  bottom: 260px;
  left: 730px;
  height: 740px;
  width: 350px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
}

.inputWrap {
  width: 200px;
  border-radius: 8px;
  border: 1px solid;
  height: 40px;
  position: relative;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
}

.imgWrap {
  height: 50px;
}

.prize_data {
  width: max-content;
}

.prize_data >>> .imgWrap .image-item {
  height: 50px !important;
}
</style>
