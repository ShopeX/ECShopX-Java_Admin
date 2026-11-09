<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="attr-nav-item">
    <CompTodoList v-model="value" :max="5" @onAddItem="handleClickAdd">
      <template slot="body" slot-scope="scope">
        <div class="nav-item--wrap">
          <el-input v-model="scope.data.content" :placeholder="$t('c1030e12.8585af')" />
          <div class="nav-item--picker">
            <SpImagePicker v-model="scope.data.imgUrl" size="small" />
            <CompPickerLink
              :value="scope.data"
              @change="(e) => handleChangeLink(e, scope.index)"
            />
          </div>
          <div class="cell-value-tip">{{ $t('c1030e12.53f5ef') }}</div>
        </div>
      </template>
    </CompTodoList>
  </div>
</template>

<script>
import Vue from 'vue'
import { i18n } from '@/i18n'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompTodoList from '../../comps/comp-todoList'
import CompButton from '../../comps/comp-button'
import { ORDER_NAV_ID_TO_KEY, syncKeyFromLinkPicker } from './order-nav-meta'
export default {
  name: 'AttrNavItem',
  components: { CompPickerLink, CompTodoList, CompButton },
  props: {
    value: [Object, Array]
  },
  methods: {
    handleClickAdd() {
      this.value.push({
        content: i18n.t('c1030e12.8585af'),
        imgUrl: '',
        key: '',
        linkType: 0,
        linkPage: '',
        id: '',
        title: ''
      })
    },
    handleChangeLink(e, index) {
      Vue.set(
        this.value,
        index,
        syncKeyFromLinkPicker({
          ...this.value[index],
          ...e,
          key:
            this.value[index].key ||
            ORDER_NAV_ID_TO_KEY[e.id] ||
            ORDER_NAV_ID_TO_KEY[this.value[index].id]
        })
      )
    }
  }
}
</script>
<style lang="scss">
.attr-nav-item {
  width: 100%;
  .nav-item--picker {
    display: flex;
    margin-top: 10px;
  }
}
</style>
