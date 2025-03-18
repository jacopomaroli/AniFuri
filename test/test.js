global.document = {
  querySelector: () => {}
}
const renderers = [
  {
    language: 'japanese',
    renderer: {
      draw: () => {}
    }
  },
  {
    language: 'hiragana',
    renderer: {
      draw: () => {}
    }
  }
]
global.window = {
  angular: {
    element: () => ({ injector: () => ({ get: () => ({ renderers }) }) })
  }
}
const { annotateRuby } = require('../src/main')

const japaneseTextRaw = '笹 を 食べ ながら のんびり する の は 最高 だ なぁ'
const hiraganaTextRaw = 'ささ を たべ ながら のんびり する の は さいこう だ なぁ'

const res = annotateRuby(japaneseTextRaw, hiraganaTextRaw)
console.log(res)
