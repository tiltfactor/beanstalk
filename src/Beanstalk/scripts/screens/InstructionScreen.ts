/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class InstructionsScreen extends ScreenBase
{

	constructor() {
		super("instructionsScreen", "instructions_screen_html");
	}

	init() {
		super.init();		
		
		// Listen for clicks
		$("#instructionsScreen button.back").click(() => beanstalk.screens.open(beanstalk.screens.main));	
	}
		
}