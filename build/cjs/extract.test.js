'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _extract = require('./extract');

var _extract2 = _interopRequireDefault(_extract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('extract', function (t) {
  ;[['', ''], ['https://m59.us?foo=bar', 'foo=bar'], ['https://m59.us?foo=b?r', 'foo=b?r'], ['https://m59.us?foo=#???', 'foo='], ['https://m59.us?', ''], ['m59.us?#', ''], ['m59.us??#?', '?'], ['m59.us?query#', 'query'], ['m59.us?query#?', 'query'], ['m59.us?#hash', ''], ['?foo=bar', 'foo=bar'], ['?#', ''], ['?f?oo=bar', 'f?oo=bar'], ['??foo=bar', '?foo=bar'], ['??##?foo=bar', '?']].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        input = _ref2[0],
        output = _ref2[1];

    return t.equal((0, _extract2.default)(input), output, input + ' => ' + output);
  });

  t.end();
});