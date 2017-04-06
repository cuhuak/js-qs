var reduceBy = require('reduce-by')
var tryCatch = require('try_catch')
var brackets = require('./lib/brackets')
var hasBracket = brackets.hasBracket
var stripBracket = brackets.stripBracket

// returns parsed object if `s` is a JSON string or returns undefined
var tryParseJSON = function (s) {
  var first = s.slice(0, 1)
  var last = s.slice(-1)
  if ((first === '{' || first === '[') && (last === '}' || last === ']')) {
    return tryCatch(
      function () { return  JSON.parse(s) },
      function () {}
    )
  }
}

// returns the first delimiter in `delimiters` that is present in `v` or returns `undefined`
var chooseDelimiter = function (delimiters, v) {
  return delimiters.reduceRight(function (acc, d) {
    return v.indexOf(d) !== -1 ? d : acc
  }, undefined)
}

var FormatValue = function (options, decode) {
  var maybeUndefined = function (v) {
    if (v === undefined) { return null }
  }
  var maybeJSON = function (s) {
    if (options.json) { return tryParseJSON(decode(s)) }
  }
  var maybeDelimiter = function (v) {
    var delimiter = chooseDelimiter(options.delimiters, v)
    if (delimiter) {
      return v.split(delimiter).map(function (item) {
        return maybeJSON(item) || decode(item)
      })
    }
  }

  var transformers = [ maybeUndefined, maybeJSON, maybeDelimiter, decode ]

  return function (v) {
    return transformers.reduce(function (acc, fn) {
      return acc === undefined ? fn(v) : acc
    }, undefined)
  }
}

var parse = function (string, options) {
  options = options || {}
  options.json = options.json === false ? false : true
  options.plus = options.plus === false ? false : true
  options.delimiters = options.delimiters || []

  if (typeof string !== 'string') {
    throw new TypeError('query string must be a string - got "' + typeof string + '"')
  }
  if (options.plus && options.delimiters.indexOf('+') !== -1) {
    throw new Error('"+" cannot be used as a delimiter unless options.plus is false')
  }

  var decode = function (v) {
    if (options.plus) { v = v.replace(/\+/g, ' ') }
    return decodeURIComponent(v)
  }

  var formatValue = FormatValue(options, decode)

  var params = []
  string.length && string.split('&').forEach(function (part) {
    var x = part.split('=')
    var _k = x[0]
    var k = decode(stripBracket(_k))
    var _v = x.length > 1 ? x.slice(1).join('=') : undefined
    var v = formatValue(_v)
    hasBracket(_k) ? params.push({ k, v, array: true }) : params.push({ k, v })
  })

  var grouped = reduceBy(
    function (acc, item) {
      acc.v = acc.v || []
      acc.v.push(item.v)
      if (item.array) {
        acc.array = true
      }
      return acc
    },
    function () { return {} },
    function (v) { return v.k },
    params
  )

  Object.keys(grouped).forEach(function (key) {
    var { v, array } = grouped[key]
    grouped[key] = (v.length > 1 || array) ? v : v[0]
  })

  return grouped
}

module.exports = parse
