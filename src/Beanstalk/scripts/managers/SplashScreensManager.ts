/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class SplashScreensManager extends createjs.Container  {

	logo: createjs.Bitmap;

	showSplashScreens(completeCallback:()=>void)
	{
		this.logo = new createjs.Bitmap(null);
		this.addChild(this.logo);

		var oldBodyBG = document.body.style.backgroundImage;
		document.body.style.backgroundImage = "none";

		this.showLogo("MBG_logo",() => {
			this.showLogo("BHL_logo",() => {
				this.showLogo("TiltFactor_logo",() => {
					document.body.style.backgroundImage = oldBodyBG;
					completeCallback();
				});
			});
		});
	}

	private showLogo(name: string, completeCallback: () => void) {
		this.logo.image = beanstalk.resources.getResource(name);

		var r = beanstalk.config.width / this.logo.getBounds().width;
		this.logo.scaleX = this.logo.scaleY = r;

		this.logo.x = 0;
		this.logo.y = beanstalk.config.height / 2 - this.logo.getBounds().height / 2;
		
		// Start it off invisible, fade in then fade out
		this.logo.alpha = 0;
		createjs.Tween.get(this.logo)
			.to({ alpha: 1 }, 1000, createjs.Ease.linear)
			.wait(1000)
			.to({ alpha: 0 }, 1000, createjs.Ease.linear)
			.call(() => completeCallback());
	}
}