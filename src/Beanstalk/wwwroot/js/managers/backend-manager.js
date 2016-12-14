var BackendManager = (function () {
    function BackendManager() {
    }
    BackendManager.prototype.init = function () {
        //Parse.initialize("otNfSweiaG8zuFEJPJveG2YRC5hwV4sovvIVQ8gp", "xpu1uPRRki8iRjrFy5xwpTW4dL2T2jT1JTmczZ0n");
    };
    BackendManager.prototype.login = function (username, password) {
        //return Parse.User.logIn(username, password);
    };
    BackendManager.prototype.register = function (email, password) {
        //return Parse.User.signUp(email, password, { email: email });
    };
    BackendManager.prototype.logout = function () {
        //return Parse.User.logOut();
    };
    BackendManager.prototype.loadBeanstalk = function () {
        //return new Parse.Query("Beanstalk").equalTo("user", this.user).first();
    };
    BackendManager.prototype.createBeanstalk = function () {
        /*console.log("Creating new beanstalk parse object.");
        var acl = new Parse.ACL();
        acl.setWriteAccess(this.user.id, true);
        acl.setPublicWriteAccess(false);
        acl.setPublicReadAccess(true);
        var bs = new Parse.Object("Beanstalk");
        bs.set("user", this.user);
        bs.set("height", 0);
        bs.set("stalks", 0);
        bs.setACL(acl);
        return bs.save();*/
    };
    BackendManager.prototype.forgotPassword = function (email) {
        //return Parse.User.requestPasswordReset(email);
    };
    BackendManager.prototype.loadHighscores = function (count, from, to) {
        //return new Parse.Query("Beanstalk").greaterThan("updatedAt", from).lessThan("updatedAt", to).include("user").limit(count).descending("height").find();
    };
    BackendManager.prototype.loadBeanstalkRank = function (beanstalk, from, to) {
        //return new Parse.Query("Beanstalk").greaterThan("updatedAt", from).lessThan("updatedAt", to).greaterThan("height", beanstalk.get("height")).count();
    };
   /* Object.defineProperty(BackendManager.prototype, "user", {
        get: function () {
            return Parse.User.current();
        },
        enumerable: true,
        configurable: true
    });*/
    Object.defineProperty(BackendManager.prototype, "isLoggedIn", {
        get: function () {
            return this.user != null;
        },
        enumerable: true,
        configurable: true
    });
    return BackendManager;
})();
