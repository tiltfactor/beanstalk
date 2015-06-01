
enum PlantStalkState {
	None,
	Growing,
	Grown,
	Withering
}


class PlantStalk extends createjs.Container {

	static flowerTypes = ["flower1", "flower2", "flower3", "flower4"];
    static bubblePops = ["beanstalk_flower_grow_bubble_02_sound", "beanstalk_flower_grow_bubble_03_sound"];

	config: PlantStalkConfig;
	sprite: createjs.Sprite;
	state: PlantStalkState;
	flowers: createjs.Bitmap[];
	isLocked: boolean;

	constructor(config: PlantStalkConfig) {
		super();

		this.config = config;
		this.state = PlantStalkState.None;
		this.flowers = [];
        this.isLocked = false;

        var invScale = Math.abs(2 - config.scale);

		this.sprite = new createjs.Sprite(this.getSpritesheet());
        this.sprite.regX = config.regX * invScale;
        this.sprite.regY = config.regY * invScale;
		this.scaleX = this.scaleY = config.scale;
        this.addChild(this.sprite);
	}

	lock(delay: number) {

		this.isLocked = true;
        if (this.config.flowers.length == 0) return;

        //var filter = new createjs.ColorFilter(0, 0, 0, 1, 255,0,0,0);
        //this.sprite.filters = [filter];
        //this.sprite.cache(0, 0, this.sprite.getTransformedBounds().width, this.sprite.getTransformedBounds().height);
       
        //createjs.Tween.get(this.sprite)
        //    .wait(100)
        //    .call(() => this.sprite.filters = [filter])
        //    .wait(1000)
        //    .call(() => this.sprite.filters = []);

		_.chain(this.config.flowers)
			.sample(Utils.randomRange(2, this.config.flowers.length - 1))
			.each((f: SimplePoint, i) => this.addFlower(f, Utils.randomRange(0, i * 300) + delay));		
	}

    addFlower(at: SimplePoint, delay: number) {

        var invScale = Math.abs(2 - this.config.scale);
        
		var flower = new createjs.Bitmap(beanstalk.resources.getResource(Utils.randomOne(PlantStalk.flowerTypes)));
		flower.regX = flower.getBounds().width / 2;
		flower.regY = flower.getBounds().width / 2;
		flower.scaleX = flower.scaleY = 0;
        flower.x = at.x * invScale - this.config.regX * invScale;
        flower.y = at.y * invScale - this.config.regY * invScale;
		this.addChild(flower);
		this.flowers.push(flower);
       
        createjs.Tween.get(flower)
            .wait(delay)
            .to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);

        createjs.Tween.get(this)
            .wait(delay)
            .call(() => beanstalk.audio.playSound(Utils.randomOne(PlantStalk.bubblePops), 0.5));
            
	}

	grow(): boolean {
		if (this.state != PlantStalkState.None) return false;
		this.state = PlantStalkState.Growing;
		this.sprite.gotoAndPlay("grow");
		beanstalk.audio.playSound("leaves_grow_a1_sound");
		this.sprite.on("animationend",(e: any) => this.state = PlantStalkState.Grown, this, true);
		return true;
	}

	growAndLock() {
		this.grow();
		this.isLocked = true;
		this.sprite.on("animationend",(e: any) => this.lock(0), this, true);
	}

	wither(): boolean {

		var startingFrame = 0;
		if (this.state == PlantStalkState.Growing)
			startingFrame = this.sprite.spriteSheet.getNumFrames("wither") - this.sprite.currentAnimationFrame;

		this.state = PlantStalkState.Withering;
		this.sprite.removeAllEventListeners();
		beanstalk.audio.playSound("leaves_wither_a1_sound");
		this.sprite.gotoAndPlay("wither");
		this.sprite.currentAnimationFrame = startingFrame;
		this.sprite.on("animationend",(e: any) => beanstalk.screens.game.plant.stalkWithered(this), this, true);
		_.each(this.flowers,(f, i) => this.witherFlower(f, Utils.randomRange(0, i * 300)));
		return true;
	}

	private witherFlower(flower: createjs.Bitmap, delay:number) {
		createjs.Tween.removeTweens(flower);
		createjs.Tween.get(flower)
			.wait(delay)
			.to({ scaleX: 0, scaleY: 0 }, 500, createjs.Ease.backIn);
    }

    update(delta: number) {       
    }

	private getSpritesheet(): createjs.SpriteSheet {

		// Grab them
		var data = beanstalk.resources.getResource(this.config.id + "_stalk_json");
		var sprite = beanstalk.resources.getResource(this.config.id + "_stalk_png");

		// Update the data with the image
		data.images = [sprite];

		// Manually create the animaiton here 
		data.animations = {
			grow: [0, data.frames.length - 1, false],
			wither: { frames: _.range(data.frames.length - 1).reverse(), next: false, speed: 2 }
		};

		return new createjs.SpriteSheet(data);
	}
	

}