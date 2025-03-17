build:
	npx bookmarklet src/clean.js dist/main.js
#	npx bookmarklets-cli src/main.js

watch:
	npx bookmarklets-cli --watch src/main.js