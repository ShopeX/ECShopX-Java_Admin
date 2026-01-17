<style lang="scss" src="./index.scss" />

<template>
    <div class="wgt-speedkill" :style="outerStyle">
        <div class="wgt-speedkill-content flex gap-6">
            <SeckillGoods :value="mappedValue" :goods-list="list" :custom-style="innerStyle" />
        </div>
    </div>
</template>

<script>
import config from './config'
import SeckillGoods from './comps/seckillgoods.vue'
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
        SeckillGoods
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

            // 模拟数据 TODO: 删除
            this.list = seckilldata.data.slice(0, this.value.dataCount)

            // 实际接口调用示例（注释掉）
            // try {
            //     const res = await this.$api.template.getShelvesGoods(params)
            //     this.list = res?.data?.data || []
            // } catch (error) {
            //     console.error('获取秒杀商品列表失败:', error)
            //     this.list = []
            // }
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
            console.log(promotiondata.data.items.list, 'promotiondata')
            this.list = promotiondata.data.items.list.slice(0, this.value.dataCount)

            // 实际接口调用示例（注释掉）
            // try {
            //     const res = await this.$api.template.getShelvesGoods(params)
            //     this.list = res?.data?.data || []
            // } catch (error) {
            //     console.error('获取活动集合页商品列表失败:', error)
            //     this.list = []
            // }
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
            const { outerMargin = {}, outerBackground } = this.value

            console.log(outerMargin, outerBackground, 'outerMargin')
            // 处理背景：支持两种格式
            // 1. CompOuter 格式：color, image
            // 2. CompStyle 格式：bgType ('color', 'gradient', 'pic')
            let bgColor = ''
            let bgImage = 'none'

            const bgType = outerMargin.bgType

            // 渐变背景
            if (bgType === 'gradient') {
                bgImage = `linear-gradient(to bottom, ${outerMargin.startColor || '#ffffff'}, ${outerMargin.endColor || '#ffffff'})`
            }
            // 图片背景
            else if (bgType === 'pic') {
                bgImage = outerMargin.bgPic ? `url(${outerMargin.bgPic})` : 'none'
                bgColor = ''
            }
            // CompOuter 格式或单色背景
            else {
                bgColor = outerMargin.bgColor || outerMargin.color || ''
                if (outerMargin.image) {
                    bgImage = `url(${outerMargin.image})`
                    bgColor = ''
                }
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

            // 处理背景：支持两种格式
            // 1. CompInner 格式：type ('solid', 'gradient', 'image')
            // 2. CompStyle 格式：bgType ('color', 'gradient', 'pic')
            let bgColor = ''
            let bgImage = 'none'

                const bgType = innerPadding.bgType || innerPadding.type

                // 渐变背景
                if (bgType === 'gradient') {
                    bgImage = `linear-gradient(to bottom, ${innerPadding.startColor || '#ffffff'}, ${innerPadding.endColor || '#ffffff'})`
                }
                // 图片背景
                else if (bgType === 'pic' || bgType === 'image') {
                    const imageUrl = innerPadding.bgPic || innerPadding.image || ''
                    bgImage = imageUrl ? `url(${imageUrl})` : 'none'
                    bgColor = ''
                }
                // 单色背景
                else {
                    bgColor = innerPadding.bgColor || innerPadding.color || ''
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
