/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MapDot = (function (_super) {
    __extends(MapDot, _super);
    function MapDot(pos) {
        _super.call(this, smorball.resources.getResource("map_dot"));
        this.x = pos.x;
        this.y = pos.y;
    }
    return MapDot;
})(createjs.Bitmap);
