class SpriteSheetManager {

    spritesheets: { [resourceName: string]: SBSpriteSheet };

    constructor() {
        this.spritesheets = {};
    }
    
    getSpriteSheet(id: string, createJSSpritesheet: createjs.SpriteSheet = null): SBSpriteSheet {
        if (this.spritesheets[id] != null) return this.spritesheets[id];
        if (createJSSpritesheet == null) createJSSpritesheet = new createjs.SpriteSheet(beanstalk.resources.getResource(id));
        var ss = SBSpriteSheet.fromCreateJSSpriteSheet(createJSSpritesheet);
        this.spritesheets[id] = ss;
        return ss;
    }
 

}