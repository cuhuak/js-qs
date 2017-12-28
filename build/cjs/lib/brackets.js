"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var regex = /(.*)(\[\d*])$/;
// group - optional any amount of anything
// group - ends with [] that can optionally contain any amount of digits

var hasBracket = function hasBracket(v) {
  return regex.test(v);
};
var stripBracket = function stripBracket(string) {
  return string.replace(regex, function (_, key) {
    return key;
  });
};

exports.hasBracket = hasBracket;
exports.stripBracket = stripBracket;