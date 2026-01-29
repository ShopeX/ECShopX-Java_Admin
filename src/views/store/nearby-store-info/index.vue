<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage title="附近门店信息">
    <SpFormPlus
      ref="nearbyStoreForm"
      form-type="normalForm"
      v-model="formData"
      :form-items="formItems"
      label-width="120px"
      @submit="handleSubmit"
    />
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        background_url: ''
      },
      formItems: [
        {
          label: '附近门店背景图',
          component: 'imagepicker',
          fieldName: 'background_url',
          rules: [
            {
              required: true,
              message: '请上传附近门店背景图'
            }
          ]
        }
      ]
    }
  },
  async mounted() {
    try {
      const res = await this.$api.store.getNearbyStoreBackground()
      if (res && res.background_url) {
        this.formData.background_url = res.background_url
      }
    } catch (error) {
      console.error('获取附近门店背景图失败:', error)
    }
  },
  methods: {
    async handleSubmit(formData) {
      try {
        await this.$api.store.saveNearbyStoreBackground({
          background_url: formData.background_url
        })
        this.$message.success('保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
