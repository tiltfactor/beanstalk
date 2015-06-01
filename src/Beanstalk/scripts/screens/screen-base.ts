

class ScreenBase extends createjs.Container {

	htmlElementId: string;
	htmlResourceId: string;
	element: HTMLElement;

	constructor(htmlElementId: string, htmlResourceId: string) {
		super();
		this.htmlElementId = htmlElementId;
		this.htmlResourceId = htmlResourceId;
	}

	init() {
		// Dynamically add the HTML to the DOM, this forces the browser not to load the images too early!
		var html = <string>beanstalk.resources.getResource(this.htmlResourceId);
		$("#menusContainer").prepend(html);		

		// Grab the menu element
		this.element = document.getElementById(this.htmlElementId);
	}

	show() {
		this.element.hidden = false;
		this.visible = true;
	}

	hide() {
		this.element.hidden = true;
		this.visible = false;
	}

	update(delta: number) {
	}


}