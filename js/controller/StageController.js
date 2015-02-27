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
        this.continue = false;

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

        var so = function(){showOutput(me)};
        EventBus.addEventListener("showOutput",so);

        var cb = function(){closeButtonClick(me)};
        EventBus.addEventListener("closeButtonClick",cb);

        var di = function(){disableInputText()};
        EventBus.addEventListener("disableInputText",di);

        var ei = function(){enableInputText()};
        EventBus.addEventListener("enableInputText",ei);
        
    }

    var disableInputText = function(){
        $("#canvasHolder").hide(1);
    }
    var enableInputText = function(){
        $("#canvasHolder").show(1);
        $("#inputText").focus();
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
        me.freeBottomAreaY = $("#canvasHolder").outerHeight() + $("#topButtonHolder").outerHeight();
        me.capthaHeight = 75;
        me.freeLeftAreaX = 0;
        var canvas = document.getElementById("myCanvas");
        me.width = canvas.width = window.innerWidth;
        var h = me.width * 3/4;
        if (window.innerHeight-me.freeBottomAreaY - me.capthaHeight < h){
            h = window.innerHeight-me.freeBottomAreaY;
            me.width = canvas.width = (h * 4/3);
        }
        me.height = canvas.height = h;
        me.freeTopAreaY = me.height/2;
        $("#canvasHolder").css({top: me.height+$("#topButtonHolder").outerHeight(), position:'absolute'});
    }

    var startGame = function (me) {
        EventBus.dispatch("alterTickerStatus");
        EventBus.dispatch("hideAll");
        $("#myCanvas").show();
        $("#canvasHolder").show();
        $("#inputText").val("");
        reset(me);
        loadImages(me);
    }
    var continueGame = function(me){
        if(me.continue){
            me.continue = false;
            EventBus.dispatch("hideAll");
            EventBus.dispatch("alterTickerStatus");
            $("#canvasHolder").show();
            $("#inputText").focus();

            $("#myCanvas").show();
        }else{
            startGame(me);
        }

    }
    var newGame = function(me){
        me.config.gameState.currentHeight = 0;
        me.config.gameState.treesGrown = 0;
        startGame(me);
        if(me.config.gameState.userId != null){
            me.config.serverAPIController.save();
        }
    }
    var closeButtonClick = function(me){
        if(!createjs.Ticker.getPaused()){
            me.continue = true;
            EventBus.dispatch("alterTickerStatus");
            EventBus.dispatch("hideAll");
            EventBus.dispatch("showMenu", true);
        }
    }

    var loadImages = function(me){
        var _onImagesLoad= function(me){ onImagesLoad(me)};
        var manifest = [];
       /* var manifest = Manifest.game;
        me.config.loader.loadQueue(manifest, _onImagesLoad, me);*/

        if(!me.config.gameState.level){
            me.config.gameState.level = true;
            var manifest = Manifest.game;
            me.config.loader.loadQueue(manifest, _onImagesLoad, me, me.config.gameState.currentLevel);
        }else{
            me.config.loader.loadQueue(manifest, _onImagesLoad, me, me.config.gameState.currentLevel);
        }
    }
    var onImagesLoad = function(me){

        setBackground(me);
        me.captchaProcessor = new CaptchaProcessor({"loader": me.config.loader, "canvasWidth": me.width, "canvasHeight": me.height,"gameState":me.config.gameState});
        initScoreHolders(me);
        //EventBus.dispatch("alterTickerStatus");

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
        me.config.stage.update();
    }
    var setBackground = function(me){
        me.background = new Background({"loader": me.config.loader});
        setScaleFactor(me.background.height, me.background.width, me);
        me.background.setScale(me.scale);
       // me.background.setPosition(0,0);
        me.config.stage.addChild(me.background);

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
        EventBus.dispatch("disableInputText");
        var level = me.background.grow();
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
        /*if(currentTrunk.currentLeaf>=currentTrunk.totalLeaves-1){
            EventBus.dispatch("disableInputText");
        }*/
        if(output.pass){
            currentTrunk.growLeaf();
        }else{
            if(currentTrunk.currentLeaf<currentTrunk.totalLeaves){
                currentTrunk.fallLeaves();
            }
        }
        showMessage(me,output.message);
        $('#inputText').focus();
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
    var initScoreHolders = function(me){
        $("#trees-grown-bar label").html(me.config.gameState.treesGrown);
    }
    var updateScore = function(me){
        $("#trees-grown-bar label").html(me.config.gameState.treesGrown);
        EventBus.dispatch("updateBeanProgress", {"trees":me.config.trees, "trunks":me.config.trunks.length});
    }
}