var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Framerate = (function (_super) {
    __extends(Framerate, _super);
    function Framerate() {
        _super.call(this);
        this.text = new createjs.Text("99", "50px Boogaloo", "white");
        this.addChild(this.text);
    }
    Framerate.prototype.update = function (delta) {
        this.text.text = "" + Math.round(createjs.Ticker.getMeasuredFPS());
    };
    return Framerate;
})(createjs.Container);
