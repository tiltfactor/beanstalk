var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Beanstalk = (function (_super) {
    __extends(Beanstalk, _super);
    function Beanstalk() {
        _super.call(this, "Beanstalk");
    }
    Object.defineProperty(Beanstalk.prototype, "height", {
        get: function () {
            return this.get("height");
        },
        set: function (value) {
            this.set("height", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Beanstalk.prototype, "user", {
        get: function () {
            return this.get("user");
        },
        enumerable: true,
        configurable: true
    });
    return Beanstalk;
})(Parse.Object);
