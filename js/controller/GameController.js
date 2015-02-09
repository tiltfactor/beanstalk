function GameController(config) {
    this.config = config || {};
    GameController.prototype.init = function(){
        this.API = {};
        this.API.baseUrl = "https://api.parse.com";
        this.API.parseApplicationId = "1GtX8QZUiToSo4uMitz964PZRj9epEWREyKelFg5";
        this.API.parseRestAPIKey = "DhRAPRaHunZo6CRxPfPoGG5I1qdsRwfakBTpk88C";
        checkLogin(this);
        loadEvents(this);
    }

    var checkLogin = function(me) {
        var isLoggedIn = getCookie("username");
        if(isLoggedIn) {
             getProgress(me);
        }
        else {
            $("#login-wrapper").css("display","table");
        }
    }
    
    var getCookie = function(cookieName) {
	var nameEQ = cookieName + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;        
    }

    var loadEvents = function(me) {
        var up = function(trees){me.updateBeanProgress(trees)};
        EventBus.addEventListener("updateBeanProgress", up);       
        
        var pg = function(){playAsGuest(me)};
        EventBus.addEventListener("playAsGuest", pg);
        
        var rg = function(){showRegisterScreen()};
        EventBus.addEventListener("showRegisterScreen", rg);  
        
        var lg = function(){userLogin(me)};
        EventBus.addEventListener("userLogin", lg);
        
        var ru = function(){registerUser(me)};
        EventBus.addEventListener("registerUser", ru);
    
        var fp = function(){resetPassword(me)};
        EventBus.addEventListener("resetPassword", fp);
    }

    var playAsGuest = function(me) {
        $("#login-wrapper").css("display","none");  
        gameInit(me);
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
            $(".msg").hide(1);
            $(".login-msg").show(1);
            var params = encodeURI(username +"&password=" + password);
            $.ajax({
                url: me.API.baseUrl+"/1/login?username=" + params,
                headers: {
                    'X-Parse-Application-Id' : me.API.parseApplicationId,
                    'X-Parse-REST-API-Key': me.API.parseRestAPIKey
                },
                type: "GET",
                success: function(params) { 
                    document.cookie="username=" + username + ";expires= -1";
                    document.cookie="sessionTocken="+params.sessionToken+";expires= -1";
                    document.cookie="objectId="+params.objectId+";expires= -1";
                    $("#login-wrapper").css("display","none");
                    getProgress(me);
                },
                        error: function() {
                    $(".msg").hide(1);
                    $(".error-msg").show(1);
                }
          });
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
            $.ajax({
                url: me.API.baseUrl+"/1/users",
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id' : me.API.parseApplicationId,
                    'X-Parse-REST-API-Key': me.API.parseRestAPIKey
                },
                data: JSON.stringify({ "username": username, "password": password }),
                type: "POST",
                success: function(params) { 
                    $("#register-wrapper").css("display","none");
                    document.cookie="username=" + username + ";expires= -1";
                    document.cookie="sessionTocken="+params.sessionToken+";expires= -1";
                    document.cookie="objectId="+params.objectId+";expires= -1";
                    setPlayerRole(me);
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

    var getProgress = function(me) {
        var params = 'where='+ JSON.stringify({"user":{"__type":"Pointer","className":"_User","objectId":getCookie("objectId")}});       
        params = encodeURI(params);
        $.ajax({
            url: me.API.baseUrl+"/1/classes/BeanProgress/?" + params,
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : me.API.parseApplicationId,
                'X-Parse-REST-API-Key': me.API.parseRestAPIKey,
                'X-Parse-Session-Token': getCookie("sessionTocken")
            },
            type: "GET",
            success: function(params) { 
                me.API.progressId = params.results[0].objectId;
                me.API.treesCount = params.results[0].tree;
                me.API.metersGrown = params.results[0].meters;
                if((me.API.metersGrown > 0) || (me.API.treesCount > 0)) {
                    $("#continueButton").show(1);
                    $("#new-game").hide(1);
                }
                gameInit(me);
            },
                    error: function() {

                    }
        });    
    }

    var setProgress = function(me) {
        var trees = 0;
        var metersGrown = 0;
        $.ajax({
            url: me.API.baseUrl+"/1/classes/BeanProgress/",
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : me.API.parseApplicationId,
                'X-Parse-REST-API-Key': me.API.parseRestAPIKey,
                'X-Parse-Session-Token': getCookie("sessionTocken")
            },
            type: "POST",
            data: JSON.stringify({
                "meters":metersGrown,
                "tree":trees,
                "user":{
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": getCookie("objectId")
                }}),
            success: function() { 
                gameInit(me);
            },
                    error: function() {

                    }
        });     
    }
    
    GameController.prototype.updateBeanProgress = function(trees) {
        if( getCookie("username")) {
            var metersGrown = trees.target.trunks * 20;
            $.ajax({
                url: this.API.baseUrl+"/1/classes/BeanProgress/"+this.API.progressId,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Parse-Application-Id' : this.API.parseApplicationId,
                    'X-Parse-REST-API-Key': this.API.parseRestAPIKey,
                    'X-Parse-Session-Token': getCookie("sessionTocken")
                },
                type: "PUT",
                data: JSON.stringify({
                    "meters":metersGrown,
                    "tree":trees.target.trees,
                    "user":{
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": getCookie("objectId")
                    }}),
                success: function() { 
                    console.log(arguments);
                },
                        error: function() {

                        }
            });   
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
