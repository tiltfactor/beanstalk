var DifficultyManager = (function () {
    function DifficultyManager() {
        this.current = smorball.config.difficulties[0];
    }
    DifficultyManager.prototype.setDifficulty = function (difficulty, persist) {
        if (persist === void 0) { persist = true; }
        console.log("Difficulty set to", difficulty.name);
        this.current = difficulty;
        if (persist)
            smorball.persistance.persist();
    };
    DifficultyManager.prototype.getDifficulty = function (name) {
        return _.find(smorball.config.difficulties, function (d) { return d.name == name; });
    };
    DifficultyManager.prototype.updateDifficulty = function (timeOnLevel) {
        this.current = _.chain(smorball.config.difficulties).filter(function (d) { return timeOnLevel < d.requiredTime; }).min(function (d) { return d.requiredTime; }).value();
        console.log("Level completed in " + timeOnLevel + "s, difficulty set to: ", this.current.name);
    };
    return DifficultyManager;
})();
