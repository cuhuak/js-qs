'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _segment = require('./segment');

var _segment2 = _interopRequireDefault(_segment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('segment', function (t) {
  ;[['', { main: '', query: '', hash: '' }], ['#?', { main: '', query: '', hash: '#?' }], ['m59.us', { main: 'm59.us', query: '', hash: '' }], ['m59.us##', { main: 'm59.us', query: '', hash: '##' }], ['m59.us?foo=bar', { main: 'm59.us', query: '?foo=bar', hash: '' }], ['m59.us?', { main: 'm59.us', query: '?', hash: '' }], ['m59.us?#', { main: 'm59.us', query: '?', hash: '#' }], ['m59.us??#?', { main: 'm59.us', query: '??', hash: '#?' }], ['m59.us?query#', { main: 'm59.us', query: '?query', hash: '#' }], ['m59.us?query#?', { main: 'm59.us', query: '?query', hash: '#?' }], ['m59.us?#hash', { main: 'm59.us', query: '?', hash: '#hash' }], ['?foo=bar', { main: '', query: '?foo=bar', hash: '' }], ['??foo=bar', { main: '', query: '??foo=bar', hash: '' }], ['m59.us#?foo=bar', { main: 'm59.us', query: '', hash: '#?foo=bar' }], ['m59.us?f?f=b', { main: 'm59.us', query: '?f?f=b', hash: '' }], ['m59.us?foo=b?r', { main: 'm59.us', query: '?foo=b?r', hash: '' }], ['m59.us?foo#', { main: 'm59.us', query: '?foo', hash: '#' }], ['m59.us??##?fo=o', { main: 'm59.us', query: '??', hash: '##?fo=o' }], ['??##?foo=bar', { main: '', query: '??', hash: '##?foo=bar' }]].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        input = _ref2[0],
        output = _ref2[1];

    t.deepEqual((0, _segment2.default)(input), output, input + ' => ' + JSON.stringify(output));
  });
  t.end();
});