<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      v-model="params"
      form-type="searchForm"
      label-width="auto"
      :default-cell-width="300"
      :form-items="searchFormItems"
      @submit="onSearch"
      @reset="onSearch"
    />

    <div class="action-container">
      <el-button type="primary" icon="plus" @click="addLabels">
        {{ $t('81d2acb6.f0677c') }}
      </el-button>
    </div>

    <el-table v-loading="loading" border :data="accountsList">
      <el-table-column :label="$t('81d2acb6.2b6bc0')" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.$index, scope.row)">
            {{ $t('81d2acb6.95b351') }}
          </el-button>
          <!--<el-button
            type="text"
            @click="deleteAccountAction(scope.$index, scope.row)"
          >
            删除
          </el-button>-->
        </template>
      </el-table-column>
      <el-table-column prop="login_name" :label="$t('81d2acb6.bb2cdf')" />
      <el-table-column prop="mobile" :label="$t('81d2acb6.8098e2')" />
      <el-table-column prop="username" :label="$t('81d2acb6.60d045')" />
      <el-table-column :label="$t('f3a67ede.5c16c5')" min-width="180" v-if="!VERSION_PLATFORM()">
        <template slot-scope="scope">
          <template v-if="scope.row.distributor_ids && scope.row.distributor_ids.length">
            <el-tag
              v-for="item in scope.row.distributor_ids"
              :key="item.distributor_id"
              size="mini"
              class="rel-distributor-tag"
            >
              {{ item.name }}
            </el-tag>
          </template>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="roles" :label="$t('81d2acb6.464f3d')" min-width="180">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.role_data"
            :key="item.role_id"
            size="mini"
            type="warning"
          >
            {{ item.role_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" :label="$t('81d2acb6.710ad0')" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_disable"
            active-value="1"
            inactive-value="0"
            active-color="#ff4949"
            inactive-color="#ccc"
            @change="acitonDisabled(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="page.pageIndex"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item :label="$t('81d2acb6.bb2cdf')">
            <div class="flex flex-col items-start">
              <el-input
                v-if="!editLoginName"
                v-model="form.login_name"
                class="!w-[250px]"
                :minlength="4"
                :maxlength="16"
                :placeholder="$t('81d2acb6.2b668a')"
              />
              <el-input
                v-else
                v-model="form.login_name"
                class="!w-[250px]"
                :disabled="true"
              />
              <p class="frm-tips whitespace-nowrap !pb-0">{{ $t('81d2acb6.d59d95') }}</p>
            </div>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.8098e2')">
            <el-col :span="10">
              <el-input
                v-if="!isEdit"
                v-model="form.mobile"
                :maxlength="11"
                :placeholder="$t('81d2acb6.fed6c9')"
              />
              <el-input v-else v-model="editMobile" :disabled="true" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.60d045')">
            <el-col :span="10">
              <el-input v-model="form.username" required :placeholder="$t('81d2acb6.629b2e')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.2646b8')">
            <el-col :span="10">
              <el-input v-model="form.password" :maxlength="255" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.baad7e')">
            <div class="flex flex-col items-start gap-2">
              <SpSelectShop
                ref="shopSelect"
                v-model="selectedDistributorIds"
                multiple
                class="!w-[250px]"
                :placeholder="$t('81d2acb6.a5d26b')"
                :query-params="shopPickerQueryParams"
                @change="onShopSelectChange"
              />
              <div
                v-if="boundDistributors.length"
                class="flex max-w-[480px] flex-wrap gap-1"
              >
                <el-tag
                  v-for="item in boundDistributors"
                  :key="item.distributor_id"
                  size="small"
                  closable
                  @close="removeBoundShop(item.distributor_id)"
                >
                  {{ item.name }}
                  <span v-if="item.shop_code" class="text-[#909399]">（{{ item.shop_code }}）</span>
                </el-tag>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.464f3d')">
            <el-checkbox-group v-model="form.role_id">
              <el-checkbox
                v-for="role in rolesListData"
                :key="role.role_id"
                :label="role.role_id"
                :value="role.role_id"
              >
                {{ role.role_name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> {{ $t('81d2acb6.625fb2') }} </el-button>
        <el-button type="primary" @click="submitAction"> {{ $t('81d2acb6.be5fbb') }} </el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>
<script>
import {
  createAccount,
  getAccountInfo,
  getAccountList,
  updateAccountInfo,
  deleteAccountInfo,
  getRolesList
} from '../../../api/company'
import { getDistributorList } from '@/api/marketing'
import { changeOperatorStatus } from '@/api/login'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /** 账户已绑定店铺（提交全量；追加选择时合并去重） */
      boundDistributors: [],
      selectedDistributorIds: [],
      isEdit: false,
      editVisible: false,
      editTitle: '',

      form: {
        operator_type: 'staff',
        mobile: '',
        login_name: '',
        username: '',
        distributor_ids: [],
        password: '',
        role_id: []
      },
      activeName: 'staff',

      editLoginName: '',
      editMobile: '',
      accountsList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        mobile: '',
        login_name: '',
        username: ''
      },
      operator_id: 0,
      rolesListData: [],
      datapass_block: 0
    }
  },
  computed: {
    /** 与原先 DistributorSelect 请求范围一致 */
    shopPickerQueryParams() {
      return {
        show_distributor_self: 1,
        is_valid: 'cloud_all'
      }
    },
    searchFormItems() {
      return [
        {
          fieldName: 'login_name',
          label: this.$t('81d2acb6.8c2e31'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('81d2acb6.3103ef'),
            clearable: true
          }
        },
        {
          fieldName: 'mobile',
          label: this.$t('81d2acb6.ce2bf3'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('81d2acb6.6e4f4b'),
            clearable: true
          }
        },
        {
          fieldName: 'username',
          label: this.$t('81d2acb6.75d152'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('81d2acb6.8093e3'),
            clearable: true
          }
        }
      ]
    }
  },
  watch: {
    status(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    this.fetchList()
    this.getRolesListData()
  },
  methods: {
    onShopSelectChange(val) {
      const pickedIds = val == null || val === '' ? [] : Array.isArray(val) ? val : [val]
      if (!pickedIds.length) {
        this.syncShopSelectLabel()
        return
      }
      const mergedIds = [
        ...new Set([
          ...this.boundDistributors.map((item) => item.distributor_id),
          ...pickedIds
        ])
      ]
      this.mergeBoundDistributors(mergedIds)
    },
    removeBoundShop(distributorId) {
      this.boundDistributors = this.boundDistributors.filter(
        (item) => item.distributor_id !== distributorId
      )
      this.selectedDistributorIds = this.boundDistributors.map((item) => item.distributor_id)
      this.syncShopSelectLabel()
    },
    setBoundFromAccountRows(rows) {
      this.boundDistributors = (rows || []).map((item) => ({
        distributor_id: item.distributor_id,
        name: item.name,
        shop_code: item.shop_code
      }))
      this.selectedDistributorIds = this.boundDistributors.map((item) => item.distributor_id)
      this.syncShopSelectLabel()
    },
    syncShopSelectLabel() {
      this.$nextTick(() => {
        const shopSelect = this.$refs.shopSelect
        if (!shopSelect) return
        const list = this.boundDistributors
        if (!list.length) {
          shopSelect.selectValue = ''
          return
        }
        shopSelect.selectValue =
          list.length === 1 ? list[0].name : this.$t('d6d1dfc8.013ecd', { n: list.length })
      })
    },
    mergeBoundDistributors(ids) {
      if (!ids.length) {
        this.boundDistributors = []
        this.selectedDistributorIds = []
        this.syncShopSelectLabel()
        return
      }
      getDistributorList({ distributor_id: ids, is_app: 1, is_valid: 'cloud_all', show_distributor_self: 1 }).then((res) => {
        const fetched = res.data.data.list || []
        const byId = new Map(
          this.boundDistributors.map((item) => [String(item.distributor_id), item])
        )
        fetched.forEach((item) => {
          byId.set(String(item.distributor_id), item)
        })
        this.boundDistributors = ids
          .map((id) => byId.get(String(id)))
          .filter(Boolean)
        this.selectedDistributorIds = this.boundDistributors.map((item) => item.distributor_id)
        this.syncShopSelectLabel()
      })
    },
    handleCancel() {
      this.editVisible = false
      this.form.operator_type = 'staff'
      this.operator_id = ''
      this.form.login_name = ''
      this.form.mobile = ''
      this.form.username = ''
      this.form.password = ''
      this.form.role_id = []
      this.form.distributor_ids = []
      this.boundDistributors = []
      this.selectedDistributorIds = []
      this.syncShopSelectLabel()
    },
    addLabels() {
      // 添加物料弹框
      this.handleCancel()
      this.editTitle = this.$t('81d2acb6.f1333f')
      this.editVisible = true
      this.isEdit = false
      this.form.username = ''
      this.form.login_name = ''
      this.editLoginName = ''
      this.editMobile = ''
      this.operator_id = ''
      this.form.password = ''
      this.form.role_id = []
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      this.editTitle = this.$t('81d2acb6.67b76a')
      this.editVisible = true
      this.isEdit = true
      this.form.username = row.username
      this.form.login_name = row.login_name
      this.editLoginName = row.login_name
      this.editMobile = row.mobile
      this.operator_id = row.operator_id
      this.form.password = ''
      row.role_data.forEach((item) => {
        this.form.role_id.push(item.role_id)
      })
      if (row.distributor_ids && row.distributor_ids.length > 0) {
        this.setBoundFromAccountRows(row.distributor_ids)
      }
    },
    submitAction() {
      // 提交物料
      this.form.distributor_ids = []
      if (this.boundDistributors.length > 0) {
        this.boundDistributors.forEach((distributor) => {
          this.form.distributor_ids.push({
            name: distributor.name,
            distributor_id: distributor.distributor_id
          })
        })
      }

      if (this.operator_id) {
        updateAccountInfo(this.operator_id, this.form).then((response) => {
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
        })
      } else {
        createAccount(this.form).then((response) => {
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
          this.handleCancel()
        })
      }
    },

    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        operator_type: 'staff',
        ...this.params
      }
      getAccountList(params).then((response) => {
        let list = response.data.data.list
        list.forEach((item) => {
          if (item.is_disable == 1) {
            item.is_disable = '1'
          } else {
            item.is_disable = '0'
          }
        })

        this.accountsList = list
        this.total_count = response.data.data.total_count
        this.datapass_block = response.data.data.datapass_block
        this.loading = false
      })
    },
    deleteAccountAction(index, row) {
      this.$confirm(this.$t('81d2acb6.80ae2a'), this.$t('81d2acb6.02d981'), {
        confirmButtonText: this.$t('81d2acb6.38cf16'),
        cancelButtonText: this.$t('81d2acb6.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteAccountInfo(row.operator_id)
            .then((response) => {
              this.accountsList.splice(index, 1)
              this.$message({
                message: this.$t('81d2acb6.0007d1'),
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('81d2acb6.acf066')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('81d2acb6.2111cc')
          })
        })
    },
    acitonDisabled(index, row) {
      if (row.is_disabled === true) {
        var msg = this.$t('81d2acb6.a26113')
        this.$confirm(msg, this.$t('81d2acb6.02d981'), {
          confirmButtonText: this.$t('81d2acb6.38cf16'),
          cancelButtonText: this.$t('81d2acb6.625fb2'),
          type: 'warning'
        }).then(() => {
          let params = {
            operator_id: row.operator_id,
            is_disable: row.is_disable
          }
          changeOperatorStatus(params).then((res) => {
            // this.fetchList()
          })
        })
      } else {
        let params = {
          operator_id: row.operator_id,
          is_disable: row.is_disable
        }
        changeOperatorStatus(params).then((res) => {
          // this.fetchList()
        })
      }
    },
    getRolesListData() {
      var params = { page: 1, pageSize: 100, version: 1 }
      getRolesList(params).then((res) => {
        this.rolesListData = res.data.data.list
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}
.rel-distributor-tag + .rel-distributor-tag {
  margin-left: 5px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
