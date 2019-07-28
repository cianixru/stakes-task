"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noopSymbol = Symbol();
var noop = (_a = {},
    _a[noopSymbol] = true,
    _a);
exports.CallIf = function (predicate) {
    if (predicate === void 0) { predicate = function (_) { return true; }; }
    return Object.assign(function (fnc) {
        return function (value) {
            return (value === noop || !predicate(value))
                ? noop
                : fnc(value);
        };
    }, {
        valueOf: function () { return predicate; },
        cond: function (f) {
            return exports.CallIf(function (value) { return predicate(value) && f(value); });
        }
    });
};
var _a;
/**
 * <example>
 *     const trace = (d: number) =>
 *      console.log(d)
 *
 *     const only10to15 = CallIf(R.gt(10)).ap(R.lt(15)).fold
 *     const trace10to15 = only10to15(trace)
 *
 *      trace10to15(8) // noop
 *      trace10to15(12) // 12
 *      trace10to15(16) // noop
 * </example>
 */
