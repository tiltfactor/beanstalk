var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GameState;
(function (GameState) {
    GameState[GameState["NotPlaying"] = 0] = "NotPlaying";
    GameState[GameState["Loading"] = 1] = "Loading";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Timeout"] = 3] = "Timeout";
    GameState[GameState["GameOver"] = 4] = "GameOver";
})(GameState || (GameState = {}));
var GameManager = (function (_super) {
    __extends(GameManager, _super);
    function GameManager() {
        _super.apply(this, arguments);
        this.state = 0 /* NotPlaying */;
    }
    GameManager.prototype.init = function () {
        var _this = this;
        this.levels = smorball.resources.getResource("levels_data");
        this.enemyTypes = smorball.resources.getResource("enemies_data");
        this.athleteTypes = smorball.resources.getResource("athletes_data");
        // Listen for keyboard presses
        document.onkeydown = function (e) { return _this.onKeyDown(e); };
    };
    GameManager.prototype.onKeyDown = function (e) {
        // Only handle keypresses if we are running
        if (this.state != 2 /* Playing */)
            return;
        // Tab
        if (e.keyCode == 9) {
            smorball.screens.game.selectNextPowerup();
            e.preventDefault();
        }
    };
    GameManager.prototype.loadLevel = function (levelIndex) {
        console.log("starting level", levelIndex);
        // Set these now
        this.state = 1 /* Loading */;
        this.levelIndex = levelIndex;
        this.level = this.getLevel(levelIndex);
        this.enemiesKilled = 0;
        this.enemyTouchdowns = 0;
        this.passesRemaining = smorball.config.passes;
        // Load the resources needed
        smorball.resources.loadLevelResources(levelIndex);
        // Take this oppertunity to grab a new page from the API
        smorball.captchas.loadPageFromServer();
        // Show the loading screen
        smorball.screens.open(smorball.screens.loadingLevel);
    };
    GameManager.prototype.play = function () {
        // Reset these
        this.enemies = [];
        this.athletes = [];
        this.timeOnLevel = 0;
        this.knockbackMultiplier = 1;
        // Open the correct screen
        smorball.screens.open(smorball.screens.game);
        smorball.screens.game.newLevel();
        smorball.powerups.newLevel();
        smorball.upgrades.newLevel();
        smorball.timeTrial.newLevel();
        // Start playing the crowd cheering sound
        this.ambienceSound = smorball.audio.playAudioSprite("stadium_ambience_looping_sound", { startTime: 0, duration: 28000, loop: -1 });
        // Update the spawner
        smorball.spawning.startNewLevel(this.level);
        smorball.captchas.startNewLevel(this.level);
        // Finaly change the state so we start playing
        this.state = 2 /* Playing */;
    };
    GameManager.prototype.getLevel = function (indx) {
        return this.levels[indx];
    };
    GameManager.prototype.update = function (delta) {
        if (this.state != 2 /* Playing */)
            return;
        this.timeOnLevel += delta;
        _.each(this.enemies, function (e) {
            if (e != null)
                e.update(delta);
        });
        _.each(this.athletes, function (e) {
            if (e != null)
                e.update(delta);
        });
    };
    GameManager.prototype.gameOver = function (win) {
        // Set these
        this.state = 4 /* GameOver */;
        createjs.Ticker.setPaused(true);
        // If this is a timetrail level then we need to do something special
        if (this.level.timeTrial) {
            // If we beat the best time then update it here
            if (this.timeOnLevel > smorball.user.bestSurvivalTime)
                smorball.user.bestSurvivalTime = this.timeOnLevel;
            // Show the end screen
            smorball.screens.game.showTimeTrialEnd();
            // Save
            smorball.persistance.persist();
        }
        else if (win) {
            // Stop the ambience
            smorball.audio.fadeOutAndStop(this.ambienceSound, 2000);
            // Play a different ambient sound
            this.ambienceSound = smorball.audio.playSound("crowd_cheering_ambient_sound");
            // If this is the first level then lets adjust the difficulty
            if (this.levelIndex == 0)
                smorball.difficulty.updateDifficulty(this.timeOnLevel);
            // Work out how much we earnt
            var earnt = smorball.user.levelWon(this.levelIndex);
            smorball.screens.game.showVictory(earnt);
        }
        else
            smorball.screens.game.showDefeat(0);
    };
    GameManager.prototype.enemyReachedGoaline = function (enemy) {
        this.enemyTouchdowns++;
        smorball.captchas.refreshCaptcha(enemy.lane);
        // If its a time trail then only one enemy is allowed to reach the goaline
        if (this.level.timeTrial)
            this.gameOver(false);
        else if (this.enemyTouchdowns >= smorball.config.enemyTouchdowns)
            this.gameOver(false);
    };
    GameManager.prototype.getOpponentsRemaining = function () {
        return smorball.spawning.enemySpawnsThisLevel - smorball.game.enemiesKilled - this.enemyTouchdowns;
    };
    GameManager.prototype.getScore = function () {
        return (smorball.config.enemyTouchdowns - this.enemyTouchdowns) * 1000;
    };
    GameManager.prototype.enemyKilled = function (enemy) {
        this.enemiesKilled++;
        smorball.powerups.onEnemyKilled(enemy);
    };
    GameManager.prototype.timeout = function () {
        this.state = 3 /* Timeout */;
        createjs.Ticker.setPaused(true);
        smorball.screens.game.showTimeout();
        smorball.screens.game.captchas.visible = false;
        smorball.stage.update();
    };
    GameManager.prototype.resume = function () {
        this.state = 2 /* Playing */;
        createjs.Ticker.setPaused(false);
        smorball.screens.game.timeoutEl.hidden = true;
        smorball.screens.game.captchas.visible = true;
    };
    GameManager.prototype.help = function () {
        var _this = this;
        createjs.Ticker.setPaused(false);
        this.ambienceSound.paused = true;
        smorball.screens.instructions.backMenu = smorball.screens.game;
        smorball.screens.open(smorball.screens.instructions);
        smorball.screens.instructions.on("back", function () {
            createjs.Ticker.setPaused(true);
            _this.ambienceSound.paused = false;
            smorball.stage.update();
        }, this, true);
    };
    GameManager.prototype.returnToMap = function () {
        createjs.Ticker.setPaused(false);
        this.state = 0 /* NotPlaying */;
        smorball.screens.open(smorball.screens.map);
        // Stop the ambience
        if (this.ambienceSound)
            smorball.audio.fadeOutAndStop(this.ambienceSound, 2000);
    };
    return GameManager;
})(createjs.Container);
