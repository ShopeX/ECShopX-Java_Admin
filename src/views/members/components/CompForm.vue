<script>
import { h } from 'vue'
import dayjs from 'dayjs'

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
      radioValue: null
    }
  },
  computed: {
    conditionType() {
      return (this.item && this.item.condition_type) || ''
    }
  },
  watch: {
    dateRange: {
      handler(val) {
        this.$emit('update', this.index, { ...this.item, value: Array.isArray(val) ? val.map(timestamp => dayjs.unix(timestamp).valueOf()) : [] })
      },
      immediate: false
    },
    minValue(val) {
      this.$emit('update', this.index, {
        ...this.item,
        value: { min: val, max: this.maxValue }
      })
    },
    maxValue(val) {
      this.$emit('update', this.index, {
        ...this.item,
        value: { min: this.minValue, max: val }
      })
    },
    selectedGoods: {
      handler(val) {
        this.$emit('update', this.index, { ...this.item, value: val })
      },
      deep: true
    },
    checkoutValues(val) {
      console.log(val, '-1--')
      this.$emit('update', this.index, { ...this.item, value: val })
    },
    radioValue(val) {
      this.$emit('update', this.index, { ...this.item, value: val })
    },
    'item.value': {
      handler(val) {
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
        this.dateRange = Array.isArray(val) ? val.map(timestamp => dayjs.unix(timestamp).valueOf()) : []
      } else if (type === 'number_rang') {
        if (val && typeof val === 'object') {
          this.minValue = val.min || 0
          this.maxValue = val.max || 0
        }
      } else if (type === 'number_items') {
        this.selectedGoods = (val && Array.isArray(val)) ? val : []
      } else if (type === 'mapping') {
        this.checkoutValues = (val && Array.isArray(val)) ? val : []
      } else if (type === 'radio') {
        this.radioValue = val
      }
    },
    // 渲染时间范围选择器
    renderTimeRange() {
      return h('div', { class: 'w-[500px]' }, [
        h('el-date-picker', {
          props: {
            value: this.dateRange,
            type: 'daterange',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'timestamp',
            clearable: true,
            disabled: this.disabled
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
      const unit = (this.item && this.item.unit) || '元'
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
        h('span', { class: 'mx-2' }, '至'),
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
    // 渲染选择商品
    renderPickGoods() {
      return h('div', { class: 'flex items-center' }, [
        h('el-button', {
          props: {
            size: 'small',
            type: 'primary',
            disabled: this.disabled
          },
          on: {
            click: this.selectGoods
          }
        }, '选择商品'),
        this.selectedGoods.length > 0
          ? h('span', { class: 'ml-2.5' }, `已选择${this.selectedGoods.length}件商品`)
          : null
      ])
    },
    // 渲染复选框（mapping）
    renderCheckout() {
      const checkboxes = this.options.map(option =>
        h('el-checkbox', {
          props: {
            label: option.id,
            value: option.name,
            disabled: this.disabled
          },
          key: option.id
        }, option.name)
      )
      return h('div', [
        h('el-checkbox-group', {
          props: {
            value: this.checkoutValues,
            disabled: this.disabled
          },
          on: {
            input: (val) => {
              this.checkoutValues = val
            }
          }
        }, checkboxes)
      ])
    },
    renderRadio() {
      const radios = this.options.map(option =>
        h('el-radio', {
          props: {
            label: option.id,
            value: option.name,
            disabled: this.disabled
          },
          key: option.id
        }, option.name)
      )
      return h('div', { class: 'flex items-center' }, [
        h('el-radio-group', {
          props: {
            value: this.radioValue,
            disabled: this.disabled
          },
          on: {
            input: (val) => {
              this.radioValue = val
            }
          }
        }, radios)
      ])
    },
    // 选择商品方法
    async selectGoods() {
      try {
        const { data } = await this.$picker.goods({
          multiple: true,
          data: this.selectedGoods.map(g => g.item_id)
        })
        this.selectedGoods = data.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name
        }))
      } catch (error) {
        console.error('选择商品失败:', error)
      }
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
