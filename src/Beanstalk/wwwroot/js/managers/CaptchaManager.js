var CaptchaManager = (function () {
    function CaptchaManager() {
    }
    CaptchaManager.prototype.init = function () {
        $("#gameScreen button.submit").click(function () {
            var heightGrown = beanstalk.screens.game.plant.growStalk();
            beanstalk.user.height += heightGrown;
            //beanstalk.screens.game.translateCamera(0, heightGrown);
        });
    };
    return CaptchaManager;
})();
