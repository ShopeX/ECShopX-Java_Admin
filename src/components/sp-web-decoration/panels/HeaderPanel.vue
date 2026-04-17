<template>
  <el-form label-position="top" size="small" class="decoration-panel-form">
    <el-form-item :label="$t('decorationeditor.field.sectionTitle')">
      <el-input :value="value.title" @input="updateSetting('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('decorationeditor.field.logoUrl')">
      <el-input :value="value.logoUrl" @input="updateSetting('logoUrl', $event)" />
    </el-form-item>

    <el-form-item :label="$t('decorationeditor.field.backgroundColor')">
      <el-input :value="value.backgroundColor" @input="updateSetting('backgroundColor', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'HeaderPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    updateSetting(field, value) {
      this.$emit('change', {
        [field]: value
      })
    }
  }
}
</script>
