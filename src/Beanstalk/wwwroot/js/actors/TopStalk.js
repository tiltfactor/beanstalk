var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TopStalk = (function (_super) {
    __extends(TopStalk, _super);
    function TopStalk() {
        _super.apply(this, arguments);
    }
    TopStalk.prototype.growSeed = function () {
        // var invScale = Math.abs(2 - this.config.scale);
        var x = this.config.seed.x - this.config.regX + this.x;
        var y = this.config.seed.y - this.config.regY + this.y;
        beanstalk.screens.game.growSeed(x, y);
    };
    TopStalk.prototype.grow = function () {
        var _this = this;
        var b = _super.prototype.grow.call(this);
        if (!b)
            return false;
        this.sprite.on("animationend", function (e) { return _this.growSeed(); }, this, true);
        return true;
    };
    return TopStalk;
})(PlantStalk);
