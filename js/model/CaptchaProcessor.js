/**
 * Created by nidhincg on 27/12/14.
 */
(function(){

    var CaptchaProcessor = function(config){
        this.config = config;
        this.currentPass = 0;
        this.maxPass = 1;
        this.captchaOnScreen={};
        this.captchaTextBoxId = "inputText";
        this.captchaPassButton = "passButton";
        this.init();
        cp = this;
    }
    CaptchaProcessor.prototype.init = function(){
        //this.captchaDatasArray = [jsonData];
        this.currentIndex = 0;
        if(this.config.gameState.captchaDatasArray.length == 1){
            this.callCaptchaFromServer();
        }
        activateCaptchaSet(this);
        loadEvents(this);
    }
    var activateUI = function(me){
       // $("#canvasHolder").parent().css({position: 'relative'});
       // $("#canvasHolder").css({top: me.config.canvasHeight, left: me.config.canvasWidth/2- $("#canvasHolder").width()/2, position:'absolute'});
        $(".buttonHolder").css("display","block");
        //document.getElementById(me.captchaPassButton).value = 'PASS('+ me.maxPass + ')';

        $('#inputText').focus();
        disablePassButton(me,false);

    }
    var loadEvents = function(me){
        var pt = function(e){passText(me)};
        EventBus.addEventListener("passText", pt);

        var at = function(){assistText(me)};
        EventBus.addEventListener("assistText",at);
        EventBus.addEventListener("callCaptchaFromServer",this.callCaptchaFromServer);
    }

    CaptchaProcessor.prototype.getCaptchaPlaceHolder = function(coordinateData){
        activateUI(this);
        this.captchaHolder = new createjs.Bitmap();
        this.captchaHolder.x = coordinateData.width/2;
        this.captchaHolder.y = coordinateData.height;
        this.captchaHolder.maxHeight = coordinateData.maxHeight;
        this.captchaHolder.maxWidth = coordinateData.width;
        //activateCaptchaSet(this);
        this.load(this.captchaHolder);

        return this.captchaHolder;
    }
   
    CaptchaProcessor.prototype.load = function(captcha){
        var captchaData = getCaptchaData(this);
        var message = "";
        console.log(captchaData);
        captcha.image = captchaData.url;
        if(this.captchaDatas.local){
            setScale(captcha,captcha.image.width, captcha.image.height);
            captcha.texts = [captchaData.ocr1, captchaData.ocr2];
            EventBus.dispatch("showCommentary", captchaData.message);

        }else{
            var myCords = getCaptchaCoordinates(captchaData.coords);
            captcha.sourceRect = new createjs.Rectangle(myCords.sPoint.x,myCords.sPoint.y,myCords.width,myCords.height);
            setScale(captcha, myCords.width, myCords.height);
            captcha.texts  =captchaData.texts;
        }

        if(captcha.sourceRect){
            captcha.x = this.config.canvasWidth/2 - captcha.sourceRect.width/2;
        }
        else{
            captcha.x = this.config.canvasWidth/2 - captcha.image.width/2;
        }
        
       //captcha.y = captcha.y;//this.config.canvasHeight - captcha.maxHeight;//(captcha.getTransformedBounds().height/2);

              // captcha.datas = captchaData;

        this.captchaOnScreen = captcha;
        ++this.currentIndex;

    };


    var getCaptchaData = function(me){
        checkCaptchaSetting(me);
        var captchaData = me.captchaDatas.differences[me.currentIndex];
        var imageId = null;
        var myText = null;
        if(me.captchaDatas.local){
            imageId = captchaData.image.split(".")[0];
            myText = captchaData.ocr1;
        }else{
            imageId = me.captchaDatas._id;
            myText = captchaData.texts[0];
        }
        captchaData.url  =  me.config.loader.getResult(imageId);
        if(captchaData.url == null){
            me.currentIndex++;
            captchaData = getCaptchaData(me);
        }
        /*if(getCaptcha(me,myText) != null){
            me.currentIndex++;
            captchaData = getCaptchaData(me);
        }*/

        return captchaData;
    }
    /*var getCaptcha = function(me,input){
            var captcha = me.captchaOnScreen;
            if(captcha.texts && (input == captcha.texts[0]||input==captcha.texts[1])){
                return captcha;
            }
        return null;
    }*/
    var checkCaptchaSetting = function(me){
        console.log("index : " + me.currentIndex);
        if(me.currentIndex == Math.floor(me.captchaDatas.differences.length/2)){
            console.log("next load");
            me.callCaptchaFromServer();
        }
        if(me.captchaDatas.local && me.config.loader.localCapthcaSize <= me.currentIndex){
           // console.log(me.config.loader.localCapthcaSize +" entering into loop..")
            activateCaptchaSet(me);
        }
        if(me.currentIndex >= me.captchaDatas.differences.length){
            console.log("change");
            activateCaptchaSet(me);
        }
    }
    var setScale = function(captcha, imgWidth, imgHeight){
        var cW = captcha.maxWidth-20;
        var cH = captcha.maxHeight - 10;
        var sx = cW/imgWidth  > 1 ? 1: cW/imgWidth ;
        var sy = cH/imgHeight > 1 ? 1 : cH/imgHeight ;
        captcha.scaleX = sx;
        captcha.scaleY = sy;
    }
    CaptchaProcessor.prototype.compare = function(){
        var output = {}
        var input = document.getElementById(this.captchaTextBoxId).value;

        //checkRegex(this);

        if(input == ''){
            output.pass = false;
            output.message = "Enter text";
            return output;
        }
        /*var cw = new closestWord(input,this.captchaDatasArray);
        console.log(cw);*/
        //if(cw.match){

        /*if(matchText(this.captchaOnScreen.texts,input)){
            output.pass = true;
            output.message = "Correct";
            this.load();
        }else{
            output.pass = false;
            output.message = "Incorrect";
            this.load();
        }
        clearText(this);
        return output;*/

        this.captchasOnScreen = [];
        this.captchasOnScreen.push(this.captchaOnScreen);
        var cw = new closestWord(input,this.captchasOnScreen);
        if(matchText(this.captchaOnScreen.texts,input)){
            output.pass = true;
            output.message = "correct";
            var captcha = cw.closestOcr;
            this.captchaOnScreen = {};
            output.laneId = captcha.id;
            this.load(captcha);
        }else{
            output.pass = false;
            output.message = "Incorrect";
            var captcha = cw.closestOcr;
            this.captchasOnScreen = {};
            output.laneId = captcha.id;
            this.load(captcha);
        }
        clearText(this);
        return output;
    }

    var checkRegex = function(me){
        var regex3 = /^[^a-z0-9]*$/;
        var regex2 = /[A-Z]+/;
        var regex1 = /[_.,!"']+/;
        var regex4 = /[\s]+/;
        var regex5 = /[\/]+/;
        var str = me.captcha.texts[0];//+me.captcha.texts[1];
        me.captcha.outputText = {};

        /*switch(str){
            case regex2 : if(regex2.test(str)){
                me.captcha.outputText = "Capitalization matters too!!!"; 
                EventBus.dispatch("showOutput");     
            }
            case regex1 : if(regex1.test(str)){
                me.captcha.outputText = "Careful, because punctuation matters!!!";
                EventBus.dispatch("showOutput");   
            }

        }*/
        if(regex1.test(str)){
            me.captcha.outputText = "Careful, because punctuation matters!!!"; 
            EventBus.dispatch("showOutput");   
        }
        if(regex2.test(str)){
            me.captcha.outputText = "Capitalization matters too!!!";  
            EventBus.dispatch("showOutput");  
        }
        if(regex3.test(str)){
            me.captcha.outputText = "Every letter in this word is capital!!!";   
            EventBus.dispatch("showOutput"); 
        }
        if(regex4.test(str)){
            me.captcha.outputText = "Use a space to separate multiple words!!!";   
            EventBus.dispatch("showOutput"); 
        }
        if(regex5.test(str)){
            me.captcha.outputText = "Use / for fractions!!!";   
            EventBus.dispatch("showOutput"); 
        }
        
          
        return me.captcha.outputText;
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

    var getCaptchaCoordinates = function(cord){
        var myCords = {};
        myCords.sPoint  = cord[3];
        myCords.width = cord[2].x - cord[3].x;
        myCords.height = cord[0].y - cord[3].y;
        return myCords;
    }

    var matchText = function(textArray, input){
        for(var i = 0 ; i< textArray.length; i++){
            var text = textArray[i];
            if(text == input){
                return true;
            }
        }
        return false;
    }

    CaptchaProcessor.prototype.callCaptchaFromServer = function(){
        var me = this;
        var url = "http://tiltfactor1.dartmouth.edu:8080/api/page";
       // setTimeout(function(){
            console.log("call from server");
            $.ajax({
            dataType: 'json',
            url: url,
            beforeSend : function(xhr){
                xhr.setRequestHeader('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJHYW1lIiwiaWF0IjoxNDE1MzQxNjMxMjY4LCJpc3MiOiJCSExTZXJ2ZXIifQ.bwRps5G6lAd8tGZKK7nExzhxFrZmAwud0C2RW26sdRM');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("error: "+ textStatus);
            },
            success: function(data){
                console.log(data);
                if(data != null)
                    processCaptchaData(data, me);
            }
        });
      //  }, 1);
    }

    var processCaptchaData = function(data, me){
        var myData = {"url" : data.url, "differences" : data.differences, "_id": data._id, "local": false };
        var _onImageLoad = function(me){
            console.log("after image load");
            me.config.gameState.captchaDatasArray.push(myData);
            if(me.captchaDatas == undefined ||  me.captchaDatas.local){
                activateCaptchaSet(me);
            }
        }
        me.config.loader.load([{src: myData.url + ".jpeg", id: myData._id}], _onImageLoad, me);

    }
    var activateCaptchaSet = function(me){
        me.captchaDatas = me.config.gameState.captchaDatasArray[me.config.gameState.captchaDatasArray.length-1];
        if(!me.captchaDatas.local){
            me.config.gameState.captchaDatasArray.pop();
        }
        me.currentIndex = 0;
    }
    /*CaptchaProcessor.prototype.getCaptchaImageData = function(){
        if(this.captchaDatasArray.length == 1){
            var data = this.captchaDatasArray[0];
            var url = data.url + ".jpg";
            //var image = data.differences[0].image;
            return {"src" : url, "id": data._id };
            return image;
            
        }
        return null;
    }*/
    CaptchaProcessor.prototype.clearCaptchaArray = function(){
        var data = this.captchaDatasArray[this.captchaDatasArray.length-1];
        this.captchaDatasArray = [];
        this.captchaDatasArray.push(jsonData);
        this.captchaDatasArray.push(data);
    }
    var assistText = function(me){
        document.getElementById(me.captchaTextBoxId).value=me.captchaOnScreen.texts[0];
    }


    window.CaptchaProcessor = CaptchaProcessor;

}());
