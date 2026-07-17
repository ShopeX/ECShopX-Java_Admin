<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-card>
      <el-table :data="list" data-testid="member-trustlogin-table">
        <el-table-column :label="$t('8da83775.2b6bc0')" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">
              {{ $t('b64b502c.224e2c') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('b64b502c.d7ec2d')" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('b64b502c.3fea7c')" width="300">
          <template slot-scope="scope">
            <div>
              <el-tag
                v-if="scope.row.status == true || scope.row.status == 'true'"
                type="success"
              >
                {{ $t('b64b502c.cc42dd') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.status == false || scope.row.status == 'false'"
                type="danger"
              >
                {{ $t('b64b502c.b15d91') }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <sideBar :visible.sync="show_sideBar" :title="$t('b64b502c.224e2c')">
      <el-form>
        <el-form-item :label="$t('b64b502c.d7ec2d')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="app_id">
          <el-input v-model="form.app_id" />
        </el-form-item>
        <el-form-item label="secret">
          <el-input v-model="form.secret" />
        </el-form-item>
        <el-form-item label="extra_config">
          <el-input
            v-model="form.extra_config"
            type="textarea"
            :rows="4"
            placeholder='{"team_id":"","key_id":"","private_key":""}'
            data-testid="member-trustlogin-extra-config"
          />
        </el-form-item>
        <el-form-item :label="$t('b64b502c.3fea7c')">
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="statusChange(form)">
            {{ $t('b64b502c.939d53') }}
          </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </SpPage>
</template>
<script>
import sideBar from '@/components/element/sideBar'
import { getTrustLoginList, saveStatusSetting } from '../../../api/trustlogin'
export default {
  components: {
    sideBar
  },
  data() {
    return {
      loading: false,
      show_sideBar: false,
      list: [],
      form: {
        name: '',
        app_id: '',
        secret: '',
        extra_config: '',
        status: false,
        loginversion: 'touch',
        type: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.loading = true
      getTrustLoginList().then((res) => {
        const payload = res.data.data || { touch: [] }
        this.list = Array.isArray(payload.touch) ? payload.touch : []
        this.list.forEach((row) => {
          if (row.status === 'true') row.status = true
          if (row.status === 'false') row.status = false
          if (row.extra_config === undefined || row.extra_config === null) {
            row.extra_config = ''
          }
        })
        this.loading = false
      })
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.form.name = data.name
      this.form.status = data.status
      this.form.app_id = data.app_id
      this.form.secret = data.secret
      this.form.extra_config = data.extra_config || ''
      this.form.type = data.type
      this.form.loginversion = 'touch'
    },
    statusChange(data) {
      saveStatusSetting(data)
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$t('b64b502c.3b1083')
          })
          this.show_sideBar = false
          this.getConfig()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('b64b502c.6de920')
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
