<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('5987e78b.5a02fa')">
      <el-input :value="value.title" @input="updateField('title', $event)" />
    </el-form-item>

    <div class="grid grid-cols-2 gap-3">
      <el-form-item :label="$t('5987e78b.54c6bb')">
        <el-switch :value="value.autoplay" @input="updateField('autoplay', $event)" />
      </el-form-item>

      <el-form-item :label="$t('5987e78b.f70f79')">
        <el-input-number
          :value="value.height"
          :min="120"
          :max="960"
          :step="10"
          controls-position="right"
          @change="updateField('height', $event)"
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'CarouselPanel',
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
