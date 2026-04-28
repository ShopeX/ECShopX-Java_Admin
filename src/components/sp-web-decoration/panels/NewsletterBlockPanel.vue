<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('fd031e97.a1f8ea')">
      <el-input :value="settings.title" @input="updateField('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('fd031e97.5ee8bf')">
      <el-radio-group :value="settings.alignment" @input="updateField('alignment', $event)">
        <el-radio-button label="left">{{ $t('fd031e97.413f48') }}</el-radio-button>
        <el-radio-button label="center">{{ $t('fd031e97.0bbc2e') }}</el-radio-button>
        <el-radio-button label="right">{{ $t('fd031e97.fd8e95') }}</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item :label="$t('fd031e97.f33ffa')">
      <el-switch :value="settings.enable_social" @input="updateField('enable_social', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
const { normalizeNewsletterBlockSettings } = require('../utils/panelState')

export default {
  name: 'NewsletterBlockPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeNewsletterBlockSettings(this.value)
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
