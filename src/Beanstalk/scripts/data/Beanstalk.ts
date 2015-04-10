
class Beanstalk extends Parse.Object {

	constructor() {
		super("Beanstalk");
	}

	get height(): number {
		return this.get("height");
	}

	set height(value: number) {
		this.set("height", value);
	}

	get user(): Parse.User {
		return this.get("user");
	}

}