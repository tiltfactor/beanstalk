/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InstructionsScreen = (function (_super) {
    __extends(InstructionsScreen, _super);
    function InstructionsScreen() {
        _super.call(this, "instructionsScreen", "instructions_screen_html");
    }
    InstructionsScreen.prototype.init = function () {
        _super.prototype.init.call(this);
        // Listen for clicks
        $("#instructionsScreen button.back").click(function () { return beanstalk.screens.open(beanstalk.screens.main); });
    };
    return InstructionsScreen;
})(ScreenBase);
