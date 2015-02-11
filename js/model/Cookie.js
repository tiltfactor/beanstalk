/**
 * Created by user on 2/2/15.
 */
(function () {
    var Cookie = function(config){
        this.config = config;
        this.key = "BeanStalk";
        //loadMyPowerup(this);
    }
    Cookie.prototype.saveToCookie = function(data){
        document.cookie = "bs_username="+data.username+";expires= -1";
        document.cookie = "bs_sessionToken="+data.sessionToken+";expires= -1";
        document.cookie = "bs_objectId="+data.objectId+";expires= -1";
    }
    Cookie.prototype.getFromCookie = function(){
        var data = {};
        data.username = getCookie("bs_username");
        data.sessionToken = getCookie("bs_sessionToken");
        data.objectId = getCookie("bs_objectId");
        return data;
    }
    Cookie.prototype.clear = function(){
        document.cookie = "bs_username=;";
        document.cookie = "bs_sessionToken=;";
        document.cookie = "bs_objectId=;";
    }

    Cookie.prototype.reset = function(){
        //this.saveToStore(null);
    }

    var getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return null;
    }


    window.Cookie = Cookie;

}());
