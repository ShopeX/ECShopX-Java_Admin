<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
  对齐 vshop master-standard-java：
  背景 → gameMarginTop → 积分卡 → 转盘 → 底部固定「活动规则/抽奖记录」按钮；规则点击弹框。
-->

<template>
  <div class="sp-game-preview" :style="pageStyle">
    <div class="sp-game-preview__scroll">
      <div class="sp-game-preview__body" :style="{ marginTop: gameMarginTopCss }">
        <div class="sp-active-control">
          <div class="sp-active-control__title">
            <span>我的积分</span>
            <span class="sp-active-control__score">{{ previewPoints }}</span>
          </div>
          <div class="sp-active-control__desc">每次抽奖消耗 {{ previewCost }} 积分</div>
        </div>

        <div class="sp-game-preview__game">
          <div class="wheel-stage" :style="stageStyle">
            <div class="wheel-disk" :style="diskStyle">
              <div
                v-for="(seg, index) in segments"
                :key="index"
                class="wheel-seg"
                :style="seg.labelStyle"
              >
                <img v-if="seg.image" class="wheel-seg__img" :src="seg.image" alt="" />
                <span class="wheel-seg__text">{{ seg.name }}</span>
              </div>
            </div>
            <div class="wheel-center" :style="centerStyle">
              <img v-if="centerImage" class="wheel-center__img" :src="centerImage" alt="" />
              <span v-else class="wheel-center__text">{{ centerText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部固定：活动规则 + 抽奖记录（不展示规则正文） -->
    <div class="sp-game-preview__footer">
      <div
        class="sp-game-preview__footer-btn"
        :style="ruleBtnStyle"
        @click="ruleDialogVisible = true"
      >
        <img
          v-if="ruleBtnImage"
          class="sp-game-preview__footer-btn-img"
          :src="ruleBtnImage"
          alt=""
        />
        <template v-else>{{ ruleBtn }}</template>
      </div>
      <div class="sp-game-preview__footer-btn" :style="recordBtnStyle">
        <img
          v-if="recordBtnImage"
          class="sp-game-preview__footer-btn-img"
          :src="recordBtnImage"
          alt=""
        />
        <template v-else>{{ recordBtn }}</template>
      </div>
    </div>

    <div
      v-if="ruleDialogVisible"
      class="sp-rule-modal"
      @click.self="ruleDialogVisible = false"
    >
      <div class="sp-rule-modal__panel">
        <div class="sp-rule-modal__close" @click="ruleDialogVisible = false">×</div>
        <div class="sp-rule-modal__title">{{ ruleBtn }}</div>
        <div class="sp-rule-modal__content" v-html="previewIntro" />
      </div>
    </div>
  </div>
</template>

<script>
const FALLBACK_COLORS = ['#FFE8D6', '#FFF0E8', '#FFE0CC', '#FFF5EE', '#FFDAB9', '#FFE4C4']

export default {
  name: 'LotteryLuckyWheelPreview',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ruleDialogVisible: false
    }
  },
  computed: {
    ruleBtn() {
      return this.$t('ca01abbc.02a217')
    },
    recordBtn() {
      return this.$t('ca01abbc.8a69c2')
    },
    centerText() {
      return this.$t('ca01abbc.a3e3b8')
    },
    previewPoints() {
      return this.config.previewPoints != null ? this.config.previewPoints : 1280
    },
    previewCost() {
      return this.config.costValue != null ? this.config.costValue : 1
    },
    previewIntro() {
      const html = this.config.intro
      if (html && String(html).replace(/<[^>]+>/g, '').trim()) return html
      return '<p>活动规则将展示在此处</p>'
    },
    gameMarginTopCss() {
      const raw = this.config && this.config.gameMarginTop
      if (raw === 0 || raw === '0' || raw === '0px') return '0px'
      const n = parseInt(String(raw == null ? 150 : raw).replace(/px$/i, ''), 10)
      if (!Number.isFinite(n) || n < 0) return '150px'
      return n + 'px'
    },
    prizeList() {
      const list = Array.isArray(this.config && this.config.prizeData) ? this.config.prizeData : []
      const visible = list.filter((item) => item && (item.name || item.type))
      if (visible.length) return visible
      return [
        { name: '谢谢参与', backgroundColor: FALLBACK_COLORS[0] },
        { name: '奖项', backgroundColor: FALLBACK_COLORS[1] }
      ]
    },
    prizeDefaultBackground() {
      return (this.config && this.config.hotArea && this.config.hotArea.background) || ''
    },
    segments() {
      const total = this.prizeList.length || 1
      const step = 360 / total
      const defaultBg = this.prizeDefaultBackground
      return this.prizeList.map((item, index) => {
        const mid = step * index + step / 2
        return {
          name: item.name || item.text || '',
          image: this.resolveImageSrc(item.image || item.img),
          color:
            item.backgroundColor ||
            item.background ||
            defaultBg ||
            FALLBACK_COLORS[index % FALLBACK_COLORS.length],
          labelStyle: {
            transform: 'rotate(' + mid + 'deg) translateY(-78px)'
          }
        }
      })
    },
    conicBackground() {
      const total = this.segments.length || 1
      const step = 360 / total
      const stops = this.segments.map((seg, index) => {
        const start = (step * index).toFixed(2)
        const end = (step * (index + 1)).toFixed(2)
        return seg.color + ' ' + start + 'deg ' + end + 'deg'
      })
      return 'conic-gradient(from -90deg, ' + stops.join(', ') + ')'
    },
    hotArea() {
      return (this.config && this.config.hotArea) || {}
    },
    ringPadding() {
      const pad = String(this.hotArea.padding != null ? this.hotArea.padding : 16).replace(
        /px$/i,
        ''
      )
      const n = Number(pad)
      return Number.isFinite(n) && n >= 0 ? Math.min(n, 50) : 16
    },
    ringImage() {
      return this.resolveImageSrc(this.hotArea.backImg)
    },
    centerImage() {
      return this.resolveImageSrc(this.hotArea.img)
    },
    pageStyle() {
      const bg = this.resolveImageSrc(this.config && this.config.background)
      const style = {
        backgroundColor: (this.config && this.config.backgroundColor) || '#f5f5f5',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundAttachment: 'local'
      }
      if (bg) style.backgroundImage = 'url(' + bg + ')'
      return style
    },
    stageStyle() {
      if (!this.ringImage) {
        return {
          padding: this.ringPadding + 'px',
          background: '#617df2'
        }
      }
      return {
        padding: this.ringPadding + 'px',
        backgroundImage: 'url(' + this.ringImage + ')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }
    },
    diskStyle() {
      return { background: this.conicBackground }
    },
    centerStyle() {
      const style = {
        // 中心按钮色与「奖项默认底色」解耦，避免预览误导
        backgroundColor: '#e54d42'
      }
      if (this.centerImage) {
        style.backgroundImage = 'url(' + this.centerImage + ')'
        style.backgroundSize = 'cover'
        style.backgroundPosition = 'center'
        style.backgroundColor = 'transparent'
      }
      return style
    },
    ruleBtnImage() {
      const cfg = this.config && this.config.ruleBtnStyle
      return this.resolveImageSrc(cfg && cfg.img)
    },
    recordBtnImage() {
      const cfg = this.config && this.config.recordBtnStyle
      return this.resolveImageSrc(cfg && cfg.img)
    },
    recordBtnStyle() {
      const cfg = this.config && this.config.recordBtnStyle
      // 有按钮图时只靠图片，避免文字叠色
      if (this.recordBtnImage) return {}
      return {
        backgroundColor: (cfg && cfg.rule && cfg.rule[0]) || '#ffffff',
        color: (cfg && cfg.rule && cfg.rule[1]) || '#666666'
      }
    },
    ruleBtnStyle() {
      const cfg = this.config && this.config.ruleBtnStyle
      if (this.ruleBtnImage) return {}
      return {
        backgroundColor: (cfg && cfg.rule && cfg.rule[0]) || '#ffffff',
        color: (cfg && cfg.rule && cfg.rule[1]) || '#666666'
      }
    }
  },
  methods: {
    resolveImageSrc(image) {
      if (!image) return ''
      if (typeof image === 'string') return image
      return image.url || image.src || image.path || ''
    }
  }
}
</script>

<style scoped>
.sp-game-preview {
  width: 100%;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* 背景图铺满整个预览页，不随内部滚动裁切到内容区 */
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}

.sp-game-preview__scroll {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  /* 给底部固定按钮留空，避免内容被挡住 */
  padding-bottom: 56px;
  box-sizing: border-box;
  background: transparent;
}

.sp-game-preview__body {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px 16px;
}

.sp-active-control {
  width: 100%;
  max-width: 327px;
  box-sizing: border-box;
  padding: 18px 12px 12px 15px;
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #fff9e9 100%);
  border-radius: 12px;
  border: 1px solid #ebebeb;
  margin-bottom: 30px;
}

.sp-active-control__title {
  font-size: 17px;
  color: #1a1a1a;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 6px;
}

.sp-active-control__score {
  font-size: 21px;
  color: #ffae00;
  margin-left: 4px;
}

.sp-active-control__desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.sp-game-preview__game {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.wheel-stage {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  box-sizing: border-box;
}

.wheel-disk {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.wheel-seg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 72px;
  margin-left: -36px;
  margin-top: -28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: center center;
  pointer-events: none;
}

.wheel-seg__img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-bottom: 2px;
}

.wheel-seg__text {
  max-width: 64px;
  font-size: 11px;
  line-height: 1.2;
  color: #666;
  text-align: center;
  word-break: break-all;
}

.wheel-center {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 72px;
  height: 72px;
  margin-left: -36px;
  margin-top: -36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  z-index: 2;
}

.wheel-center__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wheel-center__text {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  padding: 0 4px;
  line-height: 1.2;
}

/* 手机框底部固定双按钮：透明底，不遮挡整页背景图 */
.sp-game-preview__footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px 16px 16px;
  box-sizing: border-box;
  background: transparent;
  pointer-events: none;
}

.sp-game-preview__footer-btn {
  pointer-events: auto;
  background-color: #fff;
  color: #666;
  text-align: center;
  border-radius: 14px;
  width: 108px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.sp-game-preview__footer-btn-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.sp-rule-modal {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  box-sizing: border-box;
}

.sp-rule-modal__panel {
  position: relative;
  width: 100%;
  max-width: 300px;
  max-height: 70%;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px 16px;
  box-sizing: border-box;
}

.sp-rule-modal__close {
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 22px;
  line-height: 1;
  color: #999;
  cursor: pointer;
}

.sp-rule-modal__title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 12px;
}

.sp-rule-modal__content {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.sp-rule-modal__content >>> p {
  margin: 0 0 6px;
}
</style>
