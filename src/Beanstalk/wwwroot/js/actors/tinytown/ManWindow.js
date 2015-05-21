var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ManWindow = (function (_super) {
    __extends(ManWindow, _super);
    function ManWindow(instance) {
        _super.call(this, instance);
        SBSpriteUtils.addRandomDelayToLoop(this.sprite, 4, 6);
    }
    ManWindow.prototype.update = function (delta) {
    };
    return ManWindow;
})(TinyTownAnim);
