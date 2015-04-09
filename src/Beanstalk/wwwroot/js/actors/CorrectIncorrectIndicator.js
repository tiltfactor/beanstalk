/// <reference path="../../typings/smorball/smorball.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CorrectIncorrectIndicator = (function (_super) {
    __extends(CorrectIncorrectIndicator, _super);
    function CorrectIncorrectIndicator() {
        _super.call(this);
        this.correct = new createjs.Bitmap(smorball.resources.getResource("correct_text"));
        this.correct.regX = this.correct.getBounds().width / 2;
        this.correct.regY = this.correct.getBounds().height / 2;
        this.addChild(this.correct);
        this.incorrect = new createjs.Bitmap(smorball.resources.getResource("incorrect_text"));
        this.incorrect.regX = this.incorrect.getBounds().width / 2;
        this.incorrect.regY = this.incorrect.getBounds().height / 2;
        this.addChild(this.incorrect);
        this.visible = false;
    }
    CorrectIncorrectIndicator.prototype.showCorrect = function () {
        this.visible = true;
        this.correct.visible = true;
        this.incorrect.visible = false;
        this.animateIn();
    };
    CorrectIncorrectIndicator.prototype.showIncorrect = function () {
        this.visible = true;
        this.correct.visible = false;
        this.incorrect.visible = true;
        this.animateIn();
    };
    CorrectIncorrectIndicator.prototype.animateIn = function () {
        var _this = this;
        createjs.Tween.removeTweens(this);
        this.scaleX = this.scaleY = 0;
        this.alpha = 1;
        createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.elasticOut).wait(1000).to({ alpha: 0 }, 1000).call(function () { return _this.visible = false; });
    };
    return CorrectIncorrectIndicator;
})(createjs.Container);
