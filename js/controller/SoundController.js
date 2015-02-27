function SoundController(config){
    this.config = config;

    SoundController.prototype.init = function(){
        //this.audioList = [];
        this.config.stage = new createjs.Stage("loaderCanvas");
        createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin, createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
        createjs.Sound.alternateExtensions = ["wav"];
        loadEvents(this);
        playMusic(this);

    }

    var loadEvents = function(me){

        var ra = function(sound){removeAudioFromList(me,sound.target)};
        EventBus.addEventListener("removeAudioFromList",ra);

        var pa = function(){pauseAllSound(me)};
        EventBus.addEventListener("pauseAllSound", pa);

        var al = function(sound){addAudioToList(me,sound.target)};
        EventBus.addEventListener("addAudioToList", al);

        var cs = function(type){changeSoundVolume(me,type.target)};
        EventBus.addEventListener("changeSoundVolume", cs);

        var sm = function(){setMute(me)};
        EventBus.addEventListener("setMute", sm);

        var pm = function(sound){playSound(me,sound.target)};
        EventBus.addEventListener("playSound", pm);
    }

    var playSound = function(me,fileId){
        var config = {"file": fileId , "loop": false, "type": me.config.gameState.soundType.EFFECTS, "isMain": false,"loader":me.config.loader, "gameState":me.config.gameState};
        var sound = new Sound(config);
        EventBus.dispatch("addAudioToList",sound);

    }
    var addAudioToList = function(me,sound){
        if(sound.mySound != null){
            sound.play();
            me.config.gameState.audioList.push(sound);
        }
    }
    var removeAudioFromList = function(me,sound){
        if(sound.mySound != null){
            sound.pause();
            var index = me.config.gameState.audioList.indexOf(sound);
            me.config.gameState.audioList.splice(index,1);
        }
    }
    /*var pauseAllSound = function(me){
     for(var i= 0; i< me.audioList.length; i++){
     var sound = me.audioList[i];
     sound.pause();
     }
     }*/
    var pauseAllSound = function(me){
        for(var i= 0; i< me.config.gameState.audioList.length; i++){
            var sound = me.config.gameState.audioList[i];
            if(!sound.config.isMain){
                sound.pause();
            }
        }
    }
    var setMute = function(me){
        var audioList = me.config.gameState.audioList;
        for(var i=0; i<audioList.length; i++){
            var main = audioList[i].config.type;
            if(main == me.config.gameState.soundType.MAIN){
                if(audioList[i].mySound.paused){
                    audioList[i].play();
                }
                else{
                    audioList[i].pause();
                }
            }
        }
    }
    var changeSoundVolume = function(me,type){
        for(var i= 0; i< me.config.gameState.audioList.length; i++){
            var sound = me.config.gameState.audioList[i];
            if(sound.config.type == type){
                var vol = me.config.gameState.gs.music/100;
                if(type == me.config.gameState.soundType.EFFECTS){
                    vol = me.config.gameState.gs.soundEffects/100;
                }
                sound.setVolume(vol);
            }

        }
    }

    var playMusic = function(me){
        var fileId = "mainTheme";
        var config = {"file": fileId , "loop": true, "type": me.config.gameState.soundType.MAIN, "isMain": true,"loader":me.config.loader, "gameState":me.config.gameState};
        var mainSound = new Sound(config);
        EventBus.dispatch("addAudioToList",mainSound);
    }

    var persist = function(me){

    }


}
