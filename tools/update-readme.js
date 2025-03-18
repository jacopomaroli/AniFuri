const fs = require('fs')

// Read the bookmarklet code
const bookmarkletCode = fs.readFileSync('dist/main.js', 'utf8')

// Create the bookmarklet link
const bookmarkletLink = bookmarkletCode.slice(1)

// Read the README
let readmeContent = fs.readFileSync('README.md', 'utf8')

// Replace the bookmarklet link in the README
readmeContent = readmeContent.replace(
  /(AniFuri\]\().*/,
  `$1<${bookmarkletLink}>)`
)

// Write the updated README
fs.writeFileSync('README.md', readmeContent, 'utf8')

console.log('README updated with the latest bookmarklet link.')
