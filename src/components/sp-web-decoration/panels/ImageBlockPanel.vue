<template>
  <el-form label-position="top" size="small" class="decoration-panel-form">
    <el-form-item :label="$t('decorationeditor.field.image')">
      <el-input :value="value.imageUrl" @input="updateField('imageUrl', $event)" />
    </el-form-item>

    <el-form-item :label="$t('decorationeditor.field.link')">
      <el-input :value="value.link" @input="updateField('link', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ImageBlockPanel',
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
