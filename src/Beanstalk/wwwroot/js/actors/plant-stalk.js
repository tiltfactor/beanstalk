var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PlantStalkState;
(function (PlantStalkState) {
    PlantStalkState[PlantStalkState["None"] = 0] = "None";
    PlantStalkState[PlantStalkState["Growing"] = 1] = "Growing";
    PlantStalkState[PlantStalkState["Grown"] = 2] = "Grown";
    PlantStalkState[PlantStalkState["Withering"] = 3] = "Withering";
})(PlantStalkState || (PlantStalkState = {}));
var PlantStalk = (function (_super) {
    __extends(PlantStalk, _super);
    function PlantStalk(config) {
        _super.call(this);
        this.config = config;
        this.state = 0 /* None */;
        this.flowers = [];
        this.isLocked = false;
        var invScale = Math.abs(2 - config.scale);
        this.sprite = new createjs.Sprite(this.getSpritesheet());
        this.sprite.regX = config.regX * invScale;
        this.sprite.regY = config.regY * invScale;
        this.scaleX = this.scaleY = config.scale;
        this.addChild(this.sprite);
    }
    PlantStalk.prototype.lock = function (delay) {
        var _this = this;
        this.isLocked = true;
        if (this.config.flowers.length == 0)
            return;
        //var filter = new createjs.ColorFilter(0, 0, 0, 1, 255,0,0,0);
        //this.sprite.filters = [filter];
        //this.sprite.cache(0, 0, this.sprite.getTransformedBounds().width, this.sprite.getTransformedBounds().height);
        //createjs.Tween.get(this.sprite)
        //    .wait(100)
        //    .call(() => this.sprite.filters = [filter])
        //    .wait(1000)
        //    .call(() => this.sprite.filters = []);
        _.chain(this.config.flowers).sample(Utils.randomRange(2, this.config.flowers.length - 1)).each(function (f, i) { return _this.addFlower(f, Utils.randomRange(0, i * 300) + delay); });
    };
    PlantStalk.prototype.addFlower = function (at, delay) {
        var invScale = Math.abs(2 - this.config.scale);
        var flower = new createjs.Bitmap(beanstalk.resources.getResource(Utils.randomOne(PlantStalk.flowerTypes)));
        flower.regX = flower.getBounds().width / 2;
        flower.regY = flower.getBounds().width / 2;
        flower.scaleX = flower.scaleY = 0;
        flower.x = at.x * invScale - this.config.regX * invScale;
        flower.y = at.y * invScale - this.config.regY * invScale;
        this.addChild(flower);
        this.flowers.push(flower);
        createjs.Tween.get(flower).wait(delay).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
        createjs.Tween.get(this).wait(delay).call(function () { return beanstalk.audio.playSound(Utils.randomOne(PlantStalk.bubblePops), 0.5); });
    };
    PlantStalk.prototype.grow = function () {
        var _this = this;
        if (this.state != 0 /* None */)
            return false;
        this.state = 1 /* Growing */;
        this.sprite.gotoAndPlay("grow");
        beanstalk.audio.playSound("leaves_grow_a1_sound");
        this.sprite.on("animationend", function (e) { return _this.state = 2 /* Grown */; }, this, true);
        return true;
    };
    PlantStalk.prototype.growAndLock = function () {
        var _this = this;
        this.grow();
        this.isLocked = true;
        this.sprite.on("animationend", function (e) { return _this.lock(0); }, this, true);
    };
    PlantStalk.prototype.wither = function () {
        var _this = this;
        var startingFrame = 0;
        if (this.state == 1 /* Growing */)
            startingFrame = this.sprite.spriteSheet.getNumFrames("wither") - this.sprite.currentAnimationFrame;
        this.state = 3 /* Withering */;
        this.sprite.removeAllEventListeners();
        beanstalk.audio.playSound("leaves_wither_a1_sound");
        this.sprite.gotoAndPlay("wither");
        this.sprite.currentAnimationFrame = startingFrame;
        this.sprite.on("animationend", function (e) { return beanstalk.screens.game.plant.stalkWithered(_this); }, this, true);
        _.each(this.flowers, function (f, i) { return _this.witherFlower(f, Utils.randomRange(0, i * 300)); });
        return true;
    };
    PlantStalk.prototype.witherFlower = function (flower, delay) {
        createjs.Tween.removeTweens(flower);
        createjs.Tween.get(flower).wait(delay).to({ scaleX: 0, scaleY: 0 }, 500, createjs.Ease.backIn);
    };
    PlantStalk.prototype.update = function (delta) {
    };
    PlantStalk.prototype.getSpritesheet = function () {
        // Grab them
        var data = beanstalk.resources.getResource(this.config.id + "_stalk_json");
        var sprite = beanstalk.resources.getResource(this.config.id + "_stalk_png");
        // Update the data with the image
        data.images = [sprite];
        // Manually create the animaiton here 
        data.animations = {
            grow: [0, data.frames.length - 1, false],
            wither: { frames: _.range(data.frames.length - 1).reverse(), next: false, speed: 2 }
        };
        return new createjs.SpriteSheet(data);
    };
    PlantStalk.flowerTypes = ["flower1", "flower2", "flower3", "flower4"];
    PlantStalk.bubblePops = ["beanstalk_flower_grow_bubble_02_sound", "beanstalk_flower_grow_bubble_03_sound"];
    return PlantStalk;
})(createjs.Container);
