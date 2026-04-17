<template>
  <el-form label-position="top" size="small" class="decoration-panel-form">
    <el-form-item :label="$t('decorationeditor.field.label')">
      <el-input :value="value.label" @input="updateField('label', $event)" />
    </el-form-item>

    <div class="decoration-editor-inline-fields">
      <el-form-item :label="$t('decorationeditor.field.x')">
        <el-input-number
          :value="value.x"
          :min="0"
          :max="100"
          controls-position="right"
          @change="updateField('x', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('decorationeditor.field.y')">
        <el-input-number
          :value="value.y"
          :min="0"
          :max="100"
          controls-position="right"
          @change="updateField('y', $event)"
        />
      </el-form-item>
    </div>

    <el-form-item :label="$t('decorationeditor.field.link')">
      <el-input :value="value.link" @input="updateField('link', $event)" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'HotspotBlockPanel',
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
