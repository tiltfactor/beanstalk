/**
 * Created by user on 30/1/15.
 */
(function () {
    var Sound = function(config){
        this.config = config;
        initialize(this);
    }

    var initialize = function(me){
        me.mySound = me.config.loader.getResult(me.config.file);
        if(me.mySound != null){
            me.mySound.loop = me.config.loop;
            var vol = setVolumeValue(me);
            me.setVolume(vol);
            if(!me.config.loop){
                me.mySound.onended=function(){EventBus.dispatch("removeAudioFromList",me.mySound)};
            }
        }
    }
    var setVolumeValue = function(me){
        if(me.config.type == me.config.gameState.soundType.EFFECTS){
            var vol = me.config.gameState.gs.soundEffects/100;
        }
        else if(me.config.type == me.config.gameState.soundType.MAIN){
            var vol = me.config.gameState.gs.music/100;
        }
        return vol;
    }

    Sound.prototype.play = function(){
        if(this.loop){
            this.mySound.loop = true;
        }
        this.mySound.play();
    }
    Sound.prototype.pause = function(){
        this.mySound.pause();
    }
    Sound.prototype.getType = function(){
        this.config.type;
    }
    Sound.prototype.isMain = function(){
        this.config.isMain;
    }
    Sound.prototype.setVolume = function(volume){
        this.mySound.volume = volume;
    }

    window.Sound = Sound;

}());