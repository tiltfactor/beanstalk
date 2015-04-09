var SpawningManager = (function () {
    function SpawningManager() {
    }
    SpawningManager.prototype.startNewLevel = function (level) {
        this.level = level;
        this.enemySpawnsThisLevel = this.countEnemySpawns(level);
        this.wave = this.level.waves[0];
        this.action = this.wave.actions[0];
        this.logWave();
        this.logAction();
        this.lastEnemySpawnLane = 1;
        this.survivalData = smorball.resources.getResource("survival_data");
        // Spawn some starting athletes
        _.each(this.level.lanes, function (i) { return smorball.spawning.spawnAthlete(i); });
    };
    SpawningManager.prototype.countEnemySpawns = function (level) {
        var count = 0;
        _.each(level.waves, function (wave) {
            _.each(wave.actions, function (action) {
                if (action.type == "spawn" && action.enemy != undefined)
                    count++;
            });
        });
        return count;
    };
    SpawningManager.prototype.update = function (delta) {
        // If the game isnt playing then we shouldnt do anything
        if (smorball.game.state != 2 /* Playing */)
            return;
        // If its a time trail we dont do scripted spawning, spawning is handled by TimeTrailManager
        if (smorball.game.level.timeTrial)
            return;
        var startAction = this.action;
        var startWave = this.wave;
        // increment these first
        this.waveTimer += delta;
        this.actionTimer += delta;
        // Update whatever the current action is
        if (this.action != null)
            this.updateAction(this.action);
        // If the next action is null then lets wait until all enemyies are 
        // killed then try to start the next wave
        if (this.action == null && smorball.game.enemies.length == 0) {
            this.wave = this.getNextWave();
            // If the next wave is null then the level is done
            if (this.wave == null) {
                smorball.game.gameOver(true);
                return;
            }
            else {
                this.action = this.getNextAction();
            }
        }
        if (this.wave != startWave)
            this.logWave();
        if (this.action != startAction)
            this.logAction();
    };
    SpawningManager.prototype.logWave = function () {
        if (this.wave == null)
            return;
        console.log("Starting new wave", this.level.waves.indexOf(this.wave) + 1, "of", this.level.waves.length, this.wave);
    };
    SpawningManager.prototype.logAction = function () {
        if (this.action == null || this.wave == null)
            return;
        console.log("Starting new action", this.wave.actions.indexOf(this.action) + 1, "of", this.wave.actions.length, this.action);
    };
    SpawningManager.prototype.updateAction = function (action) {
        // Switch over the type of action we are currently on
        if (this.action.type == "spawn") {
            if (this.action.enemy != undefined) {
                this.spawnEnemy(this.action.enemy, this.action.sameLane, this.action.lane);
                this.action = this.getNextAction();
            }
            else if (this.action.powerup != undefined) {
                this.spawnPowerup(this.action.powerup, this.action.quantity, this.action.lane);
                this.action = this.getNextAction();
            }
        }
        else if (this.action.type == "commentate") {
            smorball.screens.game.bubble.showCommentary(this.action.commentry);
            this.action = this.getNextAction();
        }
        else if (this.action.type == "delay") {
            // If there are no more enemies then we dont need to delay, just send another enemy immediatately
            if (!this.action.noSkip && smorball.game.enemies.length == 0)
                this.action = this.getNextAction();
            else if (this.actionTimer > this.action.time * smorball.difficulty.current.multiplier)
                this.action = this.getNextAction();
        }
    };
    SpawningManager.prototype.spawnEnemy = function (enemyType, sameLane, lane) {
        // If lane is not provided then spawn on a random one
        if (lane == undefined)
            lane = Utils.randomOne(smorball.game.level.lanes);
        // If we are to spawn on the same lane however, override the above
        if (sameLane == true)
            lane = this.lastEnemySpawnLane;
        // Create the enemy and start running
        var enemy = new Enemy(smorball.game.enemyTypes[enemyType], lane);
        smorball.game.enemies.push(enemy);
        smorball.screens.game.actors.addChild(enemy);
        this.lastEnemySpawnLane = lane;
        console.log("Enemy spawned", enemyType);
    };
    SpawningManager.prototype.spawnPowerup = function (powerupType, quantity, lane) {
        if (quantity == undefined)
            quantity = 1;
        for (var i = 0; i < quantity; i++) {
            // If lane is not provided then spawn on a random one
            if (lane == undefined)
                lane = Utils.randomOne(smorball.game.level.lanes);
            smorball.powerups.spawnPowerup(powerupType, lane);
            console.log("Powerup spawned", powerupType);
        }
    };
    SpawningManager.prototype.spawnAthlete = function (lane) {
        var type = Utils.randomOne(_.values(smorball.game.athleteTypes));
        var athlete = new Athlete(type, lane);
        smorball.game.athletes.push(athlete);
        smorball.screens.game.actors.addChild(athlete);
        console.log("Athlete spawned", type);
    };
    SpawningManager.prototype.getNextWave = function () {
        // Reset the wave timer
        this.waveTimer = 0;
        // Work out what wave index we are currently on and then return the next one
        var indx = this.level.waves.indexOf(this.wave);
        if (indx < this.level.waves.length)
            return this.level.waves[indx + 1];
        // If we get here there are no more waves and so we are done with the level
        return null;
    };
    SpawningManager.prototype.getNextAction = function () {
        // Reset the action timer
        this.actionTimer = 0;
        var nextAction = null;
        // If we have only just started then we need to use the first action
        if (this.wave == null)
            nextAction = this.wave.actions[0];
        // Work out what action index we are currently on and then return the next one
        var indx = this.wave.actions.indexOf(this.action);
        if (indx < this.wave.actions.length)
            return this.wave.actions[indx + 1];
        // If we get here then there are no more actions in this wave
        return null;
    };
    return SpawningManager;
})();
