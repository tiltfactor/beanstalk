var ParseManager = (function () {
    function ParseManager() {
    }
    ParseManager.prototype.init = function () {
        Parse.initialize("otNfSweiaG8zuFEJPJveG2YRC5hwV4sovvIVQ8gp", "xpu1uPRRki8iRjrFy5xwpTW4dL2T2jT1JTmczZ0n");
    };
    ParseManager.prototype.login = function (username, password) {
        return Parse.User.logIn(username, password);
    };
    ParseManager.prototype.register = function (email, password) {
        return Parse.User.signUp(email, password, { email: email });
    };
    ParseManager.prototype.logout = function () {
        return Parse.User.logOut();
    };
    Object.defineProperty(ParseManager.prototype, "isLoggedIn", {
        get: function () {
            return Parse.User.current() != null;
        },
        enumerable: true,
        configurable: true
    });
    return ParseManager;
})();
