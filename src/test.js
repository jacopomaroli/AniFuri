function annotateRuby (japaneseTextRaw, hiraganaTextRaw) {
  const rubyTextGroups = []
  const japaneseTextGroups = japaneseTextRaw.trim().split(' ')
  const hiraganaTextGroups = hiraganaTextRaw.trim().split(' ')

  for (let j = 0; j < japaneseTextGroups.length; j++) {
    const japaneseText = japaneseTextGroups[j]
    const hiraganaText = hiraganaTextGroups[j]
    let hiraganaIndex = 0
    let i = 0
    let rubyTextFrag = ''
    while (i < japaneseText.length) {
      const char = japaneseText[i]

      // Check if the current character is a kanji
      if (/[\u4E00-\u9FAF]/.test(char)) {
        let kanjiEnd = i + 1
        // Find the end of the kanji sequence
        while (kanjiEnd < japaneseText.length && /[\u4E00-\u9FAF]/.test(japaneseText[kanjiEnd])) {
          kanjiEnd++
        }
        // Extract the kanji sequence
        const kanji = japaneseText.slice(i, kanjiEnd)
        // Find the corresponding hiragana sequence
        // let hiraganaEnd = hiraganaIndex
        // while (hiraganaEnd < hiraganaText.length && !/[\u4E00-\u9FAF]/.test(japaneseText[hiraganaEnd])) {
        //   hiraganaEnd++
        // }
        const hiraganaEnd = japaneseText.length - kanjiEnd
        const furigana = hiraganaText.slice(hiraganaIndex, hiraganaEnd ? -hiraganaEnd : undefined)
        // Add the ruby tag
        rubyTextFrag += `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
        // Update indices
        i = kanjiEnd
        hiraganaIndex = hiraganaEnd
      } else {
        // Non-kanji characters are added as-is
        rubyTextFrag += char
        i++
        hiraganaIndex++
      }
    }
    rubyTextGroups.push(rubyTextFrag)
  }

  const rubyText = rubyTextGroups.join(' ')
  console.log(rubyText)
  return rubyText
}

const japaneseTextRaw = '笹 を 食べ ながら のんびり する の は 最高 だ なぁ'
const hiraganaTextRaw = 'ささ を たべ ながら のんびり する の は さいこう だ なぁ'

annotateRuby(japaneseTextRaw, hiraganaTextRaw)
