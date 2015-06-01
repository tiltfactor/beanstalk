

class GameAmbienceManager {

	volumeModifier = 0.6;
	sounds: _.Dictionary<createjs.AbstractSoundInstance>;
	sections: BackgroundSection[];

	constructor() {
		this.sounds = {};
	}

	init() {

		// First stop and currently playing sounds
		_.each(this.sounds, s => s.stop());

		// Lets grab playing instances of all the ambient sounds here
		_.each(beanstalk.config.backgroundSections, section => {
			this.sounds[section.ambience] = beanstalk.audio.playSound(section.ambience);
			this.sounds[section.ambience].loop = -1;
			this.sounds[section.ambience].volume = 0;
		});

		// For performance grab the sections here and sort from bottom to top
		this.sections = _.values(beanstalk.config.backgroundSections).sort((a, b) => b.height - a.height);

		// Convert them into the correct scale (the background gets scaled)
		//_.each(this.sections, s => s.height *= beanstalk.screens.game.background.scaleY);
	}

	update(delta: number) {

		// First make sure all of the ambients are silent
		_.each(this.sounds, s=> s.volume = 0);

		// Only if the game is playing should we play any in-game ambience!
		if (beanstalk.game.state != GameState.Playing) return;

		// Work out where the centre of the screen is in relation to the background
		var pos = beanstalk.screens.game.maxCamHeight - beanstalk.screens.game.container.y + beanstalk.config.height / 2;

		// If we are right at the bottom of the background (garden)
		if (pos > this.sections[0].height) {
			var ratio = this.calcRatio(this.sections[0].height, beanstalk.screens.game.maxCamHeight, pos);
			this.setSectionVolume(0, 1 - ratio);
		}

		// If we are right at the top (space)
		else if (pos < this.sections[this.sections.length - 1].height) {
			var ratio = this.calcRatio(0, this.sections[this.sections.length - 1].height, pos);
			this.setSectionVolume(this.sections.length - 1, ratio);
		}

		// Else we are somewerhe in between
		else {

			// Work out the relative ratio between the two points in backgound space
			for (var i = 0; i < this.sections.length - 1; i++) {
				if (pos < this.sections[i].height && pos > this.sections[i + 1].height)
				{
					var ratio = this.calcRatio(this.sections[i].height, this.sections[i + 1].height, pos);
					this.setSectionVolume(i, 1 - ratio);
					this.setSectionVolume(i+1, ratio);
					//console.log(this.sections[i].ambience, this.sounds[this.sections[i].ambience].volume,
					//	this.sections[i + 1].ambience, this.sounds[this.sections[i + 1].ambience].volume,
					//	ratio, pos);
				}
			}
		}
	}

	setSectionVolume(indx: number, volume: number) {
		// dont forget to modify the volume by the global volume
		this.sounds[this.sections[indx].ambience].volume = volume * this.volumeModifier * beanstalk.audio.soundVolume;
	}

	getAmbience(id: string) {
	}

	calcRatio(from: number, to: number, val: number) {
		var dist = to - from;
		return (val - from) / dist;
	}
}