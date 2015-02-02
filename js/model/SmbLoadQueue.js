/**
 * Created by Nidhin C G on 1/12/14.
 */
(function () {

    var SmbLoadQueue =  function(config) {
        this.config = config;
        this.initialize();
    };
    createjs.LoadQueue.loadTimeout=2000000;
    SmbLoadQueue.prototype  = new createjs.LoadQueue(false,null,false);
    SmbLoadQueue.prototype._initialize = SmbLoadQueue.prototype.initialize;
    SmbLoadQueue.prototype.initialize = function(){
        //this.setUseXHR(true);
        this._initialize();
        this.events = {};
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
        me.config.stage.addChild(me.preLoader);
        me.events.loaderEvent =  function(e){ updateLoader(e,me)}
        me.addEventListener("progress",me.events.loaderEvent);
    }

    SmbLoadQueue.prototype.load = function(manifest, callback, ob){
        if(manifest.length!= 0){
            console.log("image load");
            this.loadManifest(manifest);
            var me = this;
            this.events.loadComplete = function(){
                me.removeEventListener("complete", me.events.loadComplete);
                callback(ob);
            }
            this.addEventListener("complete", this.events.loadComplete);
        }else{
            callback(ob);
        }

    }

    SmbLoadQueue.prototype.loadQueue = function(manifest, callback, ob){
        if(manifest.length != 0){
            var me = this;
            showLoading(me);
            this.loadManifest(manifest);
            this.events.click = function(){ loadComplete(callback,ob,me); }
            this.addEventListener("complete", this.events.click);
        }else{
            callback(ob);
        }

    }
    var loadComplete = function(callback, ob, me){
        console.log("hii");
        me.removeEventListener("complete",me.events.click);
        me.removeEventListener("progress",  me.events.loaderEvent);
        callback(ob);
    }

    window.SmbLoadQueue = SmbLoadQueue;

}());