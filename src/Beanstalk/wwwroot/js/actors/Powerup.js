var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerupState;
(function (PowerupState) {
    PowerupState[PowerupState["NotCollected"] = 0] = "NotCollected";
    PowerupState[PowerupState["Collecting"] = 1] = "Collecting";
})(PowerupState || (PowerupState = {}));
var Powerup = (function (_super) {
    __extends(Powerup, _super);
    function Powerup(type, lane) {
        _super.call(this);
        this.lane = lane;
        this.type = type;
        this.state = 0 /* NotCollected */;
        this.shadowBmp = new createjs.Bitmap(smorball.resources.getResource("shadow"));
        this.shadowBmp.regX = 124;
        this.shadowBmp.regY = 35;
        this.shadowBmp.alpha = 0.5;
        this.shadowBmp.scaleX = this.shadowBmp.scaleY = 0.5;
        this.addChild(this.shadowBmp);
        this.icon = new createjs.Bitmap(smorball.resources.getResource(type + "_powerup"));
        this.icon.regX = 43;
        this.icon.regY = 60;
        this.addChild(this.icon);
        this.vel = -100;
    }
    Powerup.prototype.update = function (delta) {
        if (this.state == 0 /* NotCollected */) {
            var gravity = 120;
            this.vel += gravity * delta;
            this.icon.y += this.vel * delta;
            if (this.icon.y > 0) {
                this.icon.y = 0;
                this.vel = -100;
            }
            var r = -this.icon.y / 60;
            this.shadowBmp.alpha = 0.5 - r * 0.4;
            this.shadowBmp.scaleX = this.shadowBmp.scaleY = 0.5 - r * 0.1;
        }
    };
    Powerup.prototype.collect = function () {
        var _this = this;
        smorball.audio.playSound("powerup_activated_sound", 1);
        this.state = 1 /* Collecting */;
        smorball.powerups.powerups[this.type].quantity++;
        createjs.Tween.get(this).to({ alpha: 0 }, 500, createjs.Ease.quartOut);
        createjs.Tween.get(this.icon).to({ y: this.icon.y - 20, scaleX: 0, scaleY: 0.5 }, 500, createjs.Ease.quartOut).call(function () { return _this.destroy(); });
    };
    Powerup.prototype.destroy = function () {
        smorball.powerups.views.splice(smorball.powerups.views.indexOf(this), 1);
        smorball.screens.game.actors.removeChild(this);
    };
    return Powerup;
})(createjs.Container);
