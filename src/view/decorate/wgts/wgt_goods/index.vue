<style lang="scss" src="./index.scss" />

<template>
    <div class="wgt-goods" :style="outerStyle">
        <div class="wgt-goods-content flex gap-6">
            <GoodsGoods :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
        </div>
    </div>
</template>

<script>
import config from './config'
import GoodsGoods from './comps/goodsgoods.vue'
import saledata from './mock/saledata.json'

export default {
    name: 'goods',
    wgtName: '商品',
    wgtDesc: '',
    wgtIcon: 'wgt-store',
    wgtType: 2,
    config: config,
    props: {
        value: [Object, Array]
    },
    components: {
        GoodsGoods
    },
    data() {
        return {
            list: []
        }
    },
    watch: {
        'value.dataType': {
            handler() {
                this.getGoodsList()
            },
            immediate: true,
            deep: true
        },
        'value.data': {
            handler() {
                if (['price', 'items', 'main_category', 'category'].includes(this.value.dataType)) {
                    this.getGoodsList()
                }
            },
            deep: true
        },
        'value.dataCount': {
            handler() {
                this.getGoodsList()
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
        // 获取商品列表
        async getGoodsList() {
            const dataType = this.value.dataType

            // 对于需要 data 参数的类型，检查是否有参数
            if (['price', 'items', 'main_category', 'category'].includes(dataType)) {
                if (!this.hasDataParam()) {
                    this.list = []
                    return
                }
            }

            let params = {
                data_type: dataType,
                data_value: this.value.data?.id || '',
                data_count: this.value.dataCount,
                distributor_id: this.value.data?.distributor_id || '',
                pages_template_id: this.$route.query.id,
            }
            
            switch (dataType) {
                case 'price':
                    params.data_value = this.value?.data.id.split(',')
                    break;
                case 'items':
                    params.data_value = this.value?.data.id.split(',')
                    break;
            }

            // 模拟数据 TODO: 删除
            this.list = saledata.data.slice(0, this.value.dataCount)

            // 实际接口调用示例（注释掉）
            // try {
            //     const res = await this.$api.template.getShelvesGoods(params)
            //     this.list = res?.data?.data || []
            // } catch (error) {
            //     console.error('获取商品列表失败:', error)
            //     this.list = []
            // }
        }
    },
    mounted() {
        this.getGoodsList()
    },
    computed: {
        // 将 config.js 中的字段映射到 goodsgoods.vue 期望的字段
        mappedValue() {
            const {
                goodsTitleType,
                goodsTitleImage,
                goodsTitleText,
                goodsTitleColor,
                goodsShowMoreBtn,
                goodsMoreBtnColor,
                goodsMoreLink,
                ...rest
            } = this.value

            return {
                ...rest,
                // 映射标题相关字段
                titleText: {
                    type: goodsTitleType || 'text',
                    text: goodsTitleText,
                    image: goodsTitleImage || ''
                },
                titleColor: goodsTitleColor || '',
                // 映射更多按钮相关字段
                moreBtn: {
                    show: goodsShowMoreBtn !== undefined ? goodsShowMoreBtn : true,
                    color: goodsMoreBtnColor || ''
                },
                moreLink: goodsMoreLink || {}
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
