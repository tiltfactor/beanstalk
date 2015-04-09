/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShopScreen = (function (_super) {
    __extends(ShopScreen, _super);
    function ShopScreen() {
        _super.call(this, "shopScreen", "shop_screen_html");
    }
    ShopScreen.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // Grab these from the dom
        this.cashEl = $("#shopScreen .cashbar").get(0);
        // Create the anuimated star background
        this.background = new StarBackground();
        this.addChild(this.background);
        // Listen for some things
        $("#shopScreen .back").click(function () { return smorball.screens.open(smorball.screens.map); });
        $("#shopScreen .items").mCustomScrollbar({
            scrollbarPosition: "outside",
            theme: "smorball"
        });
        // Handle the buy button
        $("#shopScreen .shop-item button").click(function (e) { return _this.onItemButtonClicked(e); });
        this.updateItems();
    };
    ShopScreen.prototype.onItemButtonClicked = function (e) {
        // Find the index in the items list
        var el = e.currentTarget;
        var indx = $("#shopScreen .shop-item").index(el.parentElement.parentElement);
        // Buy or sell
        if (smorball.upgrades.upgradesOwned[indx])
            smorball.upgrades.sell(indx);
        else
            smorball.upgrades.purchase(indx);
        // Play sound
        smorball.audio.playSound("purchase_item_sound");
        // Refresh the view
        this.updateItems();
        this.cashEl.textContent = smorball.user.cash + "";
    };
    ShopScreen.prototype.show = function () {
        _super.prototype.show.call(this);
        this.cashEl.textContent = smorball.user.cash + "";
        this.updateItems();
    };
    ShopScreen.prototype.update = function (delta) {
        this.background.update(delta);
    };
    ShopScreen.prototype.updateItems = function () {
        $("#shopScreen .shop-item").each(function (i, e) {
            var upgrade = smorball.upgrades.upgrades[i];
            var isOwned = smorball.upgrades.upgradesOwned[i];
            var isLocked = smorball.upgrades.isUpgradeLocked(i);
            $(e).removeClass("purchased");
            $(e).removeClass("too-expensive");
            $(e).removeClass("locked");
            if (isLocked) {
                $(e).find("button").text("LOCKED");
                $(e).addClass("locked");
            }
            else {
                if (isOwned) {
                    $(e).addClass("purchased");
                    $(e).find("button").text("SELL");
                }
                else {
                    $(e).find("button").text("BUY");
                    if (upgrade.price > smorball.user.cash)
                        $(e).addClass("too-expensive");
                }
            }
            $(e).find(".title").text(upgrade.name);
            $(e).find(".description").text(upgrade.description);
            $(e).find(".price").text("$" + upgrade.price);
            $(e).find(".icon").attr("src", "images/Clubhouse/" + upgrade.icon + ".png");
        });
    };
    return ShopScreen;
})(ScreenBase);
