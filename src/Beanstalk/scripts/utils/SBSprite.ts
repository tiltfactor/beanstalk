class SBSprite extends createjs.Container {

    isPlaying: boolean;
    framerate: number;

    private _bitmap: createjs.Bitmap;
    private timeSinceLastFrame: number;
    private _currentAnimationFrame: number;
    private _spriteSheet: SBSpriteSheet;
    private _animation: string;
    private _lastFrame: SBAnimationFrame;

    constructor(ss: SBSpriteSheet, startingAnimation: string) {
        super();
        this._bitmap = new createjs.Bitmap("");
        this.addChild(this._bitmap);
        this.spriteSheet = ss;
        this.animation = startingAnimation;
        this.isPlaying = true;       
        this.on("tick", e => this.onTick(e));
    }

    gotoAndStop(anim: string) {
        this.animation = anim;
        this.isPlaying = false;
        this.timeSinceLastFrame = 0;
        this.currentAnimationFrame = 0;
    }

    gotoAndPlay(anim: string) {
        this.animation = anim;
        this.isPlaying = true;
        this.timeSinceLastFrame = 0;
        this.currentAnimationFrame = 0;
    }

    get currentAnimationFrame(): number { return this._currentAnimationFrame; }

    set currentAnimationFrame(value: number) {
        if (value == this._currentAnimationFrame) return;
        this._currentAnimationFrame = value;       
    }

    get spriteSheet(): SBSpriteSheet { return this._spriteSheet; }

    set spriteSheet(value: SBSpriteSheet) {
        this._spriteSheet = value;
        this.timeSinceLastFrame = 0;
        this.framerate = value.framerate;
        this.currentAnimationFrame = 0;
    }

    get animation(): string { return this._animation; }

    set animation(value: string) {
        if (this._animation == value) return;
        if (!(value in this.spriteSheet.animations)) throw new Error("Cannot set animation to '" + value + "', that animation doesnt exist in the spritesheet!");
        else this._animation = value;
    }
    
    onTick(e) {

        if (e.delta == null || isNaN(e.delta)) return;

        // First update the bitmap
        var frame = this.getCurrentFrame();
        if (frame != this._lastFrame) {
            this._bitmap.image = frame.canvas;
            this._bitmap.regX = frame.regX;
            this._bitmap.regY = frame.regY;
        }
        this._lastFrame = frame;

        // Then tick the animation
        if (!this.isPlaying) return;

        this.timeSinceLastFrame += e.delta;

        //if (this.timeSinceLastFrame > 500) this.timeSinceLastFrame = 500;
        if (this.timeSinceLastFrame > 1000 / this.framerate) {
            //this.timeSinceLastFrame -= 1000 / this.framerate;
            this.timeSinceLastFrame = 0;
            if (this.currentAnimationFrame >= this.spriteSheet.getNumFrames(this.animation) - 1) {
                this.currentAnimationFrame = 0;
                this.dispatchEvent("animationend");
            }
            else this.currentAnimationFrame++;
        }
    }

    private getCurrentFrame(): SBAnimationFrame {
        return this.spriteSheet.getFrame(this.animation, this.currentAnimationFrame);
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        this.isPlaying = true;
    }

	
}