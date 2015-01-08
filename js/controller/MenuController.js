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
        checkStatus(me);
        me.config.gameState.gs.currentState = me.config.gameState.gs.States.MAIN_MENU;
        $( "#dialog-message" ).dialog("open");
    }
    MenuController.prototype.hideMenu = function () {
        $( "#dialog-message" ).dialog("close")
    }

    var createDialog = function(){
        $( "#dialog-message" ).dialog(
            {
                dialogClass: "no-close",
                modal: true,
                closeOnEscape: false
            });
        $("#dialog-message Button" ).button();
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