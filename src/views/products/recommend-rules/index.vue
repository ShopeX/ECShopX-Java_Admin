<template>
  <SpPage>
    <div class="page-header">
      <div>
        <h2>{{ $t('b213c3c4.5a6889') }}</h2>
        <p>{{ $t('recommendRules.description') }}</p>
      </div>
    </div>
    <DisplaySettings ref="displaySettings" />
    <div class="rules-panel">
      <div class="toolbar">
        <el-input
          v-model="searchParams.keyword"
          clearable
          class="keyword"
          :placeholder="$t('recommendRules.searchPlaceholder')"
          @keyup.enter.native="search"
        />
        <el-button type="primary" icon="el-icon-search" @click="search">
          {{ $t('recommendRules.search') }}
        </el-button>
        <el-button class="add-rule-button" type="primary" @click="openCreate">
          {{ $t('recommendRules.addRule') }}
        </el-button>
      </div>
      <SpTable
        ref="rulesTable"
        url="/goods/recommend-rules"
        :params="{ keyword: searchParams.keyword.trim() }"
        :page-size="6"
        :page-sizes="[6, 20, 50]"
        :columns="tableColumns"
        row-key="id"
        class="rules-table"
      />
    </div>
    <RuleForm v-model="formVisible" :rule="activeRule" :mode="formMode" @submit="saveRule" />
  </SpPage>
</template>

<script>
import DisplaySettings from './components/DisplaySettings'
import RuleForm from './components/RuleForm'
import SpTable from '@/components/sp-table'

export default {
  name: 'RecommendRules',
  components: { DisplaySettings, RuleForm, SpTable },
  computed: {
    tableColumns() {
      return [
        { key: 'id', label: this.$t('recommendRules.id'), minWidth: 220 },
        { key: 'rule_name', label: this.$t('recommendRules.ruleName'), minWidth: 300 },
        {
          key: 'created',
          label: this.$t('recommendRules.created'),
          minWidth: 220,
          formatter: (value) => this.formatDate(value)
        },
        {
          key: 'actions',
          label: this.$t('recommendRules.actions'),
          width: 260,
          render: {
            functional: true,
            render: (h, context) =>
              h('div', { class: 'table-actions' }, [
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: { click: () => this.openEdit(context.props.row) }
                  },
                  [this.$t('recommendRules.edit')]
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text' },
                    on: { click: () => this.openCopy(context.props.row) }
                  },
                  [this.$t('recommendRules.copy')]
                ),
                h(
                  'el-button',
                  { props: { type: 'text' }, on: { click: () => this.remove(context.props.row) } },
                  [this.$t('recommendRules.delete')]
                )
              ])
          }
        }
      ]
    }
  },
  data() {
    return {
      searchParams: { keyword: '' },
      formVisible: false,
      formMode: 'create',
      activeRule: null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.$refs.displaySettings?.dirty) {
      next()
      return
    }
    this.$confirm(
      this.$t('recommendRules.settingsLeaveConfirm'),
      this.$t('recommendRules.discardTitle'),
      {
        type: 'warning',
        cancelButtonText: this.$t('recommendRules.cancel'),
        confirmButtonText: this.$t('recommendRules.confirm')
      }
    )
      .then(() => next())
      .catch(() => next(false))
  },
  methods: {
    search() {
      this.$refs.rulesTable.refresh(true)
    },
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(Number(value) > 1e12 ? Number(value) : Number(value) * 1000)
      return isNaN(date.getTime()) ? value : date.toLocaleString()
    },
    openCreate() {
      this.formMode = 'create'
      this.activeRule = null
      this.formVisible = true
    },
    async openEdit(row) {
      this.formMode = 'edit'
      await this.openForm(row)
    },
    async openCopy(row) {
      this.formMode = 'copy'
      await this.openForm(row)
    },
    async openForm(row) {
      try {
        this.activeRule = await this.$api.recommendRules.getRecommendRuleDetail(row.id)
      } catch (error) {
        this.$message.error(error?.msg || this.$t('recommendRules.loadDetailFailed'))
        return
      }
      this.formVisible = true
    },
    async saveRule(payload, done, fail, options = {}) {
      try {
        if (this.formMode === 'edit') {
          await this.$api.recommendRules.updateRecommendRule({
            id: this.activeRule.id,
            ...payload,
            ...options
          })
        } else {
          await this.$api.recommendRules.createRecommendRule({ ...payload, ...options })
        }
        this.$message.success(this.$t('recommendRules.saved'))
        done()
        this.$refs.rulesTable.refresh()
      } catch (error) {
        const statusCode = error?.status_code || error?.data?.status_code
        if (statusCode === 409 && !options.exclude_conflict_main_items) {
          try {
            await this.$confirm(
              error?.msg || this.$t('recommendRules.excludeConflictConfirm'),
              this.$t('recommendRules.discardTitle'),
              {
                type: 'warning',
                cancelButtonText: this.$t('recommendRules.cancel'),
                confirmButtonText: this.$t('recommendRules.confirm')
              }
            )
            return this.saveRule(payload, done, fail, { exclude_conflict_main_items: true })
          } catch (confirmError) {
            if (fail) fail(error)
            return
          }
        }
        this.$message.error(error?.msg || this.$t('recommendRules.saveRuleFailed'))
        if (fail) fail(error)
      }
    },
    remove(row) {
      this.$confirm(
        this.$t('recommendRules.deleteConfirm'),
        this.$t('recommendRules.deleteTitle'),
        {
          type: 'warning',
          cancelButtonText: this.$t('recommendRules.cancel'),
          confirmButtonText: this.$t('recommendRules.confirm')
        }
      )
        .then(async () => {
          try {
            await this.$api.recommendRules.deleteRecommendRule(row.id)
            this.$message.success(this.$t('recommendRules.deleted'))
            this.$refs.rulesTable.refresh()
          } catch (error) {
            this.$message.error(error?.msg || this.$t('recommendRules.deleteFailed'))
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.page-header,
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0 0 8px;
}
.page-header p {
  margin: 0;
  color: #909399;
}
.keyword {
  width: 280px;
  margin-right: 10px;
}
.toolbar {
  justify-content: flex-start;
}
.page-header {
  padding: 8px 0 22px;
  border-bottom: 1px solid #ebeef5;
}
.page-header h2 {
  font-size: 24px;
  color: #20212a;
}
.rules-panel {
  padding: 20px 0 0;
}
.toolbar {
  display: flex;
  align-items: center;
  padding: 0 0 16px;
}
.toolbar .el-input {
  width: 350px;
}
.add-rule-button {
  margin-left: auto;
}
.rules-table {
  border: 0;
}
.rules-table ::v-deep .el-table th {
  background: #faf9fc;
  color: #85818d;
}
.rules-table ::v-deep .el-table td {
  height: 70px;
}
.table-actions ::v-deep .el-button {
  margin-right: 4px;
  color: #8b46de;
}
.table-actions ::v-deep .el-button:last-child {
  color: #d84b5a;
}
</style>
