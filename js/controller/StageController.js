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

    };
    var loadEvents = function (me) {        
        
        me.events.tick = function(){tick(me);}
        createjs.Ticker.addEventListener("tick", me.events.tick);

        var sg = function(){startGame(me)};
        EventBus.addEventListener("startGame", sg);

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

        var bb = function(){backButtonClick(me)};
        EventBus.addEventListener("backButtonClick",bb);

        var bl = function(){backToLogin()};
        EventBus.addEventListener("backToLogin",bl);
        
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
        me.freeBottomAreaY = $("#canvasHolder").outerHeight() +  $("#topButtonHolder").outerHeight();
        me.capthaHeight = 75;
        me.freeLeftAreaX = 0;
        var canvas = document.getElementById("myCanvas");
        me.width  = canvas.width =  window.innerWidth;
        var h = me.width * 3/4;
        if (window.innerHeight-me.freeBottomAreaY < h){
            h = window.innerHeight-me.freeBottomAreaY;
            me.width  = canvas.width = (h * 4/3);
        }
        me.height = canvas.height =  h;
        me.freeTopAreaY = me.height/2;
    }

    var startGame = function (me) {
        
        $("#inputText").val("");
        reset(me);
        loadImages(me);
    }
    var continueGame = function(me){    
        EventBus.dispatch("startGame");
    }
    var newGame = function(me){
        me.config.gameState.currentHeight = 0;
        me.config.gameState.treesGrown = 0;
        EventBus.dispatch("startGame");
    }
    var backButtonClick = function(me){
        $("#score-wrapper").css("display","none");
        $("#menu-wrapper").css("display","table");
    }
    var backToLogin = function(){
        EventBus.dispatch("hideAll");
        $("#login-wrapper").css("display","table");
    }
    var loadImages = function(me){
        var _onImagesLoad= function(me){ onImagesLoad(me)};
        var manifest = Manifest.game;
        me.config.loader.loadQueue(manifest, _onImagesLoad, me);
    }
    var onImagesLoad = function(me){

        setBackground(me);
        me.captchaProcessor = new CaptchaProcessor({"loader": me.config.loader, "canvasWidth": me.width, "canvasHeight": me.height,"gameState":me.config.gameState});
        initScoreHolders(me);
        EventBus.dispatch("alterTickerStatus");
        
        var preloadTrunk = me.config.gameState.currentHeight/me.config.gameState.trunkHeight;
        if(preloadTrunk!=0){
            me.background.setLevelHeight(preloadTrunk+1);
        }
        growNewTrunk(me);
        loadCaptchaPlaceHolder(me);
        setGameMessageHolder(me);
        setOutputText(me);
    }
    var reset = function(me){
        me.config.trunks = [];
        //me.config.trees = 0;
        //me.captchaProcessor.clearCaptchaArray();
        me.config.stage.removeAllChildren();
    }
    var setBackground = function(me){
        me.background = new Background({"loader": me.config.loader});
        setScaleFactor(me.background.height, me.background.width, me);
        me.background.setScale(me.scale);
       // me.background.setPosition(0,0);
        me.config.stage.addChild(me.background);

    }
    
    /*var preGameTrunkAnimation = function(me) {
        growNewTrunk(me);
        var currentTrunk = me.config.trunks[me.config.trunks.length-1];
        var ae = function(){
            me.showLeafAnimation();
            currentTrunk.sprite.removeEventListener("animationend", ae);
        };
        currentTrunk.sprite.addEventListener("animationend", ae);
    }*/
    
    /*StageController.prototype.showLeafAnimation = function() {
        if(this.config.animateToTrunksGrown) {
            var currentTrunk = this.config.trunks[this.config.trunks.length-1];
                currentTrunk.growLeaf();
        }
    }*/
    
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

        //me.config.serverAPIController.save();
       // var level = 1;//me.background.grow();
        removeCurrentTrunk(me);
        if(level <= me.background.maxLevel){
            growNewTrunk(me);
            me.config.gameState.currentHeight+= me.config.gameState.trunkHeight;
        }else{
            me.config.gameState.currentHeight = 0;
            me.config.gameState.treesGrown++;
            fallSeed(me);
            me.config.trunks = [];
            me.config.trees++;
            updateScore(me);
        }
        me.config.gameState.weeklyMeters += me.config.gameState.trunkHeight;
        me.config.serverAPIController.save();


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
        $(".buttonHolder").css("display","block");
        $("#inputText").val("");
        //createjs.Ticker.addEventListener("tick", me.events.tick);
    }
    var pauseGame = function (me) {
        if(!createjs.Ticker.getPaused()){
            me.config.gameState.gs.currentState = me.config.gameState.gs.States.RUN;
            EventBus.dispatch("alterTickerStatus");
            EventBus.dispatch("showMenu");
            $(".buttonHolder").css("display","none");
            $("#continueButton").css("display","none");
        }
    }
    var initScoreHolders = function(me){
        $("#trees-grown-bar label").html(me.config.gameState.treesGrown);
    }
    var updateScore = function(me){
        $("#trees-grown-bar label").html(me.config.gameState.treesGrown);
        EventBus.dispatch("updateBeanProgress", {"trees":me.config.trees, "trunks":me.config.trunks.length});
    }
}