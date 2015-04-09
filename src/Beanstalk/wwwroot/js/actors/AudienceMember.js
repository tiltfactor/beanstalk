/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AudienceMember = (function (_super) {
    __extends(AudienceMember, _super);
    function AudienceMember(type) {
        _super.call(this);
        this.type = type;
        var ss = this.getSpritesheet();
        this.member = new createjs.Sprite(ss, "idle");
        this.member.currentAnimationFrame = Math.floor(ss.getNumFrames("idle") * Math.random());
        this.member.regX = this.type.offsetX;
        this.member.regY = this.type.offsetY;
        this.member.scaleX = this.member.scaleY = this.type.scale;
        // Offset the sprite by the seat size/2
        this.member.x = 55;
        this.member.y = 100;
        this.addChild(this.member);
    }
    AudienceMember.prototype.getSpritesheet = function () {
        var level = smorball.game.levelIndex;
        var jsonName = this.type.id + "_json";
        var pngName = this.type.id + "_png";
        var data = smorball.resources.getResource(jsonName);
        var sprite = smorball.resources.getResource(pngName);
        data.images = [sprite];
        return new createjs.SpriteSheet(data);
    };
    return AudienceMember;
})(createjs.Container);
