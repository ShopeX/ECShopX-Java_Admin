<template>
  <section class="display-settings">
    <div class="settings-header">
      <div class="flex items-center gap-2">
        <span class="font-medium">{{ $t('recommendRules.displaySettings') }}</span>
        <span class="text-sm font-normal text-[#909399]">{{
          $t('recommendRules.displaySettingsHint')
        }}</span>
      </div>
      <el-button type="primary" size="small" :loading="saving" @click="save">
        {{ $t('recommendRules.saveSettings') }}
      </el-button>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <div v-loading="loading" class="settings-grid">
      <div v-for="scene in scenes" :key="scene.key" class="scene-card">
        <div class="scene-head">
          <span class="font-medium">{{ scene.label }}</span>
          <el-switch v-model="settings[scene.enabled]" @change="dirty = true" />
        </div>
        <div class="scene-field">
          <span>{{ $t('recommendRules.displayLimit') }}</span
          ><el-input-number
            v-model="settings[scene.limit]"
            :min="1"
            :max="50"
            :step="1"
            controls-position="right"
            @change="dirty = true"
          />
        </div>
        <div class="scene-field">
          <span>{{ $t('recommendRules.sorting') }}</span
          ><el-radio-group v-model="settings[scene.sort]" @change="dirty = true"
            ><el-radio label="sales_desc">{{ $t('recommendRules.salesDesc') }}</el-radio
            ><el-radio label="price_asc">{{
              $t('recommendRules.priceAsc')
            }}</el-radio></el-radio-group
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const sceneDefinitions = [
  { key: 'detail', enabled: 'detail_enabled', limit: 'detail_limit', sort: 'detail_sort' },
  { key: 'cart', enabled: 'cart_enabled', limit: 'cart_limit', sort: 'cart_sort' },
  { key: 'checkout', enabled: 'checkout_enabled', limit: 'checkout_limit', sort: 'checkout_sort' },
  {
    key: 'orderDetail',
    enabled: 'order_detail_enabled',
    limit: 'order_detail_limit',
    sort: 'order_detail_sort'
  }
]

function createDefaultSettings() {
  return sceneDefinitions.reduce((settings, scene) => {
    settings[scene.enabled] = false
    settings[scene.limit] = 6
    settings[scene.sort] = 'sales_desc'
    return settings
  }, {})
}

function normalizeSettings(value = {}) {
  const settings = createDefaultSettings()
  sceneDefinitions.forEach((scene) => {
    settings[scene.enabled] = Number(value[scene.enabled]) === 1
    if (value[scene.limit] !== undefined && value[scene.limit] !== null) {
      settings[scene.limit] = Number(value[scene.limit])
    }
    if (value[scene.sort]) {
      settings[scene.sort] = value[scene.sort]
    }
  })
  return settings
}

export default {
  name: 'DisplaySettings',
  components: {},
  data() {
    return {
      scenes: sceneDefinitions.map((scene) => ({
        ...scene,
        label: this.$t(`recommendRules.scene.${scene.key}`)
      })),
      settings: createDefaultSettings(),
      loading: false,
      saving: false,
      errorMessage: '',
      dirty: false
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      this.errorMessage = ''
      try {
        const data = await this.$api.recommendRules.getRecommendDisplaySettings()
        this.settings = normalizeSettings(data)
        this.dirty = false
      } catch (error) {
        this.errorMessage = error?.msg || this.$t('recommendRules.loadSettingsFailed')
      } finally {
        this.loading = false
      }
    },
    validate() {
      for (const scene of sceneDefinitions) {
        if (!this.settings[scene.enabled]) continue
        const limit = this.settings[scene.limit]
        if (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 50) {
          this.errorMessage = this.$t('recommendRules.invalidDisplayLimit')
          return false
        }
        if (!['sales_desc', 'price_asc'].includes(this.settings[scene.sort])) {
          this.errorMessage = this.$t('recommendRules.invalidSorting')
          return false
        }
      }
      return true
    },
    toPayload() {
      return sceneDefinitions.reduce((payload, scene) => {
        payload[scene.enabled] = this.settings[scene.enabled] ? 1 : 0
        payload[scene.limit] = Number(this.settings[scene.limit])
        payload[scene.sort] = this.settings[scene.sort]
        return payload
      }, {})
    },
    async save() {
      this.errorMessage = ''
      if (!this.validate()) return
      this.saving = true
      try {
        await this.$api.recommendRules.saveRecommendDisplaySettings(this.toPayload())
        this.$message.success(this.$t('recommendRules.settingsSaved'))
        this.dirty = false
        this.$emit('saved', this.settings)
      } catch (error) {
        this.errorMessage = error?.msg || this.$t('recommendRules.saveSettingsFailed')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.display-settings {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #faf9fc;

  .scene-card {
    min-height: 126px;
    padding: 14px 16px;
    background: #fff;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .scene-head {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    align-items: center;
    column-gap: 16px;
    margin-bottom: 16px;
  }
  .scene-field {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    align-items: center;
    column-gap: 16px;
    margin-top: 12px;
  }
  .scene-field > span {
    width: 72px;
    flex: 0 0 72px;
    color: #606266;
  }
  .scene-field .el-input-number {
    width: 120px;
    flex: 0 0 120px;
  }
  .scene-field .el-radio-group {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 32px;
  }
  .scene-field .el-radio {
    display: inline-flex;
    margin: 0;
  }

  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 16px;
  }
  .settings-header .font-medium {
    font-size: 16px;
    font-weight: 600;
  }

  .error-message {
    margin: 8px 0;
    color: #f56c6c;
  }

  @media (max-width: 900px) {
    .settings-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
