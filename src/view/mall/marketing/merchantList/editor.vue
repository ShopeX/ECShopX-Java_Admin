<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="MerchantsEditor">
    <h5>{{ $t('e8e4e935.e9b5ee') }}</h5>
    <el-divider />
    <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
      form.settled_type == 'enterprise' ? $t('e8e4e935.04c9e3') : $t('e8e4e935.a41061')
    }}</span>
    <el-select
      v-else
      v-model="form.settled_type"
      :placeholder="$t('e8e4e935.708c9d')"
      :disabled="disabled || editDisabled"
    >
      <el-option :label="$t('e8e4e935.04c9e3')" value="enterprise" />
      <el-option :label="$t('e8e4e935.a41061')" value="soletrader" />
    </el-select>
    <el-divider />
    <el-form v-if="form.settled_type" ref="form" :model="form" :rules="rules" label-width="130px">
      <!-- 企业信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.54796d') }}</span>
        </div>
        <section>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.0b66da') : $t('e8e4e935.e6f169')
                "
                prop="merchant_name"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.merchant_name
                }}</span>
                <el-input
                  v-else
                  v-model="form.merchant_name"
                  :disabled="disabled || editDisabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('e8e4e935.25c0bd')" prop="social_credit_code_id">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.social_credit_code_id
                }}</span>
                <el-input
                  v-else
                  v-model="form.social_credit_code_id"
                  :disabled="disabled || editDisabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('e8e4e935.61a0ec')" prop="license_registered_address">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.license_registered_address
                }}</span>
                <el-input v-else v-model="form.license_registered_address" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.2fe17a') : $t('e8e4e935.610859')
                "
                prop="license_legal_representative"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.license_legal_representative
                }}</span>
                <el-input v-else v-model="form.license_legal_representative" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.e8b4af') : $t('e8e4e935.cb32ae')
                "
                prop="legal_cert_id"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.legal_cert_id
                }}</span>
                <el-input v-else v-model="form.legal_cert_id" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('5f6110bf.eaa028')" prop="contact_name">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.contact_name
                }}</span>
                <el-input v-else v-model="form.contact_name" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.f50f83') : $t('e8e4e935.8de58d')
                "
                prop="contact_mobile"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.contact_mobile
                }}</span>
                <el-input v-else v-model="form.contact_mobile" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('e8e4e935.a6695e')" prop="email">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.email
                }}</span>
                <el-input v-else v-model="form.email" :disabled="disabled" />
              </el-form-item>
            </el-col>
          </el-row>
        </section>
      </el-card>
      <!-- 结算信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.99f89b') }} </span>
          <span style="fons-size: 10px; color: #999">
            （{{ $t('e8e4e935.618c5d')
            }}{{ form.settled_type == 'enterprise' ? $t('e8e4e935.e1a437') : $t('e8e4e935.b29725')
            }}{{ $t('e8e4e935.5e9df0') }}）</span
          >
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.32734c')" prop="bank_acct_type">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.bank_acct_type == '1' ? $t('e8e4e935.18ba13') : $t('e8e4e935.f0bf8a')
              }}</span>
              <template v-else>
                <el-radio-group v-model="form.bank_acct_type" :disabled="disabled">
                  <el-radio label="1"> {{ $t('e8e4e935.18ba13') }} </el-radio>
                  <el-radio label="2"> {{ $t('e8e4e935.f0bf8a') }} </el-radio>
                </el-radio-group>
                <el-tooltip
                  :style="{ 'margin-left': 30 + 'px' }"
                  :content="$t('e8e4e935.8597fb')"
                  placement="top-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </template>
            </el-form-item>
          </el-col>
          <el-col v-if="form.bank_acct_type == '2'" :span="8">
            <el-form-item :label="$t('e8e4e935.a0b7da')" prop="bank_mobile">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.bank_mobile
              }}</span>
              <el-input v-else v-model="form.bank_mobile" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item :label="$t('e8e4e935.0a3e82')" prop="bank_name">
              <div class="flex">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.bank_name
                }}</span>
                <el-autocomplete
                  v-else
                  v-model="form.bank_name"
                  :disabled="disabled"
                  style="width: 100%"
                  prefix-icon="el-icon-search"
                  class="inline-input"
                  :fetch-suggestions="querySearch"
                  :placeholder="$t('e8e4e935.473e86')"
                  @select="handleSelectBank"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.88174a')" prop="card_id_mask">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.card_id_mask
              }}</span>
              <el-input v-else v-model="form.card_id_mask" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 入驻信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.e48700') }} </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item :label="$t('e8e4e935.4709c8')" prop="main_category_selection">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                mainCategoryDisplayText
              }}</span>
              <el-cascader
                v-else
                v-model="mainCategoryPaths"
                :options="categoryOptions"
                :props="categoryCascaderProps"
                clearable
                filterable
                collapse-tags
                style="width: 100%"
                :disabled="disabled"
                :placeholder="$t('e8e4e935.708c9d')"
                @change="onMainCategoryPathsChange"
              />
              <div v-if="!($route.query.type == 'detail' || $route.query.type == 'verify')" class="category-tip">
                勾选二级将默认选中其下全部三级，也可单独勾选三级；仅提交二级/三级
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.48f0ee')" prop="audit_goods">
              <span v-if="$route.query.type == 'detail'">{{
                form.audit_goods === true || form.audit_goods === 'true'
                  ? $t('e8e4e935.0a60ac')
                  : $t('e8e4e935.c9744f')
              }}</span>
              <el-select
                v-else
                v-model="form.audit_goods"
                style="width: 60%"
                :placeholder="$t('e8e4e935.708c9d')"
                :disabled="$route.query.type == 'verify' ? verifyDisabled : disabled"
              >
                <el-option :label="$t('e8e4e935.0a60ac')" :value="true" />
                <el-option :label="$t('e8e4e935.c9744f')" :value="false" />
              </el-select>
              <el-tooltip
                :style="{ 'margin-left': 30 + 'px' }"
                :content="$t('e8e4e935.403026')"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 证照信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.8f14f8') }} </span>
        </div>
        <div class="wrap">
          <el-form-item prop="license_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('license_url')">
              <img v-if="form.license_url" class="avatar" :src="form.license_url" />
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p><span style="color: red">*</span> {{ $t('e8e4e935.e0b8cc') }}</p>
          </el-form-item>
          <el-form-item prop="legal_certid_front_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('legal_certid_front_url')">
              <img
                v-if="form.legal_certid_front_url"
                class="avatar"
                :src="form.legal_certid_front_url"
              />
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>
              <span style="color: red">*</span>
              {{ form.settled_type == 'enterprise' ? $t('e8e4e935.e1a437') : $t('e8e4e935.b29725')
              }}{{ $t('e8e4e935.c4a042') }}
            </p>
          </el-form-item>
          <el-form-item prop="legal_cert_id_back_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('legal_cert_id_back_url')">
              <img
                v-if="form.legal_cert_id_back_url"
                class="avatar"
                :src="form.legal_cert_id_back_url"
              />
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>
              <span style="color: red">*</span>
              {{ form.settled_type == 'enterprise' ? $t('e8e4e935.e1a437') : $t('e8e4e935.b29725')
              }}{{ $t('e8e4e935.267438') }}
            </p>
          </el-form-item>
          <el-form-item prop="bank_card_front_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('bank_card_front_url')">
              <img v-if="form.bank_card_front_url" class="avatar" :src="form.bank_card_front_url" />
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>{{ $t('e8e4e935.a7a1aa') }}</p>
          </el-form-item>
          <el-form-item prop="contract_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('contract_url')">
              <img v-if="form.contract_url" class="avatar" :src="form.contract_url" />
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>{{ $t('e8e4e935.f5dc10') }}</p>
          </el-form-item>
        </div>
      </el-card>
      <!-- 账号信息 -->
      <el-card
        v-if="$route.query.type == 'add' && $store.getters.login_type != 'merchant'"
        class="box-card"
        shadow="never"
      >
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.53cab4') }} </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('e8e4e935.c41aeb')">
              <el-tooltip
                :style="{ 'margin-right': 30 + 'px' }"
                :content="$t('e8e4e935.f5dfab')"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
              <el-radio-group v-model="createAccount" :disabled="disabled">
                <el-radio label="1">
                  {{
                    form.settled_type == 'enterprise'
                      ? $t('e8e4e935.e1a437')
                      : $t('e8e4e935.b29725')
                  }}{{ $t('e8e4e935.8098e2') }}
                </el-radio>
                <el-radio label="2"> {{ $t('e8e4e935.0d98c7') }} </el-radio>
              </el-radio-group>
              <template v-if="createAccount == '2'">
                <el-input
                  v-model="mobile"
                  :placeholder="$t('e8e4e935.2628fc')"
                  :disabled="disabled"
                  style="width: 300px; margin-left: 12px"
                />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('e8e4e935.11d8b6')" prop="settled_succ_sendsms">
              <el-radio-group v-model="form.settled_succ_sendsms" :disabled="disabled">
                <el-radio label="1"> {{ $t('e8e4e935.1176c5') }} </el-radio>
                <el-radio label="2"> {{ $t('e8e4e935.ec3a35') }} </el-radio>
              </el-radio-group>
              <label v-if="form.settled_succ_sendsms == 2" class="h5_link">
                <span>{{ h5url }}</span>
                <a v-clipboard:copy="h5url" v-clipboard:success="onCopy">
                  {{ $t('e8e4e935.879058') }}</a
                >
              </label>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 审核详情 -->
      <template v-if="audit_status && audit_status != '1'">
        <p>
          <span :class="['audit_status', audit_status == '2' ? 'success' : 'fail']" />{{
            (audit_status == '2' && $t('e8e4e935.23c1f3')) ||
            (audit_status == '3' && $t('e8e4e935.7173f8'))
          }}
        </p>
        <p>{{ $t('e8e4e935.4985b0') }}: {{ audit_memo || '-' }}</p>
      </template>

      <!-- 按钮 -->
      <template
        v-if="
          $route.query.type == 'edit' ||
          ($route.query.type == 'add' && $store.getters.login_type != 'merchant')
        "
      >
        <el-form-item label-width="0px" style="text-align: center; margin-top: 60px">
          <el-button type="primary" style="padding: 10px 50px" @click="submitFn('form')">
            {{ $t('e8e4e935.be5fbb') }}
          </el-button>
        </el-form-item>
      </template>
      <template v-if="$route.query.type == 'verify'">
        <el-form-item label-width="0px" style="text-align: center; margin-top: 60px">
          <template v-if="audit_status == '1'">
            <el-button
              type="success"
              style="padding: 10px 50px"
              :disabled="datapass_block != 0"
              @click="fnPass"
            >
              {{ $t('e8e4e935.23c1f3') }}
            </el-button>
            <el-button
              type="danger"
              style="padding: 10px 50px"
              :disabled="datapass_block != 0"
              @click="fnReject"
            >
              {{ $t('e8e4e935.325254') }}
            </el-button>
          </template>
          <template v-else>
            <el-button type="info" style="padding: 10px 50px">
              {{ $t('e8e4e935.618acb') }}
            </el-button>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <!-- 图片选择 -->
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <check-box
      ref="checkbox"
      :visible="checkBoxConfig.visible"
      :message="checkBoxConfig.message"
      :is_idea="checkBoxConfig.is_idea"
      @checkBoxVisibleHandle="checkBoxVisibleHandle"
      @checkBoxConfirmHandle="checkBoxConfirmHandle"
    />
    <InfoTipModal
      :visible.sync="infoTipVisible"
      :title="$t('e8e4e935.463e67')"
      width="33%"
      :username="tip.username"
      :password="tip.password"
      @getInfo="getInfo"
    />
  </SpPage>
</template>

<script>
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
import {
  getShopConfig,
  addTheBusinessman,
  getTheMerchant,
  merchantsInDetail,
  setCheckTheEntryOfMerchants,
  getTheMerchantInfo
} from '@/api/mall/marketing.js'
import { getCategory } from '@/api/goods'
import imgPicker from '@/components/imageselect'
import InfoTipModal from '../component/InfoTipModal.vue'
import checkBox from '@/view/base/setting/dealer/cpn/checkBox.vue'

export default {
  components: {
    imgPicker,
    checkBox,
    InfoTipModal
  },
  props: ['props_type'],
  data() {
    return {
      tip: {
        username: '',
        password: ''
      },
      infoTipVisible: false,
      isEditCheckBox: false, //编辑状态是否弹窗 离开页面丢失数据
      checkBoxConfig: {
        visible: false,
        message: '',
        is_idea: true
      },
      h5url: '',
      currentCheckBoxStatus: '',
      // 审批相关
      audit_status: '',
      audit_memo: '',
      // ---------
      // 级联多选路径（UI），提交时同步为 form.main_category_selection
      mainCategoryPaths: [],
      categoryOptions: [],
      categoryCascaderProps: {
        value: 'category_id',
        label: 'category_name',
        children: 'children',
        multiple: true,
        // false：父子联动，选中三级时一级/二级会显示勾选或半选
        checkStrictly: false,
        emitPath: true
      },
      sort_order_by: 'asc',
      pickerImgType: '',
      disabled: false,
      editDisabled: false,
      verifyDisabled: false,
      imgDialog: false,
      isGetImage: false,
      datapass_block: 0,
      // 仅新增账号时用的 UI 字段，不参与接口映射
      createAccount: '1',
      mobile: '',
      form: {
        settled_type: '',
        merchant_name: '',
        social_credit_code_id: '',
        license_registered_address: '',
        license_legal_representative: '',
        legal_cert_id: '',
        contact_name: '',
        contact_mobile: '',
        email: '',
        bank_acct_type: '',
        bank_name: '',
        bank_mobile: '',
        card_id_mask: '',
        main_category_selection: [],
        main_category_names: [],
        audit_goods: true,
        license_url: '',
        legal_certid_front_url: '',
        legal_cert_id_back_url: '',
        bank_card_front_url: '',
        contract_url: '',
        settled_succ_sendsms: '',
        id: ''
      }
    }
  },
  computed: {
    mainCategoryDisplayText() {
      const names = this.form.main_category_names || []
      if (names.length) return names.join('、')
      const selection = this.form.main_category_selection || []
      if (!selection.length) return '-'
      return selection
        .map((item) => {
          if (item.name) return item.name
          const node = this.findCategoryNode(this.categoryOptions, item.category_id)
          return node?.category_name || item.category_id
        })
        .join('、')
    },
    rules() {
      return {
        merchant_name: [requiredRules(this.$t('e8e4e935.0b66da'))],
        social_credit_code_id: [requiredRules(this.$t('e8e4e935.25c0bd')), MaxRules(18)],
        license_registered_address: [requiredRules(this.$t('e8e4e935.61a0ec'))],
        license_legal_representative: [requiredRules(this.$t('e8e4e935.2fe17a'))],
        legal_cert_id: [requiredRules(this.$t('e8e4e935.e8b4af')), MaxRules(18)],
        contact_name: [requiredRules(this.$t('5f6110bf.eaa028'))],
        contact_mobile: [requiredRules(this.$t('e8e4e935.f50f83')), MaxRules(11)],
        bank_mobile: [MaxRules('11')],
        card_id_mask: [MaxRules('19')],
        main_category_selection: [
          {
            validator: (rule, value, callback) => {
              const selection = Array.isArray(value) ? value : []
              const valid = selection.some((item) => [2, 3].includes(Number(item?.level)))
              if (!selection.length || !valid) {
                callback(new Error(this.$t('e8e4e935.4709c8')))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        audit_goods: requiredRules(this.$t('e8e4e935.be5d9e'), 'change'),
        license_url: requiredRules(this.$t('e8e4e935.e0b8cc'), 'change'),
        legal_certid_front_url: requiredRules(this.$t('e8e4e935.4161c3'), 'change'),
        legal_cert_id_back_url: requiredRules(this.$t('e8e4e935.845be5'), 'change'),
        settled_succ_sendsms: requiredRules(this.$t('e8e4e935.11d8b6'), 'change')
      }
    }
  },
  watch: {
    'form.contact_mobile'(value) {
      if (this.createAccount == '1') {
        this.mobile = value || ''
      }
    },
    createAccount: {
      immediate: true,
      handler(val) {
        if (val == '1') {
          this.mobile = this.form.contact_mobile || ''
        }
      }
    }
  },
  async mounted() {
    await this.getCategoryOptions()
    await this.init()
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const result = await getShopConfig()
      this.h5url = result.data.data.h5url
    },
    onCopy() {
      this.$notify({
        message: this.$t('e8e4e935.20a495'),
        type: 'success'
      })
    },
    async init() {
      if (this.$store.getters.login_type == 'merchant') {
        const result = await getTheMerchantInfo()
        this.disabled = true
        this.resultHandler(result)
        console.log('Merchant')
        this.$route.query.type = 'detail'
        return
      }

      const { type, merchantId } = this.$route.query
      if (type == 'edit' || type == 'detail') {
        let action = 'edit'
        if (type == 'detail') {
          this.disabled = true
          action = 'detail'
        } else {
          this.editDisabled = true
        }
        const result = await getTheMerchant({ action }, merchantId)
        this.resultHandler(result)
      } else if (type == 'verify') {
        this.disabled = true
        const result = await merchantsInDetail(merchantId)
        this.resultHandler(result)
      }
    },
    resultHandler(result) {
      const data = result.data.data || {}
      this.form = {
        ...this.form,
        settled_type: data.settled_type || '',
        merchant_name: data.merchant_name || '',
        social_credit_code_id: data.social_credit_code_id || '',
        license_registered_address: data.license_registered_address || '',
        license_legal_representative: data.license_legal_representative || '',
        legal_cert_id: data.legal_cert_id || '',
        contact_name: data.contact_name || '',
        contact_mobile: data.contact_mobile || '',
        email: data.email || '',
        bank_acct_type: data.bank_acct_type || '',
        bank_name: data.bank_name || '',
        bank_mobile: data.bank_mobile || '',
        card_id_mask: data.card_id_mask || '',
        main_category_selection: data.main_category_selection || [],
        main_category_names: data.main_category_names || [],
        audit_goods: data.audit_goods === true || data.audit_goods === 'true' || data.audit_goods === 1,
        license_url: data.license_url || '',
        legal_certid_front_url: data.legal_certid_front_url || '',
        legal_cert_id_back_url: data.legal_cert_id_back_url || '',
        bank_card_front_url: data.bank_card_front_url || '',
        contract_url: data.contract_url || '',
        settled_succ_sendsms: data.settled_succ_sendsms || '',
        id: data.id || ''
      }
      this.mainCategoryPaths = this.resolveCategoryPaths(this.form.main_category_selection)
      this.datapass_block = data.datapass_block
      this.audit_status = data.audit_status
      this.audit_memo = data.audit_memo
    },
    buildPayload() {
      const f = this.form
      const payload = {
        settled_type: f.settled_type,
        main_category_selection: (f.main_category_selection || []).map((item) => ({
          category_id: Number(item.category_id) || item.category_id,
          level: Number(item.level)
        })),
        merchant_name: f.merchant_name,
        social_credit_code_id: f.social_credit_code_id,
        license_registered_address: f.license_registered_address,
        license_legal_representative: f.license_legal_representative,
        legal_cert_id: f.legal_cert_id,
        contact_name: f.contact_name,
        contact_mobile:
          this.createAccount == '2' && this.mobile ? this.mobile : f.contact_mobile,
        email: f.email,
        bank_acct_type: f.bank_acct_type,
        bank_name: f.bank_name,
        bank_mobile: f.bank_mobile,
        card_id_mask: f.card_id_mask,
        audit_goods: f.audit_goods === true || f.audit_goods === 'true',
        license_url: f.license_url,
        legal_certid_front_url: f.legal_certid_front_url,
        legal_cert_id_back_url: f.legal_cert_id_back_url,
        bank_card_front_url: f.bank_card_front_url,
        contract_url: f.contract_url
      }

      if (this.$route.query.type === 'add') {
        payload.settled_succ_sendsms = f.settled_succ_sendsms
        payload.source = 'admin'
      }
      return payload
    },
    async getInfo() {
      const result = await addTheBusinessman(this.buildPayload(), null)
      if (result.data.data.mobile && result.data.data.password) {
        this.tip = {
          username: result.data.data.mobile,
          password: result.data.data.password
        }
      }
    },
    submitFn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false
        if (this.$route.query.type === 'add' && this.createAccount == '2' && !this.mobile) {
          this.$message.error(this.$t('e8e4e935.8098e2'))
          return false
        }
        this.syncMainCategorySelection()
        const selection = this.form.main_category_selection || []
        const hasValidCategory = selection.some((item) =>
          [2, 3].includes(Number(item.level))
        )
        if (!selection.length || !hasValidCategory) {
          this.$message.error(this.$t('e8e4e935.4709c8'))
          return false
        }
        const { type, merchantId } = this.$route.query
        const payload = this.buildPayload()
        const result = await addTheBusinessman(payload, type == 'edit' ? merchantId : null)
        if (result.data.data.status) {
          this.$message.success(this.$t('e8e4e935.3b1083'))
          this.isEditCheckBox = true
          this.$router.go(-1)
        }

        if (type === 'add' && result.data.data.mobile && result.data.data.password) {
          this.$message.success(this.$t('e8e4e935.3b1083'))
          this.infoTipVisible = true
          this.isEditCheckBox = true
          this.tip = {
            username: result.data.data.mobile,
            password: result.data.data.password
          }
        }
      })
    },
    fnPass() {
      this.checkBoxConfig.visible = true
      this.checkBoxConfig.message = this.checkBoxMessage(this.$t('e8e4e935.23c1f3'))
      this.currentCheckBoxStatus = true
    },
    fnReject() {
      this.checkBoxConfig.visible = true
      this.checkBoxConfig.message = this.checkBoxMessage(this.$t('e8e4e935.325254'))
      this.currentCheckBoxStatus = false
    },
    /* -------------------------checkbox------------------------- */
    async checkBoxConfirmHandle(data) {
      console.log(data)
      console.log(this.form)
      const obj = {
        id: this.form.id,
        audit_status: this.currentCheckBoxStatus ? '2' : '3',
        audit_memo: data.comments,
        audit_goods: this.form.audit_goods === true || this.form.audit_goods === 'true'
      }
      const result = await setCheckTheEntryOfMerchants(obj)
      if (result.data.data.status) {
        this.$message.success(this.$t('e8e4e935.6e6732'))
        this.checkBoxVisibleHandle()
        this.init()
      }
    },
    checkBoxVisibleHandle() {
      this.currentCheckBoxStatus = ''
      this.checkBoxConfig.visible = false
    },
    /* -------------------------checkbox------------------------- */

    /* -------------------------图片选择------------------------- */
    pickImg({ url }) {
      if (url && this.pickerImgType) {
        const that = this.form
        that[this.pickerImgType] = url
        this.imgDialog = false
      }
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    handleImgPicker(pickerImgType) {
      if (!this.disabled) {
        this.pickerImgType = pickerImgType
        this.imgDialog = true
        this.isGetImage = true
      }
    },
    /* -------------------------图片选择------------------------- */

    async getCategoryOptions() {
      const res = await getCategory({ is_main_category: true })
      const list = Array.isArray(res) ? res : res?.data?.data || []
      this.categoryOptions = this.normalizeCategoryTree(list)
    },
    normalizeCategoryTree(list = [], depth = 1) {
      return list.map((item) => {
        const level = Number(item.category_level) || depth
        const children =
          item.children && item.children.length
            ? this.normalizeCategoryTree(item.children, depth + 1)
            : undefined
        return {
          ...item,
          category_level: level,
          children
        }
      })
    },
    onMainCategoryPathsChange() {
      this.syncMainCategorySelection()
    },
    syncMainCategorySelection() {
      this.form.main_category_selection = this.buildMainCategorySelection()
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.validateField('main_category_selection')
      })
    },
    findCategoryNode(list = [], categoryId) {
      for (const item of list) {
        if (String(item.category_id) === String(categoryId)) return item
        if (item.children?.length) {
          const found = this.findCategoryNode(item.children, categoryId)
          if (found) return found
        }
      }
      return null
    },
    findCategoryPath(list = [], categoryId, path = []) {
      for (const item of list) {
        const next = [...path, item.category_id]
        if (String(item.category_id) === String(categoryId)) return next
        if (item.children?.length) {
          const found = this.findCategoryPath(item.children, categoryId, next)
          if (found) return found
        }
      }
      return null
    },
    resolveCategoryPaths(selection) {
      if (!Array.isArray(selection) || !selection.length) return []
      return selection
        .map((item) => {
          if (item?.path) {
            return String(item.path)
              .split(/[,/|>]/)
              .map((id) => Number(id) || id)
              .filter((id) => id !== '' && id != null)
          }
          if (item?.category_id == null) return []
          return (
            this.findCategoryPath(this.categoryOptions, item.category_id) || [item.category_id]
          )
        })
        .filter((path) => path.length)
    },
    /**
     * 对齐 web 端 selectionFromTreeItems：
     * 一级不提交；有三级的二级只提交已选三级；无三级的二级提交自身。
     */
    buildMainCategorySelection() {
      const paths = this.mainCategoryPaths || []
      if (!paths.length) return []
      const result = []
      const seen = new Set()
      paths.forEach((path) => {
        if (!Array.isArray(path) || !path.length) return
        const categoryId = path[path.length - 1]
        const node = this.findCategoryNode(this.categoryOptions, categoryId)
        const level = Number(node?.category_level) || path.length
        if (level === 1) return
        if (level === 2) {
          const hasLevel3 = (node?.children || []).some(
            (child) => Number(child.category_level) === 3
          )
          if (hasLevel3) return
        }
        if (![2, 3].includes(level)) return
        const key = `${categoryId}:${level}`
        if (seen.has(key)) return
        seen.add(key)
        result.push({
          category_id: Number(categoryId) || categoryId,
          level
        })
      })
      return result
    },
    // 结算所属银行
    async querySearch(queryString, cb) {
      this.AllBank = await this.$api.adapay.getBank({
        bank_name: this.form.bank_name
      })
      var restaurants = this.AllBank.map((item) => {
        return {
          value: item.bank_name,
          bank_code: item.bank_code,
          id: item.id
        }
      })
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      //调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelectBank(val) {
      this.form.bank_code = val.bank_code
      this.form.bank_name = val.value
    },
    checkBoxMessage(status) {
      return this.$t('e8e4e935.605550', {
        status,
        name: this.form.merchant_name
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    const { type } = this.$route.query
    console.log(to, type)
    if (type == 'add' || (type == 'edit' && !this.isEditCheckBox)) {
      this.$confirm(this.$t('e8e4e935.3ba67c'), this.$t('e8e4e935.02d981'), {
        confirmButtonText: this.$t('e8e4e935.38cf16'),
        cancelButtonText: this.$t('e8e4e935.625fb2'),
        type: 'warning'
      })
        .then((res) => {
          next()
        })
        .catch(() => {
          next(false)
        })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.MerchantsEditor {
  .category-tip {
    margin-top: 4px;
    color: #909399;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 400;
  }
  .upload-box {
    width: 150px;
    height: 150px;
    align-items: center;
    display: flex;
    border: 2px dashed #ccc;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    i {
      font-size: 40px;
      color: #999;
    }
    img {
      max-width: 100%;
      max-height: 140px;
    }
    &:hover {
      border-color: #409eff;
    }
  }
  .audit_status {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-bottom: 3px;
    margin-right: 10px;
    border-radius: 50%;
    &.success {
      background: #67c23a;
    }
    &.fail {
      background: red;
    }
  }
  .h5_link {
    color: grey;
    margin-left: 20px;
  }
}
</style>

<style lang="scss">
.MerchantsEditor {
  padding-bottom: 50px;
  .theme {
    font-size: 15px;
    font-weight: 700;
  }
  .el-form-item__label {
    font-size: 12px;
    font-weight: 700;
  }
  .wrap {
    .el-form-item {
      float: left;
      margin-right: 30px;
      p {
        text-align: center;
        font-size: 12px;
      }
    }
    .row {
      text-align: center;
    }
  }
}
</style>
