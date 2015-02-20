/**
 * Created by user on 10/2/15.
 */
function ServerAPIController(config){
    this.config = config || {};

    ServerAPIController.prototype.init = function(){
        this.API = {};
        this.API.baseUrl = "https://api.parse.com";
        this.API.parseApplicationId = "1GtX8QZUiToSo4uMitz964PZRj9epEWREyKelFg5";
        this.API.parseRestAPIKey = "DhRAPRaHunZo6CRxPfPoGG5I1qdsRwfakBTpk88C";
    }
    
    ServerAPIController.prototype.login = function(data){
        var me = this;
        var url = "/1/login?";
        var params = encodeURI("username="+data.username+"&password="+data.password);
        $.ajax({
            url: this.API.baseUrl+url+ params,
            headers: {
                'Content-type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey
            },
            type: "GET",
            success: function(data) {

                if(data != null){
                    var cookie = new Cookie();
                    cookie.saveToCookie(data);
                   // var myData = {"username":data.username ,"userId": data.objectId, "sessionToken": data.sessionToken};
                    me.config.gameState.savePlayerDetails(data);
                    me.getProgress();
                }else{
                    EventBus.dispatch("showLoginSceen", "login fails");
                }
            },
            beforeSend: function () {
                $(".error-msg").hide();
                $('.login-msg').show();
            },
            complete: function () {
                $('.login-msg').hide();
            },
            error: function(jqXHR) {
                var errorText = JSON.parse(jqXHR.responseText);
                $(".msg").hide(1);
                $(".error-msg").html(errorText.error).show(1);
            }
        });

    }

    ServerAPIController.prototype.getProgress = function(){
        var me = this;
        var params = 'where='+ JSON.stringify({"player":{"__type":"Pointer","className":"_User","objectId":this.config.gameState.userId}});
        params = encodeURI(params);
        $.ajax({
            url: this.API.baseUrl+"/1/classes/highscore?" + params,
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey,
                'X-Parse-Session-Token': this.config.gameState.sessionToken
            },
            type: "GET",
            success: function(data) {
                $("#password").val("");
                if(data != null){
                    $("#continueButton").show();
                    EventBus.dispatch("setGameState", data.results[0]);
                }
                EventBus.dispatch("showLoginScreen", "login fails");
//                me.API.progressId = params.results[0].objectId;
//                me.API.treesCount = params.results[0].tree;
//                me.API.metersGrown = params.results[0].meters;
//                if((me.API.metersGrown > 0) || (me.API.treesCount > 0)) {
//                    $("#continueButton").show(1);
//                    $("#new-game").hide(1);
//                }
//                gameInit(me);
            },
            error: function() {
                console.log("error")
            }
        });
    }
    ServerAPIController.prototype.register = function(data){
        var me = this;
        var url = "/1/users";
        $.ajax({
            url: this.API.baseUrl+url,
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey
            },
            data: JSON.stringify({ "username": data.username, "password": data.password, "email": data.username }),
            type: "POST",
            success: function(userData) {
                $("#register-user-name").val("");
                $("#register-password").val("");
                $("#confirm-password").val("");
                var cookie = new Cookie();
               // var myData = {"username":data.username ,"userId": data.objectId, "sessionToken": data.sessionToken};
                userData.username = data.username;
                cookie.saveToCookie(userData);
                me.config.gameState.savePlayerDetails(userData);
                setPlayerRole(me);


//                $("#register-wrapper").css("display","none");
//                document.cookie="username=" + username + ";expires= -1";
//                document.cookie="sessionTocken="+params.sessionToken+";expires= -1";
//                document.cookie="objectId="+params.objectId+";expires= -1";
//                setPlayerRole(me);
            },
         error: function(jqXHR) {
                var errorText = JSON.parse(jqXHR.responseText);
                $(".msg").hide(1);
                $(".error-msg").html(errorText.error).show(1);
            }
        });
    }
    ServerAPIController.prototype.logout = function(){

    }
    ServerAPIController.prototype.save = function(){
        var me = this;
        $.ajax({
            url: this.API.baseUrl+"/1/classes/highscore/"+ this.config.gameState.highScoreId,
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey,
                'X-Parse-Session-Token': this.config.gameState.sessionToken
            },
            type: "PUT",
            data: JSON.stringify({
                "meters":((this.config.gameState.treesGrown * this.config.gameState.trunkHeight*this.config.gameState.levels)+ this.config.gameState.currentHeight),
                "weeklyMeters":this.config.gameState.weeklyMeters
                }),
            success: function(data) {
                console.log(data);
            },
            error: function() {

            }
        });
    }
    ServerAPIController.prototype.getHighScores = function(scoreType){
        var me = this;
        $.ajax({
            url: this.API.baseUrl+"/1/functions/highscores",
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey,
                'X-Parse-Session-Token': this.config.gameState.sessionToken
            },
            type: "POST",
            data: JSON.stringify({
                "scoreType": scoreType
            }),
            beforeSend: function () {
                if(scoreType == 1){
                    $(".total-scores").html("Fetching data from the server..");
                }else{
                    $(".weekly-scores").html("Fetching data from the server..");
                }
            },
            success: function(params) {
                    var template = $("#scoreComponents").html();
                    var compile = _.template(template);
                    var data =  compile({items:params.result, user: me.config.gameState.username});
                    if(scoreType == 1){
                        $(".total-scores").html(data);
                    }else{
                        $(".weekly-scores").html(data);
                    }
            },
            error: function() {

            }
        });
    }
    
    ServerAPIController.prototype.getUserHighScores = function(scoreType){
        var me = this;
        var guestScore  = (this.config.gameState.treesGrown * this.config.gameState.trunkHeight*this.config.gameState.levels)+ this.config.gameState.currentHeight;
        guestScore = guestScore || 0;
        $.ajax({
            url: this.API.baseUrl+"/1/functions/guestHighscores",
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey
            },
            type: "POST",
            data: JSON.stringify({
                "scoreType": scoreType,
                "score": guestScore
            }),
            beforeSend: function () {
                if(scoreType == 1){
                    $(".total-scores").html("Fetching data from the server..");
                }else{
                    $(".weekly-scores").html("Fetching data from the server..");
                }
            },
            success: function(params) {
                    var template = $("#scoreComponents").html();
                    var compile = _.template(template);
                    var data =  compile({items:params.result, user: "guest"});
                    if(scoreType == 1){
                        $(".total-scores").html(data);
                    }else{
                        $(".weekly-scores").html(data);
                    }
            },
            error: function() {

            }
        });
    }

    ServerAPIController.prototype.resetPassword = function(email){
        $.ajax({
            url: this.API.baseUrl+"/1/requestPasswordReset",
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey
            },
            type: "POST",
            data:
                JSON.stringify({
                    "email": email
                }),
            success: function() {
                $(".reset-password-msg").show(1);
            },
            error: function(jqXHR) {
                var errorText = JSON.parse(jqXHR.responseText);
                $(".error-msg").html(errorText.error).show(1);
            }
        });
    }
    var setProgress = function(me){
        $.ajax({
            url: me.API.baseUrl+"/1/classes/highscore/",
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : me.API.parseApplicationId,
                'X-Parse-REST-API-Key': me.API.parseRestAPIKey,
                'X-Parse-Session-Token': me.config.gameState.sessionToken
            },
            type: "POST",
            data: JSON.stringify({
                "meters":0,
                "weeklyMeters":0,
                "player":{
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": me.config.gameState.userId
                }}),
            success: function(response) {
                var data = {"treesGrown" : 0, "currentHeight" : 0, "id" : response.objectId };
                me.config.gameState.setGameStatus(data);

                // eventbus to dispatch main menu with login details
                $("#login-wrapper").css("display","none");
                $(".msg").hide(1);
                $("#register-wrapper").css("display","none");
                EventBus.dispatch("showMenu");
            },
            error: function() {

            }
        });
    };
    var setPlayerRole = function(me) {
        $.ajax({
            url: me.API.baseUrl+"/1/roles/9a6z1gOMX1",
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : me.API.parseApplicationId,
                'X-Parse-REST-API-Key': me.API.parseRestAPIKey
                //'X-Parse-Session-Token': me.config.gameState.sessionToken
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
                                "objectId": me.config.gameState.userId
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
    window.serverAPIController = ServerAPIController;
}
