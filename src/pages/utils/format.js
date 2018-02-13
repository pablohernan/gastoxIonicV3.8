var Format = /** @class */ (function () {
    function Format() {
    }
    Format.prototype.roundNumber = function (value, decimals) {
        if (!decimals)
            decimals = 2;
        return parseFloat(value).toFixed(decimals);
    };
    return Format;
}());
export { Format };
//# sourceMappingURL=format.js.map