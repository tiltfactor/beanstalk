var UserManager = (function () {
    function UserManager() {
        this.height = 0;
    }
    UserManager.prototype.init = function () {
        // If we are logged in then lets try to get the beanstalk data now
        if (beanstalk.backend.isLoggedIn)
            this.loadBeanstalkFromBackend();
    };
    UserManager.prototype.loadBeanstalkFromBackend = function () {
        var _this = this;
        if (!beanstalk.backend.isLoggedIn)
            return;
        beanstalk.backend.loadBeanstalk().then(function (obj) { return _this.setBackendBeanstalk(obj); }).fail(function (err) { return console.log("Error trying to get backend beanstalk!", err); });
    };
    UserManager.prototype.setBackendBeanstalk = function (beanstalk) {
        console.log("Backend beanstalk set", beanstalk);
        this.backendBeanstalk = beanstalk;
        if (this.backendBeanstalk != null)
            this.height = this.backendBeanstalk.get("height");
    };
    return UserManager;
})();
