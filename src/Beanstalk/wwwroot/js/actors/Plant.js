var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Plant = (function (_super) {
    __extends(Plant, _super);
    function Plant() {
        _super.call(this);
        this.nextStalk = "bottom";
        this.stalks = [];
        this.height = 0;
    }
    Plant.prototype.growStalk = function () {
        var heightGrown = (this.stalks.length == 1 ? 30 : 80);
        this.height += heightGrown;
        var stalk = new PlantStalk(beanstalk.config.plant.stalks[this.nextStalk]);
        stalk.y = -this.stalks.length * heightGrown;
        stalk.grow();
        this.addChildAt(stalk, 0);
        this.stalks.push(stalk);
        // Work out what the next stalk will be
        this.nextStalk = this.nextStalk == "bright" ? "dark" : "bright";
        return heightGrown;
    };
    return Plant;
})(createjs.Container);
