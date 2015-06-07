var SocialManager = (function () {
    function SocialManager() {
    }
    SocialManager.prototype.init = function () {
        window.fbAsyncInit = function () {
            FB.init({
                appId: beanstalk.config.fbAppId,
                xfbml: true,
                version: 'v2.3'
            });
        };
        // Setup the facebook SDK
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };
    SocialManager.prototype.shareProgressToFB = function () {
        console.log("Sharing to FB: " + this.getShareText());
        FB.ui({
            method: 'feed',
            caption: this.getShareText(),
            //description: this.getShareText(),
            link: 'http://beanstalkgame.org',
        }, function (response) {
            console.log("FB Feed response", response);
        });
    };
    SocialManager.prototype.getShareText = function () {
        return Utils.format("I've transcribed {0} words for the Biodiversity Heritage Library in Beanstalk! http://beanstalkgame.org", beanstalk.user.height/10);
    };
    return SocialManager;
})();
