﻿class SocialManager {


	init() {

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
			if (d.getElementById(id)) { return; }
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		} (document, 'script', 'facebook-jssdk'));

	}

	shareProgressToFB() {
		console.log("Sharing to FB: " + this.getShareText());
		FB.ui({
			method: 'feed',
			caption: this.getShareText(),
			//description: this.getShareText(),
			link: 'http://tiltfactor.pepwuper.com/Beanstalk/',
		},	(response) => { console.log("FB Feed response", response) });
	}

    getShareText() {
        return Utils.format("Checkout my awesome {0}m high Beanstalk! http://beanstalk.com", beanstalk.user.height);
	}
	
}