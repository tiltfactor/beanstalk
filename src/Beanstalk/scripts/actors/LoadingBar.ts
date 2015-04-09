

class LoadingBar extends createjs.Container {

	loadingBarBottom: createjs.Bitmap;
	loadingBar: createjs.Bitmap;
	loadingBarTop: createjs.Bitmap;
	loadingText: createjs.Text;

	init() {

		// Add the loading bar bg
		this.loadingBarBottom = new createjs.Bitmap(beanstalk.resources.getResource("loading_bar_bottom"));
		Utils.centre(this.loadingBarBottom, true, false);
		this.loadingBarBottom.y = 1000;
		this.addChild(this.loadingBarBottom);

		// Add the loading bar 
		this.loadingBar = new createjs.Bitmap(beanstalk.resources.getResource("loading_bar"));
		this.loadingBar.x = this.loadingBarBottom.x;
		this.loadingBar.y = 1008;
		this.addChild(this.loadingBar);

		// Add the loading bar fg
		this.loadingBarTop = new createjs.Bitmap(beanstalk.resources.getResource("loading_bar_top"));
		Utils.centre(this.loadingBarTop, true, false);
		this.loadingBarTop.y = 1000;
		this.addChild(this.loadingBarTop);

		// Add the "loading" text;
		this.loadingText = new createjs.Text("LOADING...", "70px Boogaloo", "white");
		Utils.centre(this.loadingText, true, false);
		this.loadingText.y = 900;
		this.loadingText.shadow = new createjs.Shadow("#000000", 3, 3, 0);
		this.addChild(this.loadingText);

	}

	setProgress(progress: number) {
		this.loadingBar.scaleX = progress * this.loadingBarBottom.getBounds().width;
	}

}