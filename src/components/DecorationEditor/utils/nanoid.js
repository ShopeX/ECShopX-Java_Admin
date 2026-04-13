const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

function nanoid(length = 6) {
  let id = ''
  for (let index = 0; index < length; index += 1) {
    id += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return id
}

function generateSectionId(type) {
  return `${type}-${nanoid()}`
}

function generateBlockId(type) {
  return `${type}-${nanoid()}`
}

module.exports = {
  nanoid,
  generateSectionId,
  generateBlockId
}
