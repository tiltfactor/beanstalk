/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SplashScreensManager = (function (_super) {
    __extends(SplashScreensManager, _super);
    function SplashScreensManager() {
        _super.apply(this, arguments);
    }
    SplashScreensManager.prototype.showSplashScreens = function (completeCallback) {
        var _this = this;
        this.logo = new createjs.Bitmap(null);
        this.addChild(this.logo);
        var oldBodyBG = document.body.style.backgroundImage;
        document.body.style.backgroundImage = "none";
        this.showLogo("MBG_logo", function () {
            _this.showLogo("BHL_logo", function () {
                _this.showLogo("TiltFactor_logo", function () {
                    document.body.style.backgroundImage = oldBodyBG;
                    completeCallback();
                });
            });
        });
    };
    SplashScreensManager.prototype.showLogo = function (name, completeCallback) {
        this.logo.image = beanstalk.resources.getResource(name);
        var r = beanstalk.config.width / this.logo.getBounds().width;
        this.logo.scaleX = this.logo.scaleY = r;
        this.logo.x = 0;
        this.logo.y = beanstalk.config.height / 2 - this.logo.getBounds().height / 2;
        // Start it off invisible, fade in then fade out
        this.logo.alpha = 0;
        createjs.Tween.get(this.logo).to({ alpha: 1 }, 1000, createjs.Ease.linear).wait(1000).to({ alpha: 0 }, 1000, createjs.Ease.linear).call(function () { return completeCallback(); });
    };
    return SplashScreensManager;
})(createjs.Container);
