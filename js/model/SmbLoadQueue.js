/**
 * Created by Nidhin C G on 1/12/14.
 */
(function () {

    var SmbLoadQueue =  function(config) {
        this.config = config;
        this.initialize();
    };
    createjs.LoadQueue.loadTimeout=2000000;
    //SmbLoadQueue.prototype  = new createjs.LoadQueue(false,"",false);
    SmbLoadQueue.prototype._initialize = SmbLoadQueue.prototype.initialize;
    SmbLoadQueue.prototype.initialize = function(){
        //this.setUseXHR(true);
        //this._initialize();
        this.fg_loader = new createjs.LoadQueue(true,"",false);
        this.bg_loader = new createjs.LoadQueue(false,"",false);
        this.localCapthcaSize = 8;
        this.active = false;
        this.captchaLoad = false;
        this.events = {};
        this.loader = new createjs.LoadQueue(false,"",false);

        var me = this;
        setTimeout(function(){loadLocalImages(me)}, 10000);
    };

    var updateLoader =function(e, me){
        me.preLoader.update(e.progress);
        me.config.stage.update();
        if(e.progress == 1){
            me.config.stage.removeAllChildren();
            me.config.stage.update();
        }
    };

    var showLoading = function(me){
        me.preLoader = new ui.Preloader({stage : me.config.stage});
        $("#loaderDiv").show();
        me.config.stage.addChild(me.preLoader);
        me.events.loaderEvent =  function(e){ updateLoader(e,me)}
        me.fg_loader.addEventListener("progress",me.events.loaderEvent);
    }
    var loadLocalImages = function(me){
        var manifest = [];
        if(me.localCapthcaSize + 10 <= localData.differences.length){

            if(!me.active && !me.captchaLoad){
                me.captchaLoad = true;
                for(var i = me.localCapthcaSize ; i<= me.localCapthcaSize+10 ; i++){
                    var img = {};
                    var name = zeroFill(i,3);
                    img.src = "shapes/captcha/"+name+".png";
                    img.id = name;
                    manifest.push(img);
                }
                me.localCapthcaSize += 10;
                me.fg_loader.loadManifest(manifest);
                me.fg_loader.addEventListener("complete", function(){
                    me.captchaLoad = false;
                    //console.log("-------------> loaded "+me.localCapthcaSize )
                });
            }


            setTimeout(function(){loadLocalImages(me)}, 10000);
           // console.log("local images loading"+ me.localCapthcaSize);
        }
    }
    SmbLoadQueue.prototype.getbgloader = function(){
        return this.bg_loader;
    }
    SmbLoadQueue.prototype.getfgloader = function(){
        return this.fg_loader;
    }
    SmbLoadQueue.prototype.getResult = function(imgID){
        var url  =  this.fg_loader.getResult(imgID);
        if(!url){
            url = this.bg_loader.getResult(imgID);
        }
        return url;
    }
    SmbLoadQueue.prototype.load = function(manifest, callback, ob){
        if(manifest.length!= 0){
            console.log("image load");
            this.bg_loader.loadManifest(manifest);
            var me = this;
            this.events.loadComplete = function(){
                me.active = false;
                me.bg_loader.removeEventListener("complete", me.events.loadComplete);
                callback(ob);
            }
            this.bg_loader.addEventListener("complete", this.events.loadComplete);
        }else{
            callback(ob);
        }

    }

    SmbLoadQueue.prototype.loadQueue = function(manifest, callback, ob){
        if(manifest.length != 0){
            var me = this;
            this.active = true;
            showLoading(me);
            this.fg_loader.loadManifest(manifest);
            this.events.click = function(){ loadComplete(callback,ob,me); }
            this.fg_loader.addEventListener("complete", this.events.click);
        }else{
            callback(ob);
        }

    }
    var loadComplete = function(callback, ob, me){
        console.log("hii");
        me.fg_loader.removeEventListener("complete",me.events.click);
        me.fg_loader.removeEventListener("progress",  me.events.loaderEvent);
        callback(ob);
    }
    // creates number in format 000
    var zeroFill= function( number, width){
        width -= number.toString().length;
        if ( width > 0 )
        { return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number; }

        return number + "";
    }

    window.SmbLoadQueue = SmbLoadQueue;

}());