import * as settings from "./constants.js";

import Phaser from "phaser";

export class BackgroundColorFade {
    constructor(startCol, targetCol, duration) {
        this.duration = duration;
        //let currentColor = scene.cameras.main.backgroundColor;
        //let currentColor = scene;
        let currentColor = Phaser.Display.Color.IntegerToRGB(startCol);
        this.ir = currentColor.r;
        this.ig = currentColor.g;
        this.ib = currentColor.b;
        let color = Phaser.Display.Color.IntegerToRGB(targetCol);
        this.fr = color.r;
        this.fg = color.g;
        this.fb = color.b;
        this.t = 0
    }
      
    run(scene, timeFactor=1) {
        let r = this.ir + (this.t) / this.duration * (this.fr - this.ir);
        let g = this.ig + (this.t) / this.duration * (this.fg - this.ig);
        let b = this.ib + (this.t) / this.duration * (this.fb - this.ib);
        let col = Phaser.Display.Color.RGBToString(r, g, b);
        scene.cameras.main.setBackgroundColor(col);
        this.t += timeFactor;
        //console.log(r, g, b)
    }
}