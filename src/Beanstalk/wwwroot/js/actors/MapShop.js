/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MapShop = (function (_super) {
    __extends(MapShop, _super);
    function MapShop() {
        _super.call(this);
        // Add the lock
        this.lock = new createjs.Bitmap(smorball.resources.getResource("map_lock"));
        this.lock.x = -64;
        this.lock.y = -131;
        this.addChild(this.lock);
        // Add the shop
        this.shop = new createjs.Bitmap(smorball.resources.getResource("shop_icon"));
        this.shop.x = -70;
        this.shop.y = -188;
        this.shop.cursor = "pointer";
        this.shop.mouseEnabled = true;
        this.shop.on("click", function () { return smorball.screens.open(smorball.screens.shop); });
        this.addChild(this.shop);
        this.updateLockedState();
    }
    MapShop.prototype.updateLockedState = function () {
        if (smorball.upgrades.isShopUnlocked()) {
            this.lock.visible = false;
            this.shop.visible = true;
        }
        else {
            this.lock.visible = true;
            this.shop.visible = false;
        }
    };
    return MapShop;
})(createjs.Container);
