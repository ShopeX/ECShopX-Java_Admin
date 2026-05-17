<template>
  <div class="space-y-5 text-foreground">
    <div class="space-y-2">
      <div class="text-sm text-muted-foreground">菜单</div>

      <div class="rounded-lg border border-border bg-background p-3">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground"
          >
            <MenuIcon :size="16" :stroke-width="1.8" />
          </div>
          <div class="min-w-0 flex-1 truncate text-sm text-foreground">
            {{ currentMenuLabel }}
          </div>
          <button
            v-if="hasSelectedMenu"
            type="button"
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground hover:bg-muted hover:text-destructive"
            @click="clearMenu"
          >
            <Trash2 :size="14" :stroke-width="1.8" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-8 flex-1 rounded-lg border-0 bg-muted px-3 text-sm font-medium text-foreground hover:bg-muted/80"
          @click="openMenuPicker"
        >
          更改
        </button>
      </div>
    </div>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">LOGO位置</div>
      <el-radio-group
        :value="settings.logo_position"
        size="small"
        @input="updateSetting('logo_position', $event)"
      >
        <el-radio-button label="left">居左</el-radio-button>
        <el-radio-button label="center">居中</el-radio-button>
      </el-radio-group>
    </section>

    <SectionAppearancePanel :value="settings" @change="updateSetting" />
  </div>
</template>

<script>
import { Menu as MenuIcon, Trash2 } from 'lucide-vue'
import WebNavPicker from '@/components/sp-picker-plus/WebNavPicker.vue'
import SectionAppearancePanel from './SectionAppearancePanel.vue'
import { normalizeTypedSectionSettings } from '../utils/panelState.js'

const MENU_LABEL_MAP = {
  'main-menu': 'Company'
}

function normalizeSelectedMenu(menu) {
  if (!menu) return null
  if (typeof menu === 'object') return menu
  const key = String(menu).trim()
  if (!key) return null
  return {
    id: key,
    key,
    name: MENU_LABEL_MAP[key] || key
  }
}

export default {
  name: 'HeaderPanel',
  components: {
    MenuIcon,
    Trash2,
    SectionAppearancePanel
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeTypedSectionSettings('header', this.value)
    },
    currentMenuLabel() {
      const menu = normalizeSelectedMenu(this.settings.menu)
      return menu?.name || '未选择菜单'
    },
    hasSelectedMenu() {
      return Boolean(normalizeSelectedMenu(this.settings.menu))
    }
  },
  methods: {
    updateSetting(field, value) {
      this.$emit('change', {
        [field]: value
      })
    },
    clearMenu() {
      this.updateSetting('menu', '')
    },
    async openMenuPicker() {
      const selected = await this.$dialog.open(WebNavPicker, {
        title: '选择导航菜单',
        props: {
          initialSelected: normalizeSelectedMenu(this.settings.menu)
        },
        width: '760px'
      })
      if (!selected) return
      this.updateSetting('menu', selected)
    }
  }
}
</script>
