'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _try_catch = require('try_catch');

var _try_catch2 = _interopRequireDefault(_try_catch);

var _brackets = require('./lib/brackets');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns parsed object if `s` is a JSON string or returns undefined
var tryParseJSON = function tryParseJSON(s) {
  var first = s.slice(0, 1);
  var last = s.slice(-1);
  if ((first === '{' || first === '[') && (last === '}' || last === ']')) {
    return (0, _try_catch2.default)(function () {
      return JSON.parse(s);
    }, function () {
      return undefined;
    });
  }
};

// returns the first delimiter in `delimiters` that is present in `v` or returns `undefined`
var chooseDelimiter = function chooseDelimiter(delimiters, v) {
  return delimiters.reduceRight(function (acc, d) {
    return v.indexOf(d) !== -1 ? d : acc;
  }, undefined);
};

var FormatValue = function FormatValue(options, decode) {
  var maybeUndefined = function maybeUndefined(v) {
    return v === undefined ? null : undefined;
  };
  var maybeJSON = function maybeJSON(s) {
    return options.json ? tryParseJSON(decode(s)) : undefined;
  };
  var maybeDelimiter = function maybeDelimiter(v) {
    var delimiter = chooseDelimiter(options.delimiters, v);
    return delimiter ? v.split(delimiter).map(function (item) {
      return maybeJSON(item) || decode(item);
    }) : undefined;
  };

  var transformers = [maybeUndefined, maybeJSON, maybeDelimiter, decode];

  return function (v) {
    return transformers.reduce(function (acc, fn) {
      return acc === undefined ? fn(v) : acc;
    }, undefined);
  };
};

var parse = function parse(string) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.json = options.json !== false;
  options.plus = options.plus !== false;
  options.delimiters = options.delimiters || [];

  if (typeof string !== 'string') {
    throw new TypeError('query string must be a string - got "' + (typeof string === 'undefined' ? 'undefined' : _typeof(string)) + '"');
  }
  if (options.plus && options.delimiters.indexOf('+') !== -1) {
    throw new Error('"+" cannot be used as a delimiter unless options.plus is false');
  }

  var decode = function decode(v) {
    if (options.plus) {
      v = v.replace(/\+/g, ' ');
    }
    return decodeURIComponent(v);
  };

  var formatValue = FormatValue(options, decode);

  var params = Object.create(null);
  var isGrouped = {};
  string.length && string.split('&').forEach(function (part) {
    var x = part.split('=');
    var _k = x[0];
    var k = decode((0, _brackets.stripBracket)(_k));
    var _v = x.length > 1 ? x.slice(1).join('=') : undefined;
    var v = formatValue(_v);

    if (Object.prototype.hasOwnProperty.call(params, k)) {
      // key has appeared before
      if (!isGrouped[k]) {
        params[k] = [params[k]];
        isGrouped[k] = true;
      }
      params[k].push(v);
    } else {
      // first time seeing this key
      if ((0, _brackets.hasBracket)(_k)) {
        // has a bracket, must be an array
        v = [v];
        isGrouped[k] = true;
      }
      params[k] = v;
    }
  });

  return params;
};

exports.default = parse;