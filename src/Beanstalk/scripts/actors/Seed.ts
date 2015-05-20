enum SeedState {
	None,
	Growing,
	Falling,
	Landed
}

class Seed extends createjs.Bitmap {

	state: SeedState;
	vel: number;

	constructor() {
		super(beanstalk.resources.getResource("seed"));

		this.vel = -650;
		this.state = SeedState.None;
		this.regX = this.getBounds().width / 2;
		this.regY = this.getBounds().height / 2;
	}

	grow() {

		this.state = SeedState.Growing;
		this.scaleX = this.scaleY = 0;

		var t = createjs.Tween.get(this)
			.to({ scaleX: 1, scaleY: 1 }, 3000, createjs.Ease.linear)
			.wait(200);

		t = this.shake(t, 40, 20, 40);
		t = t.wait(500);
		t = this.shake(t, 40, 20, 40);
		t = t.wait(500);
		t = this.shake(t, 40, 10, 30)
		t.call(() => this.state = SeedState.Falling);

	}

	update(delta: number) {
		if (this.state == SeedState.Falling) {

			this.updatePlantWither();

			this.vel += delta * 200;
			this.vel = Math.min(this.vel, beanstalk.config.maxSeedVel);
			this.y += this.vel * delta;

			if (this.y >= beanstalk.config.seedLandY) {
				this.y = beanstalk.config.seedLandY;
				this.state = SeedState.Landed;
				beanstalk.screens.game.seedLanded();				
			}
		} 
	}

	sprout(callback: () => void) {
		createjs.Tween.get(this)
			.to({ scaleX: 0, scaleY: 0 }, 3000, createjs.Ease.linear)
			.call(() => callback());
	}

	private updatePlantWither() {

        if (this.y < -5555) {
            beanstalk.screens.game.plant.reset();
            beanstalk.screens.game.sidePlant.visible = true;
        }

		// Get all stalks that havent been withered that we are below (ish)
		//_.chain(beanstalk.screens.game.plant.stalks)
		//	.filter(s => s.y - s.sprite.regY - 400 < this.y)
		//	.filter(s => s.state == PlantStalkState.Grown)
		//	.each(s => s.wither());
			
	}

	private shake(tween: createjs.Tween, angle: number, times: number, duration: number): createjs.Tween {
		for (var i = 0; i < times; i++) {
			var r = Utils.randomRange(angle / 4, angle) * (Math.random() > 0.5 ? -1 : 1);
			tween = tween.to({ rotation: r }, duration);
		}
		tween = tween.to({ rotation: 0 }, duration);
		return tween;
	}
}