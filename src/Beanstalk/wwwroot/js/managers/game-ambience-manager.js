var GameAmbienceManager = (function () {
    function GameAmbienceManager() {
        this.volumeModifier = 0.6;
        this.sounds = {};
    }
    GameAmbienceManager.prototype.init = function () {
        var _this = this;
        // First stop and currently playing sounds
        _.each(this.sounds, function (s) { return s.stop(); });
        // Lets grab playing instances of all the ambient sounds here
        _.each(beanstalk.config.backgroundSections, function (section) {
            _this.sounds[section.ambience] = beanstalk.audio.playSound(section.ambience);
            _this.sounds[section.ambience].loop = -1;
            _this.sounds[section.ambience].volume = 0;
        });
        // For performance grab the sections here and sort from bottom to top
        this.sections = _.values(beanstalk.config.backgroundSections).sort(function (a, b) { return b.height - a.height; });
        // Convert them into the correct scale (the background gets scaled)
        //_.each(this.sections, s => s.height *= beanstalk.screens.game.background.scaleY);
    };
    GameAmbienceManager.prototype.update = function (delta) {
        // First make sure all of the ambients are silent
        _.each(this.sounds, function (s) { return s.volume = 0; });
        // Only if the game is playing should we play any in-game ambience!
        if (beanstalk.game.state != 1 /* Playing */)
            return;
        // Work out where the centre of the screen is in relation to the background
        var pos = beanstalk.screens.game.maxCamHeight - beanstalk.screens.game.container.y + beanstalk.config.height / 2;
        // If we are right at the bottom of the background (garden)
        if (pos > this.sections[0].height) {
            var ratio = this.calcRatio(this.sections[0].height, beanstalk.screens.game.maxCamHeight, pos);
            this.setSectionVolume(0, 1 - ratio);
        }
        else if (pos < this.sections[this.sections.length - 1].height) {
            var ratio = this.calcRatio(0, this.sections[this.sections.length - 1].height, pos);
            this.setSectionVolume(this.sections.length - 1, ratio);
        }
        else {
            for (var i = 0; i < this.sections.length - 1; i++) {
                if (pos < this.sections[i].height && pos > this.sections[i + 1].height) {
                    var ratio = this.calcRatio(this.sections[i].height, this.sections[i + 1].height, pos);
                    this.setSectionVolume(i, 1 - ratio);
                    this.setSectionVolume(i + 1, ratio);
                }
            }
        }
    };
    GameAmbienceManager.prototype.setSectionVolume = function (indx, volume) {
        // dont forget to modify the volume by the global volume
        this.sounds[this.sections[indx].ambience].volume = volume * this.volumeModifier * beanstalk.audio.soundVolume;
    };
    GameAmbienceManager.prototype.getAmbience = function (id) {
    };
    GameAmbienceManager.prototype.calcRatio = function (from, to, val) {
        var dist = to - from;
        return (val - from) / dist;
    };
    return GameAmbienceManager;
})();
