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
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey
            },
            type: "GET",
            success: function(data) {

                if(data != null){
                    var cookie = new Cookie();
                    cookie.saveToCookie(data);
                    me.config.gameState.saveLoginDetails(data);
                    me.getProgress();
                }else{
                    EventBus.dispatch("showLoginSceen", "login fails");
                }
            },
            beforeSend: function () {
                $('.login-msg').show();
            },
            complete: function () {
                $('.login-msg').hide();
            },
            error: function() {
                $(".msg").hide(1);
                $(".error-msg").show(1);
            }
        });

    }

    ServerAPIController.prototype.getProgress = function(){
        var me = this;
        var params = 'where='+ JSON.stringify({"player":{"__type":"Pointer","className":"_User","objectId":me.config.gameState.objectId}});
        params = encodeURI(params);
        $.ajax({
            url: me.API.baseUrl+"/1/classes/highscore/?" + params,
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : me.API.parseApplicationId,
                'X-Parse-REST-API-Key': me.API.parseRestAPIKey,
                'X-Parse-Session-Token': me.config.gameState.sessionToken
            },
            type: "GET",
            success: function(data) {
                if(data != null){
                    EventBus.dispatch("setGameState", data);
                    if(me.config.gameState.beanProgress.meters > 0) {
                        $("#continueButton").show(1);
                    }
                }
                EventBus.dispatch("showLoginSceen", "login fails");
            },
            error: function() {

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
            data: JSON.stringify({ "username": data.username, "password": data.password }),
            type: "POST",
            success: function(data) {
                var cookie = new Cookie();
                cookie.saveToCookie(data);
                me.config.gameState.saveLoginDetails(data);
                setPlayerRole(me);
//                $("#register-wrapper").css("display","none");
//                document.cookie="username=" + username + ";expires= -1";
//                document.cookie="sessionTocken="+params.sessionToken+";expires= -1";
//                document.cookie="objectId="+params.objectId+";expires= -1";
//                setPlayerRole(me);
            },
            error: function() {
                $(".msg").hide(1);
                $(".error-msg").show(1);
            }
        });
    }
    ServerAPIController.prototype.logout = function(){

    }
    ServerAPIController.prototype.save = function(wm){
        console.log("updateBeanSve API");
        var me = this;
        var weeklyMeters = me.config.gameState.beanProgress.weeklyMeters + ((wm.trees * 160 + wm.trunks * 20) - me.config.gameState.beanProgress.meters);
        var meters = (wm.trees * 160 + wm.trunks * 20);
        $.ajax({
            url: me.API.baseUrl+"/1/classes/highscore/"+me.config.gameState.beanProgress.objectId,
            headers: {
                'Content-Type': 'application/json',
                'X-Parse-Application-Id' : this.API.parseApplicationId,
                'X-Parse-REST-API-Key': this.API.parseRestAPIKey,
                'X-Parse-Session-Token': me.config.gameState.sessionToken
            },
            type: "PUT",
            data: JSON.stringify({
                "meters":meters,
                "weeklyMeters":weeklyMeters,
                "objectId": me.config.gameState.beanProgress.objectId,
                "player":{
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": me.config.gameState.objectId
                },
                "weeklyMeters": weeklyMeters}),
            success: function() {

            },
            error: function() {

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
                "player":{
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": me.config.gameState.objectId
                },
                "weeklyMeters": 0}),
            success: function(response) {
                // eventbus to dispatch main menu with login details
                $("#login-wrapper").css("display","none");
                $(".msg").hide(1);
                $("#register-wrapper").css("display","none");
                me.config.gameState.beanProgress.objectId = response.objectId;
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
            },
            type: "PUT",
            data:
                JSON.stringify({
                    "player":{
                        "__op": "AddRelation",
                        "objects": [
                            {
                                "__type": "Pointer",
                                "className": "_User",
                                "objectId": me.config.gameState.objectId
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
