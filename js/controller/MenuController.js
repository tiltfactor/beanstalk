function MenuController(config) {
    this.config = config || {};
    MenuController.prototype.init = function(){
        createDialog();
        //$("#resumeButton").hide();
        loadEvents(this);
    }

    var loadEvents = function (me) {
        EventBus.addEventListener("exitMenu", me.hideMenu);
        
        var sm = function(ob){me.showMenu(me,ob.target)};
        EventBus.addEventListener("showMenu",sm);
        
        var sh = function(){me.showHelp(me)};
        EventBus.addEventListener("showHelp",sh);
        
        var hh = function(){me.hideHelp(me)};
        EventBus.addEventListener("hideHelp",hh);

        var bb = function(){backButtonClick(me)};
        EventBus.addEventListener("backButtonClick",bb);

        var so = function(){me.showOptions(me)};
        EventBus.addEventListener("showOptions",so);

        var ho = function(){me.hideOptions(me)};
        EventBus.addEventListener("hideOptions",ho);

        var ll = function(){loginLogout(me)};
        EventBus.addEventListener("loginLogout",ll);

        var bl = function(){backToLogin()};
        EventBus.addEventListener("backToLogin",bl);

    }
    var backToLogin = function(){
        $(".msg").hide(1);
        EventBus.dispatch("hideAll");
        $("#login-wrapper").css("display","table");
    }
    var backButtonClick = function(me){
        EventBus.dispatch("hideAll");
        //EventBus.dispatch("showMenu");
        me.showMenu(me,true);
    }
    var loginLogout = function(me){
        if(me.config.gameState.userId == null){
            EventBus.dispatch("hideAll");
            $("#login-wrapper").css("display","table");
        }
        else{
            EventBus.dispatch("hideAll");
            EventBus.dispatch("logOut");
        }
    }
    MenuController.prototype.showMenu = function (me, isContinue) {
        //$("#login-wrapper").css("display","none");
        checkStatus(me);
        me.config.gameState.gs.currentState = me.config.gameState.gs.States.MAIN_MENU;
        if(me.config.gameState.currentHeight == 0 && me.config.gameState.treesGrown == 0 ){
            $("#continueButton").css("display","none");
        }
        if(me.config.gameState.userId == null){
            $("#back-button").show(1);
            $("#continueButton").css("display","none");
            $("#login-box-text").html("GUEST");
            $("#loginBtn").html("LOGIN");
        }
        else{
            var username = me.config.gameState.username;
            var user = username.split(/@/);
            $("#login-box-text").html(user[0]);
            $("#loginBtn").html("LOGOUT");
        }
        if(isContinue){
            $("#continueButton").show();
        }
        $("#menu-wrapper").css("display","table");
    }
    MenuController.prototype.showOptions = function () {
        $(".mainWrapper").css("display", "none");
        $("#options-screen" ).css("display","table");
        setSliderValue(this);
    }
    MenuController.prototype.hideMenu = function () {
       // window.close();
        $("#menu-wrapper").css("display","none");
    }
    MenuController.prototype.hideOptions = function () {
        $(".main-wrapper").css("display", "none");
        $( "#menu-container" ).css("display","table");
    }
    MenuController.prototype.showHelp = function () {
        //EventBus.dispatch("hideAll");
        //$(".buttonHolder").css("display","none");
        $("#help-screen").css("display","table");
    } 
    
    MenuController.prototype.hideHelp = function () {
        //EventBus.dispatch("hideAll");
        $("#help-screen").css("display","none");
        //EventBus.dispatch("showMenu");
        //$("#menu-wrapper").css("display","table");
    }
    var setSliderValue = function(me){
        $(".music-slider").slider({
            value: me.config.gameState.gs.music,
            range: "min",
            slide: function( event, ui ) {
                me.config.gameState.gs.music = ui.value;
                var cookie = new Cookie();
                cookie.saveVolumeToCookie(me.config.gameState.gs.music, me.config.gameState.gs.soundEffects);
                EventBus.dispatch("changeSoundVolume",me.config.gameState.soundType.MAIN);
            }
        });

        $(".effects-slider").slider({
            value: me.config.gameState.gs.soundEffects,
            range: "min",
            slide: function( event, ui ) {
                me.config.gameState.gs.soundEffects = ui.value;
                var cookie = new Cookie();
                cookie.saveVolumeToCookie(me.config.gameState.gs.music, me.config.gameState.gs.soundEffects);
                EventBus.dispatch("changeSoundVolume",me.config.gameState.soundType.EFFECTS);
            }
        });
    }
    var createDialog = function(){
        EventBus.dispatch("showMenu");
    }
    var checkStatus = function(me){
        var state = me.config.gameState.gs.States;
        switch(me.config.gameState.gs.currentState){
            case state.MAIN_MENU:{break;}
            case state.RUN:{$("#resumeButton").show();break;}
            case state.GAME_OVER: {$("#resumeButton").hide();break;}

        }
    }
}