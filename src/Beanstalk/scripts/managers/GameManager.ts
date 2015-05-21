enum GameState {
	Menus,
	Playing
}

class GameManager {

	state: GameState;

	constructor() {
		this.state = GameState.Menus;
	}

	init() {
	}

	continueGame() {

		this.state = GameState.Playing;

		// Show the screen
        beanstalk.screens.open(beanstalk.screens.game);	

        // Hide the side plant
        beanstalk.screens.game.sidePlant.visible = false;

		// Reset the plant
		var plant = beanstalk.screens.game.plant;
		plant.reset();

		// Hide the hude
		beanstalk.screens.game.hideHud(0);

		// Grow the plant to the previous level
		plant.restorePlant(beanstalk.user.startingStalkCount, () => {
			beanstalk.screens.game.showHud(1000);
		});	

		// Start the ambience
        beanstalk.ambience.init();		

        // Show the next tinytown
        beanstalk.screens.game.background.showNextTinyTownAnim();	
	}

	quitToMenus() {
		this.state = GameState.Menus;
		beanstalk.user.startingStalkCount = beanstalk.screens.game.plant.getGrowingOrGrownStalkCount();
		beanstalk.screens.open(beanstalk.screens.main)
	}
}