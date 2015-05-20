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
        this.reset();
    }
    //witherNext(): boolean {
    //	for (var i = this.stalks.length - 1; i >= 0; i--) {
    //		// Grab the top of the stack to wither, only if not locked
    //		var stalk = this.stalks[i];
    //		if (stalk.isLocked) return false;
    //		// If it was able to wither then great
    //		if (stalk.wither()) {
    //			this.stalksSinceLock--;
    //			this.nextStalk = stalk.config.id;
    //			this.height -= (i == 1 ? 30 : Plant.stalkHeightPixels);
    //			return true;
    //		}
    //	}
    //	return false;
    //}
    Plant.prototype.witherUnlocked = function () {
        for (var i = 0; i < this.stalksSinceLock; i++) {
            var stalk = this.stalks[this.stalks.length - 1 - i];
            stalk.wither();
            this.nextStalk = stalk.config.id;
            this.height -= (i == 1 ? 30 : Plant.stalkHeightPixels);
        }
        var count = this.stalksSinceLock;
        this.stalksSinceLock = 0;
        return count;
    };
    Plant.prototype.reset = function () {
        this.nextStalk = "bright";
        this.stalks = [];
        this.height = 0;
        this.stalksSinceLock = 0;
        this.isSeeding = false;
        this.removeAllChildren();
    };
    Plant.prototype.newGameStarted = function () {
        this.reset();
        this.growBottom();
        this.height = Plant.stalkHeightPixels;
    };
    Plant.prototype.lockStalks = function () {
        // Get the last n stalks that havent been locked and lock them now
        _.chain(this.stalks).last(this.stalksSinceLock).each(function (s, i) { return s.lock(i * 100); });
        this.stalksSinceLock = 0;
    };
    Plant.prototype.isReadyToLock = function () {
        return this.stalksSinceLock >= beanstalk.config.stalksBeforeLock - 1;
    };
    Plant.prototype.isAtMaxHeight = function () {
        return this.height >= beanstalk.config.maxPlantHeightPixels;
    };
    Plant.prototype.growTop = function () {
        this.isSeeding = true;
        var stalk = new TopStalk(beanstalk.config.plant.stalks.top);
        stalk.y = -this.stalks.length * Plant.stalkHeightPixels;
        stalk.grow();
        this.addChildAt(stalk, 0);
        this.stalks.push(stalk);
    };
    Plant.prototype.update = function (delta) {
        _.each(this.stalks, function (s) { return s.update(delta); });
    };
    Plant.prototype.growBottom = function () {
        var h = Plant.stalkHeightPixels;
        this.height += h;
        var stalk = new PlantStalk(beanstalk.config.plant.stalks["bottom"]);
        stalk.y = -this.stalks.length * h;
        stalk.growAndLock();
        this.addChildAt(stalk, 0);
        this.stalks.push(stalk);
    };
    Plant.prototype.growStalk = function (andLock) {
        if (andLock === void 0) { andLock = false; }
        var heightGrown = (this.stalks.length == 1 ? 30 : Plant.stalkHeightPixels);
        this.height += heightGrown;
        var stalk = new PlantStalk(beanstalk.config.plant.stalks[this.nextStalk]);
        stalk.y = -this.stalks.length * heightGrown;
        if (andLock) {
            this.stalksSinceLock = 0;
            stalk.growAndLock();
        }
        else {
            this.stalksSinceLock++;
            stalk.grow();
        }
        this.addChildAt(stalk, 0);
        this.stalks.push(stalk);
        // Work out what the next stalk will be
        this.nextStalk = this.getNextStalkType();
    };
    Plant.prototype.stalkWithered = function (stalk) {
        this.removeChild(stalk);
        this.stalks.splice(this.stalks.indexOf(stalk), 1);
    };
    Plant.prototype.getNextStalkType = function () {
        return this.nextStalk == "bright" ? "dark" : "bright";
    };
    Plant.prototype.getGrowingOrGrownStalkCount = function () {
        if (this.isSeeding)
            return 0;
        return _.filter(this.stalks, function (s) { return s.state == 2 /* Grown */ || s.state == 1 /* Growing */; }).length;
    };
    Plant.prototype.restorePlant = function (stalkCount, callback) {
        var _this = this;
        // First remove any old stalks
        this.reset();
        console.log("Growing plant with stalks:", stalkCount);
        // If there are no stalks then just grow the bottom
        if (stalkCount == 0) {
            this.growBottom();
            callback();
            return;
        }
        // Grow the bottom stalk first
        var delay = 200;
        var t = createjs.Tween.get(this).call(function () { return _this.growBottom(); }).wait(delay);
        stalkCount--;
        while (stalkCount > 0) {
            // If we could grab in size of lockcount then we can lock themse
            var count = Math.min(stalkCount, beanstalk.config.stalksBeforeLock);
            var shouldLock = count == beanstalk.config.stalksBeforeLock;
            for (var i = 0; i < count; i++)
                t = this.delayStalkGrow(t, delay, shouldLock);
            // Dont forget to decrement how many are left
            stalkCount -= count;
        }
        // Finally call the callback
        t.call(function () { return callback(); });
    };
    Plant.prototype.delayStalkGrow = function (tween, delay, shouldLock) {
        var _this = this;
        return tween.call(function () {
            _this.growStalk(shouldLock);
        }).wait(delay);
    };
    Plant.stalkHeightPixels = 80;
    return Plant;
})(createjs.Container);
