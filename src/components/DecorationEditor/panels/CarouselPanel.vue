<template>
  <el-form label-position="top" size="small" class="decoration-panel-form">
    <el-form-item :label="$t('decorationeditor.field.sectionTitle')">
      <el-input :value="value.title" @input="updateField('title', $event)" />
    </el-form-item>

    <div class="decoration-editor-inline-fields">
      <el-form-item :label="$t('decorationeditor.field.autoplay')">
        <el-switch :value="value.autoplay" @input="updateField('autoplay', $event)" />
      </el-form-item>

      <el-form-item :label="$t('decorationeditor.field.height')">
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
