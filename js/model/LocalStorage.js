/**
 * Created by user on 2/2/15.
 */
(function () {
    var LocalStorage = function(config){
        this.config = config;
        this.key = "BeanStalk";
        //loadMyPowerup(this);
    }
    LocalStorage.prototype.saveToStore = function(data){
        localStorage.setItem(this.key, data);
    }
    LocalStorage.prototype.getFromStore = function(){
        var data = localStorage.getItem(this.key);
        var json = JSON.parse(data) || {};
        return json;
    }
    LocalStorage.prototype.reset = function(){
        this.saveToStore(null);
    }


    window.LocalStorage = LocalStorage;

}());
