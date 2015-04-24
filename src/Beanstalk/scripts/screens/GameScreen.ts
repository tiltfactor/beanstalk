/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />


class GameScreen extends ScreenBase
{
	soundButton: JQuery;
	musicButton: JQuery;

	container: createjs.Container;
	background: createjs.Bitmap;
	plant: Plant;
	heightInp: HTMLInputElement;

	private plantHeightScore: number;
	private plantHeightPixels: number;
	private maxCamHeight: number;

	constructor() {
		super("gameScreen", "game_screen_html");
		this.plantHeightScore = 0;
		this.plantHeightPixels = 0;
	}

	init() {
		super.init();	

		// Create the main container, this will in effect be our "camera"
		this.container = new createjs.Container();
		this.addChild(this.container);

		// Create the background
		this.background = new createjs.Bitmap(beanstalk.resources.getResource("background_middle"));
		this.background.regY = this.background.getBounds().height;
		this.background.scaleX = this.background.scaleY = 0.7802690582959641;
		this.container.addChild(this.background);

		// Create the plant
		this.plant = new Plant();
		this.plant.x = 440;
		this.plant.y = -193;
		this.container.addChild(this.plant);

		// Create the concrete overley which makes it appear as if the plant is growing into the ground
		var overlay = new createjs.Bitmap(beanstalk.resources.getResource("concrete_overlay"));
		overlay.x = 0;
		overlay.y = -193;
		this.container.addChild(overlay);

		// Grab these
		this.heightInp = <HTMLInputElement>$("#gameScreen div.height").get(0);
		
		// Shift the camera so we can see all of a background on the screen
		this.container.y = beanstalk.config.height;
		this.maxCamHeight = this.background.getBounds().height - beanstalk.config.height;	

		// Listen for toggle on the music button
		this.musicButton = $("#gameScreen button.music").click(() => {
			beanstalk.audio.setMusicVolume(beanstalk.audio.musicVolume == 0 ? 1 : 0);
			this.updateMusicButton();
		});

		// Listen for toggle on the sound button
		this.soundButton = $("#gameScreen button.sound").click(() => {
			beanstalk.audio.setSoundVolume(beanstalk.audio.soundVolume == 0 ? 1 : 0);
			this.updateSoundButton();
		});
		
		// Listen for clicks
		$("#gameScreen button.back").click(() => beanstalk.screens.open(beanstalk.screens.main));
		$("#gameScreen button.help").click(() => {
			beanstalk.screens.instructions.backScreen = beanstalk.screens.game;
			beanstalk.screens.open(beanstalk.screens.instructions);
		});			
	}

	update(delta: number) {

		// Update the plant height in a nice way
		this.plantHeightScore = Utils.limitChange(this.plantHeightScore, beanstalk.user.height, delta * 50);
		this.heightInp.textContent = Math.round(this.plantHeightScore) + "m";
		
		// Move the camera smoothly to the plant height
		this.plantHeightPixels = Utils.limitChange(this.plantHeightPixels, this.plant.height, delta * Math.abs(this.plantHeightPixels - this.plant.height));
		this.container.y = beanstalk.config.height + this.plantHeightPixels;

		this.container.y = Math.min(this.container.y, this.maxCamHeight);
	}

	show() {
		super.show();
		this.updateMusicButton();
		this.updateSoundButton();
	}

	private updateMusicButton() {
		this.musicButton.removeClass("off");
		if (beanstalk.audio.musicVolume == 0) this.musicButton.addClass("off");
	}

	private updateSoundButton() {
		this.soundButton.removeClass("off");
		if (beanstalk.audio.soundVolume == 0) this.soundButton.addClass("off");
	}
	
}