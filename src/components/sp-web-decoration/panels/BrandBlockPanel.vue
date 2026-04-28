<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('e238fb9c.f33ffa')">
      <el-switch :value="settings.enable_social" @input="updateField('enable_social', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
const { normalizeBrandBlockSettings } = require('../utils/panelState')

export default {
  name: 'BrandBlockPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeBrandBlockSettings(this.value)
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
