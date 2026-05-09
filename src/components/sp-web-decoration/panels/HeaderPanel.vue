<template>
  <div class="space-y-3">
    <div class="text-sm font-semibold leading-5 text-[#18222f]">菜单</div>

    <div class="space-y-2.5">
      <div class="text-xs leading-5 text-[#6b7785]">菜单</div>

      <div
        class="flex min-h-[58px] items-center gap-2.5 rounded-lg border border-solid border-[#dfe3ea] bg-white px-3 py-2 transition-colors hover:border-[#cfd6e3]"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-solid border-[#e6e9ef] bg-[#fbfbfc] text-[#606266]"
        >
          <MenuIcon :size="18" :stroke-width="2" />
        </div>
        <div class="min-w-0 flex-1 truncate text-[13px] font-semibold leading-5 text-[#18222f]">
          {{ currentMenuLabel }}
        </div>
        <el-button type="text" class="!p-1 text-[#7c8492] hover:!text-[#7c3aed]" @click="clearMenu">
          <Trash2 :size="16" :stroke-width="2" />
        </el-button>
      </div>

      <div class="grid grid-cols-[minmax(0,1fr)_42px] gap-2.5">
        <el-button
          class="!h-8 !rounded-lg !border-0 !bg-[#f5f5f6] !text-[13px] !font-semibold !text-[#18222f] hover:!bg-[#eceef2]"
          @click="openMenuPicker"
        >
          更改
        </el-button>
        <el-button
          class="!m-0 !h-8 !rounded-lg !border-0 !bg-[#f5f5f6] !px-0 hover:!bg-[#eceef2]"
          @click="openMenuMore"
        >
          <MoreHorizontal :size="18" :stroke-width="2.4" class="text-[#18222f]" />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Menu as MenuIcon, MoreHorizontal, Trash2 } from 'lucide-vue'
import { normalizeHeaderSettings } from '../utils/panelState.js'

const MENU_LABEL_MAP = {
  'main-menu': 'Company'
}

export default {
  name: 'HeaderPanel',
  components: {
    MenuIcon,
    MoreHorizontal,
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
      const menu = String(this.settings.menu || '').trim()
      if (!menu) return '未选择菜单'
      return MENU_LABEL_MAP[menu] || menu
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
    openMenuPicker() {
      this.updateSetting('menu', this.settings.menu || 'main-menu')
    },
    openMenuMore() {
      this.$message?.info?.('菜单更多操作待接入')
    }
  }
}
</script>
