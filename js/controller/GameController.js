function GameController(config) {
    this.config = config || {};
    GameController.prototype.init = function(){
        this.config.gameState = new GameState();
        this.config.gameState.init();
        this.config.stage = new createjs.Stage("loaderCanvas");
        this.config.popupStage = new createjs.Stage("popupCanvas");
        this.config.smbLoadQueue = new SmbLoadQueue({"stage" : this.config.stage});

        window.onkeydown = onKeyBoardEvents;
        loadEvents(this);
        loadImages(this);

    }
    var loadImages = function(me){
        var _doInit= function(me){ doInit(me)}
       // me.config.smbLoadQueue = new SmbLoadQueue({"stage" : me.config.stage});
       // me.config.smbLoadQueue.loadQueue(Manifest.game, _doInit, me);
        var manifest = [];
        me.config.smbLoadQueue.loadQueue(manifest, _doInit, me);
    }

    var doInit = function(me){
        var config = {"gameState" : me.config.gameState,"stage":me.config.stage};
        var stageConfig = {"gameState" : me.config.gameState,"loader":me.config.loader};

        me.config.serverAPIController = new ServerAPIController(config);
        me.config.serverAPIController.init();

        me.config.menuController = new MenuController({"gameState": me.config.gameState, "loader" :me.config.smbLoadQueue });
        me.config.menuController.init();
        me.config.stageController = new StageController({"gameState": me.config.gameState, "loader" :me.config.smbLoadQueue,
            "serverAPIController":me.config.serverAPIController});
        me.config.stageController.init();
        EventBus.dispatch("exitMenu");

        loginFromCookie(me);
    }
    var getDataFromCookie = function(){
        var myCookie = new Cookie();
        var data = myCookie.getFromCookie();
        if(data.objectId == null || data.objectId == "") return null;
        return data;
    }
    var loginFromCookie = function(me){
        var data = getDataFromCookie();
        if(data != null){
            me.config.gameState.savePlayerDetails(data);
            me.config.serverAPIController.getProgress();
        }
        else{
            //show login screen
            $("#login-wrapper").css("display","table");
        }

    }

    var loadEvents = function(me) {

        var pg = function(){playAsGuest(me)};
        EventBus.addEventListener("playAsGuest", pg);

        var gi = function(data){setGameState(me,data.target)};
        EventBus.addEventListener("setGameState", gi);

        
        var rg = function(){showRegisterScreen()};
        EventBus.addEventListener("showRegisterScreen", rg);  
        
        var lg = function(){userLogin(me)};
        EventBus.addEventListener("userLogin", lg);
        
        var ru = function(){registerUser(me)};
        EventBus.addEventListener("registerUser", ru);
    
        var fp = function(){resetPassword(me)};
        EventBus.addEventListener("resetPassword", fp);

        var lg = function(){logOut(me)};
        EventBus.addEventListener("logOut",lg);

        var hs = function(){highScore(me)};
        EventBus.addEventListener("highScore", hs);

        var ha = function(){hideAll()};
        EventBus.addEventListener("hideAll", ha);
    }
    var logOut = function(me){
        var myCookie = new Cookie();
        myCookie.clear();
        me.config.gameState.clear();
        $("#resumeButton").css("display","none");
        EventBus.dispatch("hideAll");
        $("#login-wrapper").css("display","table");
        //$("#menu-wrapper").css("display","none");

    }
    var highScore = function(me){
        EventBus.dispatch("hideAll");
        $("#score-wrapper").css("display","table");
        //$("#menu-wrapper").css("display","none");
        me.config.serverAPIController.getHighScores(1);
        me.config.serverAPIController.getHighScores(2);
    }

    var hideAll = function(me){
        $("#register-wrapper").css("display","none");
        $("#login-wrapper").css("display","none");
        $("#menu-wrapper").css("display","none");
        $("#score-wrapper").css("display","none");
        $("#canvasHolder").css("display","none");
    }

    var setGameState = function(me,data){
        var result = {};
        var height = data.meters;
        var weekly = data.weeklyMeters;


        result.treesGrown = Math.floor(height/(me.config.gameState.levels * me.config.gameState.trunkHeight));
        result.currentHeight = height%(me.config.gameState.levels * me.config.gameState.trunkHeight);
        result.id = data.objectId;

        me.config.gameState.setGameStatus(result);
        EventBus.dispatch("showMenu");
    }
    var playAsGuest = function(me) {
        $("#login-wrapper").css("display","none");
        $("#logOut-btn").hide();
        EventBus.dispatch("showMenu");
    }
    
    var showRegisterScreen = function() {
            $("#login-wrapper").css("display","none");  
            $(".msg").hide(1);
            $("#register-wrapper").css("display","table");  
    }

    var userLogin = function(me) {
        EventBus.dispatch("hideAll");
        $("#menu-wrapper").css("display","table");
        EventBus.dispatch("alterTickerStatus");
        $(".msg").hide(1);
        var username = $("#user-name").val();
        var password = $("#password").val();
        if((username != "") && (password != "") && validateEmail(username)) {
            var data = {};
            data.username = username;
            data.password = password;
            me.config.serverAPIController.login(data);
      }
      else {
          $(".error-msg").html("invalid login parameters").show(1);
      }    
    }

    function validateEmail(email) { 
        var re = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        return re.test(email);
    }

    var registerUser = function(me) {
        var username = $("#register-user-name").val();
        var password = $("#register-password").val();
        var confirmPassword = $("#confirm-password").val();
        if((username != "") && (password != "") && (confirmPassword != "") && (password == confirmPassword) && validateEmail(username)) {
            $(".msg").hide(1);
            $(".register-msg").show(1);
            var data = {};
            data.username  = username;
            data.password = password;
            me.config.serverAPIController.register(data);
        }
        else{
            $(".error-msg").html("Invalid register details").show(1);
        }
    }


    var resetPassword = function(me) {
        $(".msg").hide(1);
        var email = $("#user-name").val();
        if(validateEmail(email)){
            me.config.serverAPIController.resetPassword(email);
        }else{
            $(".error-msg").html("Enter a valid email Id").show(1);
        }
    }

    var clearStage = function(stage){
        stage.removeAllChildren();
    }



    const ARROW_KEY_LEFT = 37;
    const ARROW_KEY_UP = 38;
    const ARROW_KEY_RIGHT = 39;
    const ARROW_KEY_DOWN = 40;
    const SPACE_KEY_DOWN = 32;
    const ESC_KEY = 27;
    const ONE = 49;

    var onKeyBoardEvents = function(e){
        switch (e.keyCode){

            case ARROW_KEY_LEFT:
               // currentActivePlayer.x --;
                break;
            case ARROW_KEY_UP:
               // currentActivePlayer.y --;
                break;
            case ARROW_KEY_RIGHT:
                //currentActivePlayer.x ++;
                break;
            case ARROW_KEY_DOWN:
                //currentActivePlayer.y ++;
                break;
            case SPACE_KEY_DOWN:
                //currentActivePlayer.gotoAndPlay("jump")
                break;
            case ESC_KEY:
                EventBus.dispatch("pauseGame");
                break;
            case ONE:
                if (e.shiftKey) {
                    console.log("1");
                    EventBus.dispatch("assistText");
        }
                break;

    }
    }





}
