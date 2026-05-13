const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../../')
const read = (relativePath) => fs.readFileSync(path.resolve(root, relativePath), 'utf8')

function run() {
  const tailwindSource = read('tailwind.config.js')
  const tokensSource = read('src/styles/tokens-default.scss')

  assert.match(tailwindSource, /border:\s*{\s*DEFAULT: 'hsl\(var\(--border\)\)'/)
  assert.match(tokensSource, /--border: 220 13% 91%/)

  console.log('style-tokens.test.js passed')
}

run()
