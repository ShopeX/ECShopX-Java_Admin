import headerSection from './sections/header.js'
import announcementBarSection from './sections/announcement-bar.js'
import carouselSection from './sections/carousel.js'
import imageHotspotSection from './sections/image-hotspot.js'
import productShelfSection from './sections/product-shelf.js'
import footerSection from './sections/footer.js'

import announcementBlock from './blocks/announcement.js'
import headerProductListBlock from './blocks/header-product-list.js'
import headerCollectionProductListBlock from './blocks/header-collection-product-list.js'
import megaMenuBlock from './blocks/mega-menu.js'
import imageBlock from './blocks/image.js'
import videoBlock from './blocks/video.js'
import hotspotBlock from './blocks/hotspot.js'
import footerLinkBlock from './blocks/footer-link.js'

const sectionDefinitions = {
  [headerSection.type]: headerSection,
  [announcementBarSection.type]: announcementBarSection,
  [carouselSection.type]: carouselSection,
  [imageHotspotSection.type]: imageHotspotSection,
  [productShelfSection.type]: productShelfSection,
  [footerSection.type]: footerSection
}

const blockDefinitions = {
  [announcementBlock.type]: announcementBlock,
  [headerProductListBlock.type]: headerProductListBlock,
  [headerCollectionProductListBlock.type]: headerCollectionProductListBlock,
  [megaMenuBlock.type]: megaMenuBlock,
  [imageBlock.type]: imageBlock,
  [videoBlock.type]: videoBlock,
  [hotspotBlock.type]: hotspotBlock,
  [footerLinkBlock.type]: footerLinkBlock
}

function getSectionTypesByScope(scope) {
  return Object.values(sectionDefinitions)
    .filter((definition) => definition.scope === scope)
    .map((definition) => definition.type)
}

export function getTypedSectionDefinition(type) {
  return sectionDefinitions[type] || null
}

export function getTypedBlockDefinition(type) {
  return blockDefinitions[type] || null
}

export function getAllowedBlockTypes(sectionType) {
  return getTypedSectionDefinition(sectionType)?.blocks?.allowed?.slice() || []
}

export function getSectionTypes() {
  return Object.keys(sectionDefinitions)
}

export function getSectionBlockTypes(sectionType) {
  return getAllowedBlockTypes(sectionType)
}

export { sectionDefinitions, blockDefinitions, getSectionTypesByScope }

export default {
  sectionDefinitions,
  blockDefinitions,
  getTypedSectionDefinition,
  getTypedBlockDefinition,
  getAllowedBlockTypes,
  getSectionTypes,
  getSectionBlockTypes,
  getSectionTypesByScope
}
