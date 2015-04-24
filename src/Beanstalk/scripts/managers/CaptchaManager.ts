class CaptchaManager {

	constructor() {
	}

	init() {

		$("#gameScreen button.submit").click(() => {

			var heightGrown = beanstalk.screens.game.plant.growStalk();
			beanstalk.user.height += heightGrown;
			//beanstalk.screens.game.translateCamera(0, heightGrown);

		});	


	}

}