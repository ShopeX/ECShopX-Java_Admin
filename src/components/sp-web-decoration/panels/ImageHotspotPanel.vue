<template>
  <el-form label-position="top" size="small" class="decoration-panel-form">
    <el-form-item :label="$t('decorationeditor.field.sectionTitle')">
      <el-input :value="value.title" @input="updateField('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('decorationeditor.field.image')">
      <el-input :value="value.imageUrl" @input="updateField('imageUrl', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ImageHotspotPanel',
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
