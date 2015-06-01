var UserManager = (function () {
    function UserManager() {
        this._height = 0;
        this.startingStalkCount = 0;
    }
    UserManager.prototype.init = function () {
        // If we are logged in then lets try to get the beanstalk data now
        if (beanstalk.backend.isLoggedIn)
            this.loadBeanstalkFromBackend();
    };
    Object.defineProperty(UserManager.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
            console.log("setting stalk", this.backendBeanstalk);
            // If we are running in guest mode then just persist now
            if (this.backendBeanstalk == null)
                beanstalk.persistance.persist();
            else {
                this.backendBeanstalk.set("height", value);
                this.backendBeanstalk.set("stalks", beanstalk.screens.game.plant.getGrowingOrGrownStalkCount());
                this.backendBeanstalk.save();
            }
        },
        enumerable: true,
        configurable: true
    });
    UserManager.prototype.loadBeanstalkFromBackend = function () {
        var _this = this;
        if (!beanstalk.backend.isLoggedIn)
            return;
        beanstalk.backend.loadBeanstalk().then(function (obj) { return _this.setBackendBeanstalk(obj); }).fail(function (err) { return console.log("Error trying to get backend beanstalk!", err); });
    };
    UserManager.prototype.setBackendBeanstalk = function (beanstalk) {
        console.log("Backend beanstalk set", beanstalk);
        this.backendBeanstalk = beanstalk;
        if (this.backendBeanstalk != null) {
            this._height = this.backendBeanstalk.get("height");
            this.startingStalkCount = this.backendBeanstalk.get("stalks");
        }
        else {
            this._height = 0;
            this.startingStalkCount = 0;
        }
    };
    return UserManager;
})();
