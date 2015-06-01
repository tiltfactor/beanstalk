/// <reference path="../../typings/beanstalk/beanstalk.d.ts" />
var ResourcesManager = (function () {
    function ResourcesManager() {
        this.fgQueue = new createjs.LoadQueue(true, "", true);
        this.bgQueue = new createjs.LoadQueue(false, "", false);
    }
    ResourcesManager.prototype.loadInitialResources = function (completeCallback) {
        this.loadManifest("data/initial manifest.json", completeCallback);
    };
    ResourcesManager.prototype.loadMainGameResources = function (completeCallback) {
        this.loadManifest("data/main game resources manifest.json", completeCallback);
    };
    ResourcesManager.prototype.loadCaptchas = function () {
    };
    ResourcesManager.prototype.loadManifest = function (manifest, completeCallback) {
        this.fgQueue.on("complete", completeCallback, this, true);
        this.fgQueue.loadManifest(manifest, true);
    };
    ResourcesManager.prototype.getResource = function (resourceId) {
        return this.fgQueue.getResult(resourceId);
    };
    ResourcesManager.prototype.load = function (item, forground, callback) {
        var queue = forground ? this.fgQueue : this.bgQueue;
        queue.loadFile(item, true);
        queue.on("complete", function (data) {
            if (callback != null)
                callback(queue.getItem(item.id));
        }, this, true);
    };
    return ResourcesManager;
})();
