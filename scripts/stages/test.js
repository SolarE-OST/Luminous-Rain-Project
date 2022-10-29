import Phaser from "phaser";

import Stage from "../stage.js";

import * as Droplets from "../droplets/droplet.js";
import * as Motion from "../droplets/motion.js";
import {Patterns} from "../droplets/patterns.js";

import {Utils, Graphics} from "../common.js";

export default class Test extends Stage {
    constructor() {
        super("test");

        // Stage-specific variables
		this.title = "test stage plz ignore"; // Title of stage
		this.artist = "Eddie :D"; // Artist of track for stage (usually Sakuzyo lol)
		this.subtitle = "A past forgotten..."; // Subtitle (displayed under title)
		this.songDuration = "4:16"; // Duration of song, display only
        this.difficulty = 2; // Difficulty (1-10, sometimes 11, rarely 12)
		this.tempo = 190; // Starting tempo of track (in beats per minute BPM)
		this.offset = 0; // How long to wait after starting music: decrease if bullets are too early, increase if bullets are too late
		this.wait = 0; // How long to wait for music to start (may be obsolete)
		this.timeSignature = 6; // How many beats in each measure
		this.songPath = "assets/music/chapter1/LostMemory.mp3"; // Music file path location
		this.saveLoc = ["", ""]; // Save file location
		this.effects = false; // If true, initialize effects map
		this.startingBackgroundColor = "#1e1e46"; // self explanatory
    }

    buildBeatmap() {
        this.beatmap = [
            [],
            
            [
                [1, Patterns.explode({
                    x: 100,
                    y: 100,
                    num: 20,
                    speed: 3,
                    scatter: 0,
                    warnTime: this.getTime(2)
                })],
                [2, Patterns.explode({
                    x: 200,
                    y: 100,
                    num: 20,
                    speed: 3,
                    scatter: 0,
                    warnTime: this.getTime(8)
                })],
                [3, Patterns.explode({
                    x: 300,
                    y: 100,
                    num: 20,
                    speed: 3,
                    scatter: 0.2
                })],
                [4, Patterns.explode({
                    x: 400,
                    y: 100,
                    num: 20,
                    speed: 6,
                    scatter: 0
                })],
                [5, Patterns.explode({
                    x: 500,
                    y: 100,
                    num: 6,
                    speed: 3,
                    scatter: 0
                })],
                [6, Patterns.firework({
                    x: 300,
                    yf: 150,
                    num: 200,
                    speed: 10,
                    scatter: 1,
                    warnTime: this.getTime(1),
                })],
            ], [],
            [
                [1, Patterns.fall(100)],
                [1.25, Patterns.fall(200)],
                [1.5, Patterns.fall(300)],
                [1.75, Patterns.fall(400)],
                [2, Patterns.fall(500)],
                [2.25, Patterns.fall(400)],
                [2.5, Patterns.fall(300)],
                [2.75, Patterns.fall(200)],
                [3, Patterns.fall(100)],
            ], [],
            [
                [1, Patterns.rain({
                    duration: this.getTime(12)
                })]
            ], [],
            [
                [1, Patterns.single("source", {
                    output: {
                        motion: (x, y, n, m) => new Motion.Kinematic({x: x, y: y, vx: Math.cos(n / m * 2 * Math.PI), vy: Math.sin(n / m * 2 * Math.PI)}),
                        color: 0x8000ff
                    },
                    motion: new Motion.Kinematic({
                        x: 0,
                        y: 300,
                        vx: 5,
                        vy: -3,
                    }),
                    color: 0xff0000,
                    amount: [4, 6],
                    interval: 20
                })],
                [3, Patterns.single("source", {
                    output: {
                        motion: (x, y, n) => new Motion.Parametric({
                            f: (t) => {
                                let fx = 30 * Math.sin(t / 20) + x;
                                let fy = y + 2 * t;
                                return [fx, fy];
                            },
                        }),
                        color: 0x8000ff
                    },
                    motion: new Motion.Kinematic({
                        x: 600,
                        y: 100,
                        vx: -5,
                        vy: -0.5,
                        ay: 0.02
                    }),
                    color: 0xff0000,
                    interval: 20
                })]
            ], [],
            [
                [1, Patterns.stream({
                    motion: n => new Motion.Kinematic({
                        x: 600,
                        y: 300,
                        vx: -5,
                        vy: -5,
                    }),
                    r: n => 7- n / 4,
                    length: 12,
                    color: n => {
                        return Graphics.colNum(Phaser.Display.Color.Interpolate.RGBWithRGB(0, 128, 255, 255, 0, 0, 11, n));
                    }
                })]
            ],
            [
                [1, Patterns.single("droplet", {
                    motion: new Motion.Sequence({motionArray: [
                        new Motion.Kinematic({x: 0, y: 300, vx: 5, vy: -3, duration: 60}),
                        new Motion.LinearVector({x: 300, y: 210, mag: 10, dir: Math.PI / 2})
                    ]}),
                    r: 20,
                })]
            ]
        ]
    }
}