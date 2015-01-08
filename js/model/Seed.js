/**
 * Created by nidhincg on 26/12/14.
 */
(function(){
    var Seed = function(config){
        this.config = config;
        this.initialize();
    }
    Seed.prototype = new createjs.Bitmap;
    Seed.prototype._initialize = Seed.prototype.initialize;

    Seed.prototype.initialize = function(){
        this._initialize(this.config.loader.getResult("seed"));
        this.setScale(this.config.scale);
    };
    Seed.prototype.fall = function(time){
        var me = this;
        createjs.Tween.get(this)
            .to({x:this.fallPointX, y:this.fallPointY }, time*1000)
            .call(function(){handleComplete(me)})
    }
    var handleComplete = function(me){
        createjs.Tween.get(me)
            .to({y:me.y-15},800)
            .to({y:me.y},600,createjs.Ease.bounceIn())
            .call(function(){callNewTree(me)});
    }
    var callNewTree = function(me){
        createjs.Tween.removeTweens(me);
        EventBus.dispatch("newTreeGrowFromSeed",me);
    }
    Seed.prototype.setFallPosition = function(point){
        this.fallPointX = point.x;
        this.fallPointY = point.y-this.getTransformedBounds().height;
    }
    Seed.prototype.setPosition = function(point){
        this.x = point.x;
        this.y = point.y;
    }
    Seed.prototype.setScale = function(scale){
        this.scaleX = scale.sx;
        this.scaleY = scale.sy;
    }
    window.Seed = Seed;

}());
