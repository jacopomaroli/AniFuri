javascript:(function()%7Bconst%20appElement=document.querySelector(%22%5Bng-app%5D,%20%5Bdata-ng-app%5D%22);const%20injector=window.angular.element(appElement).injector();const%20$rootScope=injector.get(%22$rootScope%22);function%20findScope(scope,controllerName)%7Bif(scope.renderers)return%20scope;if(scope.$$childHead)return%20findScope(scope.$$childHead,controllerName);if(scope.$$nextSibling)return%20findScope(scope.$$nextSibling,controllerName);return%20null%7Dfunction%20annotateRuby(japaneseTextRaw,hiraganaTextRaw)%7Bconst%20rubyTextGroups=%5B%5D;const%20japaneseTextGroups=japaneseTextRaw.trim().split(%22%20%22);const%20hiraganaTextGroups=hiraganaTextRaw.trim().split(%22%20%22);for(let%20j=0;j%3CjapaneseTextGroups.length;j++)%7Bconst%20japaneseText=japaneseTextGroups%5Bj%5D;const%20hiraganaText=hiraganaTextGroups%5Bj%5D;let%20hiraganaIndex=0;let%20i=0;let%20rubyTextFrag=%22%22;while(i%3CjapaneseText.length)%7Bconst%20char=japaneseText%5Bi%5D;if(/%5B%5Cu4E00-%5Cu9FAF%5D/.test(char))%7Blet%20kanjiEnd=i+1;while(kanjiEnd%3CjapaneseText.length&&/%5B%5Cu4E00-%5Cu9FAF%5D/.test(japaneseText%5BkanjiEnd%5D))kanjiEnd++;const%20kanji=japaneseText.slice(i,kanjiEnd);const%20hiraganaEnd=japaneseText.length-kanjiEnd;const%20furigana=hiraganaText.slice(hiraganaIndex,hiraganaEnd?-hiraganaEnd:void%200);rubyTextFrag+=%60%3Cruby%3E$%7Bkanji%7D%3Crt%3E$%7Bfurigana%7D%3C/rt%3E%3C/ruby%3E%60;i=kanjiEnd;hiraganaIndex=hiraganaEnd%7Delse%7BrubyTextFrag+=char;i++;hiraganaIndex++%7D%7DrubyTextGroups.push(rubyTextFrag)%7Dconst%20rubyText=rubyTextGroups.join(%22%20%22);console.log(rubyText);return%20rubyText%7Dconst%20rubyCtx=%7B%7D;function%20maybeAnnotateRuby(dialogue,renderer)%7BrubyCtx%5Brenderer.subtitleLanguage%5D=%7Bdialogue:dialogue,renderer:renderer%7D;const%20otherCtx=Object.keys(rubyCtx).filter((x=%3Ex!==renderer.subtitleLanguage));if(!otherCtx.length)return;if(!otherCtx.every((x=%3ErubyCtx%5Bx%5D.dialogue.start===dialogue.start)))return;const%20hiraganaElement=document.querySelector(%22.layerhiragana%20.hiragana.subtitle%22);hiraganaElement.style.display=%22none%22;const%20japaneseElement=document.querySelector(%22.anjapanese%20.japanese.subtitle%22);const%20rubyText=annotateRuby(rubyCtx.japanese.dialogue._rawPartsString,rubyCtx.hiragana.dialogue._rawPartsString);japaneseElement.innerHTML=rubyText%7Dconst%20$scope=findScope($rootScope,%22videoCtrl%22);if(!$scope)%7Bconsole.error(%22Could%20not%20find%20the%20scope%20for%20controller%22);return%7Dconst%20japaneseRenderer=$scope.renderers.find((x=%3Ex.language===%22japanese%22));const%20hiraganaRenderer=$scope.renderers.find((x=%3Ex.language===%22hiragana%22));if(window.origJpRenderDraw)japaneseRenderer.renderer.draw=window.origJpRenderDraw;if(window.origHiRenderDraw)hiraganaRenderer.renderer.draw=window.origHiRenderDraw;window.origJpRenderDraw=japaneseRenderer.renderer.draw;window.origHiRenderDraw=hiraganaRenderer.renderer.draw;japaneseRenderer.renderer.draw=dialogue=%3E%7Bwindow.origJpRenderDraw.apply(japaneseRenderer.renderer,%5Bdialogue%5D);maybeAnnotateRuby(dialogue,japaneseRenderer.renderer)%7D;hiraganaRenderer.renderer.draw=dialogue=%3E%7Bwindow.origHiRenderDraw.apply(hiraganaRenderer.renderer,%5Bdialogue%5D);maybeAnnotateRuby(dialogue,hiraganaRenderer.renderer)%7D;%7D)();