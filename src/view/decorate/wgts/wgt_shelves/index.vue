<style lang="scss" src="./index.scss" />

<template>
    <div class="wgt-shelves" :style="outerStyle">
        <div class="wgt-shelves-content flex gap-6" v-if="value.animation == 'horizontal'">
            <BasicGoods v-if="['sales', 'price', 'items', 'main_category', 'category'].includes(value.dataType)"
                :value="value" :goods-list="list" :custom-style="innerStyle" />
            <SeckillGoods v-if="['seckill', 'promotion'].includes(value.dataType)" :value="value" :goods-list="list"
                :custom-style="innerStyle" />
            <RankingGoods v-if="value.dataType === 'category_ranking'" :value="value" :goods-list="list"
                :custom-style="innerStyle" />
            <GroupGoods v-if="value.dataType === 'group'" :value="value" :goods-list="list"
                :custom-style="innerStyle" />
            <SeckillRight
                v-if="value.limitedTime && ['sales', 'price', 'items', 'main_category', 'category'].includes(value.dataType)"
                :value="value" :goods-list="seckillList" />
        </div>
        <!-- 纵向排列 -->
        <div class="wgt-shelves-content" v-if="value.animation == 'vertical'">
            <RowGoods v-if="value.goodsSort === 'one'" :value="value" :goods-list="list" :custom-style="innerStyle" />
            <ColumnGoods v-if="value.goodsSort === 'two'" :value="value" :goods-list="list" :custom-style="innerStyle" />
            <GridGoods v-if="value.goodsSort === 'three'" :value="value" :goods-list="list" :custom-style="innerStyle" />
        </div>
    </div>
</template>

<script>
import config from './config'
import groupIcon from '@/assets/imgs/wgt/group.png'
import BasicGoods from './comps/basicgoods.vue'
import SeckillGoods from './comps/seckillgoods.vue'
import SeckillRight from './comps/seckillright.vue'
import RankingGoods from './comps/rankinggoos.vue'
import GroupGoods from './comps/groupgoods.vue'
import RowGoods from './comps/rowgoods.vue'
import ColumnGoods from './comps/columngoods.vue'
import GridGoods from './comps/gridgoods.vue'
import saledata from './mock/saledata.json'
import seckilldata from './mock/skill.json'
import rankingata from './mock/ranking.json'
import promotiondata from './mock/promotion.json'
import groupdata from './mock/group.json'
export default {
    name: 'Shelves',
    wgtName: '货架',
    wgtDesc: '',
    wgtIcon: 'wgt-store',
    wgtType: 2,
    config: config,
    props: {
        value: [Object, Array]
    },
    components: {
        BasicGoods,
        SeckillGoods,
        SeckillRight,
        RankingGoods,
        GroupGoods,
        RowGoods,
        ColumnGoods,
        GridGoods,
    },
    data() {
        return {
            list: [],
            limitedTimeList: [],
            seckillList: null,
            groupIcon: groupIcon,
            seckillData: null
        }
    },
    watch: {
        'value.dataType': {
            handler(newVal) {
                if (['sales', 'price', 'items', 'main_category', 'category'].includes(newVal)) {
                    this.getBasicGoodsList()
                } else if (newVal === 'seckill') {
                    this.getSeckillGoodsList()
                } else if (newVal === 'category_ranking') {
                    this.getRankingGoodsList()
                } else if (newVal === 'promotion') {
                    this.getPromotionGoodsList()
                } else if (newVal === 'group') {
                    this.getGroupGoodsList()
                }
            },
            immediate: true,
            deep: true
        },
        'value.data': {
            handler() {
                // 当 data 配置变化时，对于需要配置的数据类型重新获取商品列表
                if (['price', 'items', 'main_category', 'category'].includes(this.value.dataType)) {
                    this.getBasicGoodsList()
                } else if (this.value.dataType === 'seckill') {
                    this.getSeckillGoodsList()
                } else if (this.value.dataType === 'category_ranking') {
                    this.getRankingGoodsList()
                } else if (this.value.dataType === 'promotion') {
                    this.getPromotionGoodsList()
                } else if (this.value.dataType === 'group') {
                    this.getGroupGoodsList()
                }
            },
            deep: true
        },
        'value.limitedTime': {
            handler() {
                this.getSeckillList()
            },
            immediate: true,
            deep: true
        },
        'value.limitedTimeData': {
            handler() {
                this.getSeckillList()
            },
            deep: true
        },
    },
    methods: {
        // 检查 data 是否有参数
        hasDataParam() {
            const data = this.value.data
            console.log(data, 'data')
            if (!data) return false

            // 检查 id 是否存在且不为空
            if (data.id !== undefined && data.id !== null && data.id !== '') {
                return true
            }

            return false
        },
        // 检查限时特惠数据是否有参数
        hasLimitedTimeDataParam() {
            const limitedTimeData = this.value.limitedTimeData
            if (!limitedTimeData) return false

            // 检查 id 是否存在且不为空
            if (limitedTimeData.id !== undefined && limitedTimeData.id !== null && limitedTimeData.id !== '') {
                return true
            }

            return false
        },
        // Mock接口请求
        async getBasicGoodsList() {
            const dataType = this.value.dataType

            // 对于需要 data 参数的类型，检查是否有参数
            if (['price', 'items', 'main_category', 'category'].includes(dataType)) {
                if (!this.hasDataParam()) {
                    // 没有 data 参数，清空列表
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
        },
        async getSeckillList() {
            // 检查限时特惠是否开启
            if (!this.value.limitedTime) {
                this.seckillList = null
                return
            }

            // 检查限时特惠数据是否有数据
            if (!this.hasLimitedTimeDataParam()) {
                this.seckillList = null
                return
            }

            let params = {
                data_type: 'seckill',
                data_value: this.value.limitedTimeData?.id || '',
                data_count: this.value.limitedTimeDataCount,
                distributor_id: this.value.limitedTimeData?.distributor_id || '',
                pages_template_id: this.$route.query.id,
            }
            // 模拟数据 TODO: 删除
            this.seckillList = seckilldata.data
            console.log(this.seckillList, 'seckillList', seckilldata.data)
            // 实际接口调用示例（注释掉）
            // try {
            //     const res = await this.$api.template.getShelvesGoods(params)
            //     this.seckillList = res?.data?.data || []
            // } catch (error) {
            //     console.error('获取限时特惠商品列表失败:', error)
            //     this.seckillList = null
            // }
        },
        // 获取秒杀商品列表（当 dataType 为 seckill 时）
        async getSeckillGoodsList() {
            const dataType = this.value.dataType

            // 检查是否有 data 参数
            if (!this.hasDataParam()) {
                // 没有 data 参数，清空列表
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
        // 获取榜单商品列表（当 dataType 为 category_ranking 时）
        async getRankingGoodsList() {
            const dataType = this.value.dataType

            // 检查是否有 data 参数
            // if (!this.hasDataParam()) {
            //     // 没有 data 参数，清空列表
            //     this.list = []
            //     return
            // }

            let params = {
                data_type: dataType,
                data_value: this.value.data?.id || '',
                data_count: this.value.dataCount,
                distributor_id: this.value.data?.distributor_id || '',
                pages_template_id: this.$route.query.id,
            }

            // 模拟数据 TODO: 删除
            this.list = rankingata.data.list.slice(0, this.value.dataCount)

            // 实际接口调用示例（注释掉）
            // try {
            //     const res = await this.$api.template.getShelvesGoods(params)
            //     this.list = res?.data?.data || []
            // } catch (error) {
            //     console.error('获取榜单商品列表失败:', error)
            //     this.list = []
            // }
        },
        async getPromotionGoodsList() {
            const dataType = this.value.dataType

            // // 检查是否有 data 参数
            // if (!this.hasDataParam()) {
            //     // 没有 data 参数，清空列表
            //     this.list = []
            //     return
            // }

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
        },
        async getGroupGoodsList() {
            const dataType = this.value.dataType

            let params = {
                data_type: dataType,
                data_value: this.value.data?.id || '',
                data_count: this.value.dataCount,
                distributor_id: this.value.data?.distributor_id || '',
                pages_template_id: this.$route.query.id,
            }

            // 模拟数据 TODO: 删除
            console.log(groupdata.data, 'groupdata')
            this.list = groupdata.data.slice(0, this.value.dataCount)

            // 实际接口调用示例（注释掉）
            // try {
            //     const res = await this.$api.template.getShelvesGoods(params)
            //     this.list = res?.data?.data || []
            // } catch (error) {
            //     console.error('获取拼团商品列表失败:', error)
            //     this.list = []
            // }
        }
    },
    computed: {
        outerStyle() {
            const { outerMargin, outerBackground } = this.value
            return {
                paddingTop: outerMargin.paddedt + 'px',
                paddingBottom: outerMargin.paddedb + 'px',
                paddingLeft: outerMargin.paddedl + 'px',
                paddingRight: outerMargin.paddedr + 'px',
                backgroundColor: outerBackground.color,
                backgroundImage: outerBackground.image ? `url(${outerBackground.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },

        innerStyle() {
            const { innerPadding, innerBackground, } = this.value
            return {
                paddingLeft: innerPadding.paddedl + 'px',
                paddingRight: innerPadding.paddedr + 'px',
                paddingTop: innerPadding.paddedt + 'px',
                paddingBottom: innerPadding.paddedb + 'px',
                backgroundColor: innerBackground?.type == 'solid' ? innerBackground.color : 'none',
                backgroundImage: innerBackground?.type == 'gradient' ? `linear-gradient(${innerBackground.startColor || 'transparent'}, ${innerBackground.endColor || 'transparent'})` : innerBackground?.type == 'image' ? `url(${innerBackground.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }
        },
    }
}
</script>
