/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MapScreen = (function (_super) {
    __extends(MapScreen, _super);
    function MapScreen() {
        _super.call(this, "mapMenu", "map_menu_html");
    }
    MapScreen.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        var data = smorball.resources.getResource("map_data");
        // Grab these
        this.teamLogoEl = $("#mapMenu .selected-team .team-logo").get(0);
        this.teamNameEl = $("#mapMenu .selected-team .team-name").get(0);
        this.scoreEl = $("#mapMenu .selected-team .score").get(0);
        this.lockIconEl = $("#mapMenu .selected-team .lock-icon").get(0);
        this.cashEl = $("#mapMenu .cashbar").get(0);
        // Add the background
        this.addChild(new createjs.Bitmap(smorball.resources.getResource("map_background")));
        // Add each map dot
        _.each(data.dots, function (d) { return _this.addChild(new MapDot(d)); });
        // Add each level
        this.levels = [];
        for (var i = 0; i < data.levels.length; i++) {
            var l = new MapLevel(i, data.levels[i]);
            l.on("mouseover", function (e) { return _this.onLevelRollover(e.currentTarget); });
            this.addChild(l);
            this.levels.push(l);
        }
        // Add the shop
        this.shop = new MapShop();
        this.shop.x = 1080;
        this.shop.y = 947;
        this.addChild(this.shop);
        // Add the survival level
        this.survival = new MapSurvival();
        this.survival.x = 272;
        this.survival.y = 915;
        this.addChild(this.shop);
        //this.survival.on("click",() => smorball.screens.open(smorball.screens.shop));
        this.addChild(this.survival);
        // Listen for some events
        $("#mapMenu .fb-share").click(function () { return _this.shareToFB(); });
        $("#mapMenu .twitter-share").click(function () { return _this.shareToTwitter(); });
        $("#mapMenu .menu").click(function () { return smorball.screens.open(smorball.screens.main); });
    };
    MapScreen.prototype.update = function (delta) {
    };
    MapScreen.prototype.show = function () {
        _super.prototype.show.call(this);
        _.each(this.levels, function (l) { return l.updateLockedState(); });
        this.cashEl.textContent = smorball.user.cash + "";
        this.onLevelRollover(this.levels[0]);
        this.shop.updateLockedState();
        this.survival.updateLockedState();
    };
    MapScreen.prototype.shareToFB = function () {
        console.log("sharing to facebook");
    };
    MapScreen.prototype.shareToTwitter = function () {
        console.log("sharing to twitter");
    };
    MapScreen.prototype.onLevelRollover = function (level) {
        if (level.isUnlocked) {
            var l = smorball.game.getLevel(level.levelId);
            var usrLvl = smorball.user.levels[level.levelId];
            var img = smorball.resources.getResource(l.team.id + "_logo_small");
            this.teamLogoEl.src = img.src;
            this.teamNameEl.textContent = l.team.name;
            this.scoreEl.textContent = (usrLvl.score / 1000) + "/" + smorball.config.enemyTouchdowns;
            this.lockIconEl.hidden = true;
            this.teamLogoEl.hidden = false;
        }
        else {
            this.teamLogoEl.hidden = true;
            this.teamNameEl.textContent = "Locked";
            this.scoreEl.textContent = "0/6";
            this.lockIconEl.hidden = false;
        }
    };
    return MapScreen;
})(ScreenBase);
