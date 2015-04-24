var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PlantStalk = (function (_super) {
    __extends(PlantStalk, _super);
    function PlantStalk(config) {
        _super.call(this);
        this.config = config;
        this.sprite = new createjs.Sprite(this.getSpritesheet());
        this.sprite.regX = config.regX;
        this.sprite.regY = config.regY;
        this.sprite.scaleX = this.sprite.scaleY = config.scale;
        this.addChild(this.sprite);
    }
    PlantStalk.prototype.grow = function () {
        this.sprite.gotoAndPlay("grow");
        //this.sprite.on("animationend",(e: any) => {
        //	console.log(this.sprite.spriteSheet.getNumFrames("grow"), this.sprite.spriteSheet.animations);
        //	this.sprite.gotoAndStop(this.sprite.spriteSheet.getNumFrames("grow")-1);
        //}, this, true);
    };
    PlantStalk.prototype.getSpritesheet = function () {
        // Grab them
        var data = beanstalk.resources.getResource(this.config.id + "_stalk_json");
        var sprite = beanstalk.resources.getResource(this.config.id + "_stalk_png");
        // Update the data with the image
        data.images = [sprite];
        // Manually create the animaiton here 
        data.animations = {
            grow: [0, data.frames.length - 1, false]
        };
        console.log("data.animations ", data.animations);
        return new createjs.SpriteSheet(data);
    };
    return PlantStalk;
})(createjs.Container);
