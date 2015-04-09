var UserManager = (function () {
    function UserManager() {
        this.levels = [{ isUnlocked: true, score: 0 }];
        this.cash = 0;
        this.bestSurvivalTime = 0;
    }
    UserManager.prototype.newGame = function () {
        this.levels = [{ isUnlocked: true, score: 0 }];
        this.cash = 0;
    };
    UserManager.prototype.hasSaveGame = function () {
        return this.levels != null;
    };
    UserManager.prototype.hasUnlockedLevel = function (level) {
        if (this.levels == null || level >= this.levels.length)
            return false;
        else
            return this.levels[level].isUnlocked;
    };
    UserManager.prototype.levelWon = function (level) {
        var l = this.levels[level];
        var score = smorball.game.getScore();
        var diff = score - l.score;
        l.score = Math.max(score - l.score);
        // If this is the first level then we earn nothing!
        if (level == 0)
            diff = 0;
        smorball.user.cash += diff;
        if (this.levels[level + 1] == undefined)
            this.levels.push({ isUnlocked: true, score: 0 });
        smorball.persistance.persist();
        return diff;
    };
    UserManager.prototype.getHighestUnlockedLevel = function () {
        return this.levels.length - 1;
    };
    UserManager.prototype.isSurvivalUnlocked = function () {
        return this.getHighestUnlockedLevel() >= 16;
    };
    return UserManager;
})();
