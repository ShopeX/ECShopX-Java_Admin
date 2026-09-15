<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <div class="min-h-[calc(100vh-160px)]">
      <div class="flex border-b-2 border-[#e4e7ed] mb-4" role="tablist">
        <button
          v-for="tab in tabList"
          :key="tab.name"
          type="button"
          role="tab"
          class="min-w-0 border-0 bg-transparent text-[#303133] py-[9px] px-5 first:pl-0 font-medium text-sm leading-[22px] cursor-pointer border-b-2 -mb-0.5 transition-colors hover:text-[var(--primary)] max-md:whitespace-nowrap max-md:px-3.5"
          :class="
            activeTab === tab.name
              ? 'text-[var(--primary)] border-b-[var(--primary)]'
              : 'border-b-transparent'
          "
          @click="handleTabChange(tab.name)"
        >
          {{ tab.label }}
        </button>
      </div>
      <keep-alive>
        <component :is="activePanel" ref="activePanelRef" />
      </keep-alive>

      <el-dialog
        :title="$t('ecx9887.unsaved.title')"
        :visible.sync="unsavedDialogVisible"
        width="420px"
        :show-close="false"
        :close-on-click-modal="false"
        append-to-body
      >
        <p class="text-[#6b7280] text-[13px] leading-normal">{{ $t('ecx9887.unsaved.message') }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onContinueEdit">{{ $t('ecx9887.unsaved.continueEdit') }}</el-button>
          <el-button type="primary" @click="onDiscardChanges">{{ $t('ecx9887.unsaved.discard') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </SpPage>
</template>

<script>
import MemberDepositSettings from './settings.vue'
import MemberDepositFlows from './flows.vue'
import MemberDepositAgreement from './agreement.vue'

const TAB_SETTINGS = 'settings'
const TAB_FLOWS = 'flows'
const TAB_AGREEMENT = 'agreement'

export default {
  name: 'MemberDepositIndex',
  components: {
    MemberDepositSettings,
    MemberDepositFlows,
    MemberDepositAgreement
  },
  data() {
    return {
      activeTab: TAB_SETTINGS,
      pendingTab: null,
      pendingRouteNext: null,
      unsavedDialogVisible: false,
      allowLeave: false
    }
  },
  computed: {
    tabList() {
      return [
        { label: this.$t('ecx9887.tab.settings'), name: TAB_SETTINGS },
        { label: this.$t('ecx9887.tab.flows'), name: TAB_FLOWS },
        { label: this.$t('ecx9887.tab.agreement'), name: TAB_AGREEMENT }
      ]
    },
    activePanel() {
      if (this.activeTab === TAB_FLOWS) {
        return MemberDepositFlows
      }
      if (this.activeTab === TAB_AGREEMENT) {
        return MemberDepositAgreement
      }
      return MemberDepositSettings
    },
    guardableTabs() {
      return [TAB_SETTINGS, TAB_AGREEMENT]
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.onBeforeUnload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeUnload)
  },
  beforeRouteLeave(to, from, next) {
    if (this.allowLeave || !this.activePanelHasUnsaved()) {
      next()
      return
    }
    this.pendingRouteNext = next
    this.pendingTab = null
    this.unsavedDialogVisible = true
    next(false)
  },
  methods: {
    onBeforeUnload(event) {
      if (this.activePanelHasUnsaved()) {
        event.preventDefault()
        event.returnValue = ''
      }
    },
    activePanelHasUnsaved() {
      if (!this.guardableTabs.includes(this.activeTab)) {
        return false
      }
      const panel = this.$refs.activePanelRef
      return panel && typeof panel.hasUnsavedChanges === 'function' && panel.hasUnsavedChanges()
    },
    revertActivePanel() {
      const panel = this.$refs.activePanelRef
      if (panel && typeof panel.revertToSaved === 'function') {
        panel.revertToSaved()
      }
    },
    handleTabChange(name) {
      if (name === this.activeTab) {
        return
      }
      if (this.guardableTabs.includes(this.activeTab) && this.activePanelHasUnsaved()) {
        this.pendingTab = name
        this.pendingRouteNext = null
        this.unsavedDialogVisible = true
        return
      }
      this.switchToTab(name)
    },
    switchToTab(name) {
      this.activeTab = name
    },
    onContinueEdit() {
      this.unsavedDialogVisible = false
      this.pendingTab = null
      if (this.pendingRouteNext) {
        this.pendingRouteNext(false)
        this.pendingRouteNext = null
      }
    },
    onDiscardChanges() {
      this.unsavedDialogVisible = false
      this.revertActivePanel()
      if (this.pendingTab) {
        this.switchToTab(this.pendingTab)
        this.pendingTab = null
      }
      if (this.pendingRouteNext) {
        this.allowLeave = true
        this.pendingRouteNext()
        this.pendingRouteNext = null
        this.$nextTick(() => {
          this.allowLeave = false
        })
      }
    }
  }
}
</script>
