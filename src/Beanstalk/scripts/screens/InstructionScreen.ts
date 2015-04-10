/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class InstructionsScreen extends ScreenBase
{
	backScreen: ScreenBase;

	constructor() {
		super("instructionsScreen", "instructions_screen_html");
	}

	init() {
		super.init();		
		
		// Listen for clicks
		$("#instructionsScreen button.back").click(() => beanstalk.screens.open(this.backScreen));	
	}
		
}