/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />


class MainMenu extends ScreenBase {

	soundButton: JQuery;
	musicButton: JQuery;

	constructor() {
		super("mainMenu", "main_menu_html");
	}

	init() {
		super.init();		

		// Listen for toggle on the music button
		this.musicButton = $("#mainMenu button.music").click(() => {
			beanstalk.audio.setMusicVolume(beanstalk.audio.musicVolume == 0 ? 1 : 0);
			this.updateMusicButton();
		});

		// Listen for toggle on the sound button
		this.soundButton = $("#mainMenu button.sound").click(() => {
			beanstalk.audio.setSoundVolume(beanstalk.audio.soundVolume == 0 ? 1 : 0);
			this.updateSoundButton();
		});

		// Listen for clicks
		$("#mainMenu button.play").click(() => beanstalk.screens.open(beanstalk.screens.game));
		$("#mainMenu button.back").click(() => beanstalk.screens.open(beanstalk.screens.login));
		$("#mainMenu button.highscores").click(() => beanstalk.screens.open(beanstalk.screens.highscores));
		$("#mainMenu button.instructions").click(() => {
			beanstalk.screens.instructions.backScreen = beanstalk.screens.main;
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