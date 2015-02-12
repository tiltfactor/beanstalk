function MenuController(config) {
    this.config = config || {};
    MenuController.prototype.init = function(){
        createDialog();
        $("#resumeButton").hide();
        loadEvents(this);
    }

    var loadEvents = function (me) {
        EventBus.addEventListener("exitMenu", me.hideMenu);
        var sm = function(){me.showMenu(me)};
        EventBus.addEventListener("showMenu",sm);
    }

    MenuController.prototype.showMenu = function (me) {
        $("#login-wrapper").css("display","none");
        checkStatus(me);
        me.config.gameState.gs.currentState = me.config.gameState.gs.States.MAIN_MENU;
        if(me.config.gameState.currentHeight == 0 && me.config.gameState.treesGrown == 0){
            $("#continueButton").css("display","none");
        }
        $("#menu-wrapper").css("display","table");
    }
    MenuController.prototype.hideMenu = function () {
        $("#menu-wrapper").css("display","none");
    }

    var createDialog = function(){
        $("#menu-wrapper").css("display","table");
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