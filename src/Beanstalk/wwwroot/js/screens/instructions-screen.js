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
        this.selectedInstruction = -1;
    }
    InstructionsScreen.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        // Grab the data
        this.instructions = beanstalk.resources.getResource("instructions_data");
        // Listen for some events
        $("#instructionsScreen .left-arrow").click(function () { return _this.selectInstruction(_this.selectedInstruction - 1); });
        $("#instructionsScreen .right-arrow").click(function () { return _this.selectInstruction(_this.selectedInstruction + 1); });
        $("#instructionsScreen button.back").click(function () {
            beanstalk.screens.open(_this.backScreen);
            _this.dispatchEvent("back");
        });
        $("#instructionsScreen .paging img").click(function (e) {
            var indx = $("#instructionsScreen .paging img").index(e.currentTarget);
            _this.selectInstruction(indx);
        });
        // Set the first instruction
        this.selectInstruction(0);
    };
    InstructionsScreen.prototype.selectInstruction = function (indx) {
        var _this = this;
        if (indx < 0)
            indx = this.instructions.length - 1;
        if (indx > this.instructions.length - 1)
            indx = 0;
        this.selectedInstruction = indx;
        var instruction = this.instructions[this.selectedInstruction];
        // Update the image
        var img = $("#instructionsScreen .instruction-img").get(0);
        img.src = "images/Instructions/" + instruction.image + ".png";
        // Update the text
        $("#instructionsScreen .menu-container p").html(instruction.description);
        // Update the paging elements
        $("#instructionsScreen .paging img").each(function (i, e) {
            if (i == _this.selectedInstruction)
                e.src = "images/UI/instructions/page_indicator_on.png";
            else
                e.src = "images/UI/instructions/page_indicator_off.png";
        });
    };
    return InstructionsScreen;
})(ScreenBase);
