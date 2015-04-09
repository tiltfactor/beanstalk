/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Stadium = (function (_super) {
    __extends(Stadium, _super);
    function Stadium() {
        _super.apply(this, arguments);
    }
    Stadium.prototype.init = function () {
        this.addParts();
        this.addAudience();
        this.logo = new createjs.Bitmap(null);
        this.logo.alpha = 0.2;
        this.logo.x = smorball.config.width / 2 - 256;
        this.logo.y = smorball.config.height / 2 + 40;
        this.addChild(this.logo);
    };
    Stadium.prototype.setTeam = function (team) {
        this.logo.image = smorball.resources.getResource(team.id + "_logo");
    };
    Stadium.prototype.addParts = function () {
        var _this = this;
        var data = smorball.resources.getResource("stadium_data");
        var scale = 1600 / 800;
        _.each(data.parts, function (part) {
            var obj;
            if (part.type == "stadium_wall")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_wall"));
            if (part.type == "stadium_grass")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_grass"));
            else if (part.type == "seat")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_seat"));
            else if (part.type == "scoreboard")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_scoreboard"));
            else if (part.type == "speaker")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_speaker"));
            else if (part.type == "speaker_pole")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_speaker_pole"));
            else if (part.type == "advertisement_board")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_ad_board"));
            else if (part.type == "commentators")
                obj = new createjs.Bitmap(smorball.resources.getResource("stadium_commentators"));
            else if (part.type == "crowd_glass")
                obj = new createjs.Bitmap(smorball.resources.getResource("crowd_glass"));
            if (obj != null) {
                obj.x = part.x * scale;
                obj.y = part.y * scale;
                if (part.flipped == true)
                    obj.scaleX = -1;
                _this.addChild(obj);
            }
        });
    };
    Stadium.prototype.addAudience = function () {
        var _this = this;
        var seatImg = smorball.resources.getResource("stadium_seat");
        var audienceTypes = smorball.resources.getResource("audience_data");
        // Find all seats
        _.chain(this.children).filter(function (obj) { return obj instanceof createjs.Bitmap && obj.image == seatImg; }).each(function (seat) {
            // Lets put an audience member on that seat.
            var member = new AudienceMember(Utils.randomOne(audienceTypes));
            member.x = seat.x;
            member.y = seat.y;
            _this.addChildAt(member, _this.getChildIndex(seat) + 1);
        });
    };
    return Stadium;
})(createjs.Container);
