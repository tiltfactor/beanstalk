/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MapLevel = (function (_super) {
    __extends(MapLevel, _super);
    function MapLevel(levelId, pos) {
        var _this = this;
        _super.call(this);
        this.levelId = levelId;
        // Position correctly
        this.x = pos.x;
        this.y = pos.y;
        // Add the base
        this.base = new createjs.Bitmap(smorball.resources.getResource("map_stadium_base"));
        this.base.mouseEnabled = true;
        this.addChild(this.base);
        // Add the stadium
        this.stadium = new createjs.Bitmap(smorball.resources.getResource("map_stadium"));
        this.stadium.x = 20;
        this.stadium.y = -20;
        this.stadium.mouseEnabled = true;
        this.stadium.cursor = "pointer";
        this.addChild(this.stadium);
        // Add the lock
        this.lock = new createjs.Bitmap(smorball.resources.getResource("map_lock"));
        this.lock.x = 58;
        this.lock.y = -80;
        this.addChild(this.lock);
        // Add the logo
        //this.logo = new createjs.Bitmap(smorball.resources.getResource("eugene_melonballers_logo_small"));
        this.updateLockedState();
        this.on("click", function (e) { return _this.onClick(); }, this, false, null, true);
    }
    MapLevel.prototype.updateLockedState = function () {
        this.isUnlocked = smorball.user.hasUnlockedLevel(this.levelId);
        if (this.isUnlocked) {
            this.lock.visible = false;
            this.stadium.visible = true;
        }
        else {
            this.lock.visible = true;
            this.stadium.visible = false;
        }
    };
    MapLevel.prototype.onClick = function () {
        if (this.isUnlocked) {
            smorball.game.loadLevel(this.levelId);
        }
    };
    return MapLevel;
})(createjs.Container);
