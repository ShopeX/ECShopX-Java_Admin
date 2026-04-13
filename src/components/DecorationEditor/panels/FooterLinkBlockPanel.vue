<template>
  <el-form label-position="top" size="small" class="decoration-panel-form">
    <el-form-item :label="$t('decorationeditor.field.label')">
      <el-input :value="value.label" @input="updateField('label', $event)" />
    </el-form-item>

    <el-form-item :label="$t('decorationeditor.field.link')">
      <el-input :value="value.url" @input="updateField('url', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FooterLinkBlockPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    }
  }
}
</script>
