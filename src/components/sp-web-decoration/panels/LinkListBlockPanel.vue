<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('da28747f.b8011f')">
      <el-input :value="settings.heading" @input="updateField('heading', $event)" />
    </el-form-item>

    <el-form-item :label="$t('da28747f.7b14eb')">
      <el-input :value="settings.menu" @input="updateField('menu', $event)" />
    </el-form-item>

    <el-form-item :label="$t('da28747f.37ea7c')">
      <el-radio-group :value="settings.alignment" @input="updateField('alignment', $event)">
        <el-radio-button label="left">{{ $t('da28747f.413f48') }}</el-radio-button>
        <el-radio-button label="center">{{ $t('da28747f.0bbc2e') }}</el-radio-button>
        <el-radio-button label="right">{{ $t('da28747f.fd8e95') }}</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
const { normalizeLinkListBlockSettings } = require('../utils/panelState')

export default {
  name: 'LinkListBlockPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeLinkListBlockSettings(this.value)
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
