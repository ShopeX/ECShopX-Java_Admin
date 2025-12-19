import { pickBy } from '@/utils'
import AttrHotSetting from './attr-hotsetting'
import CompStyle from '../../comps/comp_style.vue'
export default {
  name: 'imgHotzone',
  setting: [
    {
      label: '展示形式',
      key: 'animation',
      component: 'radiobutton',
      options: [
        { name: '纵向排列', label: 'horizontal' },
        { name: '横向排列', label: 'vertical' },
      ],
      tips: '横向排列:高度固定，宽度自适应, 超出屏幕滑动',
      value: 'horizontal'
    },
    {
      label: '图片高度',
      key: 'imgHeight',
      component: function (h, { key }) {
        return (
          <el-input-number
            value={this.value[key]}
            on-input={(val) => {
              this.value[key] = val
              // 当 animation === 'vertical' 且图片已选择时，重新计算图片宽高 获取高度的意义就为了在小程序中可以占位准确
              if (this.value.animation === 'vertical' && this.value.data?.imgUrl && this.value.data?.imgWidth && this.value.data?.imgHeight) {
                const aspectRatio = this.value.data.imgWidth / this.value.data.imgHeight
                const newImgHeight = val
                const newImgWidth = Math.round(newImgHeight * aspectRatio)
                this.$set(this.value.data, 'imgHeight', newImgHeight)
                this.$set(this.value.data, 'imgWidth', newImgWidth)
              }
            }}
            size="small"
            min={0}
          />
        )
      },
      value: 156,
      isShow: function   (v) {
        return this.value.animation === 'vertical'
      }
    },
    {
      label: '热区设置',
      key: 'data',
      component: function (h, { key }) {
        return <AttrHotSetting v-model={this.value[key]} />
      },
      value: { imgUrl: '', data: [] }
    },
    {
      label: '组件外边距',
      key: 'outerMargin',
      component: function (h, { key }) {
        return (
          <CompStyle
            showBgsetting={false}
            v-model={this.value[key]}
            uuid={this.value.uuid}
            showLabel={false}
          />
        )
      },
      value: {
        paddedt: 0,
        paddedb: 0,
        paddedl: 0,
        paddedr: 0
      }
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      config: { imgUrl, imgWidth, imgHeight },
      data,
    } = v
    // 将 rpx 转换为 px（除以2）
    const convertedImgWidth = imgWidth !== undefined && imgWidth !== null ? imgWidth / 2 : 0
    const convertedImgHeight = imgHeight !== undefined && imgHeight !== null ? imgHeight / 2 : 0
    const convertedBaseImgHeight = base?.imgHeight !== undefined && base?.imgHeight !== null ? base.imgHeight / 2 : base?.imgHeight
    const convertedOuterMargin = base?.outerMargin ? {
      paddedt: (base.outerMargin.paddedt || 0) / 2,
      paddedb: (base.outerMargin.paddedb || 0) / 2,
      paddedl: (base.outerMargin.paddedl || 0) / 2,
      paddedr: (base.outerMargin.paddedr || 0) / 2
    } : base?.outerMargin
    
    return {
      name,
      ...base,
      imgHeight: convertedBaseImgHeight,
      outerMargin: convertedOuterMargin,
      data: {
        imgUrl,
        imgWidth: convertedImgWidth,
        imgHeight: convertedImgHeight,
        data
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      name: 'name',
      base: (v) => {
        const baseData = pickBy(v, {
          animation: 'animation',
          imgHeight: 'imgHeight',
          outerMargin: 'outerMargin',
        })
        // 将 base.imgHeight 转换为 rpx（乘以2）
        if (baseData.imgHeight !== undefined && baseData.imgHeight !== null) {
          baseData.imgHeight = baseData.imgHeight * 2
        }
        // 将 outerMargin 中的尺寸转换为 rpx（乘以2）
        if (baseData.outerMargin) {
          baseData.outerMargin = {
            paddedt: (baseData.outerMargin.paddedt || 0) * 2,
            paddedb: (baseData.outerMargin.paddedb || 0) * 2,
            paddedl: (baseData.outerMargin.paddedl || 0) * 2,
            paddedr: (baseData.outerMargin.paddedr || 0) * 2
          }
        }
        return baseData
      },
      config: ({ data }) => {
        if (!data) return {}
        // 将 imgWidth 和 imgHeight 转换为 rpx（乘以2）
        const imgWidth = data.imgWidth !== undefined && data.imgWidth !== null ? data.imgWidth * 2 : 0
        const imgHeight = data.imgHeight !== undefined && data.imgHeight !== null ? data.imgHeight * 2 : 0
        return {
          imgUrl: data.imgUrl || '',
          imgWidth,
          imgHeight
        }
      },
      data: 'data.data'
    })
  }
}
