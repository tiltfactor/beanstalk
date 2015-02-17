/**
 * Created by user on 17/12/14.
 */
(function() {

    window.sprites = window.sprites || {};

    var Bamboo = function(config){
        this.config = config;
        this.initialize();

    }
    Bamboo.prototype = new createjs.Container;
    Bamboo.prototype._initialize = Bamboo.prototype.initialize;

    Bamboo.prototype.initialize = function(){
        this._initialize();

        var data = {
            "images":[this.config.loader.getResult("bamboo")],
            "frames":{ "regX":0,"regY":0,"height":303,"width":62.5,count:32 },
            "animations":{"grow":[0,31,"complete",0.3],"complete":[31]}
        };
        var spriteSheet = new createjs.SpriteSheet(data);
        this.sprite = new createjs.Sprite(spriteSheet, "grow");
        this.addChild(this.sprite);
        this.leaves = [];
        this.setScale(this.config.scale);
        reset(this);
        drawLeaf(this);
        addEvents(this);
        this.children[0].addEventListener("animationend",this.children[0].myAnimationEnd);
    }
    var addEvents = function(me){
        me.children[0].myAnimationEnd = function(){ onAnimationEnd(me)};
    }
    Bamboo.prototype.setScale = function(scale){
        this.scaleX = scale.sx;
        this.scaleY = scale.sy;
    }

    Bamboo.prototype.getHeight = function(){
        return this.getTransformedBounds().height;
    }
    Bamboo.prototype.getWidth = function(){
        return this.getTransformedBounds().width;
    }
    Bamboo.prototype.getTrunkSPoint = function(){
        var point = {};
        point.x = this.x+ this.sprite.spriteSheet._frameWidth * this.scaleX /2;
        point.y = this.y;
        return point;
    }
    Bamboo.prototype.getTrunkEPoint = function(){
        var point = {};
        point.x = this.x+ this.sprite.spriteSheet._frameWidth/2 * this.scaleX;
        point.y = this.y+this.sprite.spriteSheet._frameHeight * this.scaleY;
        return point;
    }

    var reset = function(me){
        me.currentLeaf = 0;
        me.totalLeaves = 4;
        //me.grownLeafs = 0;
    }

    /*Bamboo.prototype.grow=function(){
        this.children[0].gotoAndPlay("grow");
        this.leaves[0].alpha=this.leaves[1].alpha=this.leaves[2].alpha=this.leaves[3].alpha=0;
        this.children[0].addEventListener("animationend",this.children[0].myAnimationEnd);
    };*/
    Bamboo.prototype.setPosition = function(x,y){
        this.x = x ;
        this.y = y ;
    }
    var onAnimationEnd = function(me){
        me.children[0].removeEventListener("animationend",me.children[0].myAnimationEnd);
        EventBus.dispatch("enableInputText");
    }
    var drawLeaf = function(me){
        for(var i= me.totalLeaves-1;i>=0;i--){
            var leaf = new sprites.Leaf({"loader": me.config.loader, "id" : i});
            if(leaf.direction == 1){
                leaf.setPosition(0,75*i);
            }else{
                leaf.setPosition(me.sprite.spriteSheet._frameWidth,75*i);
            }
            me.leaves.push(leaf);
            me.addChild(leaf);
        }
    }

    Bamboo.prototype.growLeaf=function(){
        var leaf = this.leaves[this.currentLeaf++];
        leaf.grow();
    }

    Bamboo.prototype.fallLeaves = function(){
        for(var i = 0; i<this.currentLeaf; i++){
            var leaf = this.leaves[i];
            leaf.fall();
        }
        this.currentLeaf=0;
    }


    window.sprites.Bamboo = Bamboo;

}());