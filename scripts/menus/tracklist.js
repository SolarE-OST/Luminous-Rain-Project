import Phaser from "phaser";

import { Graphics, MusicScenes, Utils } from "../common.js";
import * as settings from "../constants.js";

import { Stages } from "../stage_directory.js";


export default class Tracklist extends Phaser.Scene {
    constructor() {
        super("Tracklist");

        Object.assign(this, Graphics);
        Object.assign(this, MusicScenes);
    }

    preload() {
        this.load.image("glow particle", "assets/particle.png");
        this.load.audio("select", "assets/sfx/select.wav");
        this.load.audio("ok", "assets/sfx/ok.wav");

        this.load.audio("menumusic", "assets/music/menu/0f.mp3");
    }

    generateTracklist() {
        this.stageButtons = this.add.group();
        let buttonY = 100;
        for (let chapter in Stages) {
            for (let stage of Stages[chapter].stages) {
                let short = Stages[chapter].short + "-" + stage.short;
                this.stageButtons.add(
                    this.button({
                        x: 300,
                        y: buttonY,
                        w: 500,
                        h: 70,
                        text: short + ": " + stage.obj.title,
                        fontSize: 40,
                        align: "left",
                        xscale: Math.min(1, 19 / (stage.obj.title.length + 6)),
                        callback: this.sceneTransition(stage.key, true)
                    })
                );
                buttonY += 90;
            }
        }
    }

    create(data) {
        this.select = this.sound.add("select");
        this.ok = this.sound.add("ok");
        this.select.volume = settings.soundEffectVolume;
        this.ok.volume = settings.soundEffectVolume;
        if (data.music.isPlaying) {
            this.music = data.music;
            this.ampPrevArray = new Array(settings.flickerSmoothLen).fill(0);
        } else {
            this.initMusic("menumusic");
            this.music.play({seek: 15.9});
        }

        this.generateTracklist();

        this.scroll = 0;

        this.input.on("wheel", (pointer, gameObjects, dx, dy, dz) => {
            if (!(this.stageButtons.getChildren()[0].getChildren()[0].y > 200 && dy > 0) && !(this.stageButtons.getChildren()[this.stageButtons.getLength() - 1].getChildren()[0].y < 400 && dy < 0)) {
                for (let stageButton of this.stageButtons.getChildren()) {
                    stageButton.incY(dy * -0.5);
                }
            }
            if (this.stageButtons.getChildren()[0].getChildren()[0].y > 200) {
                let buttonY = 200;
                for (let button of this.stageButtons.getChildren()) {
                    button.setY(buttonY);
                    buttonY += 90;
                }
            } else if (this.stageButtons.getChildren()[this.stageButtons.getLength() - 1].getChildren()[0].y < 400) {
                let buttonY = 400;
                for (let i = this.stageButtons.getLength() - 1; i >= 0; i--) {
                    this.stageButtons.getChildren()[i].setY(buttonY);
                    buttonY -= 90;
                }
            }
        });


        
        this.rainfall(0);
        this.cameras.main.setBackgroundColor("#1e1e46");
        this.cameras.main.fadeIn(2000, 0, 0, 0);
        
    }

    update() {
    }
}