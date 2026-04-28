<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('9eb4229d.5a02fa')">
      <el-input :value="value.title" @input="updateSetting('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('9eb4229d.81a374')">
      <el-input :value="value.logoUrl" @input="updateSetting('logoUrl', $event)" />
    </el-form-item>

    <el-form-item :label="$t('9eb4229d.4573a7')">
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
