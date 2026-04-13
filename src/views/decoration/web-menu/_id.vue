<!--
  导航菜单：创建 /decoration/web-menu/create 与编辑 /decoration/web-menu/:id 共用
  编辑模式下维护菜单项（两层拖拽 + useDialog + MenuItemForm）
-->
<template>
  <SpPage>
    <SpPageHeader :title="pageTitle" />

    <SpFormPlus
      ref="menuFormRef"
      v-model="menuForm"
      form-type="form"
      label-width="120px"
      class="menu-meta-form"
      :show-default-actions="false"
      :form-items="menuFormItems"
    />

    <el-alert
      v-if="isCreate"
      class="mt-4"
      type="info"
      :closable="false"
      title="请先保存菜单基本信息，保存后可在此页管理菜单项。"
      show-icon
    />

    <template v-else>
      <div class="menu-toolbar">
        <el-button type="primary" @click="openItemDialog(null, 0)">新增顶级菜单项</el-button>
      </div>

      <div v-loading="loading">
        <draggable v-model="topItems" handle=".drag-handle" :animation="200" @end="onTopSortEnd">
          <div v-for="item in topItems" :key="item.id" class="menu-block">
            <div class="menu-item__row menu-item__row--root">
              <span class="drag-handle">⠿</span>
              <span
                v-if="item.children && item.children.length"
                class="menu-item__toggle"
                @click="item._expanded = !item._expanded"
                >{{ item._expanded ? '▼' : '▶' }}</span
              >
              <span v-else class="menu-item__toggle menu-item__toggle--empty" />
              <span class="menu-item__name">{{ item.name }}</span>
              <span class="menu-item__link">{{ itemLinkLabel(item) }}</span>
              <div class="menu-item__actions">
                <el-button type="text" @click="openItemDialog(null, item.id)">添加子项</el-button>
                <el-button type="text" @click="openItemDialog(item, 0)">编辑</el-button>
                <el-button type="text" style="color: #f56c6c" @click="handleDeleteItem(item)"
                  >删除</el-button
                >
              </div>
            </div>

            <draggable
              v-if="item._expanded && item.children && item.children.length"
              v-model="item.children"
              handle=".drag-handle"
              :animation="200"
              class="menu-item__children"
              @end="onChildSortEnd(item)"
            >
              <div
                v-for="child in item.children"
                :key="child.id"
                class="menu-item__row menu-item__row--child"
              >
                <span class="drag-handle">⠿</span>
                <span class="menu-item__toggle menu-item__toggle--empty" />
                <span class="menu-item__name">{{ child.name }}</span>
                <span class="menu-item__link">{{ itemLinkLabel(child) }}</span>
                <div class="menu-item__actions">
                  <el-button type="text" @click="openItemDialog(child, 0)">编辑</el-button>
                  <el-button type="text" style="color: #f56c6c" @click="handleDeleteItem(child)"
                    >删除</el-button
                  >
                </div>
              </div>
            </draggable>
          </div>
        </draggable>
      </div>
    </template>

    <div class="mt-6 flex gap-3">
      <el-button @click="goList">取消</el-button>
      <el-button type="primary" :loading="menuSaving" @click="saveMenu">保存</el-button>
    </div>
  </SpPage>
</template>

<script>
import Draggable from 'vuedraggable'
import { useDialog } from '@shopex-ui/finder'
import SpFormPlus from '@/components/sp-form-plus'

const defaultMenuForm = () => ({
  name: '',
  key: '',
  status: 1
})

export default {
  name: 'WebMenuId',
  components: { Draggable, SpFormPlus },
  data() {
    return {
      loading: false,
      menuSaving: false,
      menuForm: defaultMenuForm(),
      topItems: []
    }
  },
  computed: {
    isCreate() {
      return this.$route.name === 'webMenuCreate'
    },
    menuId() {
      if (this.isCreate) return null
      const id = Number(this.$route.params.id)
      return Number.isFinite(id) && id > 0 ? id : null
    },
    pageTitle() {
      return this.isCreate ? '新增菜单' : '编辑菜单'
    },
    menuFormItems() {
      return [
        {
          fieldName: 'name',
          label: '菜单名称',
          component: 'input',
          rules: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
          componentProps: { placeholder: '如：顶部导航', clearable: true }
        },
        {
          fieldName: 'key',
          label: '标识符（Handle）',
          component: 'input',
          rules: [{ required: true, message: '请输入标识符', trigger: 'blur' }],
          componentProps: { placeholder: '如：header_nav', clearable: true }
        },
        {
          fieldName: 'status',
          label: '状态',
          component: 'select',
          componentProps: {
            options: [
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 }
            ]
          }
        }
      ]
    }
  },
  watch: {
    $route: {
      handler() {
        this.bootstrap()
      },
      immediate: true
    }
  },
  methods: {
    itemLinkLabel(item) {
      const lt = item.link_type || 'url'
      const v = item.link_value != null ? String(item.link_value) : ''
      if (lt === 'url' || lt === 'none') {
        return v || '—'
      }
      return `${lt}${v ? `：${v}` : ''}`
    },
    bootstrap() {
      if (this.isCreate) {
        this.menuForm = defaultMenuForm()
        this.topItems = []
        return
      }
      if (!this.menuId) {
        this.$message.error('无效的菜单 ID')
        return
      }
      this.fetchDetail()
    },
    goList() {
      this.$router.replace('/decoration/web-menu')
    },
    async saveMenu() {
      try {
        await this.$refs.menuFormRef.validate()
      } catch (e) {
        return
      }
      this.menuSaving = true
      try {
        if (this.isCreate) {
          const created = await this.$api.decoration.createMenu(this.menuForm)
          const newId = created && created.id != null ? Number(created.id) : null
          if (!newId) {
            this.$message.error('创建失败，未返回菜单 ID')
            return
          }
          this.$message.success('保存成功')
          this.$router.replace(`/decoration/web-menu/${newId}`)
          return
        }
        await this.$api.decoration.updateMenu(this.menuId, this.menuForm)
        this.$message.success('保存成功')
        await this.fetchDetail()
      } catch (e) {
        // 全局拦截已提示
      } finally {
        this.menuSaving = false
      }
    },
    async fetchDetail() {
      if (!this.menuId) return
      this.loading = true
      try {
        const menu = await this.$api.decoration.getMenuDetail(this.menuId)
        if (!menu) {
          this.$message.error('加载菜单失败')
          return
        }
        this.menuForm = {
          name: menu.name != null ? menu.name : '',
          key: menu.key != null ? menu.key : '',
          status: menu.status != null ? menu.status : 1
        }
        const items = menu.items || []
        this.topItems = items.map((item) => ({
          ...item,
          _expanded: true,
          children: item.children || []
        }))
      } catch (e) {
        console.error(e)
        this.$message.error((e && e.message) || '加载菜单详情失败')
      } finally {
        this.loading = false
      }
    },
    openItemDialog(item, parentIdForCreate) {
      if (!this.menuId) return
      const editingItemId = item ? item.id : null
      const currentParentId = item ? item.parent_id : parentIdForCreate
      const initialValue = item
        ? {
            id: item.id,
            name: item.name,
            url: item.link_value != null ? String(item.link_value) : '',
            sort: item.sort,
            status: item.status
          }
        : { name: '', url: '', sort: 0, status: 1 }

      useDialog(this, {
        title: editingItemId ? '编辑菜单项' : '新增菜单项',
        width: '640px',
        component: () => import('./components/MenuItemForm.vue'),
        props: { initialValue },
        actions: [
          { type: 'default', label: '取消', key: 'close' },
          { type: 'primary', label: '确认', key: 'confirm' }
        ]
      }).then(async (data) => {
        if (!data) return
        const payload = {
          name: data.name,
          link_type: 'url',
          link_value: data.url != null ? String(data.url) : '',
          sort: data.sort != null ? Number(data.sort) : 0,
          status: data.status != null ? Number(data.status) : 1,
          parent_id: currentParentId
        }
        try {
          if (editingItemId) {
            await this.$api.decoration.updateMenuItem(this.menuId, editingItemId, payload)
          } else {
            await this.$api.decoration.createMenuItem(this.menuId, payload)
          }
          this.$message.success('保存成功')
          await this.fetchDetail()
        } catch (e) {
          console.error(e)
        }
      })
    },
    async handleDeleteItem(item) {
      if (!this.menuId) return
      const tip =
        item.parent_id === 0
          ? `确认删除「${item.name}」？其下子菜单项将一并删除。`
          : `确认删除「${item.name}」？`
      try {
        await this.$confirm(tip, '删除确认', { type: 'warning' })
        await this.$api.decoration.removeMenuItem(this.menuId, item.id)
        this.$message.success('删除成功')
        await this.fetchDetail()
      } catch (e) {
        if (e !== 'cancel') console.error(e)
      }
    },
    async onTopSortEnd() {
      if (!this.menuId) return
      const sorts = this.topItems.map((row, idx) => ({ id: row.id, sort: idx }))
      await this.$api.decoration.sortMenuItems(this.menuId, sorts)
    },
    async onChildSortEnd(parentItem) {
      if (!this.menuId) return
      const sorts = parentItem.children.map((child, idx) => ({ id: child.id, sort: idx }))
      await this.$api.decoration.sortMenuItems(this.menuId, sorts)
    }
  }
}
</script>

<style scoped>
.menu-meta-form {
  max-width: 640px;
}
.menu-toolbar {
  margin: 16px 0;
}
.menu-block {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 12px;
  background: #fff;
}
.menu-item__row {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 8px;
}
.menu-item__row--child {
  padding-left: 36px;
  border-top: 1px solid #f2f2f2;
}
.menu-item__children {
  border-top: 1px solid #ebeef5;
}
.drag-handle {
  cursor: move;
  color: #909399;
  user-select: none;
}
.menu-item__toggle {
  width: 20px;
  cursor: pointer;
  color: #606266;
}
.menu-item__toggle--empty {
  width: 20px;
}
.menu-item__name {
  flex: 1;
  font-weight: 500;
}
.menu-item__link {
  flex: 1;
  color: #909399;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.menu-item__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
</style>
