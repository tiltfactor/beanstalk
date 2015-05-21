/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />


class GameScreen extends ScreenBase
{
	soundButton: JQuery;
	musicButton: JQuery;

	container: createjs.Container;
	seedContainer: createjs.Container;
    captchaContainer: createjs.Container;

    plant: Plant;
    sidePlant: SidePlant;
	heightInp: HTMLInputElement;
    seed: Seed;
    background: Background;

	plantHeightScore: number;
	cameraPosition: number;
	minCamHeight: number;
	maxCamHeight: number;

	constructor() {
		super("gameScreen", "game_screen_html");
		this.plantHeightScore = 0;
		this.cameraPosition = 0;
	}

	init() {
		super.init();	

		// Create the main container, this will in effect be our "camera"
		this.container = new createjs.Container();
		this.addChild(this.container);

        // Create the background
        this.background = new Background();
        this.container.addChild(this.background);

		// Create the plant
		this.plant = new Plant();
		this.plant.x = 440;
		this.plant.y = -193;
		this.container.addChild(this.plant);

        // Create the side plant, this is used to give the illusion of a past plant on the side of the screen
        this.sidePlant = new SidePlant(23);
        this.sidePlant.x = this.plant.x + 300;
        this.sidePlant.y = this.plant.y - 800;
        this.sidePlant.visible = false;
        this.container.addChild(this.sidePlant);

		// Create a placeholder in the heirachy for the seed;
		this.seedContainer = new createjs.Container();
		this.container.addChild(this.seedContainer);

		// Create the concrete overley which makes it appear as if the plant is growing into the ground
		var overlay = new createjs.Bitmap(beanstalk.resources.getResource("concrete_overlay"));
		overlay.x = 0;
		overlay.y = -225;
		this.container.addChild(overlay);

		// Create the captcha container, this doesnt move with the camera
		this.captchaContainer = new createjs.Container();
		this.captchaContainer.x = beanstalk.config.width / 2;
		this.captchaContainer.y = beanstalk.config.height - 150;
		this.addChild(this.captchaContainer);

		// Grab these
		this.heightInp = <HTMLInputElement>$("#gameScreen div.height").get(0);
		
		// Shift the camera so we can see all of a background on the screen
		this.container.y = beanstalk.config.height;
		this.maxCamHeight = this.background.getTransformedBounds().height;// - beanstalk.config.height;	
		this.minCamHeight = beanstalk.config.height;

		// Start the camera off in the correct location
		this.cameraPosition = beanstalk.config.height;

		// Listen for toggle on the music button
		//this.musicButton = $("#gameScreen button.music").click(() => {
		//	beanstalk.audio.setMusicVolume(beanstalk.audio.musicVolume == 0 ? 1 : 0);
		//	this.updateMusicButton();
		//});

		// Listen for toggle on the sound button
		this.soundButton = $("#gameScreen button.sound").click(() => {
			beanstalk.audio.setSoundVolume(beanstalk.audio.soundVolume == 0 ? 1 : 0);
			this.updateSoundButton();
		});
		
		// Listen for clicks
		$("#gameScreen button.back").click(() => beanstalk.game.quitToMenus());
		$("#gameScreen button.help").click(() => {
			beanstalk.screens.instructions.backScreen = beanstalk.screens.game;
			beanstalk.screens.open(beanstalk.screens.instructions);
		});			
	}

	update(delta: number) {

		// Update the plant height in a nice way
		this.plantHeightScore = Utils.limitChange(this.plantHeightScore, beanstalk.user.height, delta * 10);
		this.heightInp.textContent = Math.round(this.plantHeightScore) + "m";

		// If we are seeding we need to do special stuff
		if (this.seed != null) {

			this.seed.update(delta);

			// Move the camera smoothly to the seed position
			var target = beanstalk.config.height / 2 - this.seed.y;
			this.cameraPosition = Utils.limitChange(this.cameraPosition, target, delta * Math.abs(this.cameraPosition - target));

			// Make sure the seed cant go off the screen
			if (this.cameraPosition - target > beanstalk.config.height / 6)
				this.cameraPosition = beanstalk.config.height / 6 + target;		
		}
		else {
			// Move the camera smoothly to the plant height
			var target = this.plant.height + beanstalk.config.height;
			this.cameraPosition = Utils.limitChange(this.cameraPosition, target, delta * Math.abs(this.cameraPosition - target));
		}

		// Make sure the camera cant show more than the game allows
		this.container.y = this.cameraPosition;
		//this.container.y = Math.min(this.container.y, this.maxCamHeight);
		this.container.y = Math.max(this.container.y, this.minCamHeight);

        this.plant.update(delta);
        this.background.update(delta);
	}

	growSeed(x: number, y: number)
	{
		this.seed = new Seed();
		this.seed.x = this.plant.x + x;
		this.seed.y = this.plant.y + y;
		this.seedContainer.addChild(this.seed);
		this.seed.grow();

		this.hideHud(2000);
	}

	seedLanded() {

		// Wait a sec then sprout
		createjs.Tween.get(this).wait(1000).call(() => {

			this.seed.sprout(() => {
				this.seedContainer.removeChild(this.seed);
				this.seed = null;
				this.showHud(1000);				
			});

			this.plant.reset();
            this.plant.growBottom();
            this.background.showNextTinyTownAnim();
		});	
	}

	show() {
		super.show();
		this.plantHeightScore = beanstalk.user.height;
		this.updateSoundButton();
	}

	//private updateMusicButton() {
		//this.musicButton.removeClass("off");
		//if (beanstalk.audio.musicVolume == 0) this.musicButton.addClass("off");
	//}

	private updateSoundButton() {
		this.soundButton.removeClass("off");
		if (beanstalk.audio.soundVolume == 0) this.soundButton.addClass("off");
	}

	hideHud(animDuration: number) {
		$("#gameScreen .hud").fadeOut(animDuration);
		beanstalk.captchas.captcha.visible = false;
	}

	showHud(animDuration: number) {
		$("#gameScreen .hud").fadeIn(animDuration);
		beanstalk.captchas.captcha.visible = true;
	}
	
}