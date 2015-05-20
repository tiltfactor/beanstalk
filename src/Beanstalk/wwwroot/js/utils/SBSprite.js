var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SBSprite = (function (_super) {
    __extends(SBSprite, _super);
    function SBSprite(ss, startingAnimation) {
        var _this = this;
        _super.call(this);
        this._bitmap = new createjs.Bitmap("");
        this.addChild(this._bitmap);
        this.spriteSheet = ss;
        this.animation = startingAnimation;
        this.isPlaying = true;
        this.on("tick", function (e) { return _this.onTick(e); });
    }
    SBSprite.prototype.gotoAndStop = function (anim) {
        this.animation = anim;
        this.isPlaying = false;
        this.timeSinceLastFrame = 0;
        this.currentAnimationFrame = 0;
    };
    SBSprite.prototype.gotoAndPlay = function (anim) {
        this.animation = anim;
        this.isPlaying = true;
        this.timeSinceLastFrame = 0;
        this.currentAnimationFrame = 0;
    };
    Object.defineProperty(SBSprite.prototype, "currentAnimationFrame", {
        get: function () {
            return this._currentAnimationFrame;
        },
        set: function (value) {
            if (value == this._currentAnimationFrame)
                return;
            this._currentAnimationFrame = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SBSprite.prototype, "spriteSheet", {
        get: function () {
            return this._spriteSheet;
        },
        set: function (value) {
            this._spriteSheet = value;
            this.timeSinceLastFrame = 0;
            this.framerate = value.framerate;
            this.currentAnimationFrame = 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SBSprite.prototype, "animation", {
        get: function () {
            return this._animation;
        },
        set: function (value) {
            if (this._animation == value)
                return;
            if (!(value in this.spriteSheet.animations))
                throw new Error("Cannot set animation to '" + value + "', that animation doesnt exist in the spritesheet!");
            else
                this._animation = value;
        },
        enumerable: true,
        configurable: true
    });
    SBSprite.prototype.onTick = function (e) {
        if (e.delta == null || isNaN(e.delta))
            return;
        // First update the bitmap
        var frame = this.getCurrentFrame();
        if (frame != this._lastFrame) {
            this._bitmap.image = frame.canvas;
            this._bitmap.regX = frame.regX;
            this._bitmap.regY = frame.regY;
        }
        this._lastFrame = frame;
        // Then tick the animation
        if (!this.isPlaying)
            return;
        this.timeSinceLastFrame += e.delta;
        //if (this.timeSinceLastFrame > 500) this.timeSinceLastFrame = 500;
        if (this.timeSinceLastFrame > 1000 / this.framerate) {
            //this.timeSinceLastFrame -= 1000 / this.framerate;
            this.timeSinceLastFrame = 0;
            if (this.currentAnimationFrame >= this.spriteSheet.getNumFrames(this.animation) - 1) {
                this.currentAnimationFrame = 0;
                this.dispatchEvent("animationend");
            }
            else
                this.currentAnimationFrame++;
        }
    };
    SBSprite.prototype.getCurrentFrame = function () {
        return this.spriteSheet.getFrame(this.animation, this.currentAnimationFrame);
    };
    SBSprite.prototype.stop = function () {
        this.isPlaying = false;
    };
    SBSprite.prototype.play = function () {
        this.isPlaying = true;
    };
    return SBSprite;
})(createjs.Container);
