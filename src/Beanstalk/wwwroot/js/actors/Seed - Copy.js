var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SeedState;
(function (SeedState) {
    SeedState[SeedState["None"] = 0] = "None";
    SeedState[SeedState["Growing"] = 1] = "Growing";
    SeedState[SeedState["Falling"] = 2] = "Falling";
    SeedState[SeedState["Landed"] = 3] = "Landed";
})(SeedState || (SeedState = {}));
var Seed = (function (_super) {
    __extends(Seed, _super);
    function Seed() {
        _super.call(this, beanstalk.resources.getResource("seed"));
        this.vel = -650;
        this.state = 0 /* None */;
        this.regX = this.getBounds().width / 2;
        this.regY = this.getBounds().height / 2;
    }
    Seed.prototype.grow = function () {
        var _this = this;
        this.state = 1 /* Growing */;
        this.scaleX = this.scaleY = 0;
        var t = createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 3000, createjs.Ease.linear).wait(200);
        t = this.shake(t, 40, 20, 40);
        t = t.wait(500);
        t = this.shake(t, 40, 20, 40);
        t = t.wait(500);
        t = this.shake(t, 40, 10, 30);
        t.call(function () { return _this.state = 2 /* Falling */; });
    };
    Seed.prototype.update = function (delta) {
        if (this.state == 2 /* Falling */) {
            this.updatePlantWither();
            this.vel += delta * 200;
            this.vel = Math.min(this.vel, beanstalk.config.maxSeedVel);
            this.y += this.vel * delta;
            if (this.y >= beanstalk.config.seedLandY) {
                this.y = beanstalk.config.seedLandY;
                this.state = 3 /* Landed */;
                beanstalk.screens.game.seedLanded();
            }
        }
    };
    Seed.prototype.sprout = function (callback) {
        createjs.Tween.get(this).to({ scaleX: 0, scaleY: 0 }, 3000, createjs.Ease.linear).call(function () { return callback(); });
    };
    Seed.prototype.updatePlantWither = function () {
        console.log(this.y);
        if (this.y < -5555) {
            beanstalk.screens.game.plant.reset();
            beanstalk.screens.game.sidePlant.visible = true;
        }
        // Get all stalks that havent been withered that we are below (ish)
        //_.chain(beanstalk.screens.game.plant.stalks)
        //	.filter(s => s.y - s.sprite.regY - 400 < this.y)
        //	.filter(s => s.state == PlantStalkState.Grown)
        //	.each(s => s.wither());
    };
    Seed.prototype.shake = function (tween, angle, times, duration) {
        for (var i = 0; i < times; i++) {
            var r = Utils.randomRange(angle / 4, angle) * (Math.random() > 0.5 ? -1 : 1);
            tween = tween.to({ rotation: r }, duration);
        }
        tween = tween.to({ rotation: 0 }, duration);
        return tween;
    };
    return Seed;
})(createjs.Bitmap);
