/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class InstructionsScreen extends ScreenBase
{
	backScreen: ScreenBase;

	selectedInstruction: number = -1;
	instructions: Instruction[];

	constructor() {
		super("instructionsScreen", "instructions_screen_html");
	}

	init() {
		super.init();		
		
		// Grab the data
		this.instructions = beanstalk.resources.getResource("instructions_data");

		// Listen for some events
		$("#instructionsScreen .left-arrow").click(() => this.selectInstruction(this.selectedInstruction - 1));
		$("#instructionsScreen .right-arrow").click(() => this.selectInstruction(this.selectedInstruction + 1));
		$("#instructionsScreen button.back").click(() => {
			beanstalk.screens.open(this.backScreen);
			this.dispatchEvent("back");
		});

		$("#instructionsScreen .paging img").click(e => {
			var indx = $("#instructionsScreen .paging img").index(<any>e.currentTarget);
			this.selectInstruction(indx);
		});

		// Set the first instruction
		this.selectInstruction(0);
	}

	private selectInstruction(indx: number) {
		if (indx < 0) indx = this.instructions.length - 1;
		if (indx > this.instructions.length - 1) indx = 0;

		this.selectedInstruction = indx;
		var instruction = this.instructions[this.selectedInstruction];

		// Update the image
		var img = <HTMLImageElement>$("#instructionsScreen .instruction-img").get(0);
		img.src = "images/Instructions/" + instruction.image + ".png";

		// Update the text
		$("#instructionsScreen .menu-container p").text(instruction.description);

		// Update the paging elements
		$("#instructionsScreen .paging img").each((i, e: HTMLImageElement) => {
			if (i == this.selectedInstruction) e.src = "images/UI/instructions/page_indicator_on.png";
			else e.src = "images/UI/instructions/page_indicator_off.png";
		});
	}
		
}