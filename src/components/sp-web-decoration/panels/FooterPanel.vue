<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('146b63bc.5a02fa')">
      <el-input :value="value.title" @input="updateSetting('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('146b63bc.ebc0c1')">
      <el-input :value="value.copyright" @input="updateSetting('copyright', $event)" />
    </el-form-item>

    <el-form-item :label="$t('146b63bc.4573a7')">
      <el-input :value="value.backgroundColor" @input="updateSetting('backgroundColor', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FooterPanel',
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
