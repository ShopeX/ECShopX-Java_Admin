/**
 * 页面结构「添加分区」各入口策略（可扩展）。
 *
 * - types: null/undefined → 使用页内 sectionDefinitions 的全部类型（insertPicker.createSectionPickerItems）
 * - types: string[] → 仅展示这些 section type（需在 registry 中存在）
 * - mutation: 'page' → emit add-section（写入页面 dsl）；'global' → emit add-global-section
 *
 * 父组件可通过 StructurePanel 的 structureSectionInsertConfig 传入浅合并补丁（按 anchor 键）。
 */
const DEFAULT_STRUCTURE_SECTION_INSERT = {
  /** 标头区域「添加分区」：当前仅支持公告栏（全局分区） */
  header: {
    types: ['announcement-bar'],
    mutation: 'global'
  },
  template: {
    types: null,
    mutation: 'page'
  },
  'template-empty': {
    types: null,
    mutation: 'page'
  },
  footer: {
    types: null,
    mutation: 'page'
  }
}

function mergeInsertConfig(base, patch) {
  if (!patch || typeof patch !== 'object') {
    return { ...base }
  }
  const out = {}
  for (const key of Object.keys(base)) {
    out[key] = { ...base[key], ...(patch[key] && typeof patch[key] === 'object' ? patch[key] : {}) }
  }
  for (const key of Object.keys(patch)) {
    if (!(key in base) && patch[key] && typeof patch[key] === 'object') {
      out[key] = { types: null, mutation: 'page', ...patch[key] }
    }
  }
  return out
}

/**
 * @param {Record<string, { types?: string[] | null, mutation?: 'page' | 'global' }> | null | undefined} override
 */
function getStructureSectionInsertConfig(override) {
  return mergeInsertConfig(DEFAULT_STRUCTURE_SECTION_INSERT, override)
}

module.exports = {
  DEFAULT_STRUCTURE_SECTION_INSERT,
  getStructureSectionInsertConfig
}
