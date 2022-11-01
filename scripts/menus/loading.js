import Phaser from "phaser";
import { Graphics } from "../common.js";

export default class Loading extends Phaser.Scene {
    constructor() {
        super("Loading");
        Object.assign(this, Graphics);
    }

    preload() {
        this.load.image("glow particle", "assets/particle.png");
    }

    create(parentStage) {
        this.parentStage = parentStage;
        this.scene.moveAbove(this.parentStage.levelName);
        this.glowParticle = this.add.particles("glow particle");
        this.loadingCircle = this.glowParticle.createEmitter({
            tint: 0x4070ff,
            x: 300,
            y: 320,
            scale: { start: 0.5, end: 0, ease: Phaser.Math.Easing.Quintic.Out },
            blendMode: "ADD",
            frequency: 30,
            emitZone: {
              type: "edge",
              source: new Phaser.Geom.Circle(0, 0, 50),
              quantity: 36,
              yoyo: false
            }
        });
        this.loadingText = this.glowingText(300, 200, "Loading...", 50);
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    update() {
        if (this.parentStage.doneLoading) {
            this.loadingCircle.stop();
            this.tweens
                .add({
                    targets: this.loadingText.getChildren(),
                    alpha: 0,
                    ease: "Quintic.easeIn",
                    duration: 50,
                    delay: 0,
                    repeat: 0
                })
                .on("complete", () => {
                    this.scene.stop();
                });
        }
    }
}