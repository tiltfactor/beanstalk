/**
 * Created by nidhincg on 27/12/14.
 */
(function(){

    var CaptchaProcessor = function(config){
        this.config = config;
        this.currentIndex = 0;
        this.maxIndex = 6;
        this.currentPass = 0;
        this.maxPass = 1;
        this.captchaTextBoxId = "inputText";
        this.captchaPassButton = "passButton";
        initialize(this);
    }
    var initialize = function(me){
        loadEvents(me);
       // $("#canvasHolder").parent().css({position: 'relative'});
        $("#canvasHolder").css({top: me.config.canvasHeight, left: me.config.canvasWidth/2- $("#canvasHolder").width()/2, position:'absolute'});
        document.getElementById('canvasHolder').style.display = "block";
        document.getElementById(me.captchaPassButton).value = 'Pass('+ me.maxPass + ')';
        $('#inputText').focus();
        disablePassButton(me,false);

    }
    var loadEvents = function(me){
        var pt = function(e){passText(me)};
        EventBus.addEventListener("passText", pt);
    }
    CaptchaProcessor.prototype.getCaptchaPlaceHolder = function(position){
        this.captchaHolder = new createjs.Bitmap();
        this.captchaHolder.ox = position.x;
        this.captchaHolder.y = position.y;
        this.load();
        return this.captchaHolder;
    }
    CaptchaProcessor.prototype.load = function(){
        this.captcha = captchaJson[this.currentIndex];
        this.captchaHolder.image = this.config.loader.getResult(this.captcha.id);
        this.captchaHolder.x = this.captchaHolder.ox - this.captchaHolder.getTransformedBounds().width/2;
        //this.captchaHolder.y = this.captchaHolder.oy - this.captchaHolder.getTransformedBounds().height *this.scaleY;
        if(++this.currentIndex > this.maxIndex){
            this.currentIndex = 0;
        }
    }
    CaptchaProcessor.prototype.compare = function(){
        var output = {}
        var input = document.getElementById(this.captchaTextBoxId).value;
        if(input == ''){
            output.pass = false;
            output.message = "Enter text";
            return output;
        }
        if(input == this.captcha.ocr2){
            output.pass = true;
            output.message = "Correct";
            this.load();
        }else{
            output.pass = false;
            output.message = "Incorrect";
        }
        clearText(this);
        return output;
    }

    var passText = function(me){
        clearText(me);
        if(++me.currentPass >= me.maxPass){
            disablePassButton(me,true);
        }
        me.load();
    }

    var clearText = function(me){
        document.getElementById(me.captchaTextBoxId).value = "";
    }
    var disablePassButton = function(me,status){
        document.getElementById(me.captchaPassButton).disabled = status;
    }


    window.CaptchaProcessor = CaptchaProcessor;

}());
