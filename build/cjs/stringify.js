'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _encode = require('encode-3986');

var _encode2 = _interopRequireDefault(_encode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormatArray = function FormatArray(arrayFormat, formatValue, formatPair) {
  var formatters = {
    duplicate: function duplicate(k, array) {
      return array.map(function (v) {
        return formatPair(k, v);
      }).join('&');
    },

    bracket: function bracket(k, array) {
      return array.map(function (v) {
        return formatPair(k + '[]', v);
      }).join('&');
    },

    index: function index(k, array) {
      return array.map(function (v, idx) {
        return formatPair(k + '[' + idx + ']', v);
      }).join('&');
    },

    json: function json(k, array) {
      return formatPair(k, JSON.stringify(array));
    },

    delimiter: function delimiter(_delimiter, k, array) {
      return k + '=' + array.map(formatValue).join(_delimiter);
    }
  };

  if ((typeof arrayFormat === 'undefined' ? 'undefined' : _typeof(arrayFormat)) === 'object') {
    if (arrayFormat.delimiter) {
      return formatters.delimiter.bind(null, arrayFormat.delimiter);
    } else {
      throw new Error('arrayFormat object is not valid');
    }
  } else {
    var formatter = formatters[arrayFormat];
    if (!formatter) {
      throw new Error('"' + arrayFormat + '" is not a valid array format');
    }
    return formatter;
  }
};

var Format = function Format(arrayFormat, encode) {
  var formatValue = function formatValue(v) {
    return encode((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' ? JSON.stringify(v) : v);
  };

  var formatPair = function formatPair(k, v) {
    if (v === undefined) {
      return '';
    }
    if (v === null) {
      return k;
    }
    return k + '=' + formatValue(v);
  };

  var formatArray = FormatArray(arrayFormat, formatValue, formatPair);

  return function (k, v) {
    var encodedK = encode(k);
    return Array.isArray(v) ? formatArray(encodedK, v) : formatPair(encodedK, v);
  };
};

var stringify = function stringify(params) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.arrayFormat = options.arrayFormat || 'duplicate';
  var format = Format(options.arrayFormat, function (v) {
    v = (0, _encode2.default)(v);
    if (options.plus) {
      v = v.replace(/%20/g, '+');
    }
    return v;
  });
  return Object.keys(params).sort().map(function (k) {
    return format(k, params[k]);
  }).join('&');
};

exports.default = stringify;