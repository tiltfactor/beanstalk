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
        this.allTimeRows = $("#highscoresScreen .alltime .row");
        this.weeklyRows = $("#highscoresScreen .weekly .row");
        // Listen for clicks
        $("#highscoresScreen button.back").click(function () { return beanstalk.screens.open(beanstalk.screens.main); });
    };
    HighscoresScreen.prototype.show = function () {
        var _this = this;
        _super.prototype.show.call(this);
        // Start off by updating the view
        this.setRowsToLoading(this.allTimeRows);
        this.setRowsToLoading(this.weeklyRows);
        var allTimeScoresPromise = beanstalk.backend.loadHighscores(3, new Date(0), new Date());
        var weeklyTimeScoresPromise = beanstalk.backend.loadHighscores(3, moment().subtract(1, "week").toDate(), new Date());
        // HACK! This is because the TSD for parse is a bit crap
        var parse = Parse;
        if (beanstalk.user.backendBeanstalk == null) {
            parse.Promise.when(allTimeScoresPromise, weeklyTimeScoresPromise).then(function (allTime, weekly) {
                _this.setRowsFromBeanstalks(_this.allTimeRows.slice(0, 3), allTime);
                _this.setRowsFromBeanstalks(_this.weeklyRows.slice(0, 3), weekly);
                _this.setRow(_this.allTimeRows.get(3), "..", "..", "..");
                _this.setRow(_this.weeklyRows.get(3), "..", "..", "..");
            });
        }
        else {
            var allTimeRankPromise = beanstalk.backend.loadBeanstalkRank(beanstalk.user.backendBeanstalk, new Date(0), new Date());
            var weeklyRankPromise = beanstalk.backend.loadBeanstalkRank(beanstalk.user.backendBeanstalk, moment().subtract(1, "week").toDate(), new Date());
            parse.Promise.when(allTimeScoresPromise, weeklyTimeScoresPromise, allTimeRankPromise, weeklyRankPromise).then(function (allTime, weekly, alltimeRank, weeklyRank) {
                _this.setRowsFromBeanstalks(_this.allTimeRows.slice(0, 3), allTime);
                _this.setRowsFromBeanstalks(_this.weeklyRows.slice(0, 3), weekly);
                _this.setPlayerRow(_this.allTimeRows.get(3), beanstalk.user.backendBeanstalk, alltimeRank + 1);
                _this.setPlayerRow(_this.weeklyRows.get(3), beanstalk.user.backendBeanstalk, weeklyRank + 1);
            });
        }
    };
    HighscoresScreen.prototype.setRowsToLoading = function (rows) {
        rows.each(function (i, e) {
            $(e).find(".position").text("");
            $(e).find(".name").text("loading..");
            $(e).find(".height").text("");
        });
    };
    HighscoresScreen.prototype.setRowsFromBeanstalks = function (rows, beanstalks) {
        rows.each(function (i, e) {
            if (i < beanstalks.length) {
                $(e).find(".position").text(Utils.getGetOrdinal(i + 1));
                $(e).find(".name").text(Utils.getNameFromEmail(beanstalks[i].get("user").getUsername()));
                $(e).find(".height").text("" + beanstalks[i].get("height"));
            }
            else {
                $(e).find(".position").text("..");
                $(e).find(".name").text("..");
                $(e).find(".height").text("..");
            }
        });
    };
    HighscoresScreen.prototype.setPlayerRow = function (row, obj, rank) {
        $(row).find(".position").text(Utils.getGetOrdinal(rank));
        $(row).find(".name").text(Utils.getNameFromEmail(beanstalk.backend.user.getUsername()));
        $(row).find(".height").text(obj.get("height"));
    };
    HighscoresScreen.prototype.setRow = function (row, position, name, height) {
        $(row).find(".position").text(position);
        $(row).find(".name").text(name);
        $(row).find(".height").text(height);
    };
    return HighscoresScreen;
})(ScreenBase);
