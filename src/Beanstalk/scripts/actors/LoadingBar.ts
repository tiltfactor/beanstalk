

class LoadingBar extends createjs.Container {

	loadingBarBottom: createjs.Bitmap;
	loadingBarMiddle: createjs.Bitmap;
    loadingBarTop: createjs.Bitmap;
    bar: createjs.Shape;
	loadingText: createjs.Text;

	init() {

		// Add the loading bar bg
		this.loadingBarBottom = new createjs.Bitmap(beanstalk.resources.getResource("loading_bar_bottom"));
		Utils.centre(this.loadingBarBottom, true, false);
		this.loadingBarBottom.y = 1000;
        this.addChild(this.loadingBarBottom);

        // Create and add the bar
        this.bar = new createjs.Shape();
        this.addChild(this.bar);

        // Add the loading bar 
        this.loadingBarMiddle = new createjs.Bitmap(beanstalk.resources.getResource("loading_bar_middle"));
        this.loadingBarMiddle.x = this.loadingBarBottom.x;
        this.loadingBarMiddle.y = 1000;
        this.addChild(this.loadingBarMiddle);       

        // Add the loading bar fg
        this.loadingBarTop = new createjs.Bitmap(beanstalk.resources.getResource("loading_bar_top"));
        Utils.centre(this.loadingBarTop, true, false);
        this.loadingBarTop.y = 1000;
        this.addChild(this.loadingBarTop);

        // Now setup and postion the bar correctly
        this.bar.x = this.loadingBarTop.x + 57;
        this.bar.y = this.loadingBarTop.y + 53;
        this.bar.graphics.beginFill("#098cda");
        this.bar.graphics.drawRect(0, 0, 648, 42);
        this.bar.graphics.endFill();       

		// Add the "loading" text;
		this.loadingText = new createjs.Text("LOADING...", "70px Boogaloo", "white");
		Utils.centre(this.loadingText, true, false);
		this.loadingText.y = 900;
		this.loadingText.shadow = new createjs.Shadow("#000000", 3, 3, 0);
		this.addChild(this.loadingText);
	}

	setProgress(progress: number) {
        this.bar.scaleX = progress;
	}

}