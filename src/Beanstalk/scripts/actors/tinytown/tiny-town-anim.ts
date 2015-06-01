class TinyTownAnim extends createjs.Container {

    sprite: SBSprite;
    type: TinyTownAnimationType;
    showCount: number;

    constructor(type: TinyTownAnimationType) {

        super();
       
        this.showCount = 0;
        this.type = type;
        var ss = this.getSpriteSheet(type.id);
        this.sprite = new SBSprite(ss, type.id);
        this.addChild(this.sprite);

        this.sprite.regX = type.regX;
        this.sprite.regY = type.regY;
        this.sprite.framerate = type.framerate;
        this.sprite.currentAnimationFrame = Math.floor(Math.random() * ss.getNumFrames(type.id));     
    }

    private getSpriteSheet(type: string): SBSpriteSheet {
        var d = beanstalk.resources.getResource("tiny_town_json");
        d.images = [beanstalk.resources.getResource("tiny_town_png")];
        return beanstalk.sprites.getSpriteSheet(type, new createjs.SpriteSheet(d));
    }

    public update(delta: number) {
    }

}