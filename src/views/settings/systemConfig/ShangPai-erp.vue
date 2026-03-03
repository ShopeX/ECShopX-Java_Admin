<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="cer-box">
      <SpFormPlus
        ref="form"
        v-model="creInfo"
        :form-items="formItems"
        form-type="form"
        label-width="150px"
        :show-default-actions="false"
      />
      <el-row class="mb-10">
        <el-col :span="4">
          <el-button type="primary" @click="deleteCer">{{ $t('073515a8.7b49f4') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="cer-box">
      <el-row>
        <el-col :span="4" class="col-right">{{ $t('073515a8.8ad285') }}</el-col>
        <el-col :span="4">
          <el-button type="primary" @click="bindRelation">{{ $t('073515a8.1c5b43') }}</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="lookRelation">{{ $t('073515a8.4fc632') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="$t('073515a8.1c5b43')" :visible.sync="dialogBindVisible" fullscreen>
      <div>
        <iframe :src="bindUrl" width="1200" height="980" frameborder="0" scrolling="auto" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogBindVisible = false">{{
          $t('073515a8.9d2578')
        }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('073515a8.4fc632')" :visible.sync="dialogLookVisible" fullscreen>
      <div>
        <iframe :src="lookUrl" width="1200" height="980" frameborder="0" scrolling="auto" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogLookVisible = false">{{
          $t('073515a8.9d2578')
        }}</el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>
<script>
import { Message } from 'element-ui'
import { getCertificate, deleteCertificateInfo, bindRelation, acceptRelation } from '@/api/company'
export default {
  data() {
    return {
      creInfo: {
        cert_id: '',
        node_id: '',
        shopex_uid: ''
      },
      loading: false,
      dialogBindVisible: false,
      bindUrl: '',
      dialogLookVisible: false,
      lookUrl: ''
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: '__group_title',
          component: 'group',
          label: this.$t('073515a8.ac07a8')
        },
        {
          fieldName: 'cert_id',
          label: this.$t('073515a8.0a8cc4'),
          formItemClass: 'w-1/2',
          component: 'input',
          componentProps: {
            readonly: true
          }
        },
        {
          fieldName: '__group_title2',
          component: 'group',
          label: this.$t('073515a8.f5b1c6')
        },
        {
          fieldName: 'node_id',
          label: this.$t('073515a8.ce8c5c'),
          formItemClass: 'w-1/2',
          component: 'input',
          componentProps: {
            readonly: true
          }
        },
        {
          fieldName: 'shopex_uid',
          label: this.$t('073515a8.ce8c5c'),
          formItemClass: 'w-1/2',
          component: 'input',
          componentProps: {
            readonly: true
          }
        }
      ]
    }
  },
  mounted() {
    this.getCerInfo()
  },
  methods: {
    getCerInfo() {
      this.loading = true
      getCertificate().then((response) => {
        this.creInfo = {
          cert_id: response.data.data.cert_id,
          node_id: response.data.data.node_id,
          shopex_uid: response.data.data.shopex_uid
        }
        this.loading = false
      })
    },
    deleteCer() {
      this.$confirm(this.$t('073515a8.83eb97'), this.$t('073515a8.02d981'), {
        confirmButtonText: this.$t('073515a8.38cf16'),
        cancelButtonText: this.$t('073515a8.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteCertificateInfo().then((response) => {
            this.$message({
              message: this.$t('073515a8.0007d1'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          //用户取消删除操作
        })
    },
    bindRelation() {
      bindRelation().then((response) => {
        this.bindUrl = response.data.data.url
        this.dialogBindVisible = true
      })
    },
    lookRelation() {
      acceptRelation().then((response) => {
        this.lookUrl = response.data.data.url
        this.dialogLookVisible = true
      })
    }
  }
}
</script>
