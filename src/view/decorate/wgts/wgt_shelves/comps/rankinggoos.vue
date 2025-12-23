<template>
    <div class="ranking-goods" :style="containerStyle">
        <!-- 头部区域 -->
        <div class="ranking-header">
            <div class="ranking-header-left">
                <div class="header-title">
                    <img v-if="value.titleText && value.titleText.type === 'image' && value.titleText.image"
                        :src="value.titleText.image" class="header-image" alt="">
                    <span v-if="value.titleText && value.titleText.text" class="header-text"
                        :style="{ color: value.titleColor }">
                        {{ value.titleText?.text }}
                    </span>
                </div>
            </div>
            <!-- 查看更多 -->
            <div v-if="value.moreBtn && value.moreBtn.show" class="header-more" :style="{ color: value.moreBtn.color }">
                查看更多>
            </div>
        </div>

        <!-- 商品列表 -->
        <div class="ranking-goods-list" ref="goodsListRef">
            <div v-for="(item, index) in goodsList" :key="item.item_id || item.itemId || index"
                class="ranking-goods-item">
                <!-- 排名标签 -->
                <div class="ranking-badge" :class="index < 3 ? `top-badge-${index + 1}` : 'number-badge'">
                    <span v-if="index < 3">TOP.{{ index + 1 }}</span>
                    <span v-else>{{ index + 1 }}</span>
                </div>

                <!-- 商品图片 -->
                <div class="goods-img-wrapper">
                    <img :src="item.main_img || item.pics?.[0] || ''" class="goods-image" alt="">
                    <!-- 销量 -->
                    <div class="goods-sales" v-if="item.score">
                        <el-image :src="fireIcon" class="fire-icon" alt="" />
                        <span class="sales-number">{{ item.score }}</span>
                    </div>
                </div>

                <!-- 商品信息 -->
                <div class="goods-info">
                    <div class="goods-name-wrapper">
                        <!-- 标签 -->
                        <div class="goods-tags" v-if="getPromotionTags(item).length > 0">
                            <span v-for="(tag, tagIndex) in getPromotionTags(item)" :key="tagIndex" class="goods-tag"
                                :class="tag.class">
                                {{ tag.text }}
                            </span>
                        </div>
                        <!-- 商品名称 -->
                        <div class="goods-name">{{ item.item_name || item.itemName || '商品名称最多...' }}</div>
                    </div>

                    <!-- 价格 -->
                    <div class="goods-price">
                        <span class="price-symbol">¥</span>
                        <span class="price-value">{{ formatPrice(item.price) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import fireIcon from '@/assets/imgs/wgt/fire.png'
export default {
    name: 'RankingGoods',
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        goodsList: {
            type: Array,
            default: () => []
        },
        customStyle: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        containerStyle() {
            const bg = this.value.innerBackground || {}
            let style = {
                ...this.customStyle
            }

            if (bg.type === 'solid') {
                style.backgroundColor = bg.color
            } else if (bg.type === 'gradient') {
                style.backgroundImage = `linear-gradient(to bottom, ${bg.startColor}, ${bg.endColor})`
            } else if (bg.type === 'image' && bg.image) {
                style.backgroundImage = `url(${bg.image})`
                style.backgroundSize = 'cover'
                style.backgroundPosition = 'center'
                style.backgroundRepeat = 'no-repeat'
            }

            return style
        }
    },
    data() {
        return {
            fireIcon: fireIcon
        }
    },
    methods: {
        // 格式化价格
        formatPrice(price) {
            if (!price) return '0.00'
            const numPrice = typeof price === 'string' ? parseFloat(price) : price
            // 价格通常以分为单位，需要除以100
            return (numPrice / 100).toFixed(2)
        },
        // 获取促销标签
        getPromotionTags(item) {
            const tags = []

            // 检查 feature_activity_tag
            if (item.feature_activity_tag) {
                const tagText = item.feature_activity_tag
                if (tagText.includes('优先购') || tagText.includes('优先')) {
                    tags.push({
                        text: '优先购',
                        class: 'tag-priority'
                    })
                } else if (tagText.includes('秒杀')) {
                    tags.push({
                        text: '秒杀',
                        class: 'tag-seckill'
                    })
                } else if (tagText) {
                    tags.push({
                        text: tagText,
                        class: 'tag-default'
                    })
                }
            }

            // 检查 promotion_activity（如果存在）
            if (item.promotion_activity && Array.isArray(item.promotion_activity)) {
                item.promotion_activity.forEach(act => {
                    if (act.tag_name) {
                        let tagClass = 'tag-default'
                        if (act.tag_name.includes('优先购') || act.tag_name.includes('优先')) {
                            tagClass = 'tag-priority'
                        } else if (act.tag_name.includes('秒杀')) {
                            tagClass = 'tag-seckill'
                        }
                        // 避免重复添加
                        const exists = tags.find(t => t.text === act.tag_name)
                        if (!exists) {
                            tags.push({
                                text: act.tag_name,
                                class: tagClass
                            })
                        }
                    }
                })
            }

            return tags
        }
    }
}
</script>

<style lang="scss" scoped>
.ranking-goods {
    width: 100%;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 12px;
    overflow: hidden;
    position: relative;
    background-color: #4A4A4A;

    // 背景模糊效果
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: inherit;
        background-size: cover;
        background-position: center;
        filter: blur(10px);
        z-index: 0;
        opacity: 0.3;
        pointer-events: none;
    }

    >* {
        position: relative;
        z-index: 1;
    }

    .ranking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        color: #FFFFFF;
        height: 21px;

        .ranking-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header-title {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 18px;

            .header-image {
                height: 18px;
                margin-right: 4px;
            }

            .header-text {
                font-family: PingFang SC, PingFang SC;
                font-weight: 500;
                font-size: 15px;
            }
        }

        .header-more {
            font-size: 13px;
            cursor: pointer;
            font-weight: 500;
            white-space: nowrap;
        }
    }

    .ranking-goods-list {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        /* Firefox */
        -ms-overflow-style: none;
        /* IE and Edge */

        &::-webkit-scrollbar {
            display: none;
            /* Chrome, Safari, Opera */
        }
    }

    .ranking-goods-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 97px;
        width: 97px;
        flex-shrink: 0;
        border-radius: 6px;
        overflow: hidden;
        background-color: #fff;
        position: relative;

        .ranking-badge {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            font-family: D-DIN-PRO, D-DIN-PRO;
            font-weight: 800;
            text-align: center;

            &.top-badge-1 {
                height: 14px;
                background: linear-gradient(180deg, #FFEBAF 0%, #F0C33B 17%, #654B00 100%);
                border-radius: 6px 0px 6px 0px;
                line-height: 14px;
                padding: 0 4px;
                font-family: D-DIN-PRO, D-DIN-PRO;
                font-weight: 800;
                font-size: 12px;
                color: #FFFFFF;
                text-shadow: 0px 1px 0px #6B5001;
            }

            &.top-badge-2 {
                height: 14px;
                background: linear-gradient(180deg, #DBE7FF 0%, #97A9CE 17%, #1B222F 100%);
                border-radius: 6px 0px 6px 0px;
                line-height: 14px;
                padding: 0 4px;
                font-family: D-DIN-PRO, D-DIN-PRO;
                font-weight: 800;
                font-size: 12px;
                color: #FFFFFF;
                text-shadow: 0px 1px 0px #1E2533;
            }

            &.top-badge-3 {
                height: 14px;
                background: linear-gradient(180deg, #FFE2D1 0%, #DC9064 17%, #784427 100%);
                border-radius: 6px 0px 6px 0px;
                line-height: 14px;
                padding: 0 4px;
                font-family: D-DIN-PRO, D-DIN-PRO;
                font-weight: 800;
                font-size: 12px;
                color: #FFFFFF;
                text-shadow: 0px 1px 0px #7E4829;
            }

            &.number-badge {
                height: 14px;
                background: linear-gradient(180deg, #E3E3E3 0%, #BABABA 16%, #444444 100%);
                border-radius: 6px 0px 6px 0px;
                line-height: 14px;
                padding: 0 4px;
                font-family: D-DIN-PRO, D-DIN-PRO;
                font-weight: 800;
                font-size: 12px;
                color: #FFFFFF;
                text-shadow: 0px 1px 0px #363636;
            }
        }

        .goods-img-wrapper {
            width: 100%;
            height: 99px;
            position: relative;
            border-radius: 6px;
            margin-bottom: 6px;
            overflow: hidden;
            background: #F5F5F5;

            .goods-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .goods-sales {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 2;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 50%);
                display: flex;
                align-items: center;
                justify-content: center;

                .fire-icon {
                    width: 12px;
                    height: 12px;
                    object-fit: cover;
                }

                .sales-number {
                    font-family: D-DIN-PRO, D-DIN-PRO;
                    font-weight: 500;
                    font-size: 12px;
                    color: #FF9500;
                }
            }
        }

        .goods-info {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0 6px;



            .goods-name-wrapper {
                width: 100%;
                margin-bottom: 4px;

                .goods-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-bottom: 4px;

                    .goods-tag {
                        padding: 2px 6px;
                        border-radius: 2px;
                        font-family: PingFang SC, PingFang SC;
                        font-weight: 500;
                        font-size: 10px;
                        white-space: nowrap;

                        &.tag-priority {
                            background-color: #E5E5E5;
                            color: #666666;
                        }

                        &.tag-seckill {
                            background-color: #D4003B;
                            color: #FFFFFF;
                        }

                        &.tag-default {
                            background-color: #F5F5F5;
                            color: #666666;
                        }
                    }
                }

                .goods-name {
                    width: 100%;
                    line-height: 15px;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    height: 30px;
                    font-family: PingFang SC, PingFang SC;
                    font-weight: 500;
                    font-size: 11px;
                    color: #404040;
                }
            }

            .goods-price {
                display: flex;
                align-items: baseline;

                .price-symbol {
                    font-family: D-DIN-PRO, D-DIN-PRO;
                    font-weight: 500;
                    font-size: 11px;
                    color: #1A1A1A;
                    line-height: 1;
                    text-transform: none;
                }

                .price-value {
                    height: 14px;
                    font-family: D-DIN-PRO, D-DIN-PRO;
                    font-weight: 600;
                    font-size: 14px;
                    color: #1A1A1A;
                    line-height: 14px;
                    text-transform: none;
                }
            }
        }
    }
}
</style>