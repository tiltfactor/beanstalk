interface SBAnimations {
    [animName: string]: SBAnimation;
}

interface SBAnimation {
    name: string;
    frames: SBAnimationFrame[];
} 

interface SBAnimationFrame {
    canvas: HTMLCanvasElement;
    regX: number;
    regY: number;
}

class SBSpriteSheet {

    framerate: number;
    animations: SBAnimations;

    static fromCreateJSSpriteSheet(spritesheet: createjs.SpriteSheet): SBSpriteSheet {
        var ss = new SBSpriteSheet();
        ss.framerate = spritesheet.framerate;
        ss.animations = SBSpriteUtils.extractAnimations(spritesheet);
        return ss;
    }

    getFrame(animationName: string, frameNumber: number): SBAnimationFrame {

        // Catch some invalid args
        if (!(animationName in this.animations))
            throw new Error("Cannot get frame " + frameNumber + " for animation '" + animationName + "', that animation doesnt exist in the spritesheet.");
        if (frameNumber >= this.animations[animationName].frames.length) 
            throw new Error("Cannot get frame " + frameNumber + " for animation '" + animationName + "', that frame is greater than the number of frames in the animation.");
        if (frameNumber < 0)
            throw new Error("Cannot get frame " + frameNumber + " for animation '" + animationName + "', that frame less than zero.");

        return this.animations[animationName].frames[frameNumber];
    }

    getNumFrames(animationName: string) {
        return this.animations[animationName].frames.length;
    }
    	
}