class SBSpriteUtils {

    static extractAnimations(spriteSheet: createjs.SpriteSheet): SBAnimations {

        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;

        var animations: SBAnimations = {};
        var frameCount = 0;
        for (var i = 0; i < spriteSheet.animations.length; i++)
        {
            var anim: SBAnimation = {
                name: spriteSheet.animations[i],
                frames: []
            }
            for (var j = 0; j < spriteSheet.getNumFrames(anim.name); j++)
            {
                var ssFrameData = (<any>spriteSheet)._frames[frameCount];
                var frame: SBAnimationFrame = {
                    regX: ssFrameData.regX,
                    regY: ssFrameData.regY,
                    canvas:  SBSpriteUtils.extractFrame(spriteSheet, frameCount, canvas)
                }
                anim.frames[j] = frame;
                frameCount++;
            }
            animations[anim.name] = anim;
        }
        return animations;
    }

    //static extractFrames(spriteSheet: createjs.SpriteSheet, animation: string) {
    //    var canvas = document.createElement("canvas");
    //    var frames: HTMLImageElement[] = [];
    //    for (var i = 0; i < spriteSheet.getNumFrames(animation); i++)
    //        frames[i] = SBSpriteUtils.extractFrame(spriteSheet, i, canvas);
    //    return frames;
    //}

    static extractFrame(spriteSheet: createjs.SpriteSheet, frame: number, canvas: HTMLCanvasElement = null): HTMLCanvasElement {

        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        var data = spriteSheet.getFrame(frame);

        var r = data.rect;

        canvas.width = r.width;
        canvas.height = r.height;

        context.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);

        return canvas;

        //var img = document.createElement("img");
        //img.src = canvas.toDataURL("image/png");
        //return img;
    }
	
}