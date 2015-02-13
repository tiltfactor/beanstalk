/**
 * Created by user on 5/12/14.
 */
function GameState(config){
    this.config = config || {};

    GameState.prototype.init = function(json){
        this.json = json || {};
        this.gs = {};
        this.cookie = {};
        gst = this;

        this.totalLevels = 20;
        this.trunkHeight = 20;
        this.levels = 8;

        this.gs.currentLevel = this.json.currentLevel || 1;
        this.gs.points = this.json.points || 0;
        this.gs.States = {
            MAIN_MENU:0,RUN:1,GAME_OVER :2
        }
        this.gs.currentState = this.gs.States.MAIN_MENU;
        this.captchaDatasArray = [localData];




    }
    GameState.prototype.savePlayerDetails = function(data){
        this.username = data.username;
        this.userId  =data.objectId;
        this.sessionToken = data.sessionToken;
    }
//    GameState.prototype.saveLoginDetails = function(data){
//        this.sessionToken = data.sessionToken;
//        this.objectId = data.objectId;
//    };
    GameState.prototype.setGameStatus = function(data){
        this.currentHeight = data.currentHeight;
        this.treesGrown = data.treesGrown;
        this.highScoreId = data.id;
        console.log(data);

    }
    GameState.prototype.clear = function(){
        this.username = null;
        this.userId  = null;
        this.sessionToken = null;
        this.currentHeight = 0;
        this.treesGrown = 0;
        this.highScoreId = 0;
    }



}