<template>
    <div class="seckill-right-card" :style="cardStyle">
        <!-- 限时特惠标题 -->
        <div class="seckill-title">{{ title }}</div>
        <!-- 有数据时显示商品列表 -->
        <template v-if="hasData">
            <div class="seckill-item-list">
                <div v-for="(item, index) in goodsList" :key="item.item_id" class="seckill-item"
                    :style="{ top: `${index * 4 / (1 - index * 0.08)}px`, transform: `scale(${1 - index * 0.08})`, zIndex: `${(goodsList.length - index) * 1}`, opacity: `${1 - index * 0.08}` }">
                    <!-- 商品图片 -->
                    <div class="seckill-image-wrapper">
                        <img :src="item.main_img" class="seckill-image" alt="">
                    </div>
                </div>
            </div>
            <!-- 商品名称 -->
            <div class="seckill-goods-name">{{ goodsList[currentIndex].item_name }}</div>
            <!-- 秒杀价 -->
            <div class="seckill-price">
                <span class="price-label">秒杀价</span>
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ formatPrice(goodsList[currentIndex].activity_price) }}</span>
            </div>
        </template>
        <!-- 无数据时显示占位样式 -->
        <template v-else>
            <div class="seckill-item-list">
                <div class="seckill-item">
                    <div class="seckill-image-wrapper placeholder-image" />
                </div>
            </div>
            <!-- 商品名称 -->
            <div class="seckill-goods-name">--</div>
            <!-- 秒杀价 -->
            <div class="seckill-price">
                <span class="price-label">秒杀价</span>
                <span class="price-symbol">¥</span>
                <span class="price-value placeholder-text">--</span>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'SeckillRight',
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        goodsList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            currentIndex: 0,
        }
    },
    computed: {
        title() {
            return this.value.limitedTimeTitle
        },
        hasData() {
            return this.goodsList && Array.isArray(this.goodsList) && this.goodsList.length > 0
        },
        cardStyle() {
            const bg = this.value.limitedTimeBackground || {}
            let style = {}

            if (bg.type === 'solid') {
                style.backgroundColor = bg.color || '#FFE5E5'
            } else if (bg.type === 'gradient') {
                style.backgroundImage = `linear-gradient(${bg.startColor || '#E5C9FE'}, ${bg.endColor || '#FFFFFF'})`
            } else if (bg.type === 'image' && bg.image) {
                style.backgroundImage = `url(${bg.image})`
                style.backgroundSize = 'cover'
                style.backgroundPosition = 'center'
                style.backgroundRepeat = 'no-repeat'
            } else {
                // 默认浅粉色背景
                style.backgroundColor = '#FFE5E5'
            }

            return style
        }
    },
    methods: {
        formatPrice(price) {
            if (!price) return '0'
            const numPrice = typeof price === 'string' ? parseFloat(price) : price
            // 价格通常以分为单位，需要除以100
            return Math.floor(numPrice / 100).toString()
        }
    }
}
</script>

<style lang="scss" scoped>
.seckill-right-card {
    width: 101px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.03);
    border-radius: 8px 8px 8px 8px;
    padding: 9px 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;



    .seckill-title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 18px;
        color: #404040;
        text-align: center;
        margin-bottom: 6px;
        line-height: 1.2;
    }

    .seckill-item-list {
        position: relative;
        width: 73px;
        height: 81px;
        overflow: hidden;
    }

    .seckill-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 73px;
        height: 73px;
    }

    .seckill-image-wrapper {
        width: 73px;
        aspect-ratio: 1;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 4px;

        .seckill-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            box-shadow: 0px 4px 12px 0px rgba(253,201,216,0.25);
        }
    }

    .seckill-goods-name {
        width: 100%;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #404040;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 15px;
        padding: 0 7px;
        font-size: 11px;
    }

    .seckill-price {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 2px;

        .price-label {
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 10px;
            color: #D4003B;
            margin-right: 3px;
        }

        .price-symbol {
            font-family: D-DIN-PRO, D-DIN-PRO;
            font-weight: 500;
            font-size: 11px;
            color: #D4003B;
            line-height: 1;
        }

        .price-value {
            font-family: D-DIN-PRO, D-DIN-PRO;
            font-weight: 600;
            font-size: 14px;
            color: #D4003B;
            line-height: 1;
        }
    }

    .placeholder-image {
        background-color: #F5F5F5;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' fill='%23CCCCCC'/%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.5;
        }
    }

    .placeholder-text {
        color: #CCCCCC;
    }
}
</style>
