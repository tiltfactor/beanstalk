/**
 * Created by user on 8/1/15.
 */
function LocalStorageController(config){
    this.config = config;


    LocalStorageController.prototype.init = function(){

    }

    var loadEvents = function(me){
        var sd = function(name,value){save(name, value, me);}
        EventBus.addEventListener("save", sd);
    }

    LocalStorageController.prototype.get = function(name){

    }
    var save = function(name, value, me){

    }
}
