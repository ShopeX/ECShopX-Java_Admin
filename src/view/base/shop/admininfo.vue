<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <SpPageHeader :title="$t('41eeee23.53cab4')" />
    <SpForm
      ref="form"
      v-model="form"
      submit
      :form-list="formList"
      :reset-btn="false"
      :submit-btn-text="$t('41eeee23.be5fbb')"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      changePwdEnabled: false,
      form: {
        mobile: '',
        username: '',
        head_portrait: '',
        pwd: '',
        repwd: ''
      },
      formList: [
        {
          label: '41eeee23.7116e7',
          key: 'mobile',
          type: 'text'
        },
        {
          label: '41eeee23.23eb0e',
          key: 'username',
          type: 'input'
        },
        {
          label: '41eeee23.4c50ee',
          key: 'head_portrait',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          }
        },
        {
          label: '41eeee23.7fc88a',
          key: 'pwd',
          type: 'input',
          isShow: () => this.changePwdEnabled && !this.VERSION_SHUYUN()
        },
        {
          label: '41eeee23.3fbdde',
          key: 'repwd',
          type: 'input',
          isShow: () => this.changePwdEnabled && !this.VERSION_SHUYUN()
        },
        {
          label: '41eeee23.7fc88a',
          key: 'changePwd',
          type: 'button',
          component: () => {
            return (
              <el-link
                type='primary'
                href='https://account.shopex.cn/account/security'
                target='_blank'
              >
                {this.$t('41eeee23.af20fa')}
              </el-link>
            )
          },
          tip: '41eeee23.505176',
          isShow: () => !this.changePwdEnabled && !this.VERSION_SHUYUN()
        }
      ]
    }
  },
  mounted() {
    this.getAdminInfo()
  },
  methods: {
    async getAdminInfo() {
      const res = await this.$api.login.getAdminInfo()
      this.changePwdEnabled = res.logintype !== 'admin1'
      this.form.mobile = res.mobile
      this.form.username = res.username
      this.form.head_portrait = res.head_portrait
    },
    onSubmit() {
      console.log(this.form)
      const that = this
      this.$api.login.updateAdminInfo(this.form).then((response) => {
        if (response.status) {
          this.$message({
            message: this.$t('41eeee23.55aa63'),
            type: 'success',
            onClose() {
              that.$router.go(-1)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
