/**
 * Created by user on 17/12/14.
 */
(function() {

    var Background = function(config){
        this.config = config;
        this.height = 321;
        this.width = 600;
        this.maxLevel = 8;
        this.maxHeight = 2571;
        this.speed = 3;
        this.initialize();
        bg = this;
    }
    Background.prototype = new createjs.Container;
    Background.prototype._initialize = Background.prototype.initialize;

    Background.prototype.initialize = function(){
        this._initialize();

        this.bitmap = new createjs.Bitmap(this.config.loader.getResult("bg"));
        this.bitmap.sourceRect = new createjs.Rectangle(0,this.maxHeight,this.width,this.height);
        this.addChild(this.bitmap);
        loadEvents(this);
        this.reset();

    }
    var loadEvents = function(me){
        me.events = {};
        me.events.tick = function(){tick(me);}
        me.events.tickFallSeed = function(){tickFallSeed(me)};
    }
    Background.prototype.reset = function(){
        this.currentLevel = 1;
        this.bitmap.sourceRect.y = this.maxHeight - this.currentLevel*this.height;
    }
    Background.prototype.setScale = function(scale){
        this.scaleX = scale.sx;
        this.scaleY = scale.sy;
    }
    Background.prototype.getSeedTravelTime = function(){
        var time = (this.maxHeight-this.height)/(this.speed*createjs.Ticker.getFPS());
        return time;
    }
    Background.prototype.getTrunkPosition = function(){
        var point = {};
        point.x = this.x + this.width/2 * this.scaleX ;
        point.y = this.y + this.height * this.scaleY;
        return point;
    }

    Background.prototype.grow = function(){
        //this.currentHeight -= this.height;
        this.currentLevel++;
        if(this.currentLevel <= this.maxLevel){
            createjs.Ticker.addEventListener("tick", this.events.tick);
        }else{
            createjs.Ticker.addEventListener("tick", this.events.tickFallSeed);
        }

        return this.currentLevel;
    }

    Background.prototype.setPosition = function(x,y){
        this.x = x;
        this.y = y ;
    }

    var tick = function (me) {
        if (!createjs.Ticker.getPaused()) {
           //var level = me.currentLevel+1;
            me.bitmap.sourceRect.y -= me.speed;
            if(me.bitmap.sourceRect.y <= me.maxHeight - me.currentLevel*me.height){
                createjs.Ticker.removeEventListener("tick", me.events.tick);
               // me.currentLevel = level;
                if(me.currentLevel == me.maxLevel){
                    me.bitmap.sourceRect.y =0;
                    //me.fallSeed();

                }
            }

        }

    }
    var tickFallSeed = function(me){
        if (!createjs.Ticker.getPaused()) {

            if(me.bitmap.sourceRect.y >= me.maxHeight -me.height){
                createjs.Ticker.removeEventListener("tick", me.events.tickFallSeed);
                me.currentLevel = 1;
                //me.seed.y = me.height;
            }

            me.bitmap.sourceRect.y += me.speed;
        }
    }

    window.Background = Background;

}());