/* eslint-disable camelcase */
const fs = require('fs')
const { minify_sync } = require('terser')
const { parse } = require('acorn')
const walk = require('acorn-walk')

const inputCode = fs.readFileSync('src/main.js', 'utf8')

const wrappedCode = `(function() { ${inputCode} })();`

// Parse the code into a SpiderMonkey AST
const ast = parse(wrappedCode, {
  ecmaVersion: 'latest', // Use the latest ECMAScript version
  sourceType: 'script' // or 'module' if your code uses ES modules
})

// Traverse the AST and remove `module.exports` nodes
walk.simple(ast, {
  AssignmentExpression (node) {
    if (
      node.left.type === 'MemberExpression' &&
      node.left.object.type === 'Identifier' &&
      node.left.object.name === 'module' &&
      node.left.property.type === 'Identifier' &&
      node.left.property.name === 'exports'
    ) {
      // Remove the `module.exports` assignment by replacing it with an empty expression
      node.type = 'ExpressionStatement'
      node.expression = { type: 'Identifier', name: '' } // Replace with an empty expression
    }
  }
})

// Minify the code
const result = minify_sync(ast, {
  compress: {
    defaults: false,
    drop_debugger: true
  },
  mangle: false,
  format: {
    beautify: false
  },
  parse: {
    spidermonkey: true,
    bare_returns: true
  }
})

// Check for errors
if (result.error) {
  throw result.error
}

let modified = result.code

if (modified.startsWith('!')) {
  modified = modified.slice(1)
}

// Write the minified output to a file
console.log(modified)
modified = `javascript:${modified}`
modified = encodeURI(modified)
fs.writeFileSync('dist/main.js', modified, 'utf8')
