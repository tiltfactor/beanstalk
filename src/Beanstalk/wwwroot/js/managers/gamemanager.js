var GameState;
(function (GameState) {
    GameState[GameState["Menus"] = 0] = "Menus";
    GameState[GameState["Playing"] = 1] = "Playing";
})(GameState || (GameState = {}));
var GameManager = (function () {
    function GameManager() {
        this.state = 0 /* Menus */;
    }
    GameManager.prototype.init = function () {
    };
    GameManager.prototype.continueGame = function () {
        this.state = 1 /* Playing */;
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
        plant.restorePlant(beanstalk.user.startingStalkCount, function () {
            beanstalk.screens.game.showHud(1000);
        });
        // Start the ambience
        beanstalk.ambience.init();
    };
    GameManager.prototype.quitToMenus = function () {
        this.state = 0 /* Menus */;
        beanstalk.user.startingStalkCount = beanstalk.screens.game.plant.getGrowingOrGrownStalkCount();
        beanstalk.screens.open(beanstalk.screens.main);
    };
    return GameManager;
})();
