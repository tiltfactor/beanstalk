
class Background extends createjs.Container {

    bgParts: createjs.Container;
    animationsContainer: createjs.Container;
    tinyTownConatiner: createjs.Container;

	constructor() {
        super();

        this.bgParts = new createjs.Container();
        this.addChild(this.bgParts);

        // Add the background parts (split for performance)
        var bottom = new createjs.Bitmap(beanstalk.resources.getResource("background-bottom-part"));
        bottom.regY = Math.round(bottom.getBounds().height);
        this.bgParts.addChild(bottom);

        var middle = new createjs.Bitmap(beanstalk.resources.getResource("background-middle-part"));
        middle.regY = Math.round(bottom.getBounds().height + middle.getBounds().height);
        this.bgParts.addChild(middle);

        var top = new createjs.Bitmap(beanstalk.resources.getResource("background-top-part"));
        top.regY = Math.round(bottom.getBounds().height + middle.getBounds().height + top.getBounds().height);
        this.bgParts.addChild(top);

        var solidSpace = new createjs.Shape();
        solidSpace.graphics.beginFill("#1b476c");
        solidSpace.graphics.drawRect(0, 0, top.getBounds().width, 1500);
        solidSpace.graphics.endFill();
        solidSpace.regY = top.regY + 1498;
        this.addChild(solidSpace);

        this.animationsContainer = new createjs.Container();
        this.addChild(this.animationsContainer);

        this.tinyTownConatiner = new createjs.Container();
        this.addChild(this.tinyTownConatiner);

        this.addAnimations();
    }

    getBGHeight() {
        return this.bgParts.getBounds().height;
    }

    private addAnimations() {

        var data = <AnimationsData>beanstalk.resources.getResource("animations_data");

        var ss = this.getSpriteSheet("animations");
        _.each(data.animations.positions, a => {

            var t = data.animations.types[a.type];

            var anim = new SBSprite(ss, a.type);
            anim.regX = t.regX;
            anim.regY = t.regY;
            anim.framerate = t.framerate;
            anim.currentAnimationFrame = Math.floor(Math.random() * ss.getNumFrames(a.type));
            anim.x = a.x;
            anim.y = a.y - this.getBGHeight();
            anim.scaleX = anim.scaleY = a.scale;

            this.animationsContainer.addChild(anim);
        });

    }

    private getSpriteSheet(type:string): SBSpriteSheet {
        var d = beanstalk.resources.getResource(type+"_json");
        d.images = [beanstalk.resources.getResource(type+"_png")];
        return beanstalk.sprites.getSpriteSheet(type, new createjs.SpriteSheet(d));
    }

	
}