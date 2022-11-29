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
        let buttonY = 300;
        for (let chapter in Stages) {
            for (let stage of Stages[chapter].stages) {
                let short = Stages[chapter].short + "-" + stage.short;
                this.stageButtons.add(
                    this.button({
                        x: 275,
                        y: buttonY,
                        w: 450,
                        h: 70,
                        text: short + ": " + stage.obj.title,
                        fontSize: 40,
                        align: "left",
                        xscale: Math.min(1, 17 / (stage.obj.title.length + 6)),
                        callback: this.sceneTransition(stage.key, true),
                        data: stage
                        /*
                        onHover: () => {
                            let stageInfo = this.add.group();
                            stageInfo.add(this.add.rectangle(700, 300, 300, 500, 0xaaaaaa).setAlpha(0.7).setScrollFactor(0.1));
                            stageInfo.add(this.add.text(700, 100, stage.obj.title, {
                                fontSize: 400 / Math.max(10, stage.obj.title.length),
                                align: "center",
                                color: "#f0f076",
                                stroke: "#f0f076",
                                strokeThickness: 1,
                                padding: {
                                  x: 60,
                                  y: 60
                                }
                            })
                                .setShadow(0, 0, "#f0f076", 20)
                                .setOrigin(0.5, 0.5)
                                .setScrollFactor(0.1)
                            );
                            stageInfo.add(this.add.text(700, 150, stage.obj.artist, {
                                fontSize: 20,
                                align: "center",
                                color: "#f0f076",
                                stroke: "#f0f076",
                                strokeThickness: 1,
                                padding: {
                                  x: 60,
                                  y: 60
                                }
                            })
                                .setShadow(0, 0, "#f0f076", 20)
                                .setOrigin(0.5, 0.5)
                                .setScrollFactor(0.1)
                            );
                            stageInfo.add(this.add.text(570, 450, "Difficulty: " + stage.obj.difficulty, {
                                fontSize: 20,
                                align: "left",
                                color: "#ffffff",
                            })
                                .setOrigin(0, 0.5)
                                .setScrollFactor(0.1)
                            );
                            stageInfo.add(this.add.text(570, 475, "Length: " + stage.obj.songDuration, {
                                fontSize: 20,
                                align: "left",
                                color: "#ffffff",
                            })
                                .setOrigin(0, 0.5)
                                .setScrollFactor(0.1)
                            );
                            stageInfo.add(this.add.text(570, 500, "Tempo: " + stage.obj.tempo + " BPM", {
                                fontSize: 20,
                                align: "left",
                                color: "#ffffff",
                            })
                                .setOrigin(0, 0.5)
                                .setScrollFactor(0.1)
                            );
                            stageInfo.add(this.add.rectangle(700, 300, 250, 250, 0x777777).setScrollFactor(0.1));
                            stageInfo.add(this.add.text(700, 300, "Pretend\nthere's some\nreally cool\nartwork here", {
                                fontSize: 28,
                                align: "center",
                                color: "#ffffff"
                            })
                                .setOrigin(0.5, 0.5)
                                .setScrollFactor(0.1)
                            );


                            return stageInfo;
                        }*/
                    })
                );
                buttonY += 90;
            }
        }
    }

    createStageInfo() {
        this.stageInfo = this.add.group();
        let stage = this.stageButtons.getChildren()[this.buttonIndex].data;
        this.stageInfo.add(this.add.rectangle(700, 300, 300, 500, 0xaaaaaa).setAlpha(0.7).setScrollFactor(0.1));
        this.stageInfo.add(this.add.text(700, 100, stage.obj.title, {
            fontSize: 400 / Math.max(10, stage.obj.title.length),
            align: "center",
            color: "#f0f076",
            stroke: "#f0f076",
            strokeThickness: 1,
            padding: {
                x: 60,
                y: 60
            }
        })
            .setShadow(0, 0, "#f0f076", 20)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0.1)
        );
        this.stageInfo.add(this.add.text(700, 150, stage.obj.artist, {
            fontSize: 20,
            align: "center",
            color: "#f0f076",
            stroke: "#f0f076",
            strokeThickness: 1,
            padding: {
                x: 60,
                y: 60
            }
        })
            .setShadow(0, 0, "#f0f076", 20)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0.1)
        );
        this.stageInfo.add(this.add.text(570, 450, "Difficulty: " + stage.obj.difficulty, {
            fontSize: 20,
            align: "left",
            color: "#ffffff",
        })
            .setOrigin(0, 0.5)
            .setScrollFactor(0.1)
        );
        this.stageInfo.add(this.add.text(570, 475, "Length: " + stage.obj.songDuration, {
            fontSize: 20,
            align: "left",
            color: "#ffffff",
        })
            .setOrigin(0, 0.5)
            .setScrollFactor(0.1)
        );
        this.stageInfo.add(this.add.text(570, 500, "Tempo: " + stage.obj.tempo + " BPM", {
            fontSize: 20,
            align: "left",
            color: "#ffffff",
        })
            .setOrigin(0, 0.5)
            .setScrollFactor(0.1)
        );
        this.stageInfo.add(this.add.rectangle(700, 300, 250, 250, 0x777777).setScrollFactor(0.1));
        this.stageInfo.add(this.add.text(700, 300, "Pretend\nthere's some\nreally cool\nartwork here", {
            fontSize: 28,
            align: "center",
            color: "#ffffff"
        })
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0.1)
        );
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
            //this.music.play({seek: 15.9});
        }
        this.transitioning = false;


        this.generateTracklist();

        this.button({
            x: 845,
            y: 25,
            w: 100,
            h: 40,
            text: "Back",
            callback: this.sceneTransition("Main Menu", false, {
                music: this.music
            }),
            fontSize: 20,
            scrollFactor: 0
        });

        this.add.rectangle(275, 300, 550, 90, 0xdddddd, 0.2).setScrollFactor(0.1);

        this.scrollbarLimit = 600 / (this.stageButtons.getLength() + 1)
        this.scrollbar = this.add.rectangle(10, this.scrollbarLimit, 20, this.scrollbarLimit * 2, 0xaaaaaa, 0.7).setScrollFactor(0);
        this.scrollbarY = this.scrollbarLimit;
        

        /*
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
        */
        this.scroll = 0;
        this.targetY = 300;
        this.buttonY = 300;
        this.buttonIndex = 0;
        this.prevIndex = 0;

        this.input.on("wheel", (pointer, gameObjects, dx, dy, dz) => {
            //console.log(this.scroll);
            if (this.scroll >= 0 && this.scroll <= 90 * (this.stageButtons.getLength() - 1)) {
                this.scroll += dy * 0.5;
                this.scroll = Math.min(90 * (this.stageButtons.getLength() - 1), Math.max(0, this.scroll));
                this.buttonIndex = Math.round(this.scroll / 90);
                this.targetY = 300 - this.buttonIndex * 90;
                this.scrollbarY = (this.buttonIndex + 1) * this.scrollbarLimit
            } else {
                this.scroll = (this.scroll < 0) ? 0 : 90 * (this.stageButtons.getLength() - 1)
            }

            
        });

        this.createStageInfo();

       




        
        this.rainfall(0);
        this.cameras.main.setBackgroundColor("#1e1e46");
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
    }

    update() {
        if (!this.music.isPlaying && !this.transitioning) {
            this.music.play({seek: 15.9});
        }

        this.buttonY -= (this.buttonY - this.targetY) * 0.3
        this.scrollbar.y -= (this.scrollbar.y - this.scrollbarY) * 0.3;

        let tempY = this.buttonY;
        for (let button of this.stageButtons.getChildren()) {
            button.setY(tempY);
            tempY += 90;
        }


        if (this.prevIndex !== this.buttonIndex) {
            this.stageInfo.destroy(true, true);
            this.createStageInfo();
        }
        this.prevIndex = this.buttonIndex;
    


        this.cameras.main.pan((this.input.mousePointer.x + 910) * 0.3, (this.input.mousePointer.y + 700) * 0.3, 100, Phaser.Math.Easing.Quadratic.InOut, true);
    }
}