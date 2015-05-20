var SpriteSheetManager = (function () {
    function SpriteSheetManager() {
        this.spritesheets = {};
    }
    SpriteSheetManager.prototype.getSpriteSheet = function (id, createJSSpritesheet) {
        if (createJSSpritesheet === void 0) { createJSSpritesheet = null; }
        if (this.spritesheets[id] != null)
            return this.spritesheets[id];
        if (createJSSpritesheet == null)
            createJSSpritesheet = new createjs.SpriteSheet(beanstalk.resources.getResource(id));
        var ss = SBSpriteSheet.fromCreateJSSpriteSheet(createJSSpritesheet);
        this.spritesheets[id] = ss;
        return ss;
    };
    return SpriteSheetManager;
})();
