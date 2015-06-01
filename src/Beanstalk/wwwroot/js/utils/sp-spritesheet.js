var SBSpriteSheet = (function () {
    function SBSpriteSheet() {
    }
    SBSpriteSheet.fromCreateJSSpriteSheet = function (spritesheet) {
        var ss = new SBSpriteSheet();
        ss.framerate = spritesheet.framerate;
        ss.animations = SBSpriteUtils.extractAnimations(spritesheet);
        return ss;
    };
    SBSpriteSheet.prototype.getFrame = function (animationName, frameNumber) {
        // Catch some invalid args
        if (!(animationName in this.animations))
            throw new Error("Cannot get frame " + frameNumber + " for animation '" + animationName + "', that animation doesnt exist in the spritesheet.");
        if (frameNumber >= this.animations[animationName].frames.length)
            throw new Error("Cannot get frame " + frameNumber + " for animation '" + animationName + "', that frame is greater than the number of frames in the animation.");
        if (frameNumber < 0)
            throw new Error("Cannot get frame " + frameNumber + " for animation '" + animationName + "', that frame less than zero.");
        return this.animations[animationName].frames[frameNumber];
    };
    SBSpriteSheet.prototype.getNumFrames = function (animationName) {
        return this.animations[animationName].frames.length;
    };
    return SBSpriteSheet;
})();
