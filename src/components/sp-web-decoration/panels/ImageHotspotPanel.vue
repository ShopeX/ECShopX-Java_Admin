<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('ca91ced3.5a02fa')">
      <el-input :value="value.title" @input="updateField('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('ca91ced3.f7a82c')">
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
