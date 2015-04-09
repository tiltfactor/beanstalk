var UpgradesManager = (function () {
    function UpgradesManager() {
        this.upgradesOwned = [false, false, false, false, false, false, false, false, false];
    }
    UpgradesManager.prototype.init = function () {
        this.upgrades = smorball.resources.getResource("upgrade_data");
    };
    UpgradesManager.prototype.newLevel = function () {
        if (this.isOwned("cleats"))
            smorball.powerups.powerups.cleats.quantity++;
        if (this.isOwned("helmet"))
            smorball.powerups.powerups.helmet.quantity++;
        if (this.isOwned("bullhorn"))
            smorball.powerups.powerups.bullhorn.quantity++;
        if (this.isOwned("snike"))
            smorball.powerups.powerups.bullhorn.spawnRateMultiplier = this.getUpgrade("snike").multiplier;
        if (this.isOwned("bawling"))
            smorball.powerups.powerups.bullhorn.spawnRateMultiplier = this.getUpgrade("bawling").multiplier;
        if (this.isOwned("loudmouth"))
            smorball.powerups.powerups.bullhorn.spawnRateMultiplier = this.getUpgrade("loudmouth").multiplier;
        if (this.isOwned("nightclass"))
            smorball.captchas.confusedTimeMuliplier = this.getUpgrade("nightclass").multiplier;
    };
    UpgradesManager.prototype.isUpgradeLocked = function (indx) {
        return (smorball.user.getHighestUnlockedLevel() + 2) <= this.upgrades[indx].unlocksAt;
    };
    UpgradesManager.prototype.isShopUnlocked = function () {
        return smorball.user.levels.length > 1;
    };
    UpgradesManager.prototype.purchase = function (upgrade) {
        this.upgradesOwned[upgrade] = true;
        smorball.user.cash -= this.upgrades[upgrade].price;
        smorball.persistance.persist();
    };
    UpgradesManager.prototype.sell = function (upgrade) {
        this.upgradesOwned[upgrade] = false;
        smorball.user.cash += this.upgrades[upgrade].price;
        smorball.persistance.persist();
    };
    UpgradesManager.prototype.getUpgrade = function (id) {
        return _.find(this.upgrades, function (u) { return u.id == id; });
    };
    UpgradesManager.prototype.isOwned = function (id) {
        var u = this.getUpgrade(id);
        return this.upgradesOwned[this.upgrades.indexOf(u)];
    };
    return UpgradesManager;
})();
