<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" src="./index.scss"></style>
<template>
  <div class="page-decorate-index">
    <div class="decorate-hd">
      <div class="hd-lf">{{ localTitle }}</div>
      <div class="hd-rg">
        <el-button v-if="mode == 'page'" plain @click="onExit"> 后退 </el-button>
        <el-button v-if="mode == 'dialog'" plain @click="onClose"> 关闭 </el-button>
        <el-button plain @click="onSaveTemplate"> 保存 </el-button>
      </div>
    </div>
    <div class="decorate-bd">
      <div class="left-container">
        <div class="wgts-categories">
          <!-- 通用挂件 -->
          <div v-if="widgetCategories.general.length > 0" class="wgt-category">
            <div class="category-title">通用挂件</div>
            <draggable
              class="wgts-view"
              :chosen-class="'wgts-chosen'"
              :list="widgetCategories.general"
              :group="{
                name: 'easyview',
                pull: 'clone',
                put: false
              }"
              :sort="false"
              :clone="cloneDefaultField"
            >
              <div
                v-for="(wgt, index) in widgetCategories.general"
                :key="`wgt-general__${index}`"
                class="wgt-item"
                :data-name="wgt.name"
              >
                <div :class="['wgt-icon', wgt.wgtIcon]" />
                <div class="wgt-name">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-placeholder">
                  <div class="placholder-txt">放置区域</div>
                </div>
              </div>
            </draggable>
          </div>

          <!-- 功能挂件 -->
          <div v-if="widgetCategories.functional.length > 0" class="wgt-category">
            <div class="category-title">功能挂件</div>
            <draggable
              class="wgts-view"
              :chosen-class="'wgts-chosen'"
              :list="widgetCategories.functional"
              :group="{
                name: 'easyview',
                pull: 'clone',
                put: false
              }"
              :sort="false"
              :clone="cloneDefaultField"
            >
              <div
                v-for="(wgt, index) in widgetCategories.functional"
                :key="`wgt-functional__${index}`"
                class="wgt-item"
                :data-name="wgt.name"
              >
                <div :class="['wgt-icon', wgt.wgtIcon]" />
                <div class="wgt-name">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-placeholder">
                  <div class="placholder-txt">放置区域</div>
                </div>
              </div>
            </draggable>
          </div>

          <!-- 商品挂件 -->
          <div v-if="widgetCategories.goods.length > 0" class="wgt-category">
            <div class="category-title">商品挂件</div>
            <draggable
              class="wgts-view"
              :chosen-class="'wgts-chosen'"
              :list="widgetCategories.goods"
              :group="{
                name: 'easyview',
                pull: 'clone',
                put: false
              }"
              :sort="false"
              :clone="cloneDefaultField"
            >
              <div
                v-for="(wgt, index) in widgetCategories.goods"
                :key="`wgt-goods__${index}`"
                class="wgt-item"
                :data-name="wgt.name"
              >
                <div :class="['wgt-icon', wgt.wgtIcon]" />
                <div class="wgt-name">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-placeholder">
                  <div class="placholder-txt">放置区域</div>
                </div>
              </div>
            </draggable>
          </div>

          <!-- 专用挂件 -->
          <div v-if="widgetCategories.dedicated.length > 0" class="wgt-category">
            <div class="category-title">专用挂件</div>
            <draggable
              class="wgts-view"
              :chosen-class="'wgts-chosen'"
              :list="widgetCategories.dedicated"
              :group="{
                name: 'easyview',
                pull: 'clone',
                put: false
              }"
              :sort="false"
              :clone="cloneDefaultField"
            >
              <div
                v-for="(wgt, index) in widgetCategories.dedicated"
                :key="`wgt-dedicated__${index}`"
                class="wgt-item"
                :data-name="wgt.name"
              >
                <div :class="['wgt-icon', wgt.wgtIcon]" />
                <div class="wgt-name">
                  {{ wgt.wgtName }}
                </div>
                <div class="wgt-placeholder">
                  <div class="placholder-txt">放置区域</div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="center-container">
        <!-- {{ contentComps }} -->
        <!-- {{ headerData }} -->
        <div class="weapp-template">
          <Header v-if="headerVisible" :value="headerData" @change="handleClickHeader" />
          <div class="weapp-body" :style="weappBodyStyle">
            <draggable 
              :list="contentComps" 
              group="easyview" 
              class="components-design-wrap"
              :move="onDragMove"
              @add="onDragAdd"
            >
              <div
                v-for="(wgt, index) in contentComps"
                :key="`wgt-render-item__${index}`"
                class="wgt-render-item"
                :class="{ active: activeCompIndex == index }"
                @click="handleClickWgtItem(index)"
              >
                <div class="wgt-tip">
                  {{ wgt.wgtName }}
                </div>
                <div
                  class="wgt-tools flex flex-col gap-1"
                  :class="{ active: activeCompIndex == index }"
                >
                  <SpIcon name="copy" @click="onCopyComp(index, wgt)" />
                  <SpIcon name="delete" @click="onDeleteComp(index)" />
                </div>
                <component :is="wgt.name" :value="wgt" />
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div v-if="activeCompIndex !== null && contentComps[activeCompIndex] && hackReset">
          <div class="wgt-name">
            {{ getComponentAttr(contentComps[activeCompIndex]).wgtName }}
          </div>
          <attrPanel
            v-model="contentComps[activeCompIndex]"
            :class="`wgt-attr-${contentComps[activeCompIndex].name}`"
            :info="getComponentAttr(contentComps[activeCompIndex])"
          />
        </div>
        <div v-if="activeCompIndex == null && hackReset && headerAttr">
          <div class="wgt-name">{{ headerAttr.wgtName }}</div>
          <attrPanel v-model="headerData" :info="headerAttr" />
        </div>
      </div>
    </div>

    <el-backtop target=".center-container" :right="420" />
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import store from '@/store'
import { hex2rgb } from '@/utils'
import gWgts from './wgts'
import attrPanel from './attr_panel'
import Header from './wgts/wgt-page'
export default {
  components: {
    draggable,
    attrPanel,
    Header
  },
  async beforeRouteLeave(to, from, next) {
    next()
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'page' // page || dialog
    },
    scene: {
      type: String,
      default: '1001'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localScene: '1001',
      localTitle: '',
      widgets: [],
      contentComps: [],
      activeComp: null,
      activeCompIndex: null,
      hackReset: true,
      headerData: null,
      headerAttr: null
    }
  },
  computed: {
    weappBodyStyle() {
      const { newPageBackgroundStyle } = this.headerData || {}
      return {
        'background-color': newPageBackgroundStyle?.color,
        'background-image': `url(${newPageBackgroundStyle?.image})`,
        'background-size': 'cover',
        'background-position': 'center'
      }
    },
    headerVisible() {
      if (this.mode == 'page' && this.scene == '1001') {
        return true
      } else {
        return false
      }
    },
    widgetCategories() {
      // 通用挂件：轮播、热区图、视频、文字轮播
      const generalNames = ['Slider', 'ImgHotzone', 'Film', 'Marquees']
      // 功能挂件：店铺、优惠券
      const functionalNames = ['Store', 'Coupon', 'StoreAlphabet']
      // 商品挂件：秒杀、拼团、热销榜单、品类榜单、商品
      const goodsNames = ['Speedkill', 'Group', 'hotranking', 'Ranking', 'goods']
      // 专用挂件：订单导航
      const dedicatedNames = ['OrderNavigation']

      const categories = {
        general: [],
        functional: [],
        goods: [],
        dedicated: []
      }

      // 显示所有挂件，不进行过滤
      this.widgets.forEach((wgt) => {
        const name = wgt.name
        if (generalNames.includes(name)) {
          categories.general.push(wgt)
        } else if (functionalNames.includes(name)) {
          categories.functional.push(wgt)
        } else if (goodsNames.includes(name)) {
          categories.goods.push(wgt)
        } else if (dedicatedNames.includes(name)) {
          categories.dedicated.push(wgt)
        } else {
          // 未分类的组件默认放到通用挂件
          categories.general.push(wgt)
        }
      })

      return categories
    }
  },
  created() {
    const { mode } = this
    if (mode == 'page') {
      const { scene = '1001' } = this.$route.query
      this.localScene = scene

      const _title = {
        1001: '商城装修',
        1002: '商品详情',
        1003: '店铺装修',
        1004: '自定义页装修',
        1006: '分类模版装修',
        1008: '个人中心模版装修',
        1009: '导购模板装修'
      }
      this.localTitle = _title[scene]
    } else {
      this.localScene = this.scene
      this.localTitle = this.title
      this.contentComps = this.value
    }
    this.regsiterWgts()
    if (this.mode == 'page') {
      this.getTemplateDetial()
    }
  },
  mounted() {

  },
  methods: {
    regsiterWgts() {
      // const { scene = '1001' } = this.$route.query
      const wgts = gWgts[this.localScene]
      Object.keys(wgts).forEach((index) => {
        this.widgets.push(wgts[index])
        Vue.component(wgts[index].name, wgts[index])
      })
    },
    resetDecorateTheme() {

    },
    getComponentAttr(item) {
      const { wgtName, config } = this.widgets.find((wgt) => {
        return wgt.name?.toLowerCase() == item.name?.toLowerCase()
      })
      return {
        wgtName,
        ...config
      }
    },
    cloneDefaultField(e) {
      const { wgtName, wgtDesc, config } = e
      const { setting, name } = JSON.parse(JSON.stringify(config))
      
      // 检查是否可以添加（在克隆时检查）
      if (!this.canAddWgt(name)) {
        this.$message.error('店铺字母列表挂件与其他挂件互斥，无法同时添加')
        // 返回 null 或抛出错误来阻止克隆
        return null
      }
      
      const compData = {
        name,
        wgtName,
        wgtDesc
      }
      setting.forEach((item) => {
        compData[item.key] = item.value
      })
      // console.log('compData', compData)
      return compData
    },
    handleClickHeader() {
      this.activeCompIndex = null
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true // 重建组件
      })
    },
    handleClickWgtItem(index) {
      this.activeCompIndex = index
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true // 重建组件
      })
    },
    transform(wgt) {
      const { setting } = wgt.config
      return setting
    },
    async getTemplateDetial() {
      const { id } = this.$route.query
      let list = []
      try {
        if (this.localScene == '1004' || this.localScene == '1006' || this.localScene == '1008') {
          const resTemplate = await this.$api.wxa.getParamByTempName({
            template_name: 'yykweishop',
            page_name: `custom_${id}`,
            version: 'v1.0.1'
          })
          list = resTemplate?.list || []
        } else {
          const { template_content } = await this.$api.template.getPagesTemplateDetail({
            pages_template_id: id
          })
          list = template_content?.list || []
        }
      } catch (e) {
        console.error(e)
      }

      console.log('Header:', Header)
      // 页面设置初始数据
      const { setting, name } = Header.config
      let headerData = {
        name,
        wgtName: Header.wgtName,
        wgtDesc: Header.wgtDesc
      }
      setting.forEach((item) => {
        headerData[item.key] = item.value
      })
      const wgtHeader = list.find((item) => item.name == 'page')
      if (wgtHeader) {
        const headParams = Header.config.transformIn({ id: wgtHeader?.id, ...wgtHeader.params })
        headerData = {
          // 初始数据
          ...headerData,
          ...headParams
        }
      }
      this.headerData = headerData
      this.headerAttr = {
        wgtName: Header.wgtName,
        ...Header.config
      }

      list.forEach((li) => {
        // 是否存在挂件
        const wgt = this.widgets.find((item) => item.name?.toLowerCase() == li.name?.toLowerCase())
        if (wgt) {
          // console.log('getTemplateDetial wgt:', wgt)
          const wgtInitParams = this.cloneDefaultField(wgt)
          const params = wgt.config.transformIn({ id: li?.id, ...li.params })
          this.contentComps.push({
            wgtName: wgt.wgtName,
            ...wgtInitParams,
            ...params
          })
        }
      })
      console.log('getTemplateDetial:', this.contentComps)
    },
    onMoveUpComp(index) {
      this.contentComps
    },
    onMoveDownComp(index) {},
    onCopyComp(index, wgt) {
      // 检查互斥逻辑（wgt.name 是 config.name，即 storeAlphabet）
      if (!this.canAddWgt(wgt.name)) {
        this.$message.error('店铺字母列表挂件与其他挂件互斥，无法同时添加')
        return
      }
      this.contentComps.splice(index + 1, 0, cloneDeep(wgt))
    },
    onDeleteComp(index) {
      if (this.contentComps.length == index + 1) {
        setTimeout(() => {
          this.handleClickHeader()
        }, 20)
      }
      this.contentComps.splice(index, 1)
    },
    // 拖拽移动时的处理（在拖拽过程中检查，返回 false 可以阻止拖拽）
    onDragMove(evt) {
      // 如果是从左侧拖拽到右侧（添加新挂件）
      // evt.relatedContext.list === this.contentComps 表示要添加到右侧列表
      if (evt.relatedContext && evt.relatedContext.list === this.contentComps) {
        const draggedWgt = evt.draggedContext.element
        
        // 从左侧拖拽时，draggedWgt 可能是组件对象（name 是组件名如 StoreAlphabet）
        // 也可能是克隆后的数据（name 是 config.name 如 storeAlphabet）
        let configName = draggedWgt.name
        
        // 如果是组件对象，需要转换为 config.name
        if (draggedWgt.config) {
          // 已经是克隆后的数据，直接使用 name
          configName = draggedWgt.name
        } else {
          // 是组件对象，需要查找对应的 config.name
          const wgt = this.widgets.find(w => w.name === draggedWgt.name)
          configName = wgt?.config?.name || draggedWgt.name
        }
        
        // 检查是否可以添加
        if (!this.canAddWgt(configName)) {
          this.$message.error('店铺字母列表挂件与其他挂件互斥，无法同时添加')
          return false // 阻止拖拽
        }
      }
      return true // 允许拖拽
    },
    // 拖拽添加挂件时的处理（备用检查，防止 move 事件未触发）
    onDragAdd(evt) {
      const addedWgt = evt.added.element
      // addedWgt.name 是 config.name，即 storeAlphabet
      if (!this.canAddWgt(addedWgt.name)) {
        // 如果不允许添加，移除刚添加的挂件
        this.$nextTick(() => {
          const index = this.contentComps.findIndex(comp => comp === addedWgt)
          if (index !== -1) {
            this.contentComps.splice(index, 1)
          }
        })
        this.$message.error('店铺字母列表挂件与其他挂件互斥，无法同时添加')
      }
    },
    // 检查是否可以添加挂件（互斥逻辑）
    canAddWgt(wgtName) {
      const storeAlphabetConfigName = 'storeAlphabet'
      const storeAlphabetComponentName = 'StoreAlphabet'
      
      // 判断是否要添加店铺字母列表（可能是组件名或配置名）
      const isAddingStoreAlphabet = wgtName === storeAlphabetConfigName || wgtName === storeAlphabetComponentName
      
      // 检查当前已有的挂件（contentComps 中使用的是 config.name）
      const hasStoreAlphabet = this.contentComps.some(
        comp => comp.name === storeAlphabetConfigName
      )
      const hasOtherWgts = this.contentComps.some(
        comp => comp.name !== storeAlphabetConfigName
      )
      
      // 如果要添加店铺字母列表，但已有其他挂件，则不允许
      if (isAddingStoreAlphabet && hasOtherWgts) {
        return false
      }
      
      // 如果要添加其他挂件，但已有店铺字母列表，则不允许
      if (!isAddingStoreAlphabet && hasStoreAlphabet) {
        return false
      }
      
      return true
    },
    async onSaveTemplate() {
      // console.log('onSaveTemplate:', JSON.stringify(data))
      if (this.mode == 'dialog') {
        this.$emit('change', this.contentComps)
        return
      }
      const data = this.contentComps.map((item) => {
        const { transformOut } = this.widgets.find(
          (wgt) => wgt.name?.toLowerCase() == item.name?.toLowerCase()
        )?.config
        return transformOut(item)
      })
      data.unshift(this.headerAttr.transformOut(this.headerData))
      const { id } = this.$route.query
      if (this.localScene == '1004' || this.localScene == '1006' || this.localScene == '1008') {
        await this.$api.wxa.savePageParams({
          template_name: 'yykweishop',
          page_name: `custom_${id}`,
          version: 'v1.0.1',
          config: JSON.stringify(data)
        })
      } else {
        await this.$api.template.savePagesTemplate({
          pages_template_id: id,
          template_name: 'yykweishop',
          template_content: JSON.stringify({
            content: data
          })
        })
      }

      this.$message.success('保存成功')
    },
    onExit() {
      this.$router.go(-1)
    },
    onClose() {
      this.$emit('close')
    }
  }
}
</script>
