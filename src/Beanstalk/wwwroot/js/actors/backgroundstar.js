/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BackgroundStar = (function (_super) {
    __extends(BackgroundStar, _super);
    function BackgroundStar() {
        _super.call(this, smorball.resources.getResource("background_star"));
        this.width = this.getBounds().width;
        this.height = this.getBounds().height;
        this.alpha = 0.2;
        this.x = Math.random() * smorball.config.width;
        this.y = Math.random() * smorball.config.height;
        this.regX = this.width / 2;
        this.regY = this.height / 2;
        this.vel = new createjs.Point(Math.random() * 100, Math.random() * 200 - 100);
        this.angularVel = (Math.random() > 0.5 ? -1 : 1) * Math.random() * 50;
    }
    BackgroundStar.prototype.update = function (delta) {
        this.x += this.vel.x * delta;
        this.y += this.vel.y * delta;
        if (this.x > smorball.config.width + this.width)
            this.x = -this.width;
        if (this.x < -this.width)
            this.x = smorball.config.width - this.width;
        if (this.y > smorball.config.height + this.height)
            this.y = -this.height;
        if (this.y < -this.height)
            this.y = smorball.config.height + this.height;
        this.rotation += this.angularVel * delta;
    };
    return BackgroundStar;
})(createjs.Bitmap);
