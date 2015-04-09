/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        _super.call(this, "mainMenu", "main_menu_html");
    }
    MainMenu.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // Listen for toggle on the music button
        this.musicButton = $("#mainMenu button.music").click(function () {
            beanstalk.audio.setMusicVolume(beanstalk.audio.musicVolume == 0 ? 1 : 0);
            _this.updateMusicButton();
        });
        // Listen for toggle on the sound button
        this.soundButton = $("#mainMenu button.sound").click(function () {
            beanstalk.audio.setSoundVolume(beanstalk.audio.soundVolume == 0 ? 1 : 0);
            _this.updateSoundButton();
        });
        // Listen for clicks
        $("#mainMenu button.back").click(function () { return beanstalk.screens.open(beanstalk.screens.login); });
        $("#mainMenu button.highscores").click(function () { return beanstalk.screens.open(beanstalk.screens.highscores); });
        $("#mainMenu button.help").click(function () { return beanstalk.screens.open(beanstalk.screens.instructions); });
    };
    MainMenu.prototype.updateMusicButton = function () {
        this.musicButton.removeClass("off");
        if (beanstalk.audio.musicVolume == 0)
            this.musicButton.addClass("off");
    };
    MainMenu.prototype.updateSoundButton = function () {
        this.soundButton.removeClass("off");
        if (beanstalk.audio.soundVolume == 0)
            this.soundButton.addClass("off");
    };
    return MainMenu;
})(ScreenBase);
