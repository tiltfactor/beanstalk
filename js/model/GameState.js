/**
 * Created by user on 5/12/14.
 */
function GameState(config){
    this.config = config || {};

    GameState.prototype.init = function(json){
        this.json = json || {};
        this.gs = {};

        this.totalLevels = 20;

        this.gs.currentLevel = this.json.currentLevel || 1;
        this.gs.points = this.json.points || 0;
        this.gs.States = {
            MAIN_MENU:0,RUN:1,GAME_OVER :2
        }
        this.gs.currentState = this.gs.States.MAIN_MENU;



    }



}