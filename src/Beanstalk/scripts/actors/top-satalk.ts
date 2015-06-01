

class TopStalk extends PlantStalk {

	seed: createjs.Bitmap;

    growSeed() {
       // var invScale = Math.abs(2 - this.config.scale);

        var x = this.config.seed.x - this.config.regX + this.x;
        var y = this.config.seed.y - this.config.regY + this.y;
		beanstalk.screens.game.growSeed(x, y);
	}

	grow(): boolean {
		var b = super.grow();
		if (!b) return false;
		this.sprite.on("animationend",(e: any) => this.growSeed(), this, true);
		return true;
	}

}