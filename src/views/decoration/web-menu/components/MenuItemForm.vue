<!--
  菜单项表单 — useDialog 挂载；字段对齐 dev-plan：名称、Url、排序、状态（提交时固定 link_type=url）
-->
<template>
  <SpFormPlus
    ref="formRef"
    v-model="form"
    form-type="form"
    label-width="100px"
    :show-default-actions="false"
    :form-items="formItems"
  />
</template>

<script>
import SpFormPlus from '@/components/sp-form-plus'

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
        url: '',
        sort: 0,
        status: 1
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'name',
          label: '名称',
          component: 'input',
          rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          componentProps: { placeholder: '如：女装', clearable: true }
        },
        {
          fieldName: 'url',
          label: 'Url',
          component: 'input',
          rules: [{ required: true, message: '请输入链接地址', trigger: 'blur' }],
          componentProps: { placeholder: 'https://... 或站内路径', clearable: true }
        },
        {
          fieldName: 'sort',
          label: '排序',
          component: 'input',
          componentProps: { type: 'number', placeholder: '0' }
        },
        {
          fieldName: 'status',
          label: '状态',
          component: 'select',
          componentProps: {
            options: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 }
            ]
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
    syncForm() {
      const iv = this.initialValue || {}
      this.form = {
        name: iv.name != null ? iv.name : '',
        url: iv.url != null ? String(iv.url) : '',
        sort: iv.sort != null ? Number(iv.sort) : 0,
        status: iv.status != null ? Number(iv.status) : 1
      }
    },
    /**
     * finder useDialog 子组件约定
     * @param {{ key: string }} conf
     */
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
        await this.$refs.formRef.validate()
        const iv = this.initialValue || {}
        this.$emit('close', {
          id: iv.id,
          name: this.form.name,
          url: this.form.url,
          sort: this.form.sort,
          status: this.form.status
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
