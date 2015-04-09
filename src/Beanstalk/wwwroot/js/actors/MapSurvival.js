/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MapSurvival = (function (_super) {
    __extends(MapSurvival, _super);
    function MapSurvival() {
        var _this = this;
        _super.call(this);
        // Add the lock
        this.lock = new createjs.Bitmap(smorball.resources.getResource("map_lock"));
        this.lock.x = -64;
        this.lock.y = -131;
        this.addChild(this.lock);
        // Add the shop
        this.survival = new createjs.Bitmap(smorball.resources.getResource("stopwatch_icon"));
        this.survival.x = -76;
        this.survival.y = -204;
        this.survival.cursor = "pointer";
        this.survival.mouseEnabled = true;
        this.addChild(this.survival);
        this.updateLockedState();
        this.on("click", function (e) { return _this.onClick(); }, this, false, null, true);
    }
    MapSurvival.prototype.updateLockedState = function () {
        if (smorball.user.isSurvivalUnlocked()) {
            this.lock.visible = false;
            this.survival.visible = true;
        }
        else {
            this.lock.visible = true;
            this.survival.visible = false;
        }
    };
    MapSurvival.prototype.onClick = function () {
        if (smorball.user.isSurvivalUnlocked()) {
            smorball.game.loadLevel(smorball.game.levels.length - 1);
        }
    };
    return MapSurvival;
})(createjs.Container);
