/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />

class ScreensManager extends createjs.Container {

	main: MainMenu;
	container: createjs.DOMElement;
	game: GameScreen;
	instructions: InstructionsScreen;
	login: LoginScreen;
	highscores: HighscoresScreen;

	current: ScreenBase;

	menus: ScreenBase[];

	constructor() {
		super();

		this.menus = [];
		this.main = this.addMenu(new MainMenu());
		this.game = this.addMenu(new GameScreen());
		this.instructions = this.addMenu(new InstructionsScreen());
		this.login = this.addMenu(new LoginScreen());
		this.highscores = this.addMenu(new HighscoresScreen());
	}

	private addMenu<T extends ScreenBase>(menu: T) : T {
		this.addChild(menu);
		this.menus.push(menu);
		return menu;
	}

	init()
	{
		// Add the DOM element to the stage, this allows us to scale and position correctly
		this.container = new createjs.DOMElement(document.getElementById("menusContainer"));
		this.addChild(this.container);

		// init each menu
		_.each(this.menus, m => m.init());

		// Make sure we start off hidden
		_.each(this.menus, m => m.hide());

		// Add a generic hover over button sound
		$("button").hover(() => beanstalk.audio.playSound("mouse_over_button_sound"));
		$("button").click(() => beanstalk.audio.playSound("click_sound"));
	}

	open(menu: ScreenBase) {
		if (this.current) this.current.hide();

		if (menu == this.game) beanstalk.audio.stopMusic();
		else beanstalk.audio.playMusic(); 

		menu.show();
		this.current = menu;
	}

	update(delta: number) {
		if (this.current != null)
			this.current.update(delta);
	}

	//showMainMenu() {
	//	this.mainMenu.show();
	//}

}