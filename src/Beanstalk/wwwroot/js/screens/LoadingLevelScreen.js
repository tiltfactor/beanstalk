/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LoadingLevelScreen = (function (_super) {
    __extends(LoadingLevelScreen, _super);
    function LoadingLevelScreen() {
        _super.call(this, "loadingLevelScreen", "loading_level_screen_html");
    }
    LoadingLevelScreen.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // Grab these
        this.playButtonEl = $("#loadingLevelScreen .play-btn").get(0);
        // Create the anuimated star background
        this.background = new StarBackground();
        this.addChild(this.background);
        // Create a loading bar
        this.bar = new LoadingBar();
        this.bar.init();
        this.addChild(this.bar);
        // Add some listeners
        $("#loadingLevelScreen .play-btn").click(function () { return _this.onPlayClicked(); });
        $("#loadingLevelScreen .back").click(function () { return smorball.screens.open(smorball.screens.map); });
    };
    LoadingLevelScreen.prototype.show = function () {
        _super.prototype.show.call(this);
        $("#loadingLevelScreen h1").text(smorball.game.level.name);
        // Set the correct logo
        var img = $("#loadingLevelScreen .team-logo").get(0);
        var i = smorball.resources.getResource(smorball.game.level.team.id + "_logo");
        img.src = i.src;
    };
    LoadingLevelScreen.prototype.update = function (delta) {
        // Update the stars
        this.background.update(delta);
        // Update the bar based on our load progress
        this.bar.setProgress(smorball.resources.fgQueue.progress);
        // If we are done loading then show the play button
        if (smorball.resources.fgQueue.progress == 1) {
            this.bar.visible = false;
            this.playButtonEl.hidden = false;
        }
        else {
            this.bar.visible = true;
            this.playButtonEl.hidden = true;
        }
    };
    LoadingLevelScreen.prototype.onPlayClicked = function () {
        smorball.game.play();
    };
    return LoadingLevelScreen;
})(ScreenBase);
