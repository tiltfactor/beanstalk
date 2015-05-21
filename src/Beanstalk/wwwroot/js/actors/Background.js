var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Background = (function (_super) {
    __extends(Background, _super);
    function Background() {
        _super.call(this);
        this.bgParts = new createjs.Container();
        this.addChild(this.bgParts);
        // Add the background parts (split for performance)
        var bottom = new createjs.Bitmap(beanstalk.resources.getResource("background-bottom-part"));
        bottom.regY = Math.round(bottom.getBounds().height);
        this.bgParts.addChild(bottom);
        var middle = new createjs.Bitmap(beanstalk.resources.getResource("background-middle-part"));
        middle.regY = Math.round(bottom.getBounds().height + middle.getBounds().height);
        this.bgParts.addChild(middle);
        var top = new createjs.Bitmap(beanstalk.resources.getResource("background-top-part"));
        top.regY = Math.round(bottom.getBounds().height + middle.getBounds().height + top.getBounds().height);
        this.bgParts.addChild(top);
        var solidSpace = new createjs.Shape();
        solidSpace.graphics.beginFill("#1b476c");
        solidSpace.graphics.drawRect(0, 0, top.getBounds().width, 1500);
        solidSpace.graphics.endFill();
        solidSpace.regY = top.regY + 1498;
        this.addChild(solidSpace);
        this.animationsContainer = new createjs.Container();
        this.addChild(this.animationsContainer);
        this.tinyTownConatiner = new createjs.Container();
        this.addChild(this.tinyTownConatiner);
        this.addAnimations();
        this.addTinyTownAnims();
    }
    Background.prototype.getBGHeight = function () {
        return this.bgParts.getBounds().height;
    };
    Background.prototype.addAnimations = function () {
        var _this = this;
        var data = beanstalk.resources.getResource("animations_data");
        var ss = this.getSpriteSheet("animations");
        _.each(data.animations.instances, function (a) {
            var type = _.find(data.animations.types, function (t) { return t.id == a.type; });
            var anim = new SBSprite(ss, a.type);
            anim.regX = type.regX;
            anim.regY = type.regY;
            anim.framerate = type.framerate;
            anim.currentAnimationFrame = Math.floor(Math.random() * ss.getNumFrames(a.type));
            anim.x = a.x;
            anim.y = a.y - _this.getBGHeight();
            anim.scaleX = anim.scaleY = a.scale;
            SBSpriteUtils.addRandomDelayToLoop(anim, type.loopDelayMin, type.loopDelayMax);
            _this.animationsContainer.addChild(anim);
        });
    };
    Background.prototype.addTinyTownAnims = function () {
        var _this = this;
        var data = beanstalk.resources.getResource("animations_data");
        var ss = this.getSpriteSheet("tiny_town");
        _.each(data.tinytown.instances, function (a) {
            var type = _.find(data.tinytown.types, function (t) { return t.id == a.type; });
            var tt;
            if (a.type == "blimp")
                tt = new Blimp(type);
            tt.sprite.x = a.x;
            tt.sprite.y = a.y - _this.getBGHeight();
            tt.sprite.scaleX = tt.sprite.scaleY = a.scale;
            //SBSpriteUtils.addRandomDelayToLoop(anim, t.loopDelayMin, t.loopDelayMax);
            _this.animationsContainer.addChild(tt);
        });
    };
    Background.prototype.getSpriteSheet = function (type) {
        var d = beanstalk.resources.getResource(type + "_json");
        d.images = [beanstalk.resources.getResource(type + "_png")];
        return beanstalk.sprites.getSpriteSheet(type, new createjs.SpriteSheet(d));
    };
    return Background;
})(createjs.Container);
