<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex items-center px-4 py-3.5 rounded bg-[#f5f7fa] text-sm">
    <span class="font-medium text-[#303133]">{{ account.name }}</span>
    <span class="ml-2 text-[#606266]">
      {{ account.employee_no }} · {{ shopPrefix }}{{ account.shop_name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'EmployeeInfoCard',
  props: {
    account: {
      type: Object,
      default: () => ({})
    },
    shopPrefix: {
      type: String,
      default: ''
    }
  }
}
</script>
