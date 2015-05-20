

class Plant extends createjs.Container {

	static stalkHeightPixels = 80;

	nextStalk: string;
	stalks: PlantStalk[];
	height: number;
	stalksSinceLock: number;
	isSeeding: boolean;

	constructor() {
		super();
		this.reset();
	}

	//witherNext(): boolean {

	//	for (var i = this.stalks.length - 1; i >= 0; i--) {

	//		// Grab the top of the stack to wither, only if not locked
	//		var stalk = this.stalks[i];
	//		if (stalk.isLocked) return false;

	//		// If it was able to wither then great
	//		if (stalk.wither()) {
	//			this.stalksSinceLock--;
	//			this.nextStalk = stalk.config.id;
	//			this.height -= (i == 1 ? 30 : Plant.stalkHeightPixels);
	//			return true;
	//		}
	//	}

	//	return false;
	//}

	witherUnlocked(): number {

		// From the back, iterate through the ones since lock and wither them
		for (var i = 0; i < this.stalksSinceLock; i++) {
			var stalk = this.stalks[this.stalks.length-1-i];
			stalk.wither()
			this.nextStalk = stalk.config.id;
			this.height -= (i == 1 ? 30 : Plant.stalkHeightPixels);
		}

		var count = this.stalksSinceLock;
		this.stalksSinceLock = 0;
		return count;
	}

	reset() {
		this.nextStalk = "bright";
		this.stalks = [];
		this.height = 0;
		this.stalksSinceLock = 0;
		this.isSeeding = false;
		this.removeAllChildren();
	}

	newGameStarted() {
		this.reset();
		this.growBottom();
		this.height = Plant.stalkHeightPixels;
	}

	lockStalks() {

		// Get the last n stalks that havent been locked and lock them now
		_.chain(this.stalks)
			.last(this.stalksSinceLock)
			.each((s, i) => s.lock(i * 100));

		this.stalksSinceLock = 0;
	}

	isReadyToLock() {
		return this.stalksSinceLock >= beanstalk.config.stalksBeforeLock - 1;
	}

	isAtMaxHeight() {
		return this.height >= beanstalk.config.maxPlantHeightPixels;
	}

	growTop() {
		this.isSeeding = true;
		var stalk = new TopStalk(beanstalk.config.plant.stalks.top);
		stalk.y = -this.stalks.length * Plant.stalkHeightPixels;
		stalk.grow();
		this.addChildAt(stalk, 0);
		this.stalks.push(stalk);
    }

    update(delta: number) {
        _.each(this.stalks, s => s.update(delta));
    }

	growBottom() {

		var h = Plant.stalkHeightPixels;
		this.height += h;

		var stalk = new PlantStalk(beanstalk.config.plant.stalks["bottom"]);
		stalk.y = -this.stalks.length * h;
		stalk.growAndLock();

		this.addChildAt(stalk, 0);
		this.stalks.push(stalk);
	}

	growStalk(andLock: boolean = false) {
				
		var heightGrown = (this.stalks.length == 1 ? 30 : Plant.stalkHeightPixels);
		this.height += heightGrown;

		var stalk = new PlantStalk(beanstalk.config.plant.stalks[this.nextStalk]);
		stalk.y = -this.stalks.length * heightGrown;

		if (andLock) {
			this.stalksSinceLock=0;
			stalk.growAndLock();
		}
		else {
			this.stalksSinceLock++;
			stalk.grow();
		}

		this.addChildAt(stalk, 0);
		this.stalks.push(stalk);

		// Work out what the next stalk will be
		this.nextStalk = this.getNextStalkType();
	}

	stalkWithered(stalk: PlantStalk) {
		this.removeChild(stalk);
		this.stalks.splice(this.stalks.indexOf(stalk),1);
	}

	getNextStalkType() {
		return this.nextStalk == "bright" ? "dark" : "bright";
	}

	getGrowingOrGrownStalkCount() {
		if (this.isSeeding) return 0;
		return _.filter(this.stalks, s => s.state == PlantStalkState.Grown || s.state == PlantStalkState.Growing).length;
	}

	restorePlant(stalkCount: number, callback: ()=>void) {

		// First remove any old stalks
		this.reset();

		console.log("Growing plant with stalks:", stalkCount);

		// If there are no stalks then just grow the bottom
		if (stalkCount == 0) {
			this.growBottom();
			callback();
			return;
		}		

		// Grow the bottom stalk first
		var delay = 200;
		var t = createjs.Tween.get(this).call(() => this.growBottom()).wait(delay);
		stalkCount--;
		
		// Now grab in groups of size lockcount
		while (stalkCount > 0) {

			// If we could grab in size of lockcount then we can lock themse
			var count = Math.min(stalkCount, beanstalk.config.stalksBeforeLock);
			var shouldLock = count == beanstalk.config.stalksBeforeLock;

			// Delay them opening (nice anim)
			for (var i = 0; i < count; i++)	t = this.delayStalkGrow(t, delay, shouldLock);

			// Dont forget to decrement how many are left
			stalkCount -= count;
		}	

		// Finally call the callback
		t.call(() => callback());
	}

	private delayStalkGrow(tween: createjs.Tween, delay: number, shouldLock: boolean): createjs.Tween {
		return tween.call(() => {
			this.growStalk(shouldLock);
		})
		.wait(delay);
	}

}