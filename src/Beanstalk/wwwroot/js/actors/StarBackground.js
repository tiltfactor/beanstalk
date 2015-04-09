/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var StarBackground = (function (_super) {
    __extends(StarBackground, _super);
    function StarBackground() {
        _super.call(this);
        // Create the background
        this.background = new createjs.Shape();
        this.background.graphics.beginRadialGradientFill(["#116b99", "#053c59"], [0, 1], smorball.config.width / 2, smorball.config.height / 2, 0, smorball.config.width / 2, smorball.config.height / 2, smorball.config.width);
        this.background.graphics.drawCircle(smorball.config.width / 2, smorball.config.height / 2, smorball.config.width);
        this.addChild(this.background);
        // Add some floating stars
        this.stars = [];
        for (var i = 0; i < 40; i++) {
            var star = new BackgroundStar();
            this.addChild(star);
            this.stars.push(star);
        }
    }
    StarBackground.prototype.update = function (delta) {
        // Update the stars motion
        _.each(this.stars, function (star) { return star.update(delta); });
    };
    return StarBackground;
})(createjs.Container);
