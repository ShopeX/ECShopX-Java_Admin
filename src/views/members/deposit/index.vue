<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <SpTabs :tab-list="tabList" v-model="activeTab" @change="handleTabChange" />
    <keep-alive>
      <component :is="activePanel" />
    </keep-alive>
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
      activeTab: TAB_SETTINGS
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
    }
  },
  methods: {
    handleTabChange(name) {
      this.activeTab = name
    }
  }
}
</script>
