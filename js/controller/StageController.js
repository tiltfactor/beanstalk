function StageController(config) {
    this.config = config || {};
    this.events = {};
    StageController.prototype.init = function () {
        setCanvasAttributes(this);
        this.config.stage = new createjs.Stage("myCanvas");
        this.config.animateToTrunksGrown = false;
        createjs.Ticker.setFPS(30);
        createjs.Ticker.setPaused(true);
        loadEvents(this);
        this.config.trunks = [];

    };
    var loadEvents = function (me) {

        me.events.tick = function(){tick(me);}
        createjs.Ticker.addEventListener("tick", me.events.tick);

        var ng = function(){newGame(me)};
        EventBus.addEventListener("newGame", ng);
        
        var cg = function(){continueGame(me)};
        EventBus.addEventListener("continueGame", cg);

        var at = function(){alterTickerStatus()};
        EventBus.addEventListener("alterTickerStatus",at);

        var cc = function(){compareCaptcha(me)};
        EventBus.addEventListener("compareCaptcha", cc);

        var gn = function(){growNextLevel(me)};
        EventBus.addEventListener("growNextLevel",gn);

        var nt = function(seed){newTreeGrowFromSeed(me,seed)};
        EventBus.addEventListener("newTreeGrowFromSeed", nt);

        var pg = function(){pauseGame(me)};
        EventBus.addEventListener("pauseGame",pg);

        var rg = function(){resumeGame(me)};
        EventBus.addEventListener("resumeGame",rg);

        var so = function(){showOutput(me)};
        EventBus.addEventListener("showOutput",so);
        
        var te = function(){me.showLeafAnimation()};
        EventBus.addEventListener("showLeafAnimation",te);
    }

    var setOutputText = function(me){
        me.outputText = new createjs.Text();
        me.outputText.font = "bold 50px Arial";
        me.outputText.color = "#000";
        me.outputText.ox = me.config.stage.canvas.width/2;
        me.outputText.y = me.config.stage.canvas.height/2 - 50; //height of text
        me.outputText.alpha = 0;
        me.config.stage.addChild(me.outputText);
    }
    var showOutput = function(me){
        me.outputText.text = me.captchaProcessor.captcha.outputText;
        me.outputText.x = me.outputText.ox - me.outputText.getMeasuredWidth()/2;
        createjs.Tween.get(me.outputText).to({alpha:0.4},1000).wait(1000).to({alpha:0},1000);
    }

    var setCanvasAttributes = function(me){
        me.freeBottomAreaY = $("#canvasHolder").outerHeight();
        me.capthaHeight = 75;
        var canvas = document.getElementById("myCanvas");
        me.width  = canvas.width =  window.innerWidth-20;
        me.height = canvas.height =  window.innerHeight-20-me.freeBottomAreaY;
    }

    var newGame = function (me) {
        $("#inputText").val("");
        reset(me);
        loadImages(me);
    }
    
    var continueGame = function (me) {
        if((me.config.gameState.meters %160) > 0) {
            me.config.animateToTrunksGrown = true;
        }
        $("#inputText").val("");
        //setUserScores(me);

        loadImages(me);
    }
    
    var loadImages = function(me){
        var _onImagesLoad= function(me){ onImagesLoad(me)};
        var manifest = Manifest.game;
        //var image = me.captchaProcessor.getCaptchaImageData();
        //if(image != null) manifest.push(image);

        me.config.loader.loadQueue(manifest, _onImagesLoad, me);
    }
    var onImagesLoad = function(me){
        setBackground(me);
        me.captchaProcessor = new CaptchaProcessor({"loader": me.config.loader, "canvasWidth": me.width, "canvasHeight": me.height,"gameState":me.config.gameState});
        initScoreHolders(me);
        EventBus.dispatch("alterTickerStatus");
        //if(me.config.animateToTrunksGrown) {
        //     createjs.Ticker.setFPS(150);
        //     //preGameTrunkAnimation(me);
        //}
        //else {
             growNewTrunk(me);
             loadCaptchaPlaceHolder(me);
        //}
        setGameMessageHolder(me);
        setOutputText(me);
    }
    var reset = function(me){
        me.config.trunks = [];
        me.config.trees = 0;
        me.config.gameState.beanProgress.treesCount=0;
        //me.captchaProcessor.clearCaptchaArray();
        me.config.stage.removeAllChildren();
    }
    var setUserScores = function(me){
        me.config.trunks = [];
       // me.config.trees = me.config.gameState.beanProgress.treesCount;
        me.config.stage.removeAllChildren();
    }
    var setBackground = function(me){
        me.background = new Background({"loader": me.config.loader});
        setScaleFactor(me.background.height, me.background.width, me);
        me.background.setScale(me.scale);
       // me.background.setPosition(0,0);
        me.config.stage.addChild(me.background);

    }
    
    var preGameTrunkAnimation = function(me) {
        growNewTrunk(me);
        var currentTrunk = me.config.trunks[me.config.trunks.length-1];
        var ae = function(){
            me.showLeafAnimation();
            currentTrunk.sprite.removeEventListener("animationend", ae);
        };
        currentTrunk.sprite.addEventListener("animationend", ae);
    }
    
    StageController.prototype.showLeafAnimation = function() {
        if(this.config.animateToTrunksGrown) {
            var currentTrunk = this.config.trunks[this.config.trunks.length-1];
                currentTrunk.growLeaf();
        }
    }
    
    //tree grow process
    var growNewTrunk = function(me){
        var trunk = new sprites.Bamboo({"loader": me.config.loader, "scale" : me.scale});
        var pos = me.background.getTrunkPosition();
        trunk.setPosition(pos.x-trunk.getWidth()/2, pos.y-trunk.getHeight());
        me.config.stage.addChild(trunk);
        me.config.trunks.push(trunk);

    }
    var removeCurrentTrunk = function(me){
        var currentTrunk = getCurrentTrunk(me);
        me.config.stage.removeChild(currentTrunk);
    }
    var getCurrentTrunk = function(me){
        var currentTrunk = me.config.trunks[me.config.trunks.length-1];
        return currentTrunk;
    }
    var growNextLevel = function(me){
        var level = me.background.grow();
        removeCurrentTrunk(me);
        if(level <= me.background.maxLevel){
            if(!me.config.animateToTrunksGrown) {
                EventBus.dispatch("updateBeanProgress", {"trees":me.config.gameState.beanProgress.treesCount, "trunks":me.config.trunks.length});

                growNewTrunk(me);
            }
            else{
               if(gc.API.beanProgress.trunksGroupCompleted > me.config.trunks.length) {
                     preGameTrunkAnimation(me);
                }
                else{
                    createjs.Ticker.setFPS(30);
                    me.config.animateToTrunksGrown = false;
                    growNewTrunk(me);
                    loadCaptchaPlaceHolder(me);
                    
                }
            }
        }else{
            fallSeed(me);
            me.config.trunks = [];
            me.config.gameState.beanProgress.treesCount++;
            updateScore(me);
        }

    }
    var newTreeGrowFromSeed = function(me,seed){
        me.config.stage.removeChild(seed.target);
        growNewTrunk(me);
        me.background.currentLevel = 1;
    }
    var fallSeed = function(me){
        var seed = new Seed({"loader" : me.config.loader, "scale" : me.scale});
        me.config.stage.addChild(seed);
        var trunk = getCurrentTrunk(me);
        seed.setPosition(trunk.getTrunkSPoint());
        seed.setFallPosition(trunk.getTrunkEPoint());
        seed.fall(me.background.getSeedTravelTime());
    }
    StageController.prototype.test = function(){
        fallSeed(this);
    }

    //message holders
    var setGameMessageHolder = function(me){
        me.message = new createjs.Text();
        me.message.font = "bold 50px Arial";
        me.message.color = "#000";
        me.message.ox = me.config.stage.canvas.width/2;
        me.message.y = me.config.stage.canvas.height/2 - 50; //height of text
        me.message.alpha = 0;
        me.config.stage.addChild(me.message);
    }

    var showMessage = function(me,text){
        me.message.text = text;
        me.message.x = me.message.ox - me.message.getMeasuredWidth()/2;
        createjs.Tween.get(me.message).to({alpha:0.4},1000).wait(1000).to({alpha:0},1000);
    }

//captcha area
    var compareCaptcha = function(me){
        var currentTrunk = me.config.trunks[me.config.trunks.length-1];
        var output = me.captchaProcessor.compare();
        if(output.pass){
            currentTrunk.growLeaf();
        }else{
            currentTrunk.fallLeaves();
        }
        showMessage(me,output.message);
    }
    var loadCaptchaPlaceHolder = function(me){
        var holder = me.captchaProcessor.getCaptchaPlaceHolder({"width":me.config.stage.canvas.width,"height":me.config.stage.canvas.height - me.capthaHeight,"maxHeight":me.capthaHeight})
        me.config.stage.addChild(holder);
    }
    //ticker
    var tick = function (me) {
        if(!createjs.Ticker.getPaused()){
            me.config.stage.update();
        }
    }
    var alterTickerStatus = function(){
        createjs.Ticker.setPaused(!createjs.Ticker.getPaused());
    }


    var setScaleFactor = function(bgHeight, bgWidth, me){
       me.scale = {"sx":1,"sy" : 1};
       var availableHeight = me.height - me.capthaHeight;
       var availableWidth = me.width;
       me.scale.sy = availableHeight/bgHeight;
       me.scale.sx = availableWidth/bgWidth;
    }

    var resumeGame = function (me) {
        EventBus.dispatch("exitMenu");
        EventBus.dispatch("alterTickerStatus");
        $("#canvasHolder").css("display","block");
        //createjs.Ticker.addEventListener("tick", me.events.tick);
    }

    var pauseGame = function (me) {
        if(!createjs.Ticker.getPaused()){
            me.config.gameState.gs.currentState = me.config.gameState.gs.States.RUN;
            EventBus.dispatch("alterTickerStatus");
            EventBus.dispatch("showMenu");
            $("#canvasHolder").css("display","none");
        }
    }
    var initScoreHolders = function(me){
        me.trees = new createjs.Text("Trees grown : "+me.config.gameState.beanProgress.treesCount, "20px Arial", "#000000");
        me.trees.setTransform(me.width-me.trees.getMeasuredWidth()-10,me.trees.getMeasuredHeight(),1,1);
        me.config.stage.addChild(me.trees);
    }
    var updateScore = function(me){
        me.trees.text = "Trees grown : "+me.config.gameState.beanProgress.treesCount;
        EventBus.dispatch("updateBeanProgress", {"trees":me.config.gameState.beanProgress.treesCount, "trunks":me.config.trunks.length});
    }


}