var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TinyTownAnim = (function (_super) {
    __extends(TinyTownAnim, _super);
    function TinyTownAnim(type) {
        _super.call(this);
        this.showCount = 0;
        this.type = type;
        var ss = this.getSpriteSheet(type.id);
        this.sprite = new SBSprite(ss, type.id);
        this.addChild(this.sprite);
        this.sprite.regX = type.regX;
        this.sprite.regY = type.regY;
        this.sprite.framerate = type.framerate;
        this.sprite.currentAnimationFrame = Math.floor(Math.random() * ss.getNumFrames(type.id));
    }
    TinyTownAnim.prototype.getSpriteSheet = function (type) {
        var d = beanstalk.resources.getResource("tiny_town_json");
        d.images = [beanstalk.resources.getResource("tiny_town_png")];
        return beanstalk.sprites.getSpriteSheet(type, new createjs.SpriteSheet(d));
    };
    TinyTownAnim.prototype.update = function (delta) {
    };
    return TinyTownAnim;
})(createjs.Container);
