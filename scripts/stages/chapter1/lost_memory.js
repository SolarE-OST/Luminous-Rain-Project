import Phaser from "phaser";

import Stage from "../../stage.js";

import * as Droplets from "../../droplets/droplet.js";
import * as Motion from "../../droplets/motion.js";
import {Patterns} from "../../droplets/patterns.js";

import {Utils, Graphics} from "../../common.js";

export default class LostMemory extends Stage {
    constructor() {
        super("Lost Memory");

        // Stage-specific variables
		this.title = "Lost Memory"; // Title of stage
		this.artist = "Sakuzyo"; // Artist of track for stage (usually Sakuzyo lol)
		this.subtitle = "A past forgotten..."; // Subtitle (displayed under title)
		this.songDuration = "4:16"; // Duration of song, display only
        this.difficulty = 2; // Difficulty (1-10, sometimes 11, rarely 12)
		this.tempo = 190; // Starting tempo of track (in beats per minute BPM)
		this.offset = 16; // How long to wait after starting music: increase if droplets are too early, decrease if droplets are too late
		this.wait = 0; // How long to wait for music to start (may be obsolete)
		this.timeSignature = 6; // How many beats in each measure
		this.songPath = "assets/music/chapter1/LostMemory.mp3"; // Music file path location
		this.saveLoc = ["", ""]; // Save file location
		this.effects = false; // If true, initialize effects map
		this.startingBackgroundColor = "#1e1e46"; // self explanatory
    }

    buildBeatmap() {
        this.beatmap = [
            [
                [1, Patterns.rain({
                    duration: this.getTime(42),
                    interval: 12,
                    vy: 2,
                    other: {
                        color: 0x0080ff
                    }
                })],
            ], [], [], [], [], [], [],
            [
                [1, Patterns.explode({x: Utils.random(50, 550)})],
                [1, Patterns.rain({
                    duration: this.getTime(24),
                    interval: 15,
                    vy: 2,
                    other: {
                        color: 0x00bbff
                    }
                })]
            ],
            [[1, Patterns.explode({x: Utils.random(50, 550)})]],
            [[1, Patterns.explode({x: Utils.random(50, 550)})]],
            [
                [1, Patterns.explode({x: Utils.random(50, 550)})],
                [6.5, Patterns.fall(500)],
            ],
            [
                [1, Patterns.rain({
                    duration: this.getTime(24),
                    interval: 15,
                    vy: 2,
                    other: {
                        color: 0x00ffff
                    }
                })],
                [1, Patterns.explode({x: Utils.random(50, 550)})],
                [1, Patterns.fall(550)],
                [1.5, Patterns.fall(Utils.random(525, 575))],
                [2.5, Patterns.fall(Utils.random(525, 575))],
                [3.5, Patterns.fall(Utils.random(525, 575))],
                [4, Patterns.fall(Utils.random(525, 575))],
                [5.5, Patterns.fall(Utils.random(525, 575))],
                [6, Patterns.fall(Utils.random(525, 575))],
                [6.5, Patterns.fall(Utils.random(525, 575))],
            ],
            [
                [1, Patterns.explode({x: Utils.random(50, 550)})],
                [1, Patterns.fall(Utils.random(525, 575))],
                [1.5, Patterns.fall(Utils.random(525, 575))],
                [2.5, Patterns.fall(Utils.random(525, 575))],
                [3.5, Patterns.fall(Utils.random(525, 575))],
                [4, Patterns.fall(Utils.random(525, 575))],
                [5.5, Patterns.fall(Utils.random(525, 575))],
                [6, Patterns.fall(Utils.random(525, 575))],
                [6.5, Patterns.fall(Utils.random(525, 575))],
            ],
            [
                [1, Patterns.explode({x: Utils.random(50, 550)})],
                [1, Patterns.fall(Utils.random(525, 575))],
                [1.5, Patterns.fall(Utils.random(525, 575))],
                [2.5, Patterns.fall(Utils.random(525, 575))],
                [3.5, Patterns.fall(Utils.random(525, 575))],
                [4, Patterns.fall(Utils.random(525, 575))],
                [5.5, Patterns.fall(Utils.random(525, 575))],
                [6, Patterns.fall(Utils.random(525, 575))],
                [6.5, Patterns.fall(Utils.random(525, 575))],
            ],
            [
                [1, Patterns.explode({x: Utils.random(50, 550)})],
                [1, Patterns.fall(Utils.random(525, 575))],
                [1.5, Patterns.fall(Utils.random(525, 575))],
                [2, Patterns.fall(Utils.random(525, 575))],
                [2.5, Patterns.fall(Utils.random(525, 575))],
                [3.5, Patterns.fall(Utils.random(525, 575))],
                [4, Patterns.fall(Utils.random(525, 575))],
                [4.5, Patterns.fall(Utils.random(525, 575))],
                [5, Patterns.fall(Utils.random(525, 575))],
                [5.5, Patterns.fall(Utils.random(525, 575))],
                [6.5, Patterns.fall(Utils.random(525, 575))],
            ],
            [
                [1, Patterns.rain({
                    duration: this.getTime(24),
                    interval: 15,
                    vy: 2,
                    other: {
                        color: 0x00ffff
                    }
                })],
                [1, Patterns.firework({x: 200})],
                [4, Patterns.firework({x: 400})],
            ],
            [
                [4, Patterns.explode({x: 120, y: 100, num: 3})],
                [5, Patterns.explode({x: 240, y: 100, num: 3})],
                [6, Patterns.explode({x: 360, y: 100, num: 3})],
            ],
            [
                [1, Patterns.firework({x: 0, y: 100, xf: 480, yf: 100, warnTime: this.getTime(4)})],
                [6, Patterns.fall(525)],
                [6.5, Patterns.fall(450)]
            ],
            [
                [1, Patterns.fall(375)],
                [2, Patterns.fall(450)],
                [3, Patterns.fall(75)],
                [4, Patterns.fall(300)],
                [5, Patterns.fall(225)],
                [6, Patterns.fall(75)],
            ],
            [
                [1, Patterns.rain({
                    duration: this.getTime(21),
                    interval: 15,
                    vy: 2,
                    other: {
                        color: 0x00ffff
                    }
                })],
                [1, Patterns.firework({x: 200})],
                [4, Patterns.firework({x: 400})],
            ],
            [
                [4, Patterns.explode({x: 120, y: 100, num: 3})],
                [5, Patterns.explode({x: 240, y: 100, num: 3})],
                [6, Patterns.explode({x: 360, y: 100, num: 3})],
            ],
            [
                [1, Patterns.firework({x: 0, y: 100, xf: 480, yf: 100, warnTime: this.getTime(4)})],
                [6, Patterns.fall(525)],
                [6.5, Patterns.fall(450)]
            ],
            [
                [1, Patterns.fall(375)],
                [2, Patterns.fall(450)],
                [3, Patterns.fall(75)],
                [3, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 0, y: 200, xf: 400, yf: 40, duration: this.getTime(4) - 1})
                })]
            ],
            [
                [2, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 600, y: 200, xf: 350, yf: 50, duration: this.getTime(2) - 1})
                })],
                [4, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 0, y: 150, xf: 350, yf: 50, duration: this.getTime(3) - 1})
                })],
            ],
            [
                [1, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({ x: 600, y: 100, xf: 200, yf: 50, duration: this.getTime(3) - 1})
                })],
                [4, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({ x: 0, y: 250, xf: 400, yf: 100, duration: this.getTime(3) - 1})
                })]
            ],
            [
                [2, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 600, y: 200, xf: 350, yf: 50, duration: this.getTime(2) - 1})
                })],
                [4, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 0, y: 150, xf: 350, yf: 50, duration: this.getTime(3) - 1})
                })],
            ],
            [
                [1, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({ x: 600, y: 100, xf: 200, yf: 50, duration: this.getTime(3) - 1})
                })],
                [6, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({ x: 0, y: 250, xf: 200, yf: 100, duration: this.getTime(1) - 2})
                })],

            ],
            [
                [2, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 600, y: 200, xf: 350, yf: 50, duration: this.getTime(2) - 1})
                })],
                [4, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 0, y: 150, xf: 350, yf: 50, duration: this.getTime(3) - 1})
                })],
            ],
            [
                [1, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: [0, 1, 0, 1, 1, 0],
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(0.5),
                    motion: new Motion.Linear({ x: 600, y: 100, xf: 200, yf: 50, duration: this.getTime(3) - 1})
                })],
                [4, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({ x: 0, y: 250, xf: 400, yf: 100, duration: this.getTime(3) - 1})
                })]
            ],
            [
                [2, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 600, y: 200, xf: 350, yf: 50, duration: this.getTime(2) - 1})
                })],
                [4, Patterns.single("source", {
                    decorative: true,
                    color: 0xff0000,
                    r: 7,
                    output: {
                        motion: (x, y) => new Motion.Kinematic({x: x, y: y, vy: 2, ay: 0.03}),
                        color: 0x0000ff,
                    },
                    amount: 1,
                    ending: {
                        motion: (x, y, n, m, r) => new Motion.Kinematic({x: x, y: y, vx: Utils.vec(2, n/m + r * Utils.pi2)[0], vy: Utils.vec(2, n/m + r * Utils.pi2)[1], ay: 0.03}),
                        color: 0x8000ff
                    },
                    endingAmount: 4,
                    interval: this.getTime(1),
                    motion: new Motion.Linear({x: 0, y: 150, xf: 350, yf: 50, duration: this.getTime(3) - 1})
                })],
            ],
            [],
            [
                [1, Patterns.firework({
                    x: 0,
                    y: 80,
                    xf: 450,
                    yf: 80,
                    warnTime: this.getTime(3),
                    other: { color: 0xff0000 }
                })],
                [1, Patterns.firework({
                    x: 0,
                    y: 80,
                    xf: 300,
                    yf: 80,
                    warnTime: this.getTime(2),
                    other: { color: 0xff0000 }
                })],
                [1, Patterns.firework({
                    x: 0,
                    y: 80,
                    xf: 150,
                    yf: 80,
                    warnTime: this.getTime(1),
                    other: { color: 0xff0000 }
                })],
            ],
        ];
    }
}