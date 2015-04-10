var BackendManager = (function () {
    function BackendManager() {
    }
    BackendManager.prototype.init = function () {
        Parse.initialize("otNfSweiaG8zuFEJPJveG2YRC5hwV4sovvIVQ8gp", "xpu1uPRRki8iRjrFy5xwpTW4dL2T2jT1JTmczZ0n");
    };
    BackendManager.prototype.login = function (username, password) {
        return Parse.User.logIn(username, password);
    };
    BackendManager.prototype.register = function (email, password) {
        return Parse.User.signUp(email, password, { email: email });
    };
    BackendManager.prototype.logout = function () {
        return Parse.User.logOut();
    };
    Object.defineProperty(BackendManager.prototype, "user", {
        get: function () {
            return Parse.User.current();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BackendManager.prototype, "isLoggedIn", {
        get: function () {
            return this.user != null;
        },
        enumerable: true,
        configurable: true
    });
    return BackendManager;
})();
