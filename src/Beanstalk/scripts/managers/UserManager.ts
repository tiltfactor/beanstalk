class UserManager {

	height: number;

	backendBeanstalk: Parse.Object;

	constructor() {
		this.height = 0;
	}

	init() {
		// If we are logged in then lets try to get the beanstalk data now
		if (beanstalk.backend.isLoggedIn)
			this.loadBeanstalkFromBackend();
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
		if (this.backendBeanstalk != null)
			this.height = this.backendBeanstalk.get("height");
	}

}