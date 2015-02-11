function GameController(config) {
    this.config = config || {};
    GameController.prototype.init = function(){
        this.config.gameState = new GameState();
        this.config.gameState.init();
        this.config.stage = new createjs.Stage("loaderCanvas");
        this.config.popupStage = new createjs.Stage("popupCanvas");
        this.config.smbLoadQueue = new SmbLoadQueue({"stage" : this.config.stage});


        window.onkeydown = onKeyBoardEvents;

        var config = {"gameState" : this.config.gameState,"stage":this.config.stage};
        var stageConfig = {"gameState" : this.config.gameState,"loader":this.config.loader};


        this.config.menuController = new MenuController({"gameState": this.config.gameState, "loader" :this.config.smbLoadQueue });
        this.config.menuController.init();
        this.config.stageController = new StageController({"gameState": this.config.gameState, "loader" :this.config.smbLoadQueue});
        this.config.stageController.init();

        this.config.serverAPIController = new ServerAPIController(config);
        this.config.serverAPIController.init();
        EventBus.dispatch("exitMenu");

        loginFromCookie(this);

//        this.API = {};
//        this.API.baseUrl = "https://api.parse.com";
//        this.API.parseApplicationId = "1GtX8QZUiToSo4uMitz964PZRj9epEWREyKelFg5";
//        this.API.parseRestAPIKey = "DhRAPRaHunZo6CRxPfPoGG5I1qdsRwfakBTpk88C";
//        checkLogin(this);
        loadEvents(this);
    }

    var loginFromCookie = function(me){
        var myCookie = new Cookie();
        var data = myCookie.getFromCookie();
        if(data.objectId != ""){
            $("#login-wrapper").css("display","none");
            me.config.gameState.saveCookieDetails(data);
            me.config.serverAPIController.getProgress();
            EventBus.dispatch("showMenu");
        }
        else{
            //show login screen
            $("#login-wrapper").css("display","table");
        }

    }

    var login = function(me,data){
            var username = $("#user-name").val();
            var password = $("#password").val();
            var data = {"username": username, "password" : password};
            me.config.serverAPIController.login(data);

    }

    var onLoginSuccess = function(me,response){
        //hide loginscreen
        me.config.gameState.saveLoginDetails(response);
        showMainMenu();

    }

    var showMainMenu = function(){

    }

    //var getDataFromCookie = function(){
    //    var myCookie = new Cookie();
    //    var data = myCookie.getFromCookie();
    //    if(data.userId == null || data.userId == "") return null;
    //    return data;
    //}
    //
    //
    //
    //
    //
    //
    //
    //var checkLogin = function(me) {
    //    var isLoggedIn = getCookie("username");
    //    if(isLoggedIn) {
    //         getProgress(me);
    //    }
    //    else {
    //        $("#login-wrapper").css("display","table");
    //    }
    //}
    
    //var getCookie = function(cookieName) {
    //var nameEQ = cookieName + "=";
    //var ca = document.cookie.split(';');
    //for(var i=0;i < ca.length;i++) {
		//var c = ca[i];
		//while (c.charAt(0)==' ') c = c.substring(1,c.length);
		//if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    //}
    //return null;
    //}

    var loadEvents = function(me) {
        var up = function(trees){updateBeanProgress(me,trees.target)};
        EventBus.addEventListener("updateBeanProgress", up);       
        
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
    }
    var logOut = function(){
        var myCookie = new Cookie();
        myCookie.clear();
        $("#login-wrapper").css("display","table");
    }
    var setGameState = function(me,data){
        me.config.gameState.setGameStatus(data)
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
        var username = $("#user-name").val();
        var password = $("#password").val();
        if((username != "") && (password != "") && validateEmail(username)) {
            var data = {};
            data.username = username;
            data.password = password;
            me.config.serverAPIController.login(data);
      }
      else {
          $(".error-msg").show(1);
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
            $(".error-msg").show(1);
        }   
    }

    var setPlayerRole = function(me) {
        $.ajax({
            url: me.API.baseUrl+"/1/roles/9a6z1gOMX1",
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : me.API.parseApplicationId,
                'X-Parse-REST-API-Key': me.API.parseRestAPIKey
            },
            type: "PUT",
            data: 
                    JSON.stringify({ 
                "users":{
                    "__op": "AddRelation",
                    "objects": [
                        {
                            "__type": "Pointer",
                            "className": "_User",
                            "objectId": getCookie("objectId")
                        }
                    ]
                }}),
            success: function() { 
                setProgress(me);
            },
                    error: function() {

                    }
        });  
    }

    var resetPassword = function(me) {
         $(".msg").hide(1);
         var username = $("#user-name").val();
         if(validateEmail(username)) {
            $.ajax({
                url: me.API.baseUrl+"/1/requestPasswordReset",
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id' : me.API.parseApplicationId,
                    'X-Parse-REST-API-Key': me.API.parseRestAPIKey
                },
                type: "POST",
                data: 
                        JSON.stringify({ 
                    "email": username
                    }),
                success: function() { 
                    $(".reset-password-msg").show(1);
                },
                        error: function() {
                    $(".error-msg").show(1);
                }
            });              
         } 
         else{
             $(".error-msg").show(1);
         }
    }            

    //var getProgress = function(me) {
    //    var params = 'where='+ JSON.stringify({"user":{"__type":"Pointer","className":"_User","objectId":getCookie("objectId")}});
    //    params = encodeURI(params);
    //    $.ajax({
    //        url: me.API.baseUrl+"/1/classes/BeanProgress/?" + params,
    //        headers: {
    //            'Content-Type': 'application/json',
    //            'X-Parse-Application-Id' : me.API.parseApplicationId,
    //            'X-Parse-REST-API-Key': me.API.parseRestAPIKey,
    //            'X-Parse-Session-Token': getCookie("sessionTocken")
    //        },
    //        type: "GET",
    //        success: function(params) {
    //            me.API.progressId = params.results[0].objectId;
    //            me.API.treesCount = params.results[0].tree;
    //            me.API.metersGrown = params.results[0].meters;
    //            if((me.API.metersGrown > 0) || (me.API.treesCount > 0)) {
    //                $("#continueButton").show(1);
    //                $("#new-game").hide(1);
    //            }
    //            gameInit(me);
    //        },
    //                error: function() {
    //
    //                }
    //    });
    //}
    //
    //var setProgress = function(me) {
    //    var trees = 0;
    //    var metersGrown = 0;
    //    $.ajax({
    //        url: me.API.baseUrl+"/1/classes/BeanProgress/",
    //        headers: {
    //            'Content-Type': 'application/json',
    //            'X-Parse-Application-Id' : me.API.parseApplicationId,
    //            'X-Parse-REST-API-Key': me.API.parseRestAPIKey,
    //            'X-Parse-Session-Token': getCookie("sessionTocken")
    //        },
    //        type: "POST",
    //        data: JSON.stringify({
    //            "meters":metersGrown,
    //            "tree":trees,
    //            "user":{
    //                "__type": "Pointer",
    //                "className": "_User",
    //                "objectId": getCookie("objectId")
    //            }}),
    //        success: function() {
    //            gameInit(me);
    //        },
    //                error: function() {
    //
    //                }
    //    });
    //}
    
    var updateBeanProgress = function(me,trees) {
        var myCookie = new Cookie();
        var data = myCookie.getFromCookie();
        if(data.username) {
            //var metersGrown = trees.target.trunks * 20;
            console.log("updateBean");
            me.config.serverAPIController.save(trees);
        }
    }    

    var gameInit = function(me) {
        me.config.stage = new createjs.Stage("loaderCanvas");
        me.config.popupStage = new createjs.Stage("popupCanvas");
        //this.config.stage.canvas.width = window.innerWidth - 150;//TODO make this better
        //this.config.stage.canvas.height = window.innerHeight - 150;//TODO make this better
        loadImages(me);
        window.onkeydown = onKeyBoardEvents;
    }

    var loadImages = function(me){
        var _doInit= function(me){ doInit(me)}
        me.config.smbLoadQueue = new SmbLoadQueue({"stage" : me.config.stage});
        me.config.smbLoadQueue.loadQueue(Manifest.game, _doInit, me);
       //me.config.smbLoadQueue.loadManifest({id:"sound", src:"http://news.qburst.com/wp-content/uploads/2015/01/Main-Img-_QPL.jpg",
          // type:createjs.AbstractLoader.IMAGE });
    }

    var doInit = function(me){
        me.config.localStore = new LocalStorageController();
        me.config.gameState = new GameState();
        me.config.gameState.init();
        me.config.menuController = new MenuController({"gameState": me.config.gameState, "loader" :me.config.smbLoadQueue });
        me.config.menuController.init();
        me.config.stageController = new StageController({"gameState": me.config.gameState, "loader" :me.config.smbLoadQueue})
        me.config.stageController.init();

        EventBus.dispatch("exitShop");
       // EventBus.dispatch("exitMenu");
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
