<!--
  菜单项表单 — $dialog.open 内容区（整表 SpFormPlus）
  跳转路径：FormField 支持 component 为函数，用 ctx.h 渲染 el-select（弹窗内内置 renderSelect 不可靠）
-->
<template>
  <div class="menu-item-form-sp w-full max-w-[600px]">
    <SpFormPlus
      ref="formPlusRef"
      v-model="form"
      form-type="form"
      label-width="100px"
      class="w-full"
      :show-default-actions="false"
      :form-items="formItems"
    />
  </div>
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'
import { MENU_ITEM_PAGE_PRESETS, defaultPresetPath } from './menuItemPagePresets'

export default {
  name: 'MenuItemForm',
  components: { SpFormPlus },
  props: {
    initialValue: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        name: '',
        pagePath: '',
        sort: 0
      }
    }
  },
  computed: {
    pageSelectOptions() {
      const base = MENU_ITEM_PAGE_PRESETS.map((o) => ({
        label: this.$t(o.labelKey),
        value: o.value
      }))
      const presetVals = MENU_ITEM_PAGE_PRESETS.map((o) => o.value)
      const u = (this.form.pagePath || '').trim()
      if (u && !presetVals.includes(u)) {
        return [{ label: this.$t('7856f5b5.fbdd56', { path: u }), value: u }, ...base]
      }
      return base
    },
    formItems() {
      return [
        {
          fieldName: 'name',
          label: this.$t('7856f5b5.d7ec2d'),
          component: 'input',
          formItemClass: 'w-full',
          rules: [{ required: true, message: this.$t('7856f5b5.06e2f8'), trigger: 'blur' }],
          componentProps: {
            clearable: true,
            placeholder: this.$t('7856f5b5.2ff819')
          }
        },
        {
          fieldName: 'pagePath',
          label: this.$t('7856f5b5.0fec18'),
          component: (ctx) => this.renderPagePathSelect(ctx),
          formItemClass: 'w-full',
          rules: [{ required: true, message: this.$t('7856f5b5.575623'), trigger: 'change' }],
          componentProps: {
            filterable: true,
            placeholder: this.$t('7856f5b5.4ef9f6'),
            options: this.pageSelectOptions
          }
        },
        {
          fieldName: 'sort',
          label: this.$t('7856f5b5.c360e9'),
          component: 'input',
          formItemClass: 'w-full',
          componentProps: {
            type: 'number',
            placeholder: '0'
          }
        }
      ]
    }
  },
  watch: {
    initialValue: {
      deep: true,
      handler() {
        this.syncForm()
      }
    }
  },
  created() {
    this.syncForm()
  },
  methods: {
    /** FormField：component 为函数时传入 ctx（含与 render 同源的 h） */
    renderPagePathSelect(ctx) {
      const { h, value, onInput, props } = ctx
      const {
        options: rawOptions = [],
        filterable = true,
        placeholder = this.$t('7856f5b5.4ef9f6')
      } = props || {}
      const children = (rawOptions || []).map((opt, idx) =>
        h('el-option', {
          key: opt.value != null ? String(opt.value) : `path-${idx}`,
          props: {
            label: opt.label,
            value: opt.value,
            disabled: opt.disabled
          }
        })
      )
      return h(
        'el-select',
        {
          class: 'w-full',
          style: { width: '100%' },
          props: {
            value,
            filterable,
            placeholder,
            popperAppendToBody: true
          },
          on: {
            input: onInput
          }
        },
        children
      )
    },
    validate() {
      return this.$refs.formPlusRef.validate()
    },
    syncForm() {
      const iv = this.initialValue || {}
      let pagePath =
        iv.pagePath != null
          ? String(iv.pagePath).trim()
          : iv.url != null
            ? String(iv.url).trim()
            : ''
      if (!pagePath) {
        pagePath = defaultPresetPath()
      }
      this.form = {
        name: iv.name != null ? iv.name : '',
        pagePath,
        sort: iv.sort != null ? Number(iv.sort) : 0
      }
    },
    handleAction(conf) {
      if (!conf || conf.key === 'close') {
        this.$emit('close', null)
        return
      }
      if (conf.key === 'confirm' || conf.key === 'save') {
        this.submit()
      }
    },
    async submit() {
      this.$emit('loading', true)
      try {
        await this.validate()
        const iv = this.initialValue || {}
        this.$emit('close', {
          id: iv.id,
          name: this.form.name,
          url: this.form.pagePath,
          sort: this.form.sort
        })
      } catch (e) {
        // 校验失败保持弹窗
      } finally {
        this.$emit('loading', false)
      }
    }
  }
}
</script>

<style scoped>
.menu-item-form-sp ::v-deep .el-select {
  width: 100%;
}
</style>
