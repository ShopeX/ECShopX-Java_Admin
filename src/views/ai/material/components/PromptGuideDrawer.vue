<template>
  <el-drawer
    title="提示词指南"
    :visible.sync="visible"
    direction="rtl"
    size="520px"
    append-to-body
  >
    <div class="guide-drawer">
      <div class="external-link">
        <a :href="externalLink" target="_blank" rel="noopener">
          <i class="el-icon-link"></i>
          完整文档：提示词指南
        </a>
      </div>

      <div v-for="(sec, idx) in sections" :key="idx" class="guide-section">
        <h3 class="guide-title">{{ sec.title }}</h3>
        <ul class="guide-list">
          <li v-for="(line, i) in sec.content" :key="i">{{ line }}</li>
        </ul>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { PROMPT_GUIDE_SECTIONS, PROMPT_GUIDE_LINK } from '../constants/promptGuide'

export default {
  name: 'PromptGuideDrawer',
  props: { value: { type: Boolean, default: false } },
  data() {
    return {
      visible: this.value,
      sections: PROMPT_GUIDE_SECTIONS,
      externalLink: PROMPT_GUIDE_LINK
    }
  },
  watch: {
    value(v) { this.visible = v },
    visible(v) { if (v !== this.value) this.$emit('input', v) }
  }
}
</script>

<style scoped>
.guide-drawer { padding: 0 24px 24px; overflow-y: auto; height: calc(100vh - 80px); }
.external-link { padding: 12px 16px; background: #ecf5ff; border-radius: 4px; margin-bottom: 20px; }
.external-link a { color: #409eff; text-decoration: none; font-size: 13px; }
.external-link a:hover { text-decoration: underline; }
.guide-section { margin-bottom: 24px; }
.guide-title {
  font-size: 14px; font-weight: 600; color: #303133; margin: 0 0 8px;
  padding-left: 8px; border-left: 3px solid #409eff;
}
.guide-list { padding-left: 20px; margin: 0; color: #606266; font-size: 13px; line-height: 1.8; }
.guide-list li { margin-bottom: 4px; }
</style>
