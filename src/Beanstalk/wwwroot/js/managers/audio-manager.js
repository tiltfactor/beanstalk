var AudioManager = (function () {
    function AudioManager() {
        //musicVolume: number = 1;
        this.soundVolume = 1;
        this.musicVolumeMultiplier = 0.6;
        this.soundsPlaying = [];
        //createjs.Sound.initializeDefaultPlugins();
        //createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]);
        //createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.defaultInterruptBehavior = createjs.Sound.INTERRUPT_NONE;
        //smorball.resources.fgQueue.installPlugin(<any>createjs.Sound);
        console.log("AUDIO CAPABILITIESss: ", createjs.Sound.getCapabilities());
    }
    AudioManager.prototype.init = function () {
        var _this = this;
        createjs.Sound.on("fileload", function (e) { return _this.onSoundLoaded(e.id); });
        var manifest = beanstalk.resources.getResource("audio_manifest");
        createjs.Sound.registerSounds(manifest);
    };
    AudioManager.prototype.onSoundLoaded = function (id) {
        if (id == "main_theme_sound" && beanstalk.screens.current != null && beanstalk.screens.current != beanstalk.screens.game)
            this.playMusic();
    };
    //setMusicVolume(volume: number) {
    //	this.musicVolume = volume;
    //	if (this.music) this.music.volume = volume * this.musicVolumeMultiplier;
    //	beanstalk.persistance.persist();
    //}
    AudioManager.prototype.setSoundVolume = function (volume) {
        var change = volume - this.soundVolume;
        _.each(this.soundsPlaying, function (s) { return s.volume += change; });
        // HACK! Update the ambience immediately to stop the popping sound
        beanstalk.ambience.update(0);
        this.soundVolume = volume;
        if (this.music)
            this.music.volume = volume * this.musicVolumeMultiplier;
        beanstalk.persistance.persist();
    };
    AudioManager.prototype.playMusic = function () {
        if (this.music != null)
            return;
        this.music = createjs.Sound.play("beanstalk_garden_v3_sound");
        this.music.loop = -1;
        this.music.volume = this.soundVolume * this.musicVolumeMultiplier;
        if (this.music.playState == "playFailed")
            this.music = null;
    };
    AudioManager.prototype.playSound = function (id, volumeMultipler) {
        if (volumeMultipler === void 0) { volumeMultipler = 1; }
        var sound = createjs.Sound.play(id);
        sound.volume = this.soundVolume * volumeMultipler;
        this.soundsPlaying.push(sound);
        return sound;
    };
    AudioManager.prototype.playAudioSprite = function (id, options, volumeMultipler) {
        if (volumeMultipler === void 0) { volumeMultipler = 1; }
        var sound = createjs.Sound.play(id, options);
        sound.volume = this.soundVolume * volumeMultipler;
        this.soundsPlaying.push(sound);
        return sound;
    };
    AudioManager.prototype.stopMusic = function () {
        if (this.music == null)
            return;
        this.fadeOutAndStop(this.music, 1000);
        this.music = null;
    };
    AudioManager.prototype.fadeOutAndStop = function (sound, duration) {
        createjs.Tween.get(sound).to({ volume: 0 }, duration).call(function () {
            sound.stop();
        });
    };
    AudioManager.prototype.update = function (delta) {
        for (var i = 0; i < this.soundsPlaying.length; i++) {
            var s = this.soundsPlaying[i];
            if (s.playState == "playFinished") {
                this.soundsPlaying.splice(i, 1);
                s.destroy();
                i--;
            }
        }
    };
    return AudioManager;
})();
