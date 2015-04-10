/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />


class LoginScreen extends ScreenBase {

	loginContainer: HTMLDivElement;
	logoutContainer: HTMLDivElement;

	emailInp: HTMLInputElement;
	passwordInp: HTMLInputElement
	loginBtn: HTMLButtonElement;
	registerBtn: HTMLButtonElement;
	playAsGuestBtn: HTMLButtonElement;
	errorContainer: HTMLDivElement;

	logoutBtn: HTMLButtonElement;
	continueBtn: HTMLButtonElement;
	emailSpan: HTMLSpanElement;

	constructor() {
		super("loginScreen", "login_screen_html");
	}

	init() {
		super.init();		

		this.loginContainer = <HTMLDivElement>$("#loginScreen .login-container").get(0);
		this.logoutContainer = <HTMLDivElement>$("#loginScreen .logout-container").get(0);

		this.emailInp = <HTMLInputElement>$("#loginScreen input.email").get(0);
		this.passwordInp = <HTMLInputElement>$("#loginScreen input.password").get(0);
		this.loginBtn = <HTMLButtonElement>$("#loginScreen button.login").get(0);
		this.registerBtn = <HTMLButtonElement>$("#loginScreen button.register").get(0);
		this.playAsGuestBtn = <HTMLButtonElement>$("#loginScreen button.play-as-guest").get(0);
		this.errorContainer = <HTMLDivElement>$("#loginScreen div.alert-danger").get(0);

		this.logoutBtn = <HTMLButtonElement>$("#loginScreen button.logout").get(0);
		this.continueBtn = <HTMLButtonElement>$("#loginScreen button.continue").get(0);
		this.emailSpan = <HTMLSpanElement>$("#loginScreen span.email").get(0);

		this.errorContainer.hidden = true;
		this.loginBtn.onclick = () => this.login();
		this.registerBtn.onclick = () => this.register();
		this.logoutBtn.onclick = () => this.logout();
		this.playAsGuestBtn.onclick = () => beanstalk.screens.open(beanstalk.screens.main);
		this.continueBtn.onclick = () => beanstalk.screens.open(beanstalk.screens.main);

		this.updateState();
	}

	updateState() {

		if (beanstalk.backend.isLoggedIn) {
			this.logoutContainer.hidden = false;
			this.loginContainer.hidden = true;
			this.emailSpan.textContent = beanstalk.backend.user.getUsername();
		}
		else {
			this.logoutContainer.hidden = true;
			this.loginContainer.hidden = false;
		}
		
	}

	login() {

		// Disable input so the use cant login again
		console.log("Attempting login");
		this.disable();

		// Login
		beanstalk.backend.login(this.emailInp.value, this.passwordInp.value)
			.then(data => this.onLoggedIn())
			.fail(err => this.onBackendError(err));			
	}

	register() {

		// Disable input first for the user cant register again
		console.log("Attempting to register");
		this.disable();

		// Register
		beanstalk.backend.register(this.emailInp.value, this.passwordInp.value)
			.then(data => this.onLoggedIn())
			.fail(err => this.onBackendError(err));			
	}

	logout() {
		beanstalk.backend.logout();
		this.updateState();
	}

	enable() {
		this.playAsGuestBtn.disabled = false;
		this.loginBtn.disabled = false;
		this.registerBtn.disabled = false;
		this.emailInp.disabled = false;
		this.passwordInp.disabled = false;
	}

	disable() {
		this.playAsGuestBtn.disabled = true;
		this.loginBtn.disabled = true;
		this.registerBtn.disabled = true;
		this.emailInp.disabled = true;
		this.passwordInp.disabled = true;
	}

	private onBackendError(err: Parse.Error) {
		this.enable();
		console.log("Parse error: ", err);
		$(this.errorContainer).find(".msg").text(err.message);		
		$(this.errorContainer).show().delay(3000).fadeOut(1000);
	}

	private onLoggedIn() {

		console.log("logged in, attempting to load beanstalk for user..");

		// Now we are logged in lets grab the user data from the server
		beanstalk.backend.loadBeanstalk()
			.then(obj => {
				beanstalk.user.setBackendBeanstalk(obj);
				this.enable();
				this.updateState();
			})
			.fail(err => {
				beanstalk.backend.logout();
				this.onBackendError(err);
			});
	}
}