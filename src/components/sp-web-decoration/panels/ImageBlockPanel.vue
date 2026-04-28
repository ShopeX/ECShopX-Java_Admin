<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('94f92572.f7a82c')">
      <el-input :value="value.imageUrl" @input="updateField('imageUrl', $event)" />
    </el-form-item>

    <el-form-item :label="$t('94f92572.dec2eb')">
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
