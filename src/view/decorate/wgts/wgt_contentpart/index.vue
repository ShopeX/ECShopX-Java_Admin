<template>
    <div class="wgt-location-module" :style="moduleStyle">
        <!-- 导航栏 -->
        <div class="nav-wrapper" :style="navWrapperStyle">
            <!-- 左滑示意图 -->
            <img v-if="value.leftimgUrl && showLeftIndicator" :src="value.leftimgUrl" class="nav-indicator left" alt="">
            
            <!-- 导航项容器 -->
            <div ref="navScroller" class="nav-scroller" :style="navItemAreaStyle" @scroll="handleScroll">
                <div class="nav-list" :style="navListStyle">
                    <div v-for="(item, index) in navItems" :key="index" 
                        class="nav-item" 
                        :class="{ 'is-active': activeIndex === index }"
                        :style="getNavItemStyle(item, index)"
                        @click="handleNavClick(index)">
                        <!-- 图片类型 -->
                        <img v-if="item.navitemtype === 'image'" 
                            :src="activeIndex === index ? (item.navitemactiveimg || item.imgUrl) : item.imgUrl" 
                            class="nav-item-img" alt="">
                        <!-- 文字类型 -->
                        <span v-else class="nav-item-text">{{ item.navItemName }}</span>
                        <!-- 选中底线 -->
                        <span v-if="value.navitemborder && activeIndex === index" 
                            class="nav-item-border" 
                            :style="{ backgroundColor: value.navitembordercolor }" />
                    </div>
                </div>
            </div>
            
            <!-- 右滑示意图 -->
            <img v-if="value.rightimgUrl && showRightIndicator" :src="value.rightimgUrl" class="nav-indicator right" alt="">
        </div>

        <!-- 内容区域 -->
        <div class="content-wrapper">
            <template v-if="activeNavItem && activeNavItem.children && activeNavItem.children.length > 0">
                <!-- 关联挂件模式 -->
                <template v-if="activeNavItem.configType !== 'page'">
                    <component 
                        v-for="(child, idx) in activeNavItem.children" 
                        :key="`widget-${activeIndex}-${idx}`"
                        :is="getWidgetComponent(child.name)"
                        :value="child" />
                </template>
                <!-- 关联页面模式 -->
                <div v-else class="page-placeholder">
                    <div class="page-info">
                        <i class="el-icon-document" />
                        <span>关联页面：{{ activeNavItem.children[0]?.title || '未命名页面' }}</span>
                    </div>
                </div>
            </template>
            <!-- 空状态 -->
            <div v-else class="empty-content">
                <span>暂无内容</span>
            </div>
        </div>
    </div>
</template>

<script>
import config from './config'
import gWgts from '../index'

export default {
    name: 'LocationModule',
    wgtName: '定位导航',
    wgtDesc: '',
    wgtIcon: 'wgt-location-module',
    config: config,
    props: {
        value: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            activeIndex: 0,
            showLeftIndicator: false,
            showRightIndicator: true,
            widgetComponents: {}
        }
    },
    computed: {
        navItems() {
            return this.value.data || []
        },
        // 当前选中的导航项
        activeNavItem() {
            return this.navItems[this.activeIndex] || null
        },
        // 整体模块样式
        moduleStyle() {
            return {
                position: this.value.navSticky ? 'sticky' : 'relative',
                top: this.value.navSticky ? '0' : 'auto',
                zIndex: this.value.navSticky ? '100' : 'auto'
            }
        },
        // 导航栏外层样式
        navWrapperStyle() {
            const navbg = this.value.navbg || {}
            const navpadded = this.value.navpadded || {}
            const activeItem = this.navItems[this.activeIndex]
            
            // 根据当前选中项的配置决定背景
            let backgroundColor = navbg.color || '#ffffff'
            let backgroundImage = navbg.image ? `url(${navbg.image})` : 'none'
            
            if (activeItem) {
                if (activeItem.navactivebgimg) {
                    backgroundImage = `url(${activeItem.navactivebgimg})`
                } else if (activeItem.navactivebg) {
                    backgroundColor = activeItem.navactivebg
                    backgroundImage = 'none'
                }
            }
            
            return {
                backgroundColor,
                backgroundImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                paddingTop: `${navpadded.paddedt || 0}px`,
                paddingBottom: `${navpadded.paddedb || 0}px`,
                paddingLeft: `${navpadded.paddedl || 0}px`,
                paddingRight: `${navpadded.paddedr || 0}px`
            }
        },
        // 导航项区域样式
        navItemAreaStyle() {
            const navitembg = this.value.navitembg || {}
            const navitempadded = this.value.navitempadded || {}
            
            return {
                backgroundColor: navitembg.color || 'transparent',
                backgroundImage: navitembg.image ? `url(${navitembg.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: `${this.value.navitemradius || 0}px`,
                paddingTop: `${navitempadded.paddedt || 0}px`,
                paddingBottom: `${navitempadded.paddedb || 0}px`,
                paddingLeft: `${navitempadded.paddedl || 0}px`,
                paddingRight: `${navitempadded.paddedr || 0}px`
            }
        },
        // 导航列表样式
        navListStyle() {
            return {
                height: `${this.value.navitemheight || 40}px`
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.checkScrollIndicators()
            // 找到默认激活的导航项
            const activeIdx = this.navItems.findIndex(item => item.isActive)
            if (activeIdx > -1) {
                this.activeIndex = activeIdx
            }
            // 加载挂件组件
            this.loadWidgetComponents()
        })
    },
    methods: {
        // 加载所有挂件组件
        loadWidgetComponents() {
            const scene = this.$route?.query?.scene || '1001'
            const wgts = gWgts[scene] || gWgts['1001'] || {}
            Object.keys(wgts).forEach(key => {
                const wgt = wgts[key]
                if (wgt && wgt.name) {
                    this.widgetComponents[wgt.name.toLowerCase()] = wgt
                }
            })
        },
        // 获取挂件组件
        getWidgetComponent(name) {
            if (!name) return null
            const wgt = this.widgetComponents[name.toLowerCase()]
            return wgt || null
        },
        // 获取单个导航项样式
        getNavItemStyle(item, index) {
            const isActive = this.activeIndex === index
            const navitemmargin = this.value.navitemmargin || {}
            
            return {
                height: `${this.value.navitemheight || 40}px`,
                paddingLeft: `${navitemmargin.paddedlr || 18}px`,
                paddingRight: `${navitemmargin.paddedlr || 18}px`,
                color: isActive ? (item.navitemactivecolor || '#1A1A1A') : (item.navitemcolor || '#666666'),
                backgroundColor: isActive ? (item.navitemactivebg || 'transparent') : (item.navitembg || 'transparent'),
                borderRadius: `${item.navitemradius || 0}px`
            }
        },
        // 点击导航项
        handleNavClick(index) {
            this.activeIndex = index
        },
        // 监听滚动
        handleScroll() {
            this.checkScrollIndicators()
        },
        // 检查滚动指示器显示状态
        checkScrollIndicators() {
            const scroller = this.$refs.navScroller
            if (!scroller) return
            
            const { scrollLeft, scrollWidth, clientWidth } = scroller
            this.showLeftIndicator = scrollLeft > 0
            this.showRightIndicator = scrollLeft + clientWidth < scrollWidth - 1
        }
    }
}
</script>

<style lang="scss" scoped>
.wgt-location-module {
    width: 100%;

    .nav-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .nav-indicator {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        object-fit: contain;
        z-index: 2;
        pointer-events: none;

        &.left {
            left: 4px;
        }

        &.right {
            right: 4px;
        }
    }

    .nav-scroller {
        flex: 1;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .nav-list {
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    .nav-item {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-shrink: 0;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;

        &.is-active {
            font-weight: 500;
        }

        .nav-item-img {
            max-height: 100%;
            object-fit: contain;
        }

        .nav-item-text {
            white-space: nowrap;
        }

        .nav-item-border {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            display: block;
            width: 20px;
            height: 2px;
            border-radius: 1px;
        }
    }

    .content-wrapper {
        width: 100%;
        min-height: 100px;
    }

    .page-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        background: #f5f7fa;

        .page-info {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #909399;
            font-size: 14px;

            i {
                font-size: 18px;
            }
        }
    }

    .empty-content {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        color: #c0c4cc;
        font-size: 14px;
        background: #fafafa;
    }
}
</style>
