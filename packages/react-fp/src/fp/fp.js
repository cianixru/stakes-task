"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var arrify = function (val) {
    return (val === null || val === undefined)
        ? []
        : (Array.isArray(val) ? val : [val]);
};
var reduceProducers = function () {
    var reducers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        reducers[_i] = arguments[_i];
    }
    return function (previous, current) {
        return reducers.reduce(function (p, r) { return r(p, current); }, previous);
    };
};
var idMorphism = function (state, action) { return state; };
var concat = function (f, g) {
    return reduceProducers(f, g);
};
exports.concatR = concat;
exports.Consumer = function (f) {
    if (f === void 0) { f = idMorphism; }
    return Object.assign(f, {
        valueOf: function () { return f; },
        concat: function (g) {
            return exports.Consumer(concat(f, g));
        },
    });
};
exports.makeLens = function (prop) {
    return ramda_1.lens(ramda_1.path(arrify(prop)), ramda_1.assocPath(arrify(prop)));
};
var num = exports.makeLens('num');
var log = exports.makeLens('log');
exports.overLens = function (prop, transform) {
    return ramda_1.over(ramda_1.lens(ramda_1.path(arrify(prop)), ramda_1.assocPath(arrify(prop))), transform);
};
