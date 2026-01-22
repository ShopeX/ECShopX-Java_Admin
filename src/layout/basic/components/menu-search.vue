<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div
    class="flex items-center gap-2 px-3 py-1 cursor-pointer bg-gray-100 hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
    @click="openSearchDialog">
    <Search theme="outline" :size="14" fill="#333" />
    <span class="text-gray-600">搜索</span>
    <span class="px-2 py-1 bg-white rounded-l-md rounded-r-xl text-gray-700 font-medium">Ctrl+K</span>
  </div>
</template>

<script>
import { getBasePath } from '@/utils'
import { Search, EnterKey, SortThree } from '@icon-park/vue'

export default {
  name: 'MenuSearch',
  components: {
    Search, EnterKey, SortThree
  },
  data() {
    return {
      dialogVisible: false,
      dialogPromise: null,
      searchHistoryKey: 'menu_search_history',
      dialogCheckInterval: null
    }
  },
  mounted() {
    //页面刷新后，清理可能残留的对话框元素和状态
    this.$nextTick(() => {
      this.forceCleanup()
    })
    this.handleKeydown = (e) => {
      const isCtrlK = (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')
      if (isCtrlK) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        //如果对话框已经打开，无事发生
        if (this.dialogVisible || this.dialogPromise) {
          return false
        }
        this.openSearchDialog()
      }
    }
    window.addEventListener('keydown', this.handleKeydown, true)
  },
  beforeDestroy() {
    if (this.handleKeydown) {
      window.removeEventListener('keydown', this.handleKeydown, true)
    }
    if (this.dialogCheckInterval) {
      clearInterval(this.dialogCheckInterval)
      this.dialogCheckInterval = null
    }
    this.resetDialogState()
  },
  methods: {
    openSearchDialog() {
      if (this.dialogVisible || this.dialogPromise) {
        return
      }
      //清理所有可能残留的状态和DOM，确保完全干净
      this.forceCleanup()
      //确保清理完成后再打开对话框
      this.$nextTick(() => {
        this.openDialog()
      })
    },
    forceCleanup() {
      this.resetDialogState()
      this.cleanupDialogDOM()
    },

    openDialog() {
      if (this.dialogVisible || this.dialogPromise) {
        return
      }
      this.dialogVisible = true

      this.dialogPromise = this.$dialog.open({
        title: '',
        size: 'mini',
        buttonCancel: {
          visible: false,
        },
        buttonConfirm: {
          visible: false
        },
        content: this.renderSearchContent()
      })

      //对话框关闭后立即重置状态并清理遮罩层
      const resetState = () => {
        this.resetDialogState()
        this.cleanupDialogDOM()
      }

      this.dialogPromise.finally(() => {
        this.clearDialogCheckInterval()
        resetState()
      }).catch(() => {
        this.clearDialogCheckInterval()
        resetState()
      })

      // 定时检查对话框状态和DOM的一致性
      // 只在发现不一致时才清理，如果对话框正常打开（DOM和状态都一致），不关闭
      this.dialogCheckInterval = setInterval(() => {
        //检查对话框 DOM 是否存在
        const dialogWrapper = document.querySelector('.el-dialog__wrapper')
        const hasDialogDOM = !!dialogWrapper
        const hasDialogState = !!(this.dialogVisible || this.dialogPromise)

        // DOM 不存在但状态存在：用户手动关闭了，立即清理状态
        if (!hasDialogDOM && hasDialogState) {
          this.clearDialogCheckInterval()
          this.resetDialogState()
          this.cleanupDialogDOM()
          return
        }

        // DOM 存在但状态不存在：跳转后状态已清理但DOM还在，立即清理DOM
        if (hasDialogDOM && !hasDialogState) {
          this.clearDialogCheckInterval()
          this.cleanupDialogDOM()
          return
        }
        // DOM 和状态都一致，都存在或都不存在：正常情况，继续检查，不关闭
        // 如果都一致，定时器继续运行，直到对话框关闭（通过finally回调停止）
      }, 200) //每200ms检查一次，既能快速响应手动关闭和跳转，又不会太频繁
    },
    clearDialogCheckInterval() {
      if (this.dialogCheckInterval) {
        clearInterval(this.dialogCheckInterval)
        this.dialogCheckInterval = null
      }
    },
    resetDialogState() {
      this.dialogVisible = false
      this.dialogPromise = null
      this.clearDialogCheckInterval()
    },
    cleanupDialogDOM() {
      const cleanup = () => {
        //查找并移除所有对话框 wrapper
        const dialogWrappers = document.querySelectorAll('.el-dialog__wrapper')
        dialogWrappers.forEach((wrapper) => {
          wrapper.style.display = 'none'
          wrapper.remove()
        })
        //移除所有遮罩层
        const masks = document.querySelectorAll('.v-modal')
        masks.forEach((mask) => {
          mask.remove()
        })
        //重置 body 样式
        if (document.body.style.overflow === 'hidden') {
          document.body.style.overflow = ''
        }
      }
      cleanup()
      //确保 DOM 更新后也能清理
      this.$nextTick(() => {
        cleanup()
      })
    },
    findRouteByPermission(permission) {
      return this.$router.getRoutes().find((route) => route.meta?.permissions?.includes(permission))
    },
    closeDialog() {
      this.forceCleanup()
    },
    renderSearchContent() {
      const h = this.$createElement
      const self = this
      const EnterKeyComponent = EnterKey
      const SortThreeComponent = SortThree
      //创建一个响应式组件来处理搜索
      const SearchContent = {
        data() {
          return {
            keyword: '',
            filteredMenus: [],
            searchHistory: [],
            selectedIndex: -1, //当前选中的索引，default为未选中
            navigationMode: 'keyboard' //导航模式：'keyboard' 或 'mouse'
          }
        },
        mounted() {
          this.loadSearchHistory()
          //dialog body支持滚动，但保持弹窗大小不变
          this.$nextTick(() => {
            const dialogBody = document.querySelector('.el-dialog__body')
            if (dialogBody) {
              dialogBody.style.overflow = 'hidden'
              dialogBody.style.display = 'flex'
              dialogBody.style.flexDirection = 'column'
            }
          })
          this.$nextTick(() => {
            //在title 区域创建搜索框
            this.createSearchBoxInTitle()
            //在footer区域添加快捷键提示
            this.createShortcutsHint()
            //初始化：设置为键盘模式，默认选中第一项
            this.navigationMode = 'keyboard'
            this.$nextTick(() => {
              const availableList = this.getAvailableList()
              if (availableList.length > 0) {
                this.selectedIndex = 0
              }
            })
            //启动鼠标移动检测
            this.startMouseMoveDetection()

            const input = document.querySelector('.menu-search-title-input input')
            if (input) {
              input.focus()
              this.handleKeydown = (e) => {
                const availableList = this.getAvailableList()

                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.stopPropagation()
                  //如果有选中的项，跳转到选中的项
                  if (this.selectedIndex >= 0 && this.selectedIndex < availableList.length) {
                    const selectedItem = availableList[this.selectedIndex]
                    if (selectedItem.isHistoryItem) {
                      this.handleHistoryItemClick(selectedItem)
                    } else {
                      this.handleMenuClick(selectedItem)
                    }
                  } else if (availableList.length > 0) {
                    //如果没有选中项但有列表，跳转到第一个
                    const firstItem = availableList[0]
                    if (firstItem.isHistoryItem) {
                      this.handleHistoryItemClick(firstItem)
                    } else {
                      this.handleMenuClick(firstItem)
                    }
                  }
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  e.stopPropagation()
                  //切换到键盘模式
                  this.navigationMode = 'keyboard'
                  if (availableList.length > 0) {
                    // 如果当前索引无效，从第一个开始
                    if (this.selectedIndex < 0 || this.selectedIndex >= availableList.length) {
                      this.selectedIndex = 0
                    } else {
                      //如果已经是最后一个，循环到第一个；否则下一个
                      this.selectedIndex = (this.selectedIndex + 1) % availableList.length
                    }
                    this.scrollToSelected()
                  }
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  e.stopPropagation()
                  //切换到键盘模式
                  this.navigationMode = 'keyboard'
                  if (availableList.length > 0) {
                    //如果当前索引无效，从最后一个开始
                    if (this.selectedIndex < 0 || this.selectedIndex >= availableList.length) {
                      this.selectedIndex = availableList.length - 1
                    } else if (this.selectedIndex === 0) {
                      //如果是第一个，循环到最后一个
                      this.selectedIndex = availableList.length - 1
                    } else {
                      //否则上一个
                      this.selectedIndex = this.selectedIndex - 1
                    }
                    this.scrollToSelected()
                  }
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  e.stopPropagation()
                  self.closeDialog()
                }
              }
              input.addEventListener('keydown', this.handleKeydown)
            }
          })
        },
        beforeDestroy() {
          if (this.handleKeydown) {
            const input = document.querySelector('.menu-search-title-input input')
            if (input) {
              input.removeEventListener('keydown', this.handleKeydown)
            }
          }
          this.stopMouseMoveDetection()
          if (this.searchInputVm) {
            this.searchInputVm.$destroy()
            this.searchInputVm = null
          }
          if (this.searchInputStyle?.parentNode) {
            this.searchInputStyle.parentNode.removeChild(this.searchInputStyle)
            this.searchInputStyle = null
          }
        },
        watch: {
          keyword(newVal) {
            if (newVal?.trim()) {
              this.updateFilteredMenus(newVal)
            } else {
              this.filteredMenus = []
            }
            //搜索内容变化时，重置为键盘模式，默认选中第一项
            this.navigationMode = 'keyboard'
            this.$nextTick(() => {
              const availableList = this.getAvailableList()
              if (availableList.length > 0) {
                this.selectedIndex = 0
              } else {
                this.selectedIndex = -1
              }
            })
          }
        },
        methods: {
          startMouseMoveDetection() {
            //等待对话框渲染完成
            this.$nextTick(() => {
              const dialogElement = document.querySelector('.el-dialog')
              if (!dialogElement) {
                return
              }
              //在对话框上监听 mousemove 事件
              //使用 requestAnimationFrame 节流，避免频繁切换模式
              this.mouseMoveRafId = null
              this.handleDialogMouseMove = () => {
                //取消之前的动画帧
                if (this.mouseMoveRafId !== null) {
                  cancelAnimationFrame(this.mouseMoveRafId)
                }
                // 使用 requestAnimationFrame 节流处理
                this.mouseMoveRafId = requestAnimationFrame(() => {
                  //切换到鼠标模式
                  if (this.navigationMode === 'keyboard') {
                    this.navigationMode = 'mouse'
                  }
                  this.mouseMoveRafId = null
                })
              }
              dialogElement.addEventListener('mousemove', this.handleDialogMouseMove, { passive: true })
            })
          },
          stopMouseMoveDetection() {
            //取消待处理的动画帧
            if (this.mouseMoveRafId !== null) {
              cancelAnimationFrame(this.mouseMoveRafId)
              this.mouseMoveRafId = null
            }
            //移除事件监听
            const dialogElement = document.querySelector('.el-dialog')
            if (dialogElement && this.handleDialogMouseMove) {
              dialogElement.removeEventListener('mousemove', this.handleDialogMouseMove)
              this.handleDialogMouseMove = null
            }
          },
          getAvailableList() {
            if (this.keyword?.trim()) {
              return this.filteredMenus
            }
            return this.searchHistory.map(item => {
              const menu = self.getAllMenuItems().find(
                m => m.permission === item.permission || m.name === item.name
              )
              return menu || {
                name: item.name,
                path: item.path,
                permission: item.permission,
                isHistoryItem: true
              }
            })
          },
          handleHistoryItemClick(historyItem) {
            const menu = self.getAllMenuItems().find(
              (m) => m.permission === historyItem.permission
            )
            if (menu) {
              this.handleMenuClick(menu)
            }
          },
          scrollToSelected() {
            //滚动到选中的项
            this.$nextTick(() => {
              const availableList = this.getAvailableList()
              if (this.selectedIndex >= 0 && this.selectedIndex < availableList.length) {
                const menuItems = document.querySelectorAll('.menu-item')
                //确保索引在有效范围内
                if (menuItems[this.selectedIndex]) {
                  menuItems[this.selectedIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                  })
                }
              }
            })
          },
          createShortcutsHint() {
            this.$nextTick(() => {
              const dialogFooter = document.querySelector('.el-dialog__footer')
              if (dialogFooter) {
                let shortcutsHint = dialogFooter.querySelector('.menu-search-shortcuts-hint')
                if (!shortcutsHint) {
                  shortcutsHint = document.createElement('div')
                  shortcutsHint.className = 'menu-search-shortcuts-hint'
                  shortcutsHint.style.cssText = 'display: flex; align-items: center; gap: 12px; font-size: 12px; color: #333;'

                  // 创建回车键图标
                  const Vue = this.$root.constructor
                  const enterKeyVm = new Vue({
                    components: {
                      EnterKey: EnterKeyComponent
                    },
                    render(h) {
                      return h('EnterKey', {
                        props: {
                          theme: 'outline',
                          size: 12,
                          fill: '#333'
                        }
                      })
                    }
                  }).$mount()

                  const selectDiv = document.createElement('div')
                  selectDiv.style.cssText = 'display: flex; align-items: center; gap: 4px;'
                  selectDiv.appendChild(enterKeyVm.$el)
                  const selectSpan = document.createElement('span')
                  selectSpan.style.cssText = 'color: #333;'
                  selectSpan.textContent = '选择'
                  selectDiv.appendChild(selectSpan)

                  const navDiv = document.createElement('div')
                  navDiv.style.cssText = 'display: flex; align-items: center; gap: 4px;'

                  const sortThreeVm = new Vue({
                    components: {
                      SortThree: SortThreeComponent
                    },
                    render(h) {
                      return h('SortThree', {
                        props: {
                          theme: 'outline',
                          size: 12,
                          fill: '#333'
                        }
                      })
                    }
                  }).$mount()

                  navDiv.appendChild(sortThreeVm.$el)
                  const navSpan = document.createElement('span')
                  navSpan.style.cssText = 'color: #333;'
                  navSpan.textContent = '导航'
                  navDiv.appendChild(navSpan)

                  const closeDiv = document.createElement('div')
                  closeDiv.style.cssText = 'display: flex; align-items: center; gap: 4px;'
                  const escSpan = document.createElement('span')
                  escSpan.style.cssText = 'font-size: 12px; color: #333;'
                  escSpan.textContent = 'ESC'
                  const closeSpan = document.createElement('span')
                  closeSpan.style.cssText = 'color: #333;'
                  closeSpan.textContent = '关闭'
                  closeDiv.appendChild(escSpan)
                  closeDiv.appendChild(closeSpan)
                  shortcutsHint.appendChild(selectDiv)
                  shortcutsHint.appendChild(navDiv)
                  shortcutsHint.appendChild(closeDiv)

                  dialogFooter.insertBefore(shortcutsHint, dialogFooter.firstChild)
                }
              }

            })
          },
          createSearchBoxInTitle() {
            const self = this
            const dialogHeader = document.querySelector('.el-dialog__header')
            if (!dialogHeader) return

            const titleText = dialogHeader.querySelector('.el-dialog__title')
            const closeBtn = dialogHeader.querySelector('.el-dialog__close')

            Object.assign(dialogHeader.style, {
              display: 'flex',
              alignItems: 'center',
              height: '60px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #f5f5f5',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            })

            if (closeBtn) {
              Object.assign(closeBtn.style, {
                width: '24px',
                height: '24px'
              })
            }

            const dialog = dialogHeader.closest('.el-dialog')
            if (dialog) {
              Object.assign(dialog.style, {
                borderRadius: '8px',
                overflow: 'hidden'
              })
            }

            if (titleText) {
              titleText.innerHTML = ''
              titleText.className = 'menu-search-title-input flex-1 min-w-0 max-w-full mr-2.5'
            }
            const searchContainer = titleText || (() => {
              const div = document.createElement('div')
              div.className = 'menu-search-title-input flex-1 min-w-0 max-w-full mr-2.5'
              return div
            })()

            const Vue = this.$root.constructor
            const inputVm = new Vue({
              data() {
                return {
                  keyword: self.keyword || ''
                }
              },
              watch: {
                keyword(newVal) {
                  self.handleInputChange(newVal || '')
                }
              },
              components: {
                Search
              },
              render(h) {
                return h('sp-form-plus', {
                  props: {
                    formItems: [
                      {
                        fieldName: 'keyword',
                        label: '',
                        component: 'input',
                        cellWidth: 2,
                        componentProps: {
                          placeholder: '搜索导航菜单'
                        }
                      }
                    ],
                    formType: 'searchForm',
                    showDefaultActions: false,
                    inline: true,
                    labelWidth: '0px',
                    value: { keyword: this.keyword }
                  },
                  on: {
                    input: (formData) => {
                      const val = formData.keyword || ''
                      this.keyword = val
                      self.handleInputChange(val)
                    }
                  }
                })
              }
            }).$mount()

            if (titleText) {
              titleText.appendChild(inputVm.$el)
            } else {
              searchContainer.appendChild(inputVm.$el)
              if (closeBtn) {
                dialogHeader.insertBefore(searchContainer, closeBtn)
              } else {
                dialogHeader.appendChild(searchContainer)
              }
            }

            this.$nextTick(() => {
              const formPlus = inputVm.$el.querySelector('.sp-form-plus') || inputVm.$el
              const inputWrapper = formPlus.querySelector('.el-input')
              const inputInner = formPlus.querySelector('.el-input__inner')
              let prefixIcon = formPlus.querySelector('.el-input__prefix')

              if (formPlus) {
                Object.assign(formPlus.style, {
                  background: '#fff',
                  flex: '1',
                  minWidth: '0',
                  maxWidth: '100%',
                  padding: '0',
                  margin: '0'
                })
              }

              if (inputWrapper) {
                Object.assign(inputWrapper.style, {
                  background: '#fff',
                  border: 'none',
                  boxShadow: 'none',
                  height: '28px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                })
              }

              if (inputInner) {
                Object.assign(inputInner.style, {
                  background: '#fff',
                  border: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                  paddingLeft: '32px',
                  height: '28px',
                  lineHeight: '28px',
                  color: '#333',
                  fontSize: '14px'
                })
              }

              if (!prefixIcon && inputWrapper) {
                prefixIcon = document.createElement('span')
                prefixIcon.className = 'el-input__prefix'
                inputWrapper.insertBefore(prefixIcon, inputInner)
              }
              
              if (prefixIcon) {
                prefixIcon.innerHTML = ''
                const searchIconVm = new Vue({
                  components: { Search },
                  render(h) {
                    return h('Search', {
                      props: {
                        theme: 'outline',
                        size: 16,
                        fill: '#c0c4cc'
                      }
                    })
                  }
                }).$mount()
                prefixIcon.appendChild(searchIconVm.$el)
                Object.assign(prefixIcon.style, {
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  zIndex: '1'
                })
              }

              if (!this.searchInputStyle) {
                const style = document.createElement('style')
                style.textContent = `
                  .menu-search-title-input .el-input__inner::placeholder {
                    color: #c0c4cc !important;
                  }
                  .menu-search-title-input .el-input__inner:focus {
                    border: none !important;
                    box-shadow: none !important;
                    outline: none !important;
                  }
                  .menu-search-title-input .el-input:focus-within {
                    border: none !important;
                    box-shadow: none !important;
                  }
                  .menu-search-title-input .el-input {
                    display: flex !important;
                    align-items: center !important;
                  }
                  .menu-search-title-input .el-input__prefix {
                    left: 8px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                  }
                `
                document.head.appendChild(style)
                this.searchInputStyle = style
              }
            })

            this.searchInputVm = inputVm
          },
          loadSearchHistory() {
            try {
              const history = localStorage.getItem(self.searchHistoryKey)
              if (history) {
                this.searchHistory = JSON.parse(history)
              }
            } catch (e) {
              this.searchHistory = []
            }
          },
          deleteHistoryItem(index, e) {
            e.stopPropagation()
            e.preventDefault()

            this.searchHistory.splice(index, 1)
            this.$forceUpdate()

            //调整选中索引
            if (this.selectedIndex >= index) {
              this.selectedIndex = this.selectedIndex === index ? -1 : this.selectedIndex - 1
            }
            //确保索引在有效范围内
            const availableList = this.getAvailableList()
            if (availableList.length === 0) {
              this.selectedIndex = -1
            } else if (this.selectedIndex >= availableList.length) {
              this.selectedIndex = availableList.length - 1
            } else if (this.selectedIndex < -1) {
              this.selectedIndex = -1
            }

            //保存到 localStorage
            try {
              localStorage.setItem(self.searchHistoryKey, JSON.stringify(this.searchHistory))
            } catch (e) {
              console.error('保存搜索历史失败:', e)
            }

            //重新聚焦输入框
            this.$nextTick(() => {
              const input = document.querySelector('.menu-search-title-input input')
              input?.focus()
            })
          },
          updateFilteredMenus(keyword) {
            this.filteredMenus = self.getFilteredMenus(keyword)
          },
          handleMenuClick(menu) {
            self.handleMenuClick(menu)
          },
          handleInputChange(value) {
            this.keyword = value
          },
          highlightText(text, keyword, isSelected = false) {
            if (!keyword || !text) return [text]
            const regex = new RegExp(`(${keyword})`, 'gi')
            return text.split(regex)
              .filter(part => part)
              .map(part => {
                if (part.toLowerCase() === keyword.toLowerCase()) {
                  const highlightStyle = isSelected
                    ? { color: 'var(--primary)', fontWeight: '600' }
                    : { backgroundColor: 'color-mix(in srgb, #ffffff 70%, var(--primary))' }
                  return h('span', { style: highlightStyle }, part)
                }
                return part
              })
          },
          renderMenuList(menus, h) {
            return h('div', { class: 'menu-list' },
              menus.map((menu, index) => {
                const isSelected = this.selectedIndex === index
                return h('div', {
                  key: menu.permission,
                  class: `menu-item p-3 mb-2 cursor-pointer rounded border ${isSelected ? 'menu-item-selected' : ''}`,
                  style: isSelected
                    ? { 
                        background: 'color-mix(in srgb, #ffffff 90%, var(--primary))',
                        borderColor: 'transparent'
                      }
                    : { background: 'transparent' },
                  on: {
                    click: () => this.handleMenuClick(menu),
                    mouseenter: () => { 
                      //只在鼠标模式下更新选中索引
                      if (this.navigationMode === 'mouse') {
                        this.selectedIndex = index
                      }
                    }
                  }
                }, [
                  h('div', { 
                    class: 'font-medium flex items-center',
                    style: isSelected 
                      ? { color: 'var(--primary)' }
                      : { color: '#333' }
                  }, [
                    menu.icon ? h('SpIcon', {
                      props: { name: menu.icon, size: 16 },
                      style: { marginRight: '8px', flexShrink: 0 }
                    }) : null,
                    ...this.highlightText(menu.name, this.keyword, isSelected)
                  ]),
                  menu.path ? h('div', { class: 'text-xs text-gray-400 mt-1' }, menu.path) : null
                ])
              })
            )
          },
          renderHistoryList(h) {
            return h('div', [
              h('div', { class: 'text-xs text-gray-500 mb-2' }, '搜索历史'),
              h('div', { class: 'menu-list' },
                this.searchHistory.map((historyItem, index) => {
                  const isSelected = this.selectedIndex === index
                  return h('div', {
                    key: `history-${index}`,
                    class: `menu-item p-3 mb-2 cursor-pointer rounded border relative ${isSelected ? 'menu-item-selected' : ''}`,
                    style: {
                      paddingRight: '40px',
                      ...(isSelected
                        ? { 
                            background: 'color-mix(in srgb, #ffffff 90%, var(--primary))',
                            borderColor: 'transparent'
                          }
                        : { background: 'transparent' })
                    },
                    on: {
                      click: () => this.handleHistoryItemClick(historyItem),
                      mouseenter: () => { 
                        // 只在鼠标模式下更新选中索引
                        if (this.navigationMode === 'mouse') {
                          this.selectedIndex = index
                        }
                      }
                    }
                  }, [
                    h('div', { 
                      class: 'font-medium flex items-center',
                      style: isSelected
                        ? { color: 'var(--primary)' }
                        : { color: '#333' }
                    }, historyItem.name),
                    historyItem.path ? h('div', { class: 'text-xs text-gray-400 mt-1' }, historyItem.path) : null,
                    h('span', {
                      class: 'absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:#e1bee7 cursor-pointer text-lg font-bold',
                      style: { lineHeight: '1', padding: '4px' },
                      on: {
                        click: (e) => this.deleteHistoryItem(index, e)
                      }
                    }, '×')
                  ])
                })
              )
            ])
          }
        },
        render() {
          const h = this.$createElement
          const hasMoreHistory = this.searchHistory.length > 5
          const hasMoreResults = this.keyword?.trim() && this.filteredMenus.length > 5
          const needsScroll = hasMoreHistory || hasMoreResults
          const maxHeight = needsScroll ? '355px' : 'none'

          return h('div', {
            class: 'menu-search-content',
            style: {
              position: 'relative',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden'
            }
          }, [
            h('div', {
              class: 'menu-search-results',
              style: {
                flex: '1',
                overflowY: needsScroll ? 'auto' : 'visible',
                overflowX: 'hidden',
                minHeight: '0',
                maxHeight: maxHeight,
                paddingRight: needsScroll ? '8px' : '0'
              }
            }, [
              this.keyword?.trim()
                ? this.filteredMenus.length > 0
                  ? this.renderMenuList(this.filteredMenus, h)
                  : h('div', { class: 'text-sm text-gray-400 text-center py-4' }, '未找到匹配的菜单')
                : this.searchHistory.length > 0
                  ? this.renderHistoryList(h)
                  : h('div', { class: 'text-sm text-gray-400 text-center py-4' }, '没有搜索历史')
            ])
          ])
        }
      }

      return h(SearchContent)
    },

    getMenuIconByAlias(aliasName) {
      if (!aliasName) return ''
      const route = this.$router.getRoutes().find((route) => route.meta?.aliasName === aliasName)
      return route?.meta?.icon || ''
    },
    getAllMenuItems() {
      const menus = this.$store.state.user.accessMenus || []
      const result = []

      const flattenMenu = (items, parentPath = '') => {
        items.forEach(item => {
          if (item.is_menu === false && item.is_show === true) {
            return
          }
          const currentPath = parentPath ? `${parentPath} / ${item.name}` : item.name
          const menuItem = {
            name: item.name,
            alias_name: item.alias_name,
            permission: item.permission,
            path: currentPath,
            icon: this.getMenuIconByAlias(item.alias_name),
            originalItem: item,
            hasChildren: !!(item.children?.length),
            children: item.children || []
          }
          result.push(menuItem)

          if (item.children?.length) {
            const childPath = parentPath ? `${parentPath} / ${item.name}` : item.name
            flattenMenu(item.children, childPath)
          }
        })
      }

      flattenMenu(menus)
      return result
    },

    findFirstLeafMenu(menuItem) {
      if (!menuItem?.originalItem) return null

      const findFirstChild = item => {
        if (item.is_menu && !item.children?.length) {
          return item
        }
        if (item.children?.length) {
          for (const child of item.children) {
            const result = findFirstChild(child)
            if (result) return result
          }
        }
        return null
      }
      return findFirstChild(menuItem.originalItem)
    },

    getFilteredMenus(keyword = '') {
      const lowerKeyword = keyword.toLowerCase().trim()
      return this.getAllMenuItems()
        .filter(menu =>
          menu.name.toLowerCase().includes(lowerKeyword) ||
          menu.path.toLowerCase().includes(lowerKeyword)
        )
        .slice(0, 20)
    },
    saveSearchHistory(menu) {
      let history = []
      const historyStr = localStorage.getItem(this.searchHistoryKey)
      if (historyStr) {
        history = JSON.parse(historyStr)
      }
      history = history.filter(item => item.permission !== menu.permission)
      history.unshift({
        name: menu.name,
        path: menu.path,
        permission: menu.permission
      })
      localStorage.setItem(this.searchHistoryKey, JSON.stringify(history))
    },
    handleMenuClick(menu) {
      if (!menu) return

      this.closeDialog()
      let route = null
      let menuToSave = menu

      if (menu.hasChildren) {
        const firstLeafMenu = this.findFirstLeafMenu(menu)
        if (firstLeafMenu?.permission) {
          route = this.findRouteByPermission(firstLeafMenu.permission)
          if (route) {
            const leafMenuPath = menu.path?.includes('/')
              ? `${menu.path} / ${firstLeafMenu.name}`
              : firstLeafMenu.name
            menuToSave = {
              name: firstLeafMenu.name,
              path: leafMenuPath,
              permission: firstLeafMenu.permission
            }
          }
        }
      } else if (menu.permission) {
        route = this.findRouteByPermission(menu.permission)
      }

      if (route) {
        this.saveSearchHistory(menuToSave)
        this.$router.push({ path: route.path }).catch(() => { })
      } else {
        const basePath = getBasePath()
        this.$router.push({ path: basePath ? `/${basePath}/not-found` : '/not-found' }).catch(() => { })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item-selected {
  background: color-mix(in srgb, #ffffff 90%, var(--primary)) !important;
  border-color: transparent !important;
  
  .font-medium {
    color: var(--primary) !important;
  }
}
</style>
