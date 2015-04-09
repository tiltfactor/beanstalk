/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HighscoresScreen = (function (_super) {
    __extends(HighscoresScreen, _super);
    function HighscoresScreen() {
        _super.call(this, "highscoresScreen", "highscores_screen_html");
    }
    HighscoresScreen.prototype.init = function () {
        _super.prototype.init.call(this);
        // Listen for clicks
        $("#highscoresScreen button.back").click(function () { return beanstalk.screens.open(beanstalk.screens.main); });
    };
    return HighscoresScreen;
})(ScreenBase);
