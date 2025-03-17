const appElement = document.querySelector('[ng-app], [data-ng-app]')
const injector = window.angular.element(appElement).injector()
const $rootScope = injector.get('$rootScope')

function findScope (scope, controllerName) {
  // console.log(scope);
  // if (scope.$ctrl && scope.$ctrl.constructor.name === controllerName) {
  //   return scope;
  // }
  if (scope.renderers) {
    return scope
  }
  if (scope.$$childHead) {
    return findScope(scope.$$childHead, controllerName)
  }
  if (scope.$$nextSibling) {
    return findScope(scope.$$nextSibling, controllerName)
  }
  return null
}

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
        rubyTextFrag += `<ruby>${kanji}<rt>${furigana}</rt></ruby>`
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

const rubyCtx = {}

function maybeAnnotateRuby (dialogue, renderer) {
  rubyCtx[renderer.subtitleLanguage] = {
    dialogue,
    renderer
  }
  const otherCtx = Object.keys(rubyCtx).filter(x => x !== renderer.subtitleLanguage)
  if (!otherCtx.length) {
    return
  }
  if (!otherCtx.every(x => rubyCtx[x].dialogue.start === dialogue.start)) {
    return
  }
  const hiraganaElement = document.querySelector('.layerhiragana .hiragana.subtitle')
  hiraganaElement.style.display = 'none'
  const japaneseElement = document.querySelector('.anjapanese .japanese.subtitle')
  const rubyText = annotateRuby(rubyCtx.japanese.dialogue._rawPartsString, rubyCtx.hiragana.dialogue._rawPartsString)
  japaneseElement.innerHTML = rubyText
}

const $scope = findScope($rootScope, 'videoCtrl')

if (!$scope) {
  console.error('Could not find the scope for controller')
  return
}

const japaneseRenderer = $scope.renderers.find(x => x.language === 'japanese')
const hiraganaRenderer = $scope.renderers.find(x => x.language === 'hiragana')

// window.eh1 = (dialogue, renderer) => maybeAnnotateRuby(dialogue, renderer)
// japaneseRenderer.renderer.addEventListener('drawStart', window.eh1)
// window.eh2 = (dialogue, renderer) => maybeAnnotateRuby(dialogue, renderer)
// hiraganaRenderer.renderer.addEventListener('drawStart', window.eh2)

if (window.origJpRenderDraw) {
  japaneseRenderer.renderer.draw = window.origJpRenderDraw
}
if (window.origHiRenderDraw) {
  hiraganaRenderer.renderer.draw = window.origHiRenderDraw
}
window.origJpRenderDraw = japaneseRenderer.renderer.draw
window.origHiRenderDraw = hiraganaRenderer.renderer.draw

debugger

japaneseRenderer.renderer.draw = (dialogue) => {
  window.origJpRenderDraw.apply(japaneseRenderer.renderer, [dialogue])
  maybeAnnotateRuby(dialogue, japaneseRenderer.renderer)
}

hiraganaRenderer.renderer.draw = (dialogue) => {
  window.origHiRenderDraw.apply(hiraganaRenderer.renderer, [dialogue])
  maybeAnnotateRuby(dialogue, hiraganaRenderer.renderer)
}
