var PowerupsManager = (function () {
    function PowerupsManager() {
        this.resetPowerups();
    }
    PowerupsManager.prototype.init = function () {
        this.types = smorball.resources.getResource("powerups_data");
    };
    PowerupsManager.prototype.newLevel = function () {
        this.views = [];
        this.resetPowerups();
        this.hpSinceLastPowerupSpawn = 0;
    };
    PowerupsManager.prototype.resetPowerups = function () {
        this.powerups = {
            cleats: { quantity: 0, spawnRateMultiplier: 1 },
            bullhorn: { quantity: 0, spawnRateMultiplier: 1 },
            helmet: { quantity: 0, spawnRateMultiplier: 1 }
        };
    };
    PowerupsManager.prototype.spawnPowerup = function (type, lane) {
        // Make the view
        var powerup = new Powerup(type, lane);
        this.views.push(powerup);
        smorball.screens.game.actors.addChild(powerup);
        // Position it on the level somewhere randomly
        var min = smorball.config.goalLine + 300;
        var max = smorball.config.width - 300;
        var x = min + Math.random() * (max - min);
        var y = smorball.config.friendlySpawnPositions[lane].y;
        powerup.x = x;
        powerup.y = y;
        // Spawn
        console.log("Powerup spawned", type, lane);
        // Reset this 		
        this.hpSinceLastPowerupSpawn = 0;
    };
    PowerupsManager.prototype.update = function (delta) {
        // Dont update if the game aint playing
        if (smorball.game.state != 2 /* Playing */)
            return;
        // Update each powerup view
        _.each(this.views, function (p) { return p.update(delta); });
    };
    PowerupsManager.prototype.onEnemyKilled = function (enemy) {
        // Increment the counter by the enemy HP
        this.hpSinceLastPowerupSpawn += enemy.type.life;
        var cleatsChance = this.hpSinceLastPowerupSpawn / (this.types.cleats.spawnChance * this.powerups.cleats.spawnRateMultiplier);
        var helmetChance = this.hpSinceLastPowerupSpawn / (this.types.helmet.spawnChance * this.powerups.helmet.spawnRateMultiplier);
        var bullhornChance = this.hpSinceLastPowerupSpawn / (this.types.bullhorn.spawnChance * this.powerups.bullhorn.spawnRateMultiplier);
        // If we cant spawn them on this level then set the chance at 0
        if (smorball.game.level.powerups.indexOf("cleats") == -1)
            cleatsChance = 0;
        if (smorball.game.level.powerups.indexOf("helmet") == -1)
            helmetChance = 0;
        if (smorball.game.level.powerups.indexOf("bullhorn") == -1)
            bullhornChance = 0;
        // For each powerup that is able to spawn on this level
        var r = Math.random();
        var l = Utils.randomOne(smorball.game.level.lanes);
        if (r < cleatsChance)
            this.spawnPowerup("cleats", l);
        else if (r < cleatsChance + helmetChance)
            this.spawnPowerup("helmet", l);
        else if (r < cleatsChance + bullhornChance)
            this.spawnPowerup("bullhorn", l);
    };
    return PowerupsManager;
})();
