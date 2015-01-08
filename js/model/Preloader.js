/**
 * Created by Abhilash on 27/11/14.
 */
(function () {

    window.ui = window.ui || {};

    var Preloader = function (config) {
        this.config = config;
       // this.stage = stage;
        this.fillColor = "#AFA";
        this.strokeColor = "#000";
        this.initialize();
    };
    var p = Preloader.prototype = new createjs.Container();

    p.width = 400;
    p.height = 40;
    p.fillColor;
    p.strokeColor;
    p.bar;

    p.Container_initialize = p.initialize;
    p.initialize = function () {
        this.Container_initialize();
        this.drawPreloader();
        this.setMessage("Loading...");
        this.setPosition(this);
        //this.setPosition(this.stage);
    };

    p.drawPreloader = function () {
        var outline = new createjs.Shape();
        outline.graphics.beginStroke(this.strokeColor);
        outline.graphics.drawRect(0, 0, this.width, this.height);
        this.bar = new createjs.Shape();
        this.bar.graphics.beginFill(this.fillColor);
        this.bar.graphics.drawRect(0, 0, this.width, this.height);
        this.bar.scaleX = 0;
        this.addChild(this.bar, outline);


    };

    p.update = function (perc) {
        perc = perc > 1 ? 1 : perc;
        this.bar.scaleX = perc;
    }
    p.setPosition=function(me){
        this.x = (me.config.stage.canvas.width / 2) - (me.width / 2);
        this.y =(me.config.stage.canvas.height / 2) - (me.height / 2);
    };
    p.setMessage=function(text){
        var msgField = new createjs.Text(text,"20px Arial","#ff770");
        msgField.y = this.y-30;
        msgField.x = this.x+150;
        this.addChild(msgField);
    };
    //p.setBackground=function(){
    //    var bmp = new createjs.Bitmap("shapes/home.jpg");
    //    this.addChild(bmp);
    //};

    window.ui.Preloader = Preloader;

}());