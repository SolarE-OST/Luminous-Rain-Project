import * as Droplets from "./droplet.js";
import * as Motion from "./motion.js";
import { Utils } from "../common.js";

/**
 * @desc Used to put droplets in a chart without needing to actually create the droplet objects
 */
export class Single {
  constructor(type, args) {
    this.type = type;
    this.args = args;
    this.offset = 0;
  }

  generate(scene) {
    switch (this.type) {
      case "droplet":
        return [new Droplets.Droplet(scene, this.args)];
      case "point warning":
        return [new Droplets.PointWarning(scene, this.args)];
      case "source":
        return [new Droplets.Source(scene, this.args)];
      default:
        console.error(`Droplet type "${this.type}" does not exist`);
    }
  }
}

export class Pattern {
  static tempo = 120;

  constructor() {
    this.dropletArray = [];
    this.offset = 0;
  }

  static getTime(beats) {
    return Math.round((beats / this.tempo) * 60 * 60);
  }

  generate(scene) {
    return this.dropletArray.map((d) => d.generate(scene)[0]);
  }
}

export class Explode extends Pattern {
  /**
   * @desc Explosion of droplets radiating from point
   * @param {number} x X position of explosion
   * @param {number} [y = 100] Y position of explosion
   * @param {number} [num = 6] Number of droplets in explosion
   * @param {number} [speed = 2] Speed of droplets in explosion
   * @param {number} [grav = 0.05] Gravity of droplets in explosion
   * @param {number} [rotation = -1] Rotational offset (set to -1 for random value)
   * @param {number} [scatter = 0] Minimum fraction that speed can be randomized to (set to 0 for no randomization)
   */
  constructor({
    x,
    y = 100,
    num = 6,
    speed = 2,
    grav = 0.05,
    rotation = -1,
    scatter = 0,
    warnTime = Pattern.getTime(4),

    other = {}
  }) {
    super();
    this.offset = -warnTime;
    let randomFactor = rotation === -1 ? Math.random() * 2 * Math.PI : rotation;

    this.dropletArray.push(
      new Single("point warning", {
        r: num * 2 + 10,
        x: x,
        y: y,
        time: warnTime
      })
    );

    for (let i = 0; i < num; i++) {
      this.dropletArray.push(
        new Single("droplet", {
          r: 4,
          delay: warnTime,

          motion: new Motion.Kinematic({
            x: x,
            y: y,
            vx:
              (1 - Math.random() * scatter) *
              speed *
              Math.cos((i / num) * 2 * Math.PI + randomFactor),
            vy:
              (1 - Math.random() * scatter) *
              speed *
              Math.sin((i / num) * 2 * Math.PI + randomFactor),
            ay: grav
          }),
          other: other
        })
      );
    }
  }
}

export class Falling extends Pattern {
  /**
   * @desc Droplet that follows kinematics and falls down, usually from top of screen
   * @param {number} x Initial x-position of droplet
   * @param {number} [y = 0] Initial y-position of droplet
   * @param {number} [vx = Utils.random(-0.2, 0.2)] Initial x-velocity of droplet
   * @param {number} [vy = 3] Initial y-velocity of droplet
   * @param {number} [grav = 0.05] How fast the droplet accelerates as it falls
   * @param {number} [warnTime = Pattern.getTime(4)] How long between warning and actual droplet
   */
  constructor({
    x,
    y = 0,
    vx = Utils.random(-0.2, 0.2),
    vy = 3,
    grav = 0.05,
    warnTime = Pattern.getTime(4),

    other = {}
  }) {
    super();
    if (warnTime > 0) {
      this.offset = -warnTime;
    }

    this.dropletArray.push(
      new Single("point warning", {
        r: 24,
        x: x,
        y: y,
        time: warnTime
      })
    );

    this.dropletArray.push(
      new Single("droplet", {
        delay: warnTime,
        motion: new Motion.Kinematic({
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          ay: grav
        }),
        other: other
      })
    );
  }
}

export class Rain extends Pattern {
  /**
   * @desc Rains droplets from top of screen
   * @param {number} [duration = Pattern.getTime(8)] How long the rain lasts
   * @param {number} [interval = 5] How many frames between each raindrop
   * @param {number} [vx = 0] Initial x-velocity of droplets
   * @param {number} [vy = 3] Initial y-velocity of droplets
   * @param {number} [grav = 0.01] How fast the rain accelerates
   * @param {number} [r = 4] Radius of droplets
   */
  constructor({
    duration = Pattern.getTime(8),
    interval = 5,
    vx = 0,
    vy = 3,
    grav = 0.01,
    r = 4,
    color = 0x0080ff,

    other = {}
  }) {
    super();
    for (let i = 0; i < duration / interval; i++) {
      this.dropletArray.push(
        new Single("droplet", {
          r: r,
          color: color,
          delay: i * interval + Utils.random(-interval / 2, interval / 2),
          motion: new Motion.Kinematic({
            x: Utils.random(0, 600),
            y: -r,
            vx: vx,
            vy: vy,
            ay: grav
          }),
          other: other
        })
      );
    }
  }
}

export class PathWarning extends Pattern {}

export class Firework extends Pattern {
  constructor({
    x,
    y = 610,
    xf = x,
    yf = 100,
    num = 6,
    speed = 2,
    grav = 0.05,
    rotation = -1,
    scatter = 0,
    warnTime = Pattern.getTime(1),

    other = {}
  }) {
    super();
    this.offset = -warnTime;
    let randomFactor = rotation === -1 ? Math.random() * 2 * Math.PI : rotation;

    this.dropletArray.push(
      new Single("droplet", {
        r: num / 10 + 4,
        motion: new Motion.Linear({
          x: x,
          y: y,
          xf: xf,
          yf: yf,
          duration: warnTime
        }),
        decorative: true,
        color: 0xff0000,
        life: warnTime
      })
    );

    for (let i = 0; i < num; i++) {
      this.dropletArray.push(
        new Single("droplet", {
          r: 4,
          delay: warnTime,

          motion: new Motion.Kinematic({
            x: xf,
            y: yf,
            vx:
              (1 - Math.random() * scatter) *
              speed *
              Math.cos((i / num) * 2 * Math.PI + randomFactor),
            vy:
              (1 - Math.random() * scatter) *
              speed *
              Math.sin((i / num) * 2 * Math.PI + randomFactor),
            ay: grav
          }),
          other: other
        })
      );
    }
  }
}

export class Stream extends Pattern {
  /**
   * @desc Multiple droplets that follow each other
   * @param {number} [length = 8] How many droplets in the stream (including first droplet)
   * @param {number} [spacing = 4] How many frames between each droplet in the stream
   * @param {number} [motion] The *function* that creates a motion object ( format: (n) => {new Motion}, n = index of droplet (0 = 1st, 1 = 2nd, etc.) )
   * @param {boolean} [warn = true] If there should be a warning of the path of the stream
   * @param {number|function} [r = 4] Radius of droplets, can also be function (format: (n) => {r}, n = index)
   * @param {number|function} [color = 0x0080ff] Color of droplets, can also be function (format: (n) => {color}, n = index)
   */
  constructor({
    length = 8,
    spacing = 8,
    motion,
    warn = true,
    r = 4,
    color = 0x0080ff,

    other = {}
  }) {
    super();
    for (let i = 0; i < length * spacing; i += spacing) {
      this.dropletArray.push(
        new Single("droplet", {
          r: typeof r === "function" ? r(i / spacing) : r,
          color: typeof color === "function" ? color(i / spacing) : color,
          delay: i,
          motion: motion(i / spacing),
          other: other
        })
      );
    }
  }
}

export const Patterns = {
  single: (type, args) => new Single(type, args),

  explode: (args) => new Explode(args),

  falling: (args) => new Falling(args),

  fall: (x) => new Falling({ x: x }),

  rain: (args) => new Rain(args),

  pathWarning: (args) => new PathWarning(args),

  firework: (args) => new Firework(args),

  stream: (args) => new Stream(args)
};
