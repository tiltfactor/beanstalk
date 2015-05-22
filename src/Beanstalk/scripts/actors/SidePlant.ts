class SidePlant extends createjs.Container {



    constructor(stalks: number) {
        super();


        var ss = this.getSpritesheet();

        for (var i = 0; i < stalks; i++) {
            var s = new createjs.Sprite(ss);
            s.gotoAndStop(44);
            s.y = -i * 180;
            this.addChild(s);
        }


        var crack = new createjs.Bitmap(beanstalk.resources.getResource("side_plant_crack"));
        crack.y = 710;
        crack.x = 52;
        this.addChild(crack);

        //var shape = new createjs.Shape();
        //shape.graphics.beginFill("red");
        //shape.graphics.drawCircle(0, 0, 100);
        //shape.graphics.endFill();
        //this.addChild(shape);
    }


    private getSpritesheet(): createjs.SpriteSheet {

        // Grab them
        var data = beanstalk.resources.getResource("dark_stalk_json");
        var sprite = beanstalk.resources.getResource("dark_stalk_png");

        // Update the data with the image
        data.images = [sprite];

        return new createjs.SpriteSheet(data);
    }

	
}