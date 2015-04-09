/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class LoadingScreen extends createjs.Container {

	logo: createjs.Bitmap;
	bar: LoadingBar;
	
	init() {

		// Add the logo
		this.logo = new createjs.Bitmap(beanstalk.resources.getResource("beanstalk_logo"));
		Utils.centre(this.logo, true, false);
		this.logo.y = 0;
		this.addChild(this.logo);

		this.bar = new LoadingBar();
		this.bar.init();
		this.addChild(this.bar);
	}	

	update(delta:number) {
		// Dont need to update if not visible
		if (!this.visible) return;

		// Update the bar based on our load progress
		this.bar.setProgress(beanstalk.resources.fgQueue.progress);
	}
}