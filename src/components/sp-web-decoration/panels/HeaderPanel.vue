<template>
  <div class="space-y-3 text-[#18222f]">
    <div class="text-sm font-semibold">菜单</div>

    <div class="space-y-2">
      <div class="text-xs text-[#6b7785]">菜单</div>

      <div class="flex items-center gap-2 rounded-lg border border-[#dfe3ea] bg-white p-3">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f5f5f6]">
          <MenuIcon :size="18" :stroke-width="2" />
        </div>
        <div class="min-w-0 flex-1 truncate text-[13px]">
          {{ currentMenuLabel }}
        </div>
        <el-button type="text" class="!p-1 !text-[#7c8492]" @click="clearMenu">
          <Trash2 :size="16" :stroke-width="2" />
        </el-button>
      </div>

      <div>
        <el-button
          class="!h-9 !w-full !rounded-md !border-0 !bg-[#f5f5f6] !text-[13px] !text-[#18222f]"
          @click="openMenuPicker"
        >
          更改
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Menu as MenuIcon, Trash2 } from 'lucide-vue'
import SpWebNavPickerDialog from '@/components/sp-web-nav-picker/PickerDialog.vue'
import { normalizeHeaderSettings } from '../utils/panelState.js'

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
    Trash2
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeHeaderSettings(this.value)
    },
    currentMenuLabel() {
      const menu = normalizeSelectedMenu(this.settings.menu)
      return menu?.name || '未选择菜单'
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
      const selected = await this.$dialog.open(SpWebNavPickerDialog, {
        title: '选择导航菜单',
        props: {
          initialSelected: normalizeSelectedMenu(this.settings.menu)
        },
        size: 'medium'
      })
      if (!selected) return
      this.updateSetting('menu', selected)
    }
  }
}
</script>
