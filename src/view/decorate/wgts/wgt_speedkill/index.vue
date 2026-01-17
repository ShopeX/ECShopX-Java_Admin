<style lang="scss" src="./index.scss" />

<template>
    <div class="wgt-speedkill" :style="outerStyle">
        <div class="wgt-speedkill-content flex gap-6">
            <SeckillGoods v-if="goodsLayout === 'default' || !goodsLayout" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
            <RowGoods v-if="goodsLayout === 'one'" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
            <ColumnGoods v-if="goodsLayout === 'two'" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
            <GridGoods v-if="goodsLayout === 'three'" :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
        </div>
    </div>
</template>

<script>
import config from './config'
import SeckillGoods from './comps/seckillgoods.vue'
import RowGoods from '../../comps/goods-layout/rowgoods.vue'
import ColumnGoods from '../../comps/goods-layout/columngoods.vue'
import GridGoods from '../../comps/goods-layout/gridgoods.vue'
import seckilldata from './mock/skill.json'
import promotiondata from './mock/promotion.json'

export default {
    name: 'Speedkill',
    wgtName: '秒杀',
    wgtDesc: '',
    wgtIcon: 'wgt-store',
    wgtType: 2,
    config: config,
    props: {
        value: [Object, Array]
    },
    components: {
        SeckillGoods,
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
        'value.dataType': {
            handler(newVal) {
                if (newVal === 'seckill') {
                    this.getSeckillGoodsList()
                } else if (newVal === 'promotion') {
                    this.getPromotionGoodsList()
                }
            },
            immediate: true,
            deep: true
        },
        'value.data': {
            handler() {
                if (this.value.dataType === 'seckill') {
                    this.getSeckillGoodsList()
                } else if (this.value.dataType === 'promotion') {
                    this.getPromotionGoodsList()
                }
            },
            deep: true
        }
    },
    methods: {
        // 检查 data 是否有参数
        hasDataParam() {
            const data = this.value.data
            if (!data) return false
            if (data.id !== undefined && data.id !== null && data.id !== '') {
                return true
            }
            return false
        },
        // 获取秒杀商品列表（当 dataType 为 seckill 时）
        async getSeckillGoodsList() {
            const dataType = this.value.dataType

            // 检查是否有 data 参数
            if (!this.hasDataParam()) {
                this.list = []
                return
            }

            let params = {
                data_type: dataType,
                data_value: this.value.data?.id || '',
                data_count: this.value.dataCount,
                distributor_id: this.value.data?.distributor_id || '',
                pages_template_id: this.$route.query.id,
            }


            // 实际接口调用示例（注释掉）
            try {
                const res = await this.$api.template.getShelvesGoods(params)
                this.list = res?.data?.data || []
            } catch (error) {
                console.error('获取秒杀商品列表失败:', error)
                this.list = []
            }
        },
        async getPromotionGoodsList() {
            const dataType = this.value.dataType

            let params = {
                data_type: dataType,
                data_value: this.value.data?.id || '',
                data_count: this.value.dataCount,
                distributor_id: this.value.data?.distributor_id || '',
                pages_template_id: this.$route.query.id,
            }

            // 模拟数据 TODO: 删除

            // 实际接口调用示例（注释掉）
            try {
                const res = await this.$api.template.getShelvesGoods(params)
                this.list = res?.data?.data || []
            } catch (error) {
                console.error('获取活动集合页商品列表失败:', error)
                this.list = []
            }
        }
    },
    computed: {
        // 将 config.js 中的字段映射到 seckillgoods.vue 期望的字段
        mappedValue() {
            const {
                speedkillTitleType,
                speedkillTitleImage,
                speedkillTitleText,
                speedkillTitleColor,
                speedkillShowMoreBtn,
                speedkillMoreBtnColor,
                speedkillMoreLink,
                ...rest
            } = this.value

            return {
                ...rest,
                // 映射标题相关字段
                titleType: speedkillTitleType || 'text',
                titleImage: speedkillTitleImage || '',
                titleText: speedkillTitleText || '',
                titleColor: speedkillTitleColor || '',
                // 映射更多按钮相关字段
                showMoreBtn: speedkillShowMoreBtn !== undefined ? speedkillShowMoreBtn : true,
                moreBtnColor: speedkillMoreBtnColor || '',
                moreLink: speedkillMoreLink || {}
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
                bgImage = `linear-gradient(to bottom, ${outerMargin.startColor || '#ffffff'}, ${outerMargin.endColor || '#ffffff'})`
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
                bgImage = `linear-gradient(to bottom, ${innerPadding.startColor || '#ffffff'}, ${innerPadding.endColor || '#ffffff'})`
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
