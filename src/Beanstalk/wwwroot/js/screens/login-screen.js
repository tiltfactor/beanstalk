/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LoginScreen = (function (_super) {
    __extends(LoginScreen, _super);
    function LoginScreen() {
        _super.call(this, "loginScreen", "login_screen_html");
    }
    LoginScreen.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        this.loginContainer = $("#loginScreen .login-container").get(0);
        this.logoutContainer = $("#loginScreen .logout-container").get(0);
        this.emailInp = $("#loginScreen input.email").get(0);
        this.passwordInp = $("#loginScreen input.password").get(0);
        this.loginBtn = $("#loginScreen button.login").get(0);
        this.registerBtn = $("#loginScreen button.register").get(0);
        this.playAsGuestBtn = $("#loginScreen button.play-as-guest").get(0);
        this.errorContainer = $("#loginScreen div.alert-danger").get(0);
        this.logoutBtn = $("#loginScreen button.logout").get(0);
        this.continueBtn = $("#loginScreen button.continue").get(0);
        this.emailSpan = $("#loginScreen span.email").get(0);
        this.forgotPasswordBtn = $("#loginScreen .forgot-password").get(0);
        this.errorContainer.hidden = true;
        this.loginBtn.onclick = function () { return _this.login(); };
        this.registerBtn.onclick = function () { return _this.register(); };
        this.logoutBtn.onclick = function () { return _this.logout(); };
        this.playAsGuestBtn.onclick = function () { return _this.playAsGuest(); };
        this.continueBtn.onclick = function () { return _this.continue(); };
        this.forgotPasswordBtn.onclick = function () { return _this.forgotPassword(); };
        // Listen for enter of password and do login
        $(this.passwordInp).on("keydown", function (e) { return _this.onKeyDown(e); });
        this.updateState();
    };
    LoginScreen.prototype.onKeyDown = function (e) {
        if (e.keyCode == 13)
            this.login();
    };
    LoginScreen.prototype.playAsGuest = function () {
        beanstalk.screens.open(beanstalk.screens.main);
    };
    LoginScreen.prototype.updateState = function () {
        if (beanstalk.backend.isLoggedIn) {
            this.logoutContainer.hidden = false;
            this.loginContainer.hidden = true;
            this.emailSpan.textContent = Utils.truncate(beanstalk.backend.user.getUsername(), 20);
        }
        else {
            this.logoutContainer.hidden = true;
            this.loginContainer.hidden = false;
        }
    };
    LoginScreen.prototype.show = function () {
        _super.prototype.show.call(this);
        this.updateState();
    };
    LoginScreen.prototype.continue = function () {
        var _this = this;
        // Before we start, lets load the beanstalk from lasttime
        this.disable();
        beanstalk.backend.loadBeanstalk().then(function (obj) {
            if (obj == null)
                return beanstalk.backend.createBeanstalk();
            return Parse.Promise.as(obj);
        }).then(function (obj) {
            beanstalk.user.setBackendBeanstalk(obj);
            _this.enable();
            beanstalk.screens.open(beanstalk.screens.main);
        }).fail(function (err) {
            beanstalk.backend.logout();
            _this.onBackendError(err);
        });
    };
    LoginScreen.prototype.login = function () {
        var _this = this;
        // Disable input so the use cant login again
        console.log("Attempting login");
        this.disable();
        // Login
        beanstalk.backend.login(this.emailInp.value, this.passwordInp.value).then(function (data) { return _this.onLoggedIn(); }).fail(function (err) { return _this.onBackendError(err); });
    };
    LoginScreen.prototype.register = function () {
        var _this = this;
        // Disable input first for the user cant register again
        console.log("Attempting to register");
        this.disable();
        // Register
        beanstalk.backend.register(this.emailInp.value, this.passwordInp.value).then(function (data) { return _this.onLoggedIn(); }).fail(function (err) { return _this.onBackendError(err); });
    };
    LoginScreen.prototype.logout = function () {
        beanstalk.backend.logout();
        beanstalk.user.backendBeanstalk = null;
        beanstalk.persistance.depersist();
        this.updateState();
    };
    LoginScreen.prototype.forgotPassword = function () {
        var _this = this;
        this.disable();
        beanstalk.backend.forgotPassword(this.emailInp.value).then(function (data) {
            _this.enable();
            alert("Password reset instructions sent to: " + _this.emailInp.value);
        }).fail(function (err) { return _this.onBackendError(err); });
    };
    LoginScreen.prototype.enable = function () {
        this.playAsGuestBtn.disabled = false;
        this.loginBtn.disabled = false;
        this.registerBtn.disabled = false;
        this.emailInp.disabled = false;
        this.passwordInp.disabled = false;
        this.continueBtn.disabled = false;
        this.logoutBtn.disabled = false;
    };
    LoginScreen.prototype.disable = function () {
        this.playAsGuestBtn.disabled = true;
        this.loginBtn.disabled = true;
        this.registerBtn.disabled = true;
        this.emailInp.disabled = true;
        this.passwordInp.disabled = true;
        this.continueBtn.disabled = true;
        this.logoutBtn.disabled = true;
    };
    LoginScreen.prototype.onBackendError = function (err) {
        this.enable();
        console.log("Parse error: ", err);
        $(this.errorContainer).find(".msg").text(err.message);
        $(this.errorContainer).show().delay(3000).fadeOut(1000);
    };
    LoginScreen.prototype.onLoggedIn = function () {
        console.log("logged in!");
        this.enable();
        this.updateState();
    };
    return LoginScreen;
})(ScreenBase);
