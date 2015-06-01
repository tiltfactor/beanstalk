var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ScreenBase = (function (_super) {
    __extends(ScreenBase, _super);
    function ScreenBase(htmlElementId, htmlResourceId) {
        _super.call(this);
        this.htmlElementId = htmlElementId;
        this.htmlResourceId = htmlResourceId;
    }
    ScreenBase.prototype.init = function () {
        // Dynamically add the HTML to the DOM, this forces the browser not to load the images too early!
        var html = beanstalk.resources.getResource(this.htmlResourceId);
        $("#menusContainer").prepend(html);
        // Grab the menu element
        this.element = document.getElementById(this.htmlElementId);
    };
    ScreenBase.prototype.show = function () {
        this.element.hidden = false;
        this.visible = true;
    };
    ScreenBase.prototype.hide = function () {
        this.element.hidden = true;
        this.visible = false;
    };
    ScreenBase.prototype.update = function (delta) {
    };
    return ScreenBase;
})(createjs.Container);
