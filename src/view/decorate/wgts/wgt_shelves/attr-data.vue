<template>
    <div class="attr-data">
        <CompButton v-if="type === 'category'" :placeholder="value?.info?.title || '选择销售分类'" :view-btn="false"
            @click="handleSelectCategory" />
        <CompButton v-if="type === 'main_category'" :placeholder="value?.info?.title || '选择管理分类'" :view-btn="false"
            @click="handleSelectMainCategory" />
        <el-select v-if="type === 'seckill'" v-model="localValue" @change="handleChangeLimited">
            <el-option v-for="item in options" :key="item.seckill_id" :value="item.seckill_id"
                :label="item.activity_name">
                {{ item.activity_name }}
            </el-option>
        </el-select>
        <div v-if="type === 'items'" class="attr-data-specified" @click="handleSelectGoods">
            {{ itemsInfo && itemsInfo.info?.length > 0 ? `已经选择${itemsInfo.info?.length}件商品` : '请选择商品' }}
        </div>

        <CompButton v-if="type === 'category_ranking'" :placeholder="rankingInfo?.info?.act_name || '选择榜单'"
            :view-btn="false" :clear-btn="false" @click="handleSelectRanking" />
        <CompButton v-if="type === 'platform_category_ranking'" :placeholder="platformRankingInfo?.info?.name || '选择平台榜单'"
            :view-btn="false" :clear-btn="false" @click="handleSelectPlatformCategoryRanking" />
        <div v-if="type === 'price'" class="price-range-container">
            <el-input-number v-model="minPrice" :min="0" :precision="0" size="mini" :max="maxPrice"
                controls-position="right" @change="handleChangePrice" />
            <span class="separator">-</span>
            <el-input-number v-model="maxPrice" :min="minPrice" :precision="0" size="mini" controls-position="right"
                @change="handleChangePrice" />
        </div>
        <div v-if="type === 'promotion'" class="attr-data-promotion">
            <CompButton :placeholder="value?.info?.name || '选择秒杀'" :view-btn="false" @click="handleChangePromotion" />
        </div>
        <CompButton v-if="type === 'group'" :placeholder="value?.info?.name || '选择拼团'" :view-btn="false"
            @click="handleSelectGroup" />
        <div v-if="type === 'platform_collection'" class="attr-data-platform-promotion">
            <CompButton :placeholder="value?.info?.name || '选择平台秒杀'" :view-btn="false"
                @click="handleChangePlatformPromotion" />
        </div>
        <CompButton v-if="type === 'platform_group'" :placeholder="value?.info?.name || '选择平台拼团'" :view-btn="false"
            @click="handleSelectPlatformGroup" />
    </div>
</template>

<script>
import api from '@/api'
import { cloneDeep, isArray } from 'lodash-es'
import CompButton from '../../comps/comp-button.vue';
export default {
    components: {
        CompButton
    },
    props: ['type', 'value'],
    data() {
        return {
            localValue: null,
            props: {
                value: 'category_id',
                label: 'category_name',
                children: 'children',
                checkStrictly: true
            },
            options: [],
            minPrice: 0,
            maxPrice: 0,
            itemsInfo: null,
            promotionId: null,
            categoryOptions: [],
            rankingInfo: null,
            platformRankingInfo: null
        }
    },
    computed: {
        itemIds() {
            return this.localValue ? this.localValue.split(',') : []
        },
    },
    watch: {
        type: {
            handler(newVal) {
                if (newVal === 'price') {
                    const [min, max] = this.value.id.split(',')
                    this.minPrice = Number(min) || 0
                    this.maxPrice = Number(max) || 0
                } else if (newVal === 'group') {
                    this.groupInfo = cloneDeep(this.value)
                } else if (newVal === 'category_ranking') {
                    this.rankingInfo = cloneDeep(this.value)
                } else if (newVal === 'items') {
                    if (this.value?.info?.type === 'group_id') {
                        this.itemsInfo = cloneDeep(this.value)
                    } else {
                        this.itemsInfo = {
                            id: this.value?.id,
                            info: {
                                length: this.value?.id ? this.value?.id?.split(',')?.length : 0,
                                type: ''
                            }
                        }
                    }
                } else if (newVal === 'promotion') {
                    this.promotionId = this.value.id
                } else if (newVal === 'platform_category_ranking') {
                    console.log('newVal', this.value)
                    this.platformRankingInfo = cloneDeep(this.value)
                } else {
                    this.localValue = this.value.id
                }
                this.getList()
            },
            immediate: true
        },
    },
    created() {
    },
    methods: {
        async handleSelectMainCategory(v) {
            const { data } = await this.$picker.category({
                multiple: false,
                data: this.value?.id,
                regionauth_id: this.$route.query.regionauth_id
            })
            this.$emit('input', { id: data[0].id, info: { regionauth_id: this.$route.query.regionauth_id, title: data[0].title } })
        },
        async handleSelectCategory(v) {
            const { data } = await this.$picker.saleCategory({
                multiple: false,
                data: this.value?.id,
                regionauth_id: this.$route.query.regionauth_id
            })
            this.$emit('input', { id: data[0].id, info: { regionauth_id: data[0].regionauth_id, title: data[0].title } })
        },
        handleChangeLimited(v) {
            this.$emit('input', { id: this.localValue, info: null })
        },

        async getList() {
            if (this.type == 'seckill') {
                const res = await api.promotions.seckillActivityGetList({
                    status: '',//valid
                    seckill_type: 'limited_time_sale',
                    page: 1,
                    pageSize: 10000,
                    regionauth_id: this.$route.query.regionauth_id
                })
                this.options = res.list
            }
        },
        async handleSelectGoods() {
            const { data, length } = await this.$picker.goodsCheck({
                data: this.itemsInfo?.info?.type !== 'group_id' ? '' : this.itemsInfo?.id,
                goods: this.itemsInfo?.info?.type !== 'group_id' && this.itemsInfo?.id ? this.itemsInfo?.id.split(',') : [],
                multiple: true,
                rowKey: 'goods_id',
                regionauth_id: this.$route.query.regionauth_id,
                distributor_id: this.$route.query.distributor_id,
                distributor_name: this.$route.query.distributor_name
            })
            console.log(data, length)
            this.itemsInfo = {
                id: data,
                info: {
                    length,
                    type: 'group_id'
                }
            }
            this.$emit('input', { id: data, info: { length, type: 'group_id' } })
        },
        async handleSelectGroup() {
            const { data } = await this.$picker.groups({
                multiple: false,
                data: [{
                    groups_activity_id: this.value.id
                }],
                regionauth_id: this.$route.query.regionauth_id,
                distributor_id: this.$route.query.distributor_id
            })
            this.groupInfo = {
                id: data[0].groups_activity_id,
                info: {
                    act_name: data[0].act_name
                }
            }
            this.$emit('input', { id: data[0].collection_id, info: { name: data[0].collection_name, regionauth_id: data[0].regionauth_id } })
        },
        handleChangePrice() {
            const [min, max] = [this.minPrice, this.maxPrice]
            this.$emit('input', { id: `${min},${max}`, info: null })
        },
        async handleSelectRanking() {
            const { data } = await this.$picker.ranking({
                multiple: false,
                data: [{
                    id: this.value.id
                }],
                regionauth_id: this.$route.query.regionauth_id
            })
            this.rankingInfo = {
                id: data[0].id,
                info: {
                    act_name: data[0].name
                }
            }
            this.$emit('input', this.rankingInfo)
        },
        async handleChangePromotion() {
            const { data } = await this.$picker.activityCollection({
                multiple: false,
                data: this.value.id,
                regionauth_id: this.$route.query.regionauth_id
            })
            this.$emit('input', { id: data[0].collection_id, info: { name: data[0].collection_name, regionauth_id: data[0].regionauth_id } })
        },
        async handleChangePlatformPromotion() {
            const { data } = await this.$picker.platfromActivityCollection({
                multiple: false,
                data: this.value.id,
                regionauth_id: this.$route.query.regionauth_id
            })
            this.$emit('input', { id: data[0].collection_id, info: { name: data[0].collection_name, regionauth_id: data[0].regionauth_id } })
        },
        async handleSelectPlatformGroup() {
            const { data } = await this.$picker.platfromActivityGroup({
                multiple: false,
                data: this.value.id,
                regionauth_id: this.$route.query.regionauth_id
            })
            this.$emit('input', { id: data[0].collection_id, info: { name: data[0].collection_name, regionauth_id: data[0].regionauth_id } })
        },
        async handleSelectPlatformCategoryRanking() {
            const { data } = await this.$picker.platfromCategoryRanking({
                multiple: false,
                data: this.value.id,
            })
            this.platformRankingInfo = {
                id: data[0].id,
                info: { name: data[0].name, regionauth_id: data[0].regionauth_id }
            }
            this.$emit('input', this.platformRankingInfo)
        }
    }

}
</script>

<style lang="scss" scoped>
.attr-data {
    .attr-data-specified {
        width: 220px;
        border: 1px solid #BEBEBE;
        padding: 5px;
        font-size: 10px;
        color: #848484;
        cursor: pointer;
    }

    .price-range-container {
        display: flex;
        align-items: center;

        .separator {
            margin: 0 5px;
        }
    }
}
</style>