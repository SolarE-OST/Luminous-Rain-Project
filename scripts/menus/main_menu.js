import Phaser from "phaser";

import { Graphics, MusicScenes, Utils } from "../common.js";
import * as settings from "../constants.js";


export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("Main Menu");

        Object.assign(this, Graphics);
        Object.assign(this, MusicScenes);
    }

    preload() {
        this.load.image("glow particle", "assets/particle.png");
        this.load.audio("select", "assets/sfx/select.wav");
        this.load.audio("ok", "assets/sfx/ok.wav");

        this.load.audio("menumusic", "assets/music/menu/0f.mp3");
    }

    create(data) {
        this.select = this.sound.add("select");
        this.ok = this.sound.add("ok");
        this.select.volume = settings.soundEffectVolume;
        this.ok.volume = settings.soundEffectVolume;
        if (data.music !== undefined && data.music.isPlaying) { 
            this.music = data.music;
            this.ampPrevArray = new Array(settings.flickerSmoothLen).fill(0);
        } else {
            this.initMusic("menumusic");
            //this.music.play({seek: 15.9});
        }
        this.transitioning = false;
        

        this.titleText = this.glowingText(450, 120, "Luminous Rain", 100, "#f0f076", 3);

        this.button({x: 450, y: 250, w: 650, h: 70, text: "Play (World, NYI)", 
            callback: this.sceneTransition("Tracklist", false, { //change scene key later
                music: this.music
            }),
        });
        this.button({x: 450, y: 340, w: 650, h: 70, text: "Play (Tracklist)", 
            callback: this.sceneTransition("Tracklist", false, {
                music: this.music
            }),
        });

        this.rainfall();


        this.cameras.main.setBackgroundColor("#1e1e46");
        this.cameras.main.fadeIn(2000, 0, 0, 0);
    }

    update() {
        if (!this.music.isPlaying && !this.transitioning) {
            this.music.play({seek: 15.9});
        }

        this.cameras.main.pan((this.input.mousePointer.x + 910) * 0.3, (this.input.mousePointer.y + 700) * 0.3, 100, Phaser.Math.Easing.Quadratic.InOut, true);

        this.setFlicker();
        this.titleText.getChildren()[0].setStroke("#f0f076", this.flicker * 6);
        for (let singleText of this.titleText.getChildren()) {
            singleText.setShadowBlur(this.flicker * 30);
        }
        this.luminousRainfall[0].setScale(this.flicker * 0.15 + 0.08);
        this.luminousRainfall[1].setScale(this.flicker * 0.2 + 0.1);
        this.luminousRainfall[2].setScale(this.flicker * 0.3 + 0.15);
        this.luminousRainfall[3].setScale(this.flicker * 0.4 + 0.2);
    }
}

