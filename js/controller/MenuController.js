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

    }

    var backButtonClick = function(me){
        EventBus.dispatch("hideAll");
        //EventBus.dispatch("showMenu");
        me.showMenu(me,true);
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
        }
        if(isContinue){
            $("#continueButton").show();
        }
        $("#menu-wrapper").css("display","table");
    }
    MenuController.prototype.hideMenu = function () {
       // window.close();
        $("#menu-wrapper").css("display","none");
    }
    
    MenuController.prototype.showHelp = function () {
        EventBus.dispatch("hideAll");
        $(".buttonHolder").css("display","none");
        $("#help-screen").css("display","table");
    } 
    
    MenuController.prototype.hideHelp = function () {
        EventBus.dispatch("hideAll");
        EventBus.dispatch("showMenu");
        //$("#menu-wrapper").css("display","table");
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