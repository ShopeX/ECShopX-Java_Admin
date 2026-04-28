<template>
  <el-form label-position="top" size="small" class="space-y-3">
    <el-form-item :label="$t('6c727f2c.5a02fa')">
      <el-input :value="value.title" @input="updateField('title', $event)" />
    </el-form-item>

    <el-form-item :label="$t('6c727f2c.f0c7e9')">
      <el-select :value="value.sourceMode" @input="updateField('sourceMode', $event)">
        <el-option :label="$t('6c727f2c.68924b')" value="manual" />
        <el-option :label="$t('6c727f2c.d282eb')" value="category" />
      </el-select>
    </el-form-item>

    <el-form-item v-if="value.sourceMode === 'category'" :label="$t('6c727f2c.ae8c70')">
      <el-input :value="value.categoryId" @input="updateField('categoryId', $event)" />
    </el-form-item>

    <el-form-item v-else :label="$t('6c727f2c.9a6484')">
      <el-input
        type="textarea"
        :rows="4"
        :value="itemIdsText"
        :placeholder="$t('6c727f2c.d08db5')"
        @input="updateItemIds"
      />
    </el-form-item>

    <div class="grid grid-cols-2 gap-3">
      <el-form-item :label="$t('6c727f2c.eb22d4')">
        <el-input-number
          :value="value.columns"
          :min="2"
          :max="6"
          controls-position="right"
          @change="updateField('columns', $event)"
        />
      </el-form-item>

      <el-form-item :label="$t('6c727f2c.d57936')">
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
