class Captcha extends createjs.Container {

	chunk: OCRChunk;
	sprite: createjs.Sprite;

	constructor(chunk: OCRChunk) {

		super();

		// Create and add the spritesheet
		this.sprite = new createjs.Sprite(chunk.page.spritesheet);
		this.addChild(this.sprite);
		this.sprite.visible = false;

		// Position us in the right place
		//var pos = smorball.config.captchaPositions[lane];
		//this.x = pos.x;
		//this.y = pos.y;

		// Draw a debug circle
		if (beanstalk.config.debug) {
			//var circle = new createjs.Shape();
			//circle.graphics.beginFill("red");
			//circle.graphics.drawCircle(0, 0, 10);
			//this.addChild(circle);

			// For debug purposes, let this be clickable
			//this.mouseEnabled = true;
			//this.cursor = "pointer";
			//this.on("click",() => smorball.captchas.onCaptchaEnteredSuccessfully(this.chunk.texts[0], this));
		}
	}

	getWidth() {
		if (this.chunk == null) return 0;
		var frame = this.chunk.page.spritesheet.getFrame(this.chunk.frame);
		return frame.rect.width;
	}

	setChunk(chunk: OCRChunk) {

		// Update the sprite
		this.chunk = chunk;
		this.sprite.spriteSheet = chunk.page.spritesheet;
		this.sprite.gotoAndStop(chunk.frame);
		this.sprite.regX = this.sprite.getTransformedBounds().width / 2;
		this.sprite.regY = this.sprite.getTransformedBounds().height / 2;
		this.sprite.visible = true;
					
		// Reset any previous animations
		createjs.Tween.removeTweens(this.sprite);
		this.sprite.scaleX = this.sprite.scaleY = 1;
	}	

	animateIn() {
		this.sprite.scaleX = this.sprite.scaleY = 0;
		createjs.Tween.get(this.sprite).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
	}

	clear() {
		this.chunk = null;
		// Animate Out
		createjs.Tween.removeTweens(this.sprite);
		createjs.Tween.get(this.sprite).to({ scaleX: 0, scaleY: 0 }, 250, createjs.Ease.backOut)
			.call(tween => this.sprite.visible = false);
	}

}