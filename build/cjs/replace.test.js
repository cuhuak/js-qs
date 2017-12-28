'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _replace = require('./replace');

var _replace2 = _interopRequireDefault(_replace);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setMsg = function setMsg(msg, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      input = _ref2[0],
      output = _ref2[1];

  return msg + ' __ ' + input + ' => ' + output;
};

(0, _tape2.default)('replace', function (t) {
  ;[['', ''], ['m59.us?foo=bar', 'm59.us'], ['m59.us?', 'm59.us'], ['m59.us?#', 'm59.us#'], ['m59.us??#?', 'm59.us#?'], ['m59.us?query#', 'm59.us#'], ['m59.us?query#?', 'm59.us#?'], ['m59.us?#hash', 'm59.us#hash'], ['?foo=bar', ''], ['??foo=bar', '']].forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        input = _ref4[0],
        output = _ref4[1];

    t.equal((0, _replace2.default)(input, '', { separator: true }), output, setMsg('{ separator: true } replaced ?', [input, output]));
  });[['', '?'], ['m59.us?foo=bar', 'm59.us?'], ['m59.us?', 'm59.us?'], ['m59.us?#', 'm59.us?#'], ['m59.us??#?', 'm59.us?#?'], ['m59.us?query#', 'm59.us?#'], ['m59.us?query#?', 'm59.us?#?'], ['m59.us?#hash', 'm59.us?#hash'], ['?foo=bar', '?'], ['??foo=bar', '?']].forEach(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        input = _ref6[0],
        output = _ref6[1];

    t.equal((0, _replace2.default)(input, '', { separator: false }), output, setMsg('{ separator: false } kept ?', [input, output]));
  });
  t.equal((0, _replace2.default)('', '', { separator: true }), '', '{ separator: true } sanity check');
  t.equal((0, _replace2.default)('', ''), '?', '{ separator: false } is default');[['', '?foo=bar'], ['#?', '?foo=bar#?'], ['m59.us', 'm59.us?foo=bar'], ['m59.us##', 'm59.us?foo=bar##']].forEach(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        input = _ref8[0],
        output = _ref8[1];

    t.equal((0, _replace2.default)(input, 'foo=bar'), output, setMsg('added query string', [input, output]));
  });[['m59.us#?foo=bar', 'm59.us?0_0#?foo=bar'], ['m59.us?foo=bar', 'm59.us?0_0'], ['m59.us?foo?foo=bar', 'm59.us?0_0'], ['m59.us?foo=b?r', 'm59.us?0_0'], ['m59.us?foo#', 'm59.us?0_0#'], ['m59.us??##?foo=bar', 'm59.us?0_0##?foo=bar'], ['??##?foo=bar', '?0_0##?foo=bar']].forEach(function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        input = _ref10[0],
        output = _ref10[1];

    t.equal((0, _replace2.default)(input, '0_0'), output, setMsg('replaced query string', [input, output]));
  });
  t.equal((0, _replace2.default)('m59.us?123', function (string, uri) {
    t.equal(string, '123', 'replacer receives query string');
    t.equal(uri, 'm59.us?123', 'replacer received uri');
    return string + '456';
  }), 'm59.us?123456', 'replacer produced correct result');
  t.equal((0, _replace2.default)('m59.us', function (string) {
    t.equal(string, '', 'replacer receives empty string when no query string');
    return '';
  }), 'm59.us?', 'replacer automatically added separator, though replacer is nil');

  t.equal((0, _replace2.default)('m59.us?foo=bar', function (string) {
    t.equal(string, '?foo=bar', 'replacer receives query string including separator when { separator: true }');
    return '';
  }, { separator: true }), 'm59.us', 'replacer did not automatically insert ?');
  t.equal((0, _replace2.default)('m59.us', function (string) {
    t.equal(string, '', 'replacer receives empty string when no query string and { separator: true }');
    return '?';
  }, { separator: true }), 'm59.us?', 'added separator returned by replacer');

  t.end();
});