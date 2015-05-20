class UserManager {

	backendBeanstalk: Parse.Object;

	_height: number;
	startingStalkCount: number;

	constructor() {
		this._height = 0;
		this.startingStalkCount = 0;
	}

	init() {
		// If we are logged in then lets try to get the beanstalk data now
		if (beanstalk.backend.isLoggedIn)
			this.loadBeanstalkFromBackend();
	}

	get height() {
		return this._height;
	}

	set height(value: number) {
        this._height = value;

        console.log("setting stalk", this.backendBeanstalk);

		// If we are running in guest mode then just persist now
		if (this.backendBeanstalk == null) beanstalk.persistance.persist();
			
		// Else update the beanstalk object then attempt to save it
		else {
			this.backendBeanstalk.set("height", value);
			this.backendBeanstalk.set("stalks", beanstalk.screens.game.plant.getGrowingOrGrownStalkCount());
			this.backendBeanstalk.save();
		}
		
	}
		
	loadBeanstalkFromBackend() {
		if (!beanstalk.backend.isLoggedIn) return;
		beanstalk.backend.loadBeanstalk()
			.then(obj => this.setBackendBeanstalk(obj))
			.fail(err => console.log("Error trying to get backend beanstalk!", err));
	}

	setBackendBeanstalk(beanstalk: Parse.Object) {
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
			
	}

}