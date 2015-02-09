/**
 * Created by Abhilash on 17/12/14.
 */
(function () {
    window.sprites = window.sprites || {};
    var Leaf =  function(config) {
        this.config = config||{};
        this.initialize(config);
    };
    Leaf.prototype = new createjs.Container();
    Leaf.prototype.Container_initialize = Leaf.prototype.initialize;

    Leaf.prototype.initialize = function(){
        this.Container_initialize();
        this.alpha = 0;
        generateBottomLeaf(this);
        generateTopLeaf(this);
        setDirection(this);
        this.setScale(1,1);
        addEvents(this);
    };
    var addEvents = function(me){
        me.myAnimationEnd = function(){ onAnimationEnd(me)};
        me.bottomThreeLeafAnimationEnd = function(){ bottomThreeLeafAnimationEnd(me)};
    }
    var setDirection = function(me){
        var dir = [1, -1];
        me.direction = dir[Math.floor(Math.random()*dir.length)];
    }
    Leaf.prototype.setPosition = function(x,y){
        this.x = x -(this.direction*10);
        this.y = y;
    }
    Leaf.prototype.setScale = function(sx,sy){
        this.scaleX = sx*this.direction;
        this.scaleY = sy;
    };
    Leaf.prototype.grow=function(){
        this.alpha = 1;
        this.topLeaf.gotoAndPlay("grow");
        this.bottomLeaf.gotoAndPlay("grow");
        if(this.config.id == 0){
            this.bottomLeaf.addEventListener("animationend",this.myAnimationEnd);
        }
        else{
            this.bottomLeaf.addEventListener("animationend",this.bottomThreeLeafAnimationEnd);
        }
    }

    Leaf.prototype.fall = function(){
        this.bottomLeaf.gotoAndPlay("fall");
        this.topLeaf.gotoAndPlay("fall");
    }
    var generateTopLeaf=function(me){
        var data = {
            "images":[me.config.loader.getResult("up")],
            "frames":{ "regX":0,"regY":0,"height":13,"width":44,count:16},
            "animations":{"grow":[0,15,"complete",0.3],"complete":[15],"end": [-1], "fall" : [0,15,"end",0.9]}
        };
        var sheet = new createjs.SpriteSheet(data);

        me.topLeaf = new createjs.Sprite(sheet,"end");
        me.topLeaf.spriteSheet._data.fall.frames.reverse();
        me.topLeaf.regX= me.topLeaf.regY = 15;
        me.addChild(me.topLeaf);
    };
    var generateBottomLeaf = function(me){
        var data = {
            "images":[me.config.loader.getResult("down")],
            "frames":{"regX":0,"regY":0,"height":35,"width":30,count:16 },
            "animations":{"grow":[0,15,"complete",0.3],"complete":[15],"end": [0], "fall" : [0,15,"end",0.9]}
        };
        var sheet = new createjs.SpriteSheet(data);
        me.bottomLeaf = new createjs.Sprite(sheet,"end");
        me.bottomLeaf.spriteSheet._data.fall.frames.reverse();
        me.addChild(me.bottomLeaf);
    };

    var onAnimationEnd = function(me){
        me.bottomLeaf.removeEventListener("animationend",me.myAnimationEnd);
        EventBus.dispatch("growNextLevel");
    }
    
    var bottomThreeLeafAnimationEnd = function(me){
        me.bottomLeaf.removeEventListener("animationend",me.bottomThreeLeafAnimationEnd);
        EventBus.dispatch("showLeafAnimation");
    }
    
    window.sprites.Leaf = Leaf;
}());