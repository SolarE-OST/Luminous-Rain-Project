import Phaser from "phaser";
import { Graphics } from "../common.js";
import * as settings from "../constants.js";

export default class Pause extends Phaser.Scene {
    constructor() {
        super("Pause");
        Object.assign(this, Graphics);
    }

    preload() {
        this.load.audio("select", "assets/sfx/select.wav");
        this.load.audio("ok", "assets/sfx/ok.wav");
        this.load.image("glow particle", "assets/particle.png");
    }

    create(data) {
        this.currentLevel = data.levelName;
        this.progress = Math.min(Math.max(data.progress, 0), 100);
        this.title = data.title;
        this.composer = data.composer;

        this.resuming = -1;
        this.globalAlpha = 0;
        this.select = this.sound.add("select");
        this.ok = this.sound.add("ok");
        this.select.volume = settings.soundEffectVolume;
        this.ok.volume = settings.soundEffectVolume;
        this.ok.play();

        this.input.keyboard.on("keydown-ESC", () => {
            this.ok.play();
            if (this.globalAlpha === 1 && this.resuming === -1) {
                this.resuming = 180;
            }
        });

        this.gui = this.add.group();
        this.blackout = this.add.rectangle(300, 300, 600, 600, 0, 0);
        /*
        this.gui.addMultiple(
            this.glowingText(
                300,
                100,
                this.title,
                600 / Math.max(10, this.title.length)
            ),
            true
        );
        this.gui.addMultiple(this.glowingText(300, 150, this.composer, 40), true);*/
        this.gui.addMultiple(
            this.glowingText(
                300,
                100,
                "Progress: " + Math.floor(this.progress * 100) + "%",
                50
            ),
            true
        );

        this.countdownText = this.add
            .text(300, 180, "3", {
                fontSize: 100,
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
            .setAlpha(0);

        this.gui.add(
            this.button({
                x: 300,
                y: 300,
                w: 300,
                h: 70,
                text: "Resume",
                callback: () => {
                    this.resuming = 180;
                }
            })
        );
        this.gui.add(
            this.button({
                x: 300,
                y: 400,
                w: 300,
                h: 70,
                text: "Retry",
                callback: () => {
                    this.cameras.main.fadeOut(1000);
                    this.cameras.main.once(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        (cam, effect) => {
                            this.scene.stop();
                            this.scene.stop(this.currentLevel);
                            this.scene.start(this.currentLevel, {
                                retrying: true
                            });
                        }
                    );
                }
            })
        );
        this.gui.add(
            this.button({
                x: 300,
                y: 500,
                w: 300,
                h: 70,
                text: "Quit",
                callback: () => {
                    this.cameras.main.fadeOut(1000);
                    this.cameras.main.once(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        (cam, effect) => {
                            this.scene.stop();
                            this.scene.stop(this.currentLevel);
                            this.scene.start("Main Menu");
                        }
                    );
                }
            })
        );

        this.scene.moveAbove(this.currentLevel);
    }

    update() {
        if (this.resuming === -1) {
            if (this.globalAlpha < 1) {
                this.globalAlpha += 0.15;
            } else {
                this.globalAlpha = 1;
            }
        }

        this.blackout.fillAlpha = this.globalAlpha * 0.8;
        for (let child of this.gui.getChildren()) {
            child.setAlpha(this.globalAlpha);
        }

        if (this.resuming > 0) {
            this.resuming--;
            this.globalAlpha = Math.max(this.resuming - 60, 0) / 120;
            if (this.resuming > 120) {
                this.countdownText.text = "3";
                this.countdownText.alpha = 1;
            } else if (this.resuming > 60) {
                this.countdownText.text = "2";
            } else if (this.resuming > 0) {
                this.countdownText.text = "1";
            } else {
                this.scene.stop();
                //console.log(this.levelName);
                this.scene.resume(this.currentLevel);
            }
        }
    }
}
