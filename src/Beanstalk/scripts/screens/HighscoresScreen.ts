/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class HighscoresScreen extends ScreenBase {

	constructor() {
		super("highscoresScreen", "highscores_screen_html");
	}

	init() {
		super.init();	
		
		// Listen for clicks
		$("#highscoresScreen button.back").click(() => beanstalk.screens.open(beanstalk.screens.main));
	}
}