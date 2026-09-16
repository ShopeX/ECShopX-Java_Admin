<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="grid grid-cols-2 gap-4 items-start max-lg:grid-cols-1 p-1">
      <DailyPointsPanel />
      <ActivityListPanel />
    </div>
  </SpPage>
</template>

<script>
import DailyPointsPanel from './components/DailyPointsPanel.vue'
import ActivityListPanel from './components/ActivityListPanel.vue'

export default {
  name: 'MemberSigninAdmin',
  components: { DailyPointsPanel, ActivityListPanel }
}
</script>
