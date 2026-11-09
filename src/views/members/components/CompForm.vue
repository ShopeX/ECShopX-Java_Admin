<script>
import { h } from 'vue'
import dayjs from 'dayjs'
import { PICKER_DATE_OPTIONS } from '@/consts'

function getGoodsImage(item = {}) {
  if (item.image) return item.image
  if (Array.isArray(item.pics) && item.pics.length) return item.pics[0]
  if (typeof item.pics === 'string' && item.pics) {
    try {
      const parsed = JSON.parse(item.pics)
      if (Array.isArray(parsed) && parsed.length) return parsed[0]
    } catch (e) {
      return item.pics
    }
  }
  return ''
}

export default {
  name: 'CompForm',
  props: ['item', 'index', 'disabled'],
  data() {
    return {
      dateRange: [],
      minValue: 0,
      maxValue: 0,
      selectedGoods: [],
      checkoutValues: [],
      options: [],
      radioValue: null,
      enrichingGoods: false
    }
  },
  computed: {
    conditionType() {
      return (this.item && this.item.condition_type) || ''
    }
  },
  watch: {
    dateRange: {
      handler(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return
        this.$emit('update', this.index, { ...this.item, value: Array.isArray(val) ? val : [] })
      },
      immediate: false
    },
    minValue(val, oldVal) {
      if (val === oldVal) return
      this.$emit('update', this.index, {
        ...this.item,
        value: { min: val, max: this.maxValue }
      })
    },
    maxValue(val, oldVal) {
      if (val === oldVal) return
      this.$emit('update', this.index, {
        ...this.item,
        value: { min: this.minValue, max: val }
      })
    },
    selectedGoods: {
      handler(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return
        this.$emit('update', this.index, { ...this.item, value: val })
      },
      deep: true
    },
    checkoutValues: {
      handler(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return
        this.$emit('update', this.index, { ...this.item, value: val })
      },
      deep: true
    },
    radioValue(val, oldVal) {
      if (val === oldVal) return
      this.$emit('update', this.index, { ...this.item, value: val })
    },
    'item.value': {
      handler(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return
        this.syncValue(val)
      },
      immediate: true,
      deep: true
    },
    'item.map_value': {
      handler(val) {
        if (Array.isArray(val)) {
          this.options = val
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.initValue()
  },
  methods: {
    initValue() {
      if (this.item.value) {
        this.syncValue(this.item.value)
      }
      if (this.item.map_value && Array.isArray(this.item.map_value)) {
        this.options = this.item.map_value
      }
    },
    syncValue(val) {
      const type = this.conditionType
      if (type === 'timeRange') {
        const newDateRange = Array.isArray(val)
          ? val.map((timestamp) => {
              return timestamp < 1000000000000 ? dayjs.unix(timestamp / 1000).valueOf() : timestamp
            })
          : []
        if (JSON.stringify(this.dateRange) !== JSON.stringify(newDateRange)) {
          this.dateRange = newDateRange
        }
      } else if (type === 'number_rang') {
        if (val && typeof val === 'object') {
          const newMin = val.min || 0
          const newMax = val.max || 0
          if (this.minValue != newMin) {
            this.minValue = newMin
          }
          if (this.maxValue != newMax) {
            this.maxValue = newMax
          }
        }
      } else if (type === 'number_items') {
        const newSelectedGoods = val && Array.isArray(val) ? val : []
        if (JSON.stringify(this.selectedGoods) !== JSON.stringify(newSelectedGoods)) {
          this.selectedGoods = newSelectedGoods
          this.ensureGoodsDetails(newSelectedGoods)
        }
      } else if (type === 'mapping') {
        const newCheckoutValues = val && Array.isArray(val) ? val : []
        if (JSON.stringify(this.checkoutValues) !== JSON.stringify(newCheckoutValues)) {
          this.checkoutValues = newCheckoutValues
        }
      } else if (type === 'radio') {
        if (this.radioValue !== val) {
          this.radioValue = val
        }
      }
    },
    async ensureGoodsDetails(goods) {
      const list = Array.isArray(goods) ? goods : []
      const needFetch = list.some((g) => g && g.item_id && (!g.item_name || !g.image))
      if (!needFetch || this.enrichingGoods) return
      this.enrichingGoods = true
      try {
        const enriched = await this.fetchGoodsDetails(list)
        if (JSON.stringify(enriched) !== JSON.stringify(this.selectedGoods)) {
          this.selectedGoods = enriched
        }
      } finally {
        this.enrichingGoods = false
      }
    },
    async fetchGoodsDetails(goods) {
      const ids = goods.map((g) => g.item_id).filter(Boolean)
      if (!ids.length) return goods
      try {
        const { list } = await this.$api.goods.getItemsList({
          item_id: ids,
          page: 1,
          pageSize: Math.max(ids.length, 20)
        })
        const detailMap = {}
        ;(list || []).forEach((item) => {
          detailMap[item.item_id] = item
        })
        return goods.map((g) => {
          const detail = detailMap[g.item_id]
          if (!detail) {
            return {
              item_id: g.item_id,
              item_name: g.item_name || '',
              image: g.image || ''
            }
          }
          return {
            item_id: g.item_id,
            item_name: g.item_name || detail.item_name || '',
            image: g.image || getGoodsImage(detail)
          }
        })
      } catch (error) {
        console.error('加载商品详情失败:', error)
        return goods
      }
    },
    // 渲染时间范围选择器
    renderTimeRange() {
      return h('div', { class: 'w-[500px]' }, [
        h('el-date-picker', {
          props: {
            value: this.dateRange,
            type: 'datetimerange',
            rangeSeparator: this.$t('bb4b0675.981cbe'),
            startPlaceholder: this.$t('bb4b0675.b44c0f'),
            endPlaceholder: this.$t('bb4b0675.1d468b'),
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'timestamp',
            clearable: true,
            disabled: this.disabled,
            defaultTime: ['00:00:00', '23:59:59'],
            pickerOptions: PICKER_DATE_OPTIONS
          },
          on: {
            input: (val) => {
              this.dateRange = val || []
            },
            change: (val) => {
              this.dateRange = val || []
            }
          }
        })
      ])
    },
    // 渲染数字范围输入框
    renderNumberRange() {
      const unit = (this.item && this.item.unit) || this.$t('bb4b0675.c16655')
      return h('div', { class: 'flex items-center' }, [
        h('el-input-number', {
          props: {
            value: this.minValue,
            min: 0,
            precision: 2,
            disabled: this.disabled
          },
          class: 'w-[150px]',
          on: {
            input: (val) => {
              this.minValue = val
            }
          }
        }),
        h('span', { class: 'mx-2' }, unit),
        h('span', { class: 'mx-2' }, this.$t('bb4b0675.981cbe')),
        h('el-input-number', {
          props: {
            value: this.maxValue,
            min: 0,
            precision: 2,
            disabled: this.disabled
          },
          class: 'w-[150px]',
          on: {
            input: (val) => {
              this.maxValue = val
            }
          }
        }),
        h('span', { class: 'mx-2 ml-2' }, unit)
      ])
    },
    renderSelectedGoodsList() {
      if (!this.selectedGoods.length) return null
      return h(
        'div',
        { class: 'flex flex-wrap gap-3 mt-3' },
        this.selectedGoods.map((goods) =>
          h(
            'div',
            {
              class:
                'flex items-center w-[260px] px-2.5 py-2 border border-[#ebeef5] rounded bg-[#fafafa] box-border',
              key: goods.item_id
            },
            [
              h(
                'div',
                {
                  class:
                    'flex items-center justify-center flex-none w-12 h-12 mr-2.5 overflow-hidden rounded bg-[#ebeef5] text-[#c0c4cc] text-xl'
                },
                [
                  goods.image
                    ? h('img', {
                        class: 'w-full h-full object-cover',
                        attrs: {
                          src: goods.image,
                          alt: goods.item_name || ''
                        }
                      })
                    : h('i', { class: 'el-icon-picture-outline' })
                ]
              ),
              h(
                'div',
                {
                  class:
                    'flex-1 min-w-0 overflow-hidden text-[#303133] text-[13px] leading-[18px] text-ellipsis whitespace-nowrap',
                  attrs: { title: goods.item_name || String(goods.item_id || '') }
                },
                goods.item_name || `ID: ${goods.item_id}`
              ),
              this.disabled
                ? null
                : h('el-button', {
                    class: 'flex-none ml-1 p-0 text-[#909399]',
                    props: {
                      type: 'text',
                      icon: 'el-icon-close'
                    },
                    on: {
                      click: () => this.removeGoods(goods.item_id)
                    }
                  })
            ]
          )
        )
      )
    },
    // 渲染选择商品
    renderPickGoods() {
      return h('div', { class: 'w-full' }, [
        h('div', { class: 'flex items-center' }, [
          h(
            'el-button',
            {
              props: {
                size: 'small',
                type: 'primary',
                disabled: this.disabled
              },
              on: {
                click: this.selectGoods
              }
            },
            this.$t('bb4b0675.43d1e2')
          ),
          this.selectedGoods.length > 0
            ? h('span', { class: 'ml-2.5' }, this.$t('bb4b0675.14699a', [this.selectedGoods.length]))
            : null
        ]),
        this.renderSelectedGoodsList()
      ])
    },
    // 渲染复选框（mapping）
    renderCheckout() {
      const checkboxes = this.options.map((option) =>
        h(
          'el-checkbox',
          {
            props: {
              label: option.id,
              value: option.name,
              disabled: this.disabled
            },
            key: option.id
          },
          option.name
        )
      )
      return h('div', [
        h(
          'el-checkbox-group',
          {
            props: {
              value: this.checkoutValues,
              disabled: this.disabled
            },
            on: {
              input: (val) => {
                this.checkoutValues = val
              }
            }
          },
          checkboxes
        )
      ])
    },
    renderRadio() {
      const radios = this.options.map((option) =>
        h(
          'el-radio',
          {
            props: {
              label: option.id,
              value: option.name,
              disabled: this.disabled
            },
            key: option.id
          },
          option.name
        )
      )
      return h('div', { class: 'flex items-center' }, [
        h(
          'el-radio-group',
          {
            props: {
              value: this.radioValue,
              disabled: this.disabled
            },
            on: {
              input: (val) => {
                this.radioValue = val
              }
            }
          },
          radios
        )
      ])
    },
    // 选择商品方法
    async selectGoods() {
      try {
        const { data } = await this.$picker.goods({
          multiple: true,
          data: this.selectedGoods.map((g) => g.item_id)
        })
        this.selectedGoods = data.map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          image: getGoodsImage(item)
        }))
      } catch (error) {
        console.error('选择商品失败:', error)
      }
    },
    removeGoods(itemId) {
      if (this.disabled) return
      this.selectedGoods = this.selectedGoods.filter((item) => item.item_id !== itemId)
    }
  },
  render() {
    const type = this.conditionType
    const renderMap = {
      timeRange: this.renderTimeRange,
      number_rang: this.renderNumberRange,
      number_items: this.renderPickGoods,
      mapping: this.renderCheckout,
      radio: this.renderRadio
    }
    const renderFn = renderMap[type] || (() => h('div'))
    return renderFn()
  }
}
</script>
