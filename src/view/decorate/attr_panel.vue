<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" src="./attr_panel.scss"></style>

<script>
import { isFunction } from '@/utils'
export default {
  name: 'AttrPanel',
  props: {
    info: [Object, Array],
    value: [Object, Number, String, Boolean]
  },
  data() {
    return {
      compValue: null,
      activeTab: 'content' // 'content' 或 'style'
    }
  },
  created() {
    this.compValue = this.value
  },
  methods: {
    onCompChange() {
      this.$emit('input', this.compValue)
    },
    _renderSelect({ key, options, onchange = () => {} }) {
      return (
        <el-select v-model={this.value[key]} size='mini' onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-option label={op.label} value={op.value} />
          ))}
        </el-select>
      )
    },

    _renderTextArea({ key, rows }) {
      return <el-input type='textarea' v-model={this.value[key]} rows={rows} size='small' />
    },

    _renderInput({ key }) {
      return <el-input type='text' v-model={this.value[key]} size='small' />
    },

    _renderColor({ key, value: initValue }) {
      const displayColor = this.value[key] || initValue || '#000'
      return (
        <div class='el-color-picker-wrap'>
          <span class='color-code'>{displayColor}</span>
          <div class='color-controls-item'>
          <el-button
            class='button-reset'
            type='text'
            on-click={() => {
              this.value[key] = initValue
            }}
          >
            重置
          </el-button>
          <div class='color-swatch' style={{ backgroundColor: displayColor }}>
            <el-color-picker 
              v-model={this.value[key]} 
              size='small'
            />
          </div>
          </div>
        </div>
      )
    },

    _renderNumber({ key, min, max, step }) {
      return (
        <el-input-number v-model={this.value[key]} size='small' min={min} max={max} step={step} />
      )
    },
    _renderSwitch({ key }) {
      return <el-switch v-model={this.value[key]} />
    },
    _renderSlider({ key, showInput = false }) {
      return <el-slider v-model={this.value[key]} show-input={showInput} />
    },
    _renderRadio({ key, options }) {
      return (
        <el-radio-group v-model={this.value[key]}>
          {options.map((op) => (
            <el-radio label={op.label}>{op.name}</el-radio>
          ))}
        </el-radio-group>
      )
    },
    _renderRadioButton({ key, options, onchange = () => {} }) {
      return (
        <el-radio-group v-model={this.value[key]} size='mini' onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-radio-button label={op.label}>{op.name}</el-radio-button>
          ))}
        </el-radio-group>
      )
    },
    _renderCheckbox({ key, options, min = 0, onchange = () => {} }) {
      return (
        <el-checkbox-group min={min} v-model={this.value[key]} onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-checkbox label={op.label} key={op.label}>
              {op.name}
            </el-checkbox>
          ))}
        </el-checkbox-group>
      )
    }
  },
  computed: {
    // 样式相关的配置项 key 列表
    styleKeys() {
      return [
        'outerMargin',
        'innerPadding',
        'navpadded',
        'navitempadded',
        'navitemmargin',
        'outerBackground',
        'innerBackground',
        'navbg',
        'navitembg',
        'titleStyle',
        'titleColor',
        'titleBackgroundImage',
        'bgColor',
        'bgPic',
        'backgroundImg',
        'newNavigateStyle',
        'newPageBackgroundStyle',
        'limitedTimeBackground',
        'navitembordercolor',
        'navitemradius',
        'navitemheight'
      ]
    },
    // 将配置项按分组组织
    groupedSettings() {
      const { setting } = this.info
      if (!setting || !Array.isArray(setting)) return { content: [], style: [] }
      
      const contentGroups = {}
      const styleGroups = {}
      
      setting.forEach(item => {
        const isStyle = this.styleKeys.includes(item.key)
        const group = item.group || '其他'
        const targetGroups = isStyle ? styleGroups : contentGroups
        
        if (!targetGroups[group]) {
          targetGroups[group] = []
        }
        targetGroups[group].push(item)
      })
      
      return {
        content: Object.entries(contentGroups).map(([groupName, items]) => ({ groupName, items })),
        style: Object.entries(styleGroups).map(([groupName, items]) => ({ groupName, items }))
      }
    },
    // 内容设置（兼容旧版本，如果没有分组）
    contentSettings() {
      const { setting } = this.info
      if (!setting || !Array.isArray(setting)) return []
      return setting.filter(item => {
        // 不在样式列表中的都是内容设置
        return !this.styleKeys.includes(item.key)
      })
    },
    // 样式设置（兼容旧版本，如果没有分组）
    styleSettings() {
      const { setting } = this.info
      if (!setting || !Array.isArray(setting)) return []
      return setting.filter(item => {
        // 在样式列表中的都是样式设置
        return this.styleKeys.includes(item.key)
      })
    }
  },
  render(h) {
    const { wgtName } = this.info

    const renderComp = (item) => {
      if (isFunction(item.component)) {
        return item.component.call(this, h, item)
        // return <el-input v-model={this.value[item.key]} />
      }

      const renderItem = {
        textarea: this._renderTextArea,
        input: this._renderInput,
        color: this._renderColor,
        number: this._renderNumber,
        // 'text': this._renderText,
        'select': this._renderSelect,
        'radio': this._renderRadio,
        'radiobutton': this._renderRadioButton,
        // 'checkbox': this._renderCheckbox,
        // 'table': this._renderTable,
        // 'richText': this._renderRichText,
        // 'image': this._renderImage,
        'switch': this._renderSwitch,
        'slider': this._renderSlider
      }
      return renderItem[item.component](item)
    }

    const renderSettings = (settings) => {
      return settings.map((item, index) => {
        const hasLabel = item.label && item.label.trim() !== ''
        // 检查是否包含 SpImagePicker（通过 key 或 component 判断）
        const hasImagePicker = item.key === 'titleBackgroundImage' || 
          (typeof item.component === 'function' && item.component.toString().includes('SpImagePicker'))
        return (
          <div
            class={[
              'attr-panel-cell',
              {
                'is-show': typeof item.isShow != 'undefined' ? item.isShow.call(this, item) : true,
                'no-label': !hasLabel,
                'has-image-picker': hasImagePicker
              }
            ]}
          >
            {hasLabel && <div class='cell-label'>{item.label}</div>}
            <div class='cell-value'>
              <div class='cell-value-content'>{renderComp(item)}</div>
              {(item.tip || item.tips) && <div class='cell-value-tip' domPropsInnerHTML={item.tip || item.tips} />}
            </div>
          </div>
        )
      })
    }

    const renderGroupedSettings = (groups) => {
      if (groups.length === 0) return null
      
      return groups.map(({ groupName, items }) => (
        <div class='setting-group' key={groupName}>
          <div class='setting-group-header'>{groupName}</div>
          <div class='setting-group-content'>
            {renderSettings(items)}
          </div>
        </div>
      ))
    }

    // 检查是否有分组
    const hasGroups = this.groupedSettings.content.some(g => g.groupName !== '其他') || 
                     this.groupedSettings.style.some(g => g.groupName !== '其他')

    return (
      <div class='attr-panel'>
        <el-tabs v-model={this.activeTab} class='attr-panel-tabs'>
          <el-tab-pane label='内容设置' name='content'>
            <div class='attr-panel-content'>
              {hasGroups ? renderGroupedSettings(this.groupedSettings.content) : renderSettings(this.contentSettings)}
            </div>
          </el-tab-pane>
          <el-tab-pane label='样式设置' name='style'>
            <div class='attr-panel-content'>
              {hasGroups ? renderGroupedSettings(this.groupedSettings.style) : renderSettings(this.styleSettings)}
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    )
  }
}
</script>
