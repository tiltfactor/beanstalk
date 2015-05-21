var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Blimp = (function (_super) {
    __extends(Blimp, _super);
    function Blimp(instance) {
        _super.call(this, instance);
        this.vel = -50;
    }
    Blimp.prototype.update = function (delta) {
        this.x += this.vel * delta;
        var w = this.sprite.getBounds().width;
        var bgw = beanstalk.screens.game.background.getBGWidth();
        if (this.x < -w - 600)
            this.x = bgw;
    };
    return Blimp;
})(TinyTownAnim);
