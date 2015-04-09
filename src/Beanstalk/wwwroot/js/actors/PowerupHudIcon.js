var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerupHudIcon = (function (_super) {
    __extends(PowerupHudIcon, _super);
    function PowerupHudIcon(type) {
        var _this = this;
        _super.call(this);
        this.counter = 0;
        this.type = type;
        this.icon = new createjs.Bitmap(smorball.resources.getResource(type + "_icon"));
        this.icon.regX = this.icon.getBounds().width / 2;
        this.icon.regY = this.icon.getBounds().height / 2;
        this.addChild(this.icon);
        this.quantity = new createjs.Text();
        this.quantity.font = "70px Boogaloo";
        this.quantity.text = "2";
        this.quantity.color = "#207a46";
        this.quantity.x = 20;
        this.quantity.y = 0;
        this.addChild(this.quantity);
        this.quantityOutline = new createjs.Text();
        this.quantityOutline.font = this.quantity.font;
        this.quantityOutline.text = this.quantity.text;
        this.quantityOutline.color = "white";
        this.quantityOutline.x = this.quantity.x;
        this.quantityOutline.y = this.quantity.y;
        this.quantity.outline = 8;
        this.addChild(this.quantityOutline);
        this.icon.mouseEnabled = true;
        this.icon.cursor = "pointer";
        this.icon.on("click", function () { return _this.onClick(); });
    }
    PowerupHudIcon.prototype.onClick = function () {
        smorball.screens.game.selectPowerup(this);
    };
    PowerupHudIcon.prototype.select = function () {
        this.isSelected = true;
        this.icon.image = smorball.resources.getResource(this.type + "_selected_icon");
    };
    PowerupHudIcon.prototype.deselect = function () {
        this.icon.scaleX = this.icon.scaleY = 1;
        this.isSelected = false;
        this.icon.image = smorball.resources.getResource(this.type + "_icon");
    };
    PowerupHudIcon.prototype.update = function (delta) {
        // Update the visibilities
        var quantity = smorball.powerups.powerups[this.type].quantity;
        if (quantity == 0)
            this.visible = false;
        else if (quantity == 1) {
            this.visible = true;
            this.quantity.visible = this.quantityOutline.visible = false;
        }
        else {
            this.quantity.visible = this.quantityOutline.visible = true;
            this.quantity.text = this.quantityOutline.text = quantity + "";
        }
        // If we are selected then slowly pulse to indicate that
        if (this.isSelected) {
            this.counter += delta;
            this.icon.scaleX = this.icon.scaleY = 1.1 + Math.sin(this.counter * 4) * 0.1;
        }
    };
    return PowerupHudIcon;
})(createjs.Container);
