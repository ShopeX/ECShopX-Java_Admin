<template>
  <el-form label-position="top" size="small" class="decoration-panel-form">
    <el-form-item :label="$t('decorationeditor.field.sectionTitle')">
      <el-input :value="value.title" @input="updateField('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('decorationeditor.field.sourceMode')">
      <el-select :value="value.sourceMode" @input="updateField('sourceMode', $event)">
        <el-option :label="$t('decorationeditor.field.manual')" value="manual" />
        <el-option :label="$t('decorationeditor.field.category')" value="category" />
      </el-select>
    </el-form-item>

    <el-form-item
      v-if="value.sourceMode === 'category'"
      :label="$t('decorationeditor.field.categoryId')"
    >
      <el-input :value="value.categoryId" @input="updateField('categoryId', $event)" />
    </el-form-item>

    <el-form-item v-else :label="$t('decorationeditor.field.itemIds')">
      <el-input
        type="textarea"
        :rows="4"
        :value="itemIdsText"
        :placeholder="$t('decorationeditor.placeholder.itemIds')"
        @input="updateItemIds"
      />
    </el-form-item>

    <div class="decoration-editor-inline-fields">
      <el-form-item :label="$t('decorationeditor.field.columns')">
        <el-input-number
          :value="value.columns"
          :min="2"
          :max="6"
          controls-position="right"
          @change="updateField('columns', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('decorationeditor.field.limit')">
        <el-input-number
          :value="value.limit"
          :min="1"
          :max="50"
          controls-position="right"
          @change="updateField('limit', $event)"
        />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'ProductShelfPanel',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    itemIdsText() {
      return Array.isArray(this.value.itemIds) ? this.value.itemIds.join(',') : ''
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    },
    updateItemIds(fieldValue) {
      const itemIds = fieldValue
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
      this.updateField('itemIds', itemIds)
    }
  }
}
</script>
