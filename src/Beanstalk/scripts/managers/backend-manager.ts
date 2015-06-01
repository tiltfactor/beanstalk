class BackendManager {

	init() {
		Parse.initialize("otNfSweiaG8zuFEJPJveG2YRC5hwV4sovvIVQ8gp", "xpu1uPRRki8iRjrFy5xwpTW4dL2T2jT1JTmczZ0n");
	}

	login(username: string, password) {
		return Parse.User.logIn(username, password);
	}

	register(email: string, password) {
		return Parse.User.signUp(email, password, { email: email });
	}

	logout() {
		return Parse.User.logOut();
	}

	loadBeanstalk() {
		return new Parse.Query("Beanstalk")
			.equalTo("user", this.user)
			.first<Parse.Object>();
    }

    createBeanstalk() {
        console.log("Creating new beanstalk parse object.");

        var acl = new Parse.ACL();
        acl.setWriteAccess(this.user.id, true);
        acl.setPublicWriteAccess(false);
        acl.setPublicReadAccess(true);

        var bs = new Parse.Object("Beanstalk");
        bs.set("user", this.user);
        bs.set("height", 0);
        bs.set("stalks", 0);
        bs.setACL(acl);

        return bs.save();
    }

	forgotPassword(email: string) {
		return Parse.User.requestPasswordReset(email);
	}

	loadHighscores(count: number, from: Date, to: Date) {
		return new Parse.Query("Beanstalk")
			.greaterThan("updatedAt", from)
			.lessThan("updatedAt", to)
			.include("user")
			.limit(count)
			.descending("height")
			.find<Parse.Object[]>();
	}

	loadBeanstalkRank(beanstalk: Parse.Object, from: Date, to: Date) {
		return new Parse.Query("Beanstalk")
			.greaterThan("updatedAt", from)
			.lessThan("updatedAt", to)
			.greaterThan("height", beanstalk.get("height"))
			.count<number>();		
	}

	get user() {
		return Parse.User.current();
	}

	get isLoggedIn(): boolean {
		return this.user != null;
	}
}