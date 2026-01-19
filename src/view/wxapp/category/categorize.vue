<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.categorize {
  margin-bottom: 24px;
}

.btn-save {
  width: 200px;
  border-radius: 60px;
}
</style>

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <div class="categorize">
      分类样式：
      <el-radio-group v-model="classify">
        <el-radio v-if="VERSION_PLATFORM()" :label="true">直接加购</el-radio>
        <el-radio :label="false">平铺</el-radio>
      </el-radio-group>
    </div>
    <div v-if="!classify">
      是否开启自定义分类：
      <el-switch v-model="addCar" active-color="#13ce66" inactive-color="#ff4949" />
    </div>

    <addCartas v-if="classify" />
    <index v-if="!classify && addCar" ref="indexTile" />
    <div
      v-if="(!classify && !addCar) || classify"
      class="section-footer flex justify-start ml-[100px] mt-[20px]"
    >
      <el-button type="primary" @click="saveConfig"> 保存 </el-button>
    </div>
  </SpPage>
</template>

<script>
import addCartas from './addCartas.vue'
import index from './index.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    addCartas,
    index
  },
  data() {
    return {
      addCar: true,
      classify: this.VERSION_PLATFORM(),
      originalData: [] // 保存接口返回的原始数据
    }
  },
  computed: {
    ...mapGetters(['template_name'])
  },
  mounted() {
    this.feath()
  },
  methods: {
    async feath() {
      let filter = { template_name: this.template_name, version: 'v1.0.1', page_name: 'category' }
      const res = await this.$api.wxa.getParamByTempName(filter)
      if (res.list[0] && res.list[0].params) {
        const params = res.list[0].params
        if (typeof params.addCar == 'boolean') {
          this.addCar = params.addCar
          this.classify = params.classify
        }
        // 保存接口返回的原始数据
        if (params.data && params.data.length > 0) {
          this.originalData = params.data
        }
      }
    },
    async saveConfig() {
      if (!this.classify && this.addCar) {
        //平铺开启自定义分类
        this.$refs.indexTile.saveConfig()
      } else {
        const dataToSave = !this.classify && this.originalData.length > 0 ? this.originalData : []
        let param = {
          template_name: this.template_name,
          config: JSON.stringify([
            {
              name: 'base',
              hasSeries: false,
              data: dataToSave,
              is_open: true,
              addCar: this.addCar,
              classify: this.classify
            }
          ]),
          page_name: 'category'
        }
        await this.$api.wxa.savePageParams(param)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }
    }
  }
}
</script>
