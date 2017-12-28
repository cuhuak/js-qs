'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _segment = require('./lib/segment');

var _segment2 = _interopRequireDefault(_segment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var replace = function replace(uri, replacer) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$separator = _ref.separator,
      separator = _ref$separator === undefined ? false : _ref$separator;

  var segments = (0, _segment2.default)(uri);
  if (!separator) {
    segments.query = segments.query.slice(1);
  }
  var query = (!separator ? '?' : '') + (typeof replacer === 'function' ? replacer(segments.query, uri) : replacer);
  return segments.main + query + segments.hash;
};

exports.default = replace;