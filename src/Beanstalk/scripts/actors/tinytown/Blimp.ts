﻿class Blimp extends TinyTownAnim {

    private vel: number = -50;
    
    constructor(instance: TinyTownAnimationType) {
        super(instance);       
    }

    public update(delta: number) {
        this.x += this.vel * delta;

        var w = this.sprite.getBounds().width;
        var bgw = beanstalk.screens.game.background.getBGWidth();

        if (this.x < -w -600)
            this.x = bgw;
       
    }

}