var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Captcha = (function (_super) {
    __extends(Captcha, _super);
    function Captcha(chunk) {
        _super.call(this);
        // Create and add the spritesheet
        this.sprite = new createjs.Sprite(chunk.page.spritesheet);
        this.addChild(this.sprite);
        this.sprite.visible = false;
        // Position us in the right place
        //var pos = smorball.config.captchaPositions[lane];
        //this.x = pos.x;
        //this.y = pos.y;
        // Draw a debug circle
        if (beanstalk.config.debug) {
        }
    }
    Captcha.prototype.getWidth = function () {
        if (this.chunk == null)
            return 0;
        var frame = this.chunk.page.spritesheet.getFrame(this.chunk.frame);
        return frame.rect.width;
    };
    Captcha.prototype.setChunk = function (chunk) {
        // Update the sprite
        this.chunk = chunk;
        this.sprite.spriteSheet = chunk.page.spritesheet;
        this.sprite.gotoAndStop(chunk.frame);
        this.sprite.regX = this.sprite.getTransformedBounds().width / 2;
        this.sprite.regY = this.sprite.getTransformedBounds().height / 2;
        this.sprite.visible = true;
        // Reset any previous animations
        createjs.Tween.removeTweens(this.sprite);
        this.sprite.scaleX = this.sprite.scaleY = 1;
    };
    Captcha.prototype.animateIn = function () {
        this.sprite.scaleX = this.sprite.scaleY = 0;
        createjs.Tween.get(this.sprite).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
    };
    Captcha.prototype.clear = function () {
        var _this = this;
        this.chunk = null;
        // Animate Out
        createjs.Tween.removeTweens(this.sprite);
        createjs.Tween.get(this.sprite).to({ scaleX: 0, scaleY: 0 }, 250, createjs.Ease.backOut).call(function (tween) { return _this.sprite.visible = false; });
    };
    return Captcha;
})(createjs.Container);
