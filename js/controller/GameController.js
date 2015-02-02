function GameController(config) {
    this.config = config || {};
    GameController.prototype.init = function(){
        this.config.stage = new createjs.Stage("loaderCanvas");
        this.config.popupStage = new createjs.Stage("popupCanvas");
        //this.config.stage.canvas.width = window.innerWidth - 150;//TODO make this better
       // this.config.stage.canvas.height = window.innerHeight - 150;//TODO make this better
        loadImages(this);
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