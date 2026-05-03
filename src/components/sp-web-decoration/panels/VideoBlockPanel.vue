<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('decorationeditor.field.videoUrl')">
      <el-input :value="value.videoUrl" @input="updateField('videoUrl', $event)" />
    </el-form-item>

    <el-form-item :label="$t('decorationeditor.field.videoPoster')">
      <el-input :value="value.posterUrl" @input="updateField('posterUrl', $event)" />
    </el-form-item>

    <el-form-item :label="$t('94f92572.dec2eb')">
      <el-input :value="value.link" @input="updateField('link', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'VideoBlockPanel',
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
