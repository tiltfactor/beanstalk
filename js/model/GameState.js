/**
 * Created by user on 5/12/14.
 */
function GameState(config){
    this.config = config || {};

    GameState.prototype.init = function(json){
        this.json = json || {};
        this.gs = {};
        this.cookie = {};

        this.totalLevels = 20;

        this.gs.currentLevel = this.json.currentLevel || 1;
        this.gs.points = this.json.points || 0;
        this.gs.States = {
            MAIN_MENU:0,RUN:1,GAME_OVER :2
        }
        this.gs.currentState = this.gs.States.MAIN_MENU;
        this.captchaDatasArray = [localData];
        this.beanProgress ={};
        this.beanProgress.treesCount = 0;
        this.beanProgress.trunksGroupCompleted = 0;

    }

    GameState.prototype.saveCookieDetails = function(data){
        this.username = data.username;
        this.objectId  =data.objectId;
        this.sessionToken = data.sessionToken;
    }
    GameState.prototype.saveLoginDetails = function(data){
        this.sessionToken = data.sessionToken;
        this.objectId = data.objectId;
        this.username = data.username;
    };
    GameState.prototype.setGameStatus = function(data){
        this.beanProgress = data.results[0];
        this.beanProgress.treesCount = parseInt(this.beanProgress.meters /160);
        this.beanProgress.trunksGroupCompleted = (this.beanProgress.meters % 160) / 20;

        EventBus.dispatch("showMenu");
    }



}