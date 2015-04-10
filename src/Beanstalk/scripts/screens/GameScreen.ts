/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />


class GameScreen extends ScreenBase
{
	soundButton: JQuery;
	musicButton: JQuery;

	container: createjs.Container;
	background: createjs.Bitmap;

	constructor() {
		super("gameScreen", "game_screen_html");
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

		// Create the concrete overley which makes it appear as if the plant is growing into the ground
		var overlay = new createjs.Bitmap(beanstalk.resources.getResource("concrete_overlay"));
		overlay.x = 0;
		overlay.y = -193;
		this.container.addChild(overlay);
		
		// Shift the camera so we can see all of a background on the screen
		this.container.y = beanstalk.config.height;

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