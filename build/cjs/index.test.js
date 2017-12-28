'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var input = {
  foo: ['123', 'false', { x: 'y' }, [1, 2]],
  bar: 'abc',
  baz: 'true',
  qux: { a: 'false' },
  'f!*d++f1312_^%&$%#$': { '$%+,$&^%+-&$,3,,2$!#@$': ['false', '$#%#@%#', [{ a: {} }]] }
};

(0, _tape2.default)('parse(stringify(obj) == obj - isomorphic', function (t) {
  ;['bracket', 'index', 'json'].forEach(function (arrayFormat) {
    t.deepEqual(_2.default.parse(_2.default.stringify(input, { arrayFormat: arrayFormat })), input, arrayFormat);
  });

  t.deepEqual(_2.default.parse(_2.default.stringify(input, { arrayFormat: { delimiter: ',' } }), { delimiters: [','] }), input);
  t.deepEqual(_2.default.parse(_2.default.stringify(input, { arrayFormat: { delimiter: ';' } }), { delimiters: [',', ';'] }), input);

  t.end();
});

(0, _tape2.default)('isomorphic, stringify(parse(string)) === string', function (t) {
  ;['bracket', 'index', 'json'].forEach(function (arrayFormat) {
    var string = _2.default.stringify(input, { arrayFormat: arrayFormat });
    t.deepEqual(_2.default.stringify(_2.default.parse(string), { arrayFormat: arrayFormat }), string, arrayFormat);
  });

  t.test('delimited arrays', function (t) {
    var string = _2.default.stringify(input, { arrayFormat: { delimiter: ',' } });
    t.deepEqual(_2.default.stringify(_2.default.parse(string, { delimiters: [','] }), { arrayFormat: { delimiter: ',' } }), string);
    t.end();
  });

  t.test('delimited arrays, back and forth, complex', function (t) {
    // join arrays on semi-colon
    var string = _2.default.stringify(input, { arrayFormat: { delimiter: ';' } });
    t.deepEqual(_2.default.stringify(
    // parse arrays back out on commas and semicolons
    _2.default.parse(string, { delimiters: [',', ';'] }),
    // join them again on semicolons
    { arrayFormat: { delimiter: ';' } }), string);
    t.end();
  });

  t.end();
});

(0, _tape2.default)('methods on main export', function (t) {
  t.equal(_2.default.extract('//m59.us:80/_/?foo=bar'), 'foo=bar', 'qs.extract');
  t.deepEqual(_2.default.parse('foo=bar'), { foo: 'bar' }, 'qs.parse');
  t.equal(_2.default.replace('m59.us?foo=bar', 'bar=foo'), 'm59.us?bar=foo', 'qs.replace');
  t.equal(_2.default.stringify({ foo: 'bar' }), 'foo=bar', 'qs.stringify');

  t.end();
});