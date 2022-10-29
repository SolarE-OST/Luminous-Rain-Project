/**
 * @desc Base motion class for all motion types (technically same as Still)
 * @param x Initial x position
 * @param y Intiial y position
 * @param duration How long the motion lasts
 */
export class BaseMotion {
  constructor(x, y, duration) {
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.t = 0;
  }

  step(timeFactor = 1) {
    if (this.t < this.duration) {
      this.t += timeFactor;
    }
  }

  isComplete() {
    return this.t >= this.duration;
  }
}

/**
 * @desc Droplet stays still for some time (best used for sequential motions)
 * @param x X position
 * @param y Y position
 * @param duration How long it stays still
 */
export class Still extends BaseMotion {
  constructor({ x, y, duration }) {
    super(x, y, duration); //possibly useless? idk
  }
}

/**
 * @desc Droplet moves linearly from x, y to xf, yf (for initial position and direction, use LinearVector)
 * @param x Initial x position
 * @param y Intiial y position
 * @param xf Final x position
 * @param yf Final y position
 * @param duration How long the motion lasts
 */
export class Linear extends BaseMotion {
  constructor({ x, y, xf, yf, duration }) {
    super(x, y, duration);
    this.xf = xf;
    this.yf = yf;
    this.xStep = (xf - x) / duration;
    this.yStep = (yf - y) / duration;
  }

  step(timeFactor = 1) {
    super.step(timeFactor);
    if (this.t < this.duration) {
      this.x += this.xStep * timeFactor;
      this.y += this.yStep * timeFactor;
    }
  }
}

/**
 * @desc Droplet starts at x, y and moves in a certain direction (for initial position and final position, use Linear)
 * @param x Initial x position
 * @param y Intiial y position
 * @param mag Magnitude (speed) of motion
 * @param dir Direction (clockwise angle in rad from right direction) of motion
 * @param duration How long the motion lasts
 */
export class LinearVector extends BaseMotion {
  constructor({ x, y, mag, dir, duration = 999999 }) {
    super(x, y, duration);
    this.mag = mag;
    this.dir = dir;
    this.xStep = this.mag * Math.cos(this.dir);
    this.yStep = this.mag * Math.sin(this.dir);
  }

  step(timeFactor = 1) {
    super.step();
    if (this.t < this.duration) {
      this.x += this.xStep * timeFactor;
      this.y += this.yStep * timeFactor;
    }
  }
}

/**
 * @desc Droplet follows kinematic motion (initial position, velocity, acceleration)
 * @param x Initial x position
 * @param y Intiial y position
 * @param vx Initial x velocity
 * @param vy Initial y velocity
 * @param ax Initial x acceleration
 * @param ay Initial y acceleration
 * @param duration How long the motion lasts
 */
export class Kinematic extends BaseMotion {
  constructor({ x, y, vx = 0, vy = 0, ax = 0, ay = 0.05, duration = 999999 }) {
    super(x, y, duration);
    this.vx = vx;
    this.vy = vy;
    this.ax = ax;
    this.ay = ay;
  }

  step(timeFactor = 1) {
    super.step(timeFactor);
    if (this.t < this.duration) {
      this.x += this.vx * timeFactor;
      this.y += this.vy * timeFactor;
      this.vx += this.ax * timeFactor;
      this.vy += this.ay * timeFactor;
    }
  }
}

/**
 * @desc Droplet moves according to parametric function of format (t) => [x, y]
 * @param f Parametric function
 * @param duration How long the motion lasts
 */
export class Parametric extends BaseMotion {
  constructor({ f, duration = 999999 }) {
    super(f(0)[0], f(0)[1], duration);
    this.f = f;
  }

  step() {
    super.step();
    this.x = this.f(this.t)[0];
    this.y = this.f(this.t)[1];
  }
}

/**
 * @desc Made of multiple motions at different times; you will have to calculate the position of where one movement ends to begin the next yourself
 * @param motionArray List of motion objects
 */
export class Sequence extends BaseMotion {
  constructor({ motionArray }) {
    super(motionArray[0].x, motionArray[0].y, 999999);
    this.motionArray = motionArray;
    this.index = 0;
  }

  step(timeFactor) {
    super.step();
    let currentMotion = this.motionArray[this.index];
    currentMotion.step(timeFactor);
    this.x = currentMotion.x;
    this.y = currentMotion.y;
    if (currentMotion.isComplete()) {
      this.index++;
      if (this.index === this.motionArray.length) {
        this.t = this.duration;
      }
    }
  }
}

/*
export class CopyMotion {
    constructor(type, args) {
        this.type = type;
        this.args = args;
    }

    generateMovement(x, y) {
        if (typeof x !== "undefined") {
            this.args.x = x;
        }
        if (typeof y !== "undefined") {
            this.args.y = y;
        }
        switch (this.type) {
            case "still":
                return new Still(this.args);
            case "linear":
                return new Linear(this.args);
            case "kinematic":
                return new Kinematic(this.args)
            default:
                console.error(`Motion type "${this.type}" does not exist`);
        }
    }
}
*/
