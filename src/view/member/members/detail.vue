<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage bg-color="#f5f6f9">
    <el-tabs v-model="activeName" class="member-detail-tabs" @tab-click="handleClick">
      <!-- 基础信息 -->
      <el-tab-pane v-if="!VERSION_SHUYUN()" :label="$t('f14acdc9.6ea1fe')" name="info">
        <!-- 概览卡片 -->
        <div class="bg-white rounded-[8px] p-[30px] mb-[16px] flex items-start gap-[50px] flex-wrap lg:flex-nowrap">
          <div
            class="bg-[#f5f6f9] rounded-[8px] px-[30px] py-[30px] xl:px-[50px] flex flex-col items-center gap-[20px] shrink-0 overview-summary"
          >
            <div class="flex items-center gap-[20px]">
              <div class="flex flex-col items-center gap-[10px]">
                <span class="text-[12px] leading-[20px] text-[#909399] whitespace-nowrap">{{
                  $t('f14acdc9.eababe')
                }}</span>
                <span
                  class="text-[16px] leading-[22px] font-bold whitespace-nowrap"
                  :style="{ color: 'var(--primary, var(--themeColor, #409eff))' }"
                  >{{
                  discountText
                }}</span
                >
              </div>
              <div class="avatar-box shrink-0">
                <img v-if="avatarUrl" :src="avatarUrl" alt="" />
                <i v-else class="el-icon-user-solid"></i>
              </div>
              <div class="flex flex-col items-center gap-[10px]">
                <span class="text-[12px] leading-[20px] text-[#909399] whitespace-nowrap">{{
                  $t('f14acdc9.b97575')
                }}</span>
                <span
                  class="text-[16px] leading-[22px] font-bold whitespace-nowrap"
                  :style="{ color: 'var(--primary, var(--themeColor, #409eff))' }"
                  >{{
                  member.point || 0
                }}</span
                >
              </div>
            </div>
            <div class="flex items-center gap-[10px] text-[13px] text-[#606266] whitespace-nowrap">
              <span>{{ nameText }}</span>
              <span v-if="nameText !== '--' && gradeText !== '--'" class="v-divider"></span>
              <span>{{ gradeText }}</span>
            </div>
            <div
              v-if="storeName !== '--' || storeBn !== '--'"
              class="flex items-center gap-[10px] text-[13px] text-[#606266] whitespace-nowrap"
            >
              <span>{{ storeName }}</span>
              <span v-if="storeName !== '--' && storeBn !== '--'" class="v-divider"></span>
              <span>{{ storeBn }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-end mb-[10px]">
              <el-button type="primary" plain size="mini" @click="expanded = !expanded">
                {{ expanded ? $t('f14acdc9.def9e9') : $t('f14acdc9.90ef7c') }}
              </el-button>
            </div>
            <div class="info-grid">
              <div v-for="field in baseFields" :key="field.label" class="min-w-0">
                <p class="text-[12px] leading-[20px] text-[#909399]">{{ field.label }}</p>
                <p class="text-[12px] font-medium leading-[20px] text-[#303133] break-all">
                  {{ field.value || '--' }}
                </p>
              </div>
              <template v-if="expanded">
                <div v-for="field in moreFields" :key="field.label" class="min-w-0">
                  <p class="text-[12px] leading-[20px] text-[#909399]">{{ field.label }}</p>
                  <p class="text-[12px] font-medium leading-[20px] text-[#303133] break-all">
                    {{ field.value || '--' }}
                  </p>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 会员标签 -->
        <div class="bg-white rounded-[8px] p-[24px] mb-[16px]">
          <p class="text-[16px] font-bold leading-[22px] text-[#303133] mb-[20px]">
            {{ $t('f14acdc9.3cc026') }}
            <span
              v-if="tagCount !== null"
              class="ml-[8px] text-[12px] font-normal text-[#909399]"
              >({{ tagCount }})</span
            >
          </p>
          <div class="flex flex-wrap items-center gap-[8px]">
            <el-button
              v-if="tagEditable"
              type="primary"
              plain
              size="mini"
              icon="el-icon-plus"
              @click="showTagDialog = true"
              >{{ $t('f14acdc9.b58c75') }}</el-button
            >
            <el-tag
              v-for="tag in operationTags"
              :key="'op-' + tag.tag_id"
              size="small"
              class="member-tag"
              :closable="tagEditable"
              @close="handleRemoveTag(tag)"
              >{{ tag.tag_name }}</el-tag
            >
            <el-tag
              v-for="tag in systemTags"
              :key="'sys-' + tag.tag_id"
              size="small"
              class="member-tag"
              >{{ tag.tag_name }}</el-tag
            >
          </div>
        </div>

        <!-- 消费统计 -->
        <div class="flex gap-[20px] flex-wrap items-stretch">
          <div
            v-for="group in statGroups"
            :key="group.title"
            class="flex-1 min-w-[300px] bg-white rounded-[8px] p-[20px]"
          >
            <p class="text-[16px] font-bold leading-[22px] text-[#303133] mb-[20px]">
              {{ group.title }}
            </p>
            <div class="flex flex-wrap gap-x-[24px] gap-y-[14px]">
              <div v-for="item in group.items" :key="item.label" class="w-[150px] min-w-0">
                <p class="text-[12px] leading-[20px] text-[#909399]">{{ item.label }}</p>
                <p class="text-[13px] font-medium leading-[20px] text-[#303133] break-all">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 订单详情 -->
      <el-tab-pane :label="$t('f14acdc9.8054f7')" name="order">
        <order-list :user-id="user_id" :is-load="orderLoad" />
      </el-tab-pane>

      <!-- 储值详情 -->
      <el-tab-pane v-if="VUE_APP_CHUZHI" :label="$t('f14acdc9.62431a')" name="chuzhi">
        <chuZhiList />
      </el-tab-pane>

      <!-- 积分详情 -->
      <el-tab-pane
        v-if="!VERSION_IN_PURCHASE() && !VERSION_SHUYUN()"
        :label="$t('f14acdc9.52f227')"
        name="point"
      >
        <pointList />
      </el-tab-pane>

      <!-- 付费会员详情 -->
      <el-tab-pane v-if="!VERSION_IN_PURCHASE()" :label="$t('f14acdc9.ac1b7c')" name="membercard">
        <membercardList :info="member" />
      </el-tab-pane>
    </el-tabs>

    <!-- 打标签弹框 -->
    <CompTagsMore
      :title="$t('ff557c54.4f1e39')"
      :visible.sync="showTagDialog"
      :selected-tags="operationTags"
      @confirm="handleTagConfirm"
    />
  </SpPage>
</template>

<script>
import { getMember, memberRelTag, usersRelTagsDel } from '../../../api/member'
import orderList from './orderlist.vue'
import membercardList from './comps/memberCardList'
import pointList from './comps/pointList'
import chuZhiList from './comps/chuZhiList'
import CompTagsMore from '@/views/members/components/CompTagsMore.vue'
import { VERSION_SHUYUN } from '@/utils'

export default {
  components: {
    orderList,
    membercardList,
    pointList,
    chuZhiList,
    CompTagsMore
  },
  data() {
    return {
      user_id: 0,
      member: {
        user_id: '',
        company_id: '',
        grade_id: '',
        mobile: '',
        login_email: '',
        user_card_code: '',
        username: '',
        sex: 1,
        birthday: '',
        address: '',
        email: '',
        created: '',
        point: 0,
        reg_salesperson: '',
        reg_distributor: '',
        // 会员打标接口（GET /member）新增字段
        tagList: [],
        operation_tags: [],
        system_tags: [],
        tag_summary: null,
        tag_permissions: null,
        tag_data_status: null,
        salesperson_info: {},
        store_info: {},
        cardInfo: {
          company_id: '1',
          brand_name: '',
          logo_url: '',
          title: '',
          color: '#ff5000',
          code_type: '',
          background_pic_url: ''
        },
        gradeInfo: {
          background_pic_url: '',
          company_id: '',
          default_grade: true,
          grade_name: '',
          privileges: {
            discount: '',
            discount_desc: ''
          }
        },
        wechatUserInfo: {
          company_id: '1',
          authorizer_appid: '',
          open_id: '',
          unionid: '',
          nickname: '',
          sex: 0,
          city: '',
          country: '',
          province: '',
          language: '',
          headimgurl: '',
          user_id: ''
        },
        vipgrade: { is_vip: false },
        deposit: 0
      },
      activeName: 'info',
      infoLoad: true,
      orderLoad: false,
      membercardLoad: false,
      pointLoad: false,
      expanded: false,
      showTagDialog: false
    }
  },
  computed: {
    avatarUrl() {
      const m = this.member || {}
      return (m.wechatUserInfo && m.wechatUserInfo.headimgurl) || m.avatar || ''
    },
    discountText() {
      const m = this.member || {}
      const vip = m.vipgrade
      if (vip && vip.is_vip) {
        const d = Number(100 - vip.discount)
        return isNaN(d) ? '--' : `${d}%`
      }
      const desc = m.gradeInfo && m.gradeInfo.privileges ? m.gradeInfo.privileges.discount_desc : ''
      if (desc && desc != 0) {
        const n = Number(desc)
        return isNaN(n) ? String(desc) : `${n * 10}%`
      }
      return '100%'
    },
    nameText() {
      const m = this.member || {}
      return m.username || (m.wechatUserInfo && m.wechatUserInfo.nickname) || '--'
    },
    gradeText() {
      const m = this.member || {}
      const vip = m.vipgrade
      if (vip && vip.is_vip && vip.grade_name) return vip.grade_name
      return (m.gradeInfo && m.gradeInfo.grade_name) || '--'
    },
    storeName() {
      const info = (this.member && this.member.store_info) || {}
      return info.store_name || '--'
    },
    storeBn() {
      const info = (this.member && this.member.store_info) || {}
      return info.store_bn || '--'
    },
    /** 标签定义表（含 tag_name），用于给 operation_tags 关联出名称 */
    tagDefinitionMap() {
      const map = {}
      const list = (this.member && this.member.tagList) || []
      list.forEach((t) => {
        if (t && t.tag_id != null) map[String(t.tag_id)] = t
      })
      return map
    },
    /** 操作标签（手工打的标签，可摘除）；老后端兑底用 tagList */
    operationTags() {
      const m = this.member || {}
      const list =
        Array.isArray(m.operation_tags) && m.operation_tags.length
          ? m.operation_tags
          : Array.isArray(m.tagList)
          ? m.tagList
          : []
      return list.map((raw) => this.normalizeTag(raw))
    },
    /** 系统标签（后端 422 拒绝编辑，仅展示） */
    systemTags() {
      const m = this.member || {}
      return (Array.isArray(m.system_tags) ? m.system_tags : []).map((raw) =>
        this.normalizeTag(raw)
      )
    },
    tagEditable() {
      const p = this.member && this.member.tag_permissions
      if (!p) return true
      if (p.editable === false || p.can_tag === false || p.can_edit === false) return false
      return true
    },
    tagCount() {
      const s = this.member && this.member.tag_summary
      if (s === null || s === undefined) return null
      if (typeof s === 'number') return s
      if (typeof s === 'object') return s.total ?? s.count ?? null
      const n = Number(s)
      return isNaN(n) ? null : n
    },
    /** 基础资料（固定展示项，顺序对齐设计稿） */
    baseFields() {
      const m = this.member || {}
      const wx = m.wechatUserInfo || {}
      const vip = m.vipgrade || {}
      const city = [wx.country, wx.province, wx.city].filter(Boolean).join(' ')
      return [
        { label: this.$t('f14acdc9.8098e2'), value: m.mobile },
        { label: this.$t('f14acdc9.15f7b0'), value: m.user_card_code },
        {
          label: this.$t('f14acdc9.6c1583'),
          value: vip.is_vip && vip.grade_name ? vip.grade_name : m.gradeInfo && m.gradeInfo.grade_name
        },
        { label: this.$t('f14acdc9.285f2c'), value: wx.nickname },
        { label: this.$t('f14acdc9.4773d0'), value: city },
        { label: this.$t('f14acdc9.7eacb4'), value: m.name || m.username },
        {
          label: this.$t('f14acdc9.87d5eb'),
          value: m.created
            ? this.$options.filters.datetime(m.created, 'YYYY-MM-DD HH:mm:ss')
            : ''
        },
        { label: this.$t('f14acdc9.fd456f'), value: wx.open_id },
        { label: this.$t('f14acdc9.723366'), value: wx.unionid }
      ]
    },
    /** 查看更多展开项 */
    moreFields() {
      const m = this.member || {}
      return [
        { label: this.$t('6f2e9aab.1df342'), value: m.reg_salesperson },
        {
          label: this.$t('f14acdc9.8d1f18'),
          value: m.salesperson_info && m.salesperson_info.employee_number
        },
        {
          label: this.$t('f14acdc9.abbe4b'),
          value: m.birthday
        },
        { label: this.$t('6f2e9aab.c74b7d'), value: m.reg_distributor },
        {
          label: this.$t('f14acdc9.343ce4'),
          value: m.store_info && m.store_info.store_name
        },
        { label: this.$t('ff557c54.d093f6'), value: m.login_email || m.email },
        { label: this.$t('f14acdc9.d3c958'), value: m.address }
      ]
    },
    /**
     * 消费统计（最近/平均/累计）。
     * 数据来源于会员详情接口（GET /member）扩展返回的 consume_summary，
     * 未返回时展示 --；字段映射统一收敛在这里，便于与后端对齐后调整。
     */
    consumeSummary() {
      const m = this.member || {}
      return m.consume_summary || m.consumeSummary || m.consume_info || m.consumeInfo || {}
    },
    statGroups() {
      const cs = this.consumeSummary || {}
      return [
        {
          title: this.$t('f14acdc9.a8b3f7'),
          items: [
            { label: this.$t('f14acdc9.b9fe6d'), value: this.formatStat(cs.last_store_name || cs.last_store, '') },
            {
              label: this.$t('f14acdc9.9bc1d7'),
              value: this.formatStat(cs.last_consume_time || cs.last_order_time, '')
            },
            {
              label: this.$t('f14acdc9.0b0844'),
              value: this.formatStat(cs.last_consume_amount ?? cs.last_order_amount, this.$t('f14acdc9.c16655'))
            },
            {
              label: this.$t('f14acdc9.7ef9a2'),
              value: this.formatStat(cs.last_consume_nums ?? cs.last_consume_quantity, this.$t('f14acdc9.f7edf5'))
            }
          ]
        },
        {
          title: this.$t('f14acdc9.15e370'),
          items: [
            {
              label: this.$t('f14acdc9.fb61a4'),
              value: this.formatStat(cs.avg_order_price ?? cs.avg_order_amount, this.$t('f14acdc9.c16655'))
            },
            {
              label: this.$t('f14acdc9.905a86'),
              value: this.formatStat(cs.avg_order_nums ?? cs.avg_order_quantity, this.$t('f14acdc9.f7edf5'))
            },
            {
              label: this.$t('f14acdc9.18be17'),
              value: this.formatStat(cs.avg_item_price, this.$t('f14acdc9.c16655'))
            },
            { label: this.$t('f14acdc9.3184df'), value: this.formatDiscount(cs.avg_discount) }
          ]
        },
        {
          title: this.$t('f14acdc9.5c9bc8'),
          items: [
            {
              label: this.$t('f14acdc9.70db57'),
              value: this.formatStat(cs.total_consume_nums ?? cs.total_consume_quantity, this.$t('f14acdc9.f7edf5'))
            },
            {
              label: this.$t('f14acdc9.8172ed'),
              value: this.formatStat(cs.total_buy_times ?? cs.total_purchase_times, this.$t('f14acdc9.7229ec'))
            },
            {
              label: this.$t('f14acdc9.a2ce8d'),
              value: this.formatStat(cs.total_buy_amount ?? cs.total_purchase_amount, this.$t('f14acdc9.c16655'))
            },
            {
              label: this.$t('f14acdc9.494426'),
              value: this.formatStat(cs.total_refund_times, this.$t('f14acdc9.7229ec'))
            },
            {
              label: this.$t('f14acdc9.d4e011'),
              value: this.formatStat(cs.total_refund_amount, this.$t('f14acdc9.c16655'))
            }
          ]
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.resource && this.$route.query.resource == 'member') {
      this.activeName = 'order'
      this.orderLoad = true
    } else {
      this.activeName = VERSION_SHUYUN() ? 'order' : 'info'
      this.infoLoad = true
      this.orderLoad = VERSION_SHUYUN()
    }
    if (this.$route.params.user_id) {
      this.user_id = this.$route.params.user_id
    }
    if (this.$route.query.user_id) {
      this.user_id = this.$route.query.user_id
    }
    if (this.$route.query.grade_id) {
      this.grade_id = this.$route.query.grade_id
    }
    this.getMember({ user_id: this.user_id })
  },
  methods: {
    /**
     * 标签条目归一化：兼容完整标签对象 / 关联记录(仅 tag_id) / 字符串，
     * tag_name 缺失时按 tag_id 从 tagList(tagDefinitionMap) 关联补全
     */
    normalizeTag(raw) {
      if (raw === null || raw === undefined) return { tag_id: '', tag_name: '' }
      if (typeof raw !== 'object') return { tag_id: raw, tag_name: String(raw) }
      const nested = raw.tag && typeof raw.tag === 'object' ? raw.tag : {}
      const id = raw.tag_id ?? raw.id ?? nested.tag_id
      const fromDefinition = this.tagDefinitionMap[String(id)] || {}
      const name =
        raw.tag_name ?? raw.name ?? nested.tag_name ?? fromDefinition.tag_name ?? ''
      return { ...raw, tag_id: id, tag_name: name }
    },
    getMember(filter) {
      getMember(filter).then((response) => {
        this.member = { ...this.member, ...response.data.data }
      })
    },
    handleClick() {
      this.infoLoad = this.orderLoad = this.membercardLoad = this.pointLoad = false
      switch (this.activeName) {
        case 'order':
          this.orderLoad = true
          break
        case 'membercard':
          this.membercardLoad = true
          break
        case 'point':
          this.pointLoad = true
          break
        default:
          this.infoLoad = true
      }
    },
    /** 打标（POST /member/reltag） */
    handleTagConfirm(tags) {
      const tagIds = (tags || []).map((tag) => tag.tag_id)
      if (!tagIds.length) {
        this.$message({ type: 'error', message: this.$t('f14acdc9.ce7cf5') })
        return
      }
      memberRelTag({ user_id: this.user_id, tag_ids: tagIds }).then(() => {
        this.$message({ type: 'success', message: this.$t('f14acdc9.ecefe5') })
        this.showTagDialog = false
        this.refreshMember()
      })
    },
    /** 摘标（POST /member/reltagdel，系统标签后端 422 拒绝） */
    handleRemoveTag(tag) {
      this.$confirm(this.$t('f14acdc9.04fe73'), this.$t('ff557c54.4f1e39'), {
        type: 'warning'
      })
        .then(async () => {
          await usersRelTagsDel({ tag_id: tag.tag_id, user_id: this.user_id })
          this.$message({ type: 'success', message: this.$t('f14acdc9.cf006c') })
          this.refreshMember()
        })
        .catch(() => {})
    },
    refreshMember() {
      this.getMember({ user_id: this.user_id })
    },
    /** 统计值格式化：数字补单位，非数字原样展示，空值 -- */
    formatStat(value, unit) {
      if (value === null || value === undefined || value === '') return '--'
      if (typeof value === 'number') return `${value}${unit}`
      const str = String(value)
      if (/^-?\d+(\.\d+)?$/.test(str)) return `${str}${unit}`
      return str
    },
    /** 折扣格式化：0.8/80/80% 等统一为百分比展示 */
    formatDiscount(value) {
      if (value === null || value === undefined || value === '') return '--'
      if (typeof value === 'number') {
        const pct = value > 0 && value <= 1 ? value * 100 : value
        return `${pct}%`
      }
      const str = String(value)
      if (/%$/.test(str)) return str
      const n = Number(str)
      if (isNaN(n)) return str
      const pct = n > 0 && n <= 1 ? n * 100 : n
      return `${pct}%`
    }
  }
}
</script>

<style scoped lang="scss">
.member-detail-tabs {
  ::v-deep .el-tabs__item {
    font-weight: 500;
  }
}

.overview-summary {
  min-width: 260px;
}

.avatar-box {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: #c0c4cc;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  i {
    color: #fff;
    font-size: 32px;
  }
}

.v-divider {
  display: inline-block;
  width: 1px;
  height: 10px;
  background: #dcdfe6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 24px;
}

.member-tag {
  height: 24px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 22px;
}
</style>
