

class Plant extends createjs.Container {

	nextStalk: string;
	stalks: PlantStalk[];
	height: number;

	constructor() {
		super();
		this.nextStalk = "bottom";
		this.stalks = [];
		this.height = 0;
	}

	growStalk() : number {

		var heightGrown = (this.stalks.length == 1 ? 30 : 80);
		this.height += heightGrown;

		var stalk = new PlantStalk(beanstalk.config.plant.stalks[this.nextStalk]);
		stalk.y = -this.stalks.length * heightGrown;
		stalk.grow();
		this.addChildAt(stalk, 0);
		this.stalks.push(stalk);

		// Work out what the next stalk will be
		this.nextStalk = this.nextStalk == "bright" ? "dark" : "bright";

		return heightGrown;
	}
	

}