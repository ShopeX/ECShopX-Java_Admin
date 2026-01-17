<style lang="scss" src="./index.scss" />

<template>
    <div class="wgt-hotranking" :style="outerStyle">
        <div class="wgt-hotranking-content flex gap-6">
            <HotRankingGoods v-if="goodsLayout === 'default' || !goodsLayout" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
            <RowGoods v-if="goodsLayout === 'one'" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
            <ColumnGoods v-if="goodsLayout === 'two'" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
            <GridGoods v-if="goodsLayout === 'three'" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
        </div>
    </div>
</template>

<script>
import config from './config'
import HotRankingGoods from './comps/hotrankinggoods.vue'
import RowGoods from '../../comps/goods-layout/rowgoods.vue'
import ColumnGoods from '../../comps/goods-layout/columngoods.vue'
import GridGoods from '../../comps/goods-layout/gridgoods.vue'
import saledata from './mock/saledata.json'

export default {
    name: 'hotranking',
    wgtName: '热销榜单',
    wgtDesc: '',
    wgtIcon: 'wgt-store',
    wgtType: 2,
    config: config,
    props: {
        value: [Object, Array]
    },
    components: {
        HotRankingGoods,
        RowGoods,
        ColumnGoods,
        GridGoods
    },
    data() {
        return {
            list: []
        }
    },
    watch: {
        'value.dataCount': {
            handler() {
                this.getHotRankingGoodsList()
            },
            deep: true
        }
    },
    methods: {
        // 获取热销榜单商品列表（按销量排序）
        async getHotRankingGoodsList() {
            let params = {
                data_type: 'sales',
                data_value: '',
                data_count: this.value.dataCount,
                distributor_id: '',
            }

            // 模拟数据 TODO: 删除
            this.list = saledata.data.slice(0, this.value.dataCount)

            // 实际接口调用示例（注释掉）
            // try {
            //     const res = await this.$api.template.getShelvesGoods(params)
            //     this.list = res?.data?.data || []
            // } catch (error) {
            //     console.error('获取热销榜单商品列表失败:', error)
            //     this.list = []
            // }
        }
    },
    mounted() {
        this.getHotRankingGoodsList()
    },
    computed: {
        // 将 config.js 中的字段映射到 hotrankinggoods.vue 期望的字段
        mappedValue() {
            const {
                hotrankingTitleType,
                hotrankingTitleImage,
                hotrankingTitleText,
                hotrankingTitleColor,
                hotrankingShowMoreBtn,
                hotrankingMoreBtnColor,
                hotrankingMoreLink,
                ...rest
            } = this.value

            return {
                ...rest,
                // 映射标题相关字段
                titleText: {
                    type: hotrankingTitleType || 'text',
                    text: hotrankingTitleText ,
                    image: hotrankingTitleImage || ''
                },
                titleColor: hotrankingTitleColor || '',
                // 映射更多按钮相关字段
                moreBtn: {
                    show: hotrankingShowMoreBtn !== undefined ? hotrankingShowMoreBtn : true,
                    color: hotrankingMoreBtnColor || ''
                },
                moreLink: hotrankingMoreLink || {}
            }
        },
        outerStyle() {
            const { outerMargin = {} } = this.value
            
            // CompStyle 组件将背景数据直接存储在 outerMargin 中
            const bgType = outerMargin.bgType
            let bgColor = ''
            let bgImage = 'none'
            
            // 渐变背景
            if (bgType === 'gradient') {
                bgImage = `linear-gradient(to bottom, ${outerMargin.startColor || ''}, ${outerMargin.endColor || ''})`
            } 
            // 图片背景
            else if (bgType === 'pic') {
                bgImage = outerMargin.bgPic ? `url(${outerMargin.bgPic})` : 'none'
                bgColor = ''
            } 
            // 单色背景
            else if (bgType === 'color' || !bgType) {
                bgColor = outerMargin.bgColor || ''
            }
            
            return {
                paddingTop: (outerMargin.paddedt || 0) + 'px',
                paddingBottom: (outerMargin.paddedb || 0) + 'px',
                paddingLeft: (outerMargin.paddedl || 0) + 'px',
                paddingRight: (outerMargin.paddedr || 0) + 'px',
                backgroundColor: bgColor || undefined,
                backgroundImage: bgImage !== 'none' ? bgImage : undefined,
                backgroundSize: bgImage !== 'none' ? 'cover' : undefined,
                backgroundPosition: bgImage !== 'none' ? 'center' : undefined,
                backgroundRepeat: bgImage !== 'none' ? 'no-repeat' : undefined,
            }
        },
        goodsLayout() {
            return this.value?.goodsLayout || 'default'
        },
        innerStyle() {
            const { innerPadding = {} } = this.value
            
            // CompStyle 组件将背景数据直接存储在 innerPadding 中
            const bgType = innerPadding.bgType
            let bgColor = ''
            let bgImage = 'none'
            
            // 渐变背景
            if (bgType === 'gradient') {
                bgImage = `linear-gradient(to bottom, ${innerPadding.startColor || ''}, ${innerPadding.endColor || ''})`
            } 
            // 图片背景
            else if (bgType === 'pic') {
                bgImage = innerPadding.bgPic ? `url(${innerPadding.bgPic})` : 'none'
                bgColor = ''
            } 
            // 单色背景
            else if (bgType === 'color' || !bgType) {
                bgColor = innerPadding.bgColor || ''
            }
            
            return {
                paddingLeft: (innerPadding.paddedl || 0) + 'px',
                paddingRight: (innerPadding.paddedr || 0) + 'px',
                paddingTop: (innerPadding.paddedt || 0) + 'px',
                paddingBottom: (innerPadding.paddedb || 0) + 'px',
                backgroundColor: bgColor || undefined,
                backgroundImage: bgImage !== 'none' ? bgImage : undefined,
                backgroundSize: bgImage !== 'none' ? 'cover' : undefined,
                backgroundPosition: bgImage !== 'none' ? 'center' : undefined,
                backgroundRepeat: bgImage !== 'none' ? 'no-repeat' : undefined,
            }
        }
    }
}
</script>
