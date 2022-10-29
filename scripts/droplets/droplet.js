import * as settings from "../constants.js";

//import Phaser from "phaser";

import * as Motion from "./motion.js";

class MovingElement {
  constructor(motion, life = motion.duration, delay = 0, autodelete = true) {
    this.motion = motion;
    this.setPosition();
    this.life = life;
    this.age = 0;
    this.delay = delay;

    this.autodelete = autodelete;
    this.setDelete = false;

    this.display = {};
  }

  setPosition() {
    this.x = this.motion.x;
    this.y = this.motion.y;
    for (let element in this.display) {
      this.display[element].x = this.x;
      this.display[element].y = this.y;
    }
  }

  checkBoundaries() {
    return (
      this.x > -settings.outerMargin &&
      this.x < 600 + settings.outerMargin &&
      this.y > -settings.outerMargin &&
      this.y < 600 + settings.outerMargin
    );
  }

  move(dt=1) {
    if (this.age < this.life && this.delay === -1) {
      this.motion.step(dt);
      this.setPosition();
      this.age += dt;

      if (this.autodelete && !this.checkBoundaries()) {
        this.setDelete = true;
      }
    } else {
      if (this.age >= this.life && this.autodelete) {
        this.setDelete = true;
      }
      if (this.delay > 0) {
        this.delay -= dt;
        for (let displayElement in this.display) {
          this.display[displayElement].visible = false;
          this.display[displayElement].active = false;
        }
      } else {
        this.delay = -1;
        for (let displayElement in this.display) {
          this.display[displayElement].visible = true;
          this.display[displayElement].active = true;
        }
      }
    }
  }
}

export class Droplet extends MovingElement {
  constructor(
    scene,
    {
      motion,
      r = 4,
      color = 0x0080ff,
      life = motion.duration,
      decorative = false,
      delay = 0,

      autodelete = true,
      other = {}
    }
  ) {
    super(motion, life, delay, autodelete);
    this.r = r;
    this.delay = delay;
    this.color = color;
    this.decorative = decorative;
    this.grazed = false;

    for (let k in other) {
      this[k] = other[k];
    }

    this.display = {
      glow: scene.glow.add(
        scene.add.pointlight(this.x, this.y, this.color, this.r * 4, 0.6, 0.07)
      )
    };

    if (!decorative) {
      this.display.core = scene.add.ellipse(
        this.x,
        this.y,
        this.r * 2,
        this.r * 2,
        0xffffff
      );
      this.display.core.parentDroplet = this;
      scene.collidingDroplets.add(this.display.core);
    }
  }
}

export class PointWarning extends Droplet {
  constructor(
    scene,
    {
      x,
      y,
      time,
      r = 4,
      ease = "linear",

      other = {}
    }
  ) {
    super(scene, {
      motion: new Motion.Still({ x: x, y: y, duration: time }),
      r: r,
      color: 0xff0000,
      life: time,
      decorative: true,
      delay: 0,
      autodelete: true,

      other: other
    });
    this.display.glow.radius = r;
    this.display.glow.intensity = 0.4;
    this.display.glow.attenuation = 0.1;

    this.ease = ease;
    this.display.glow.setAlpha(0);
  }

  move(dt=1) {
    super.move(dt);
    switch (this.ease) {
      case "linear":
        this.display.glow.setAlpha(
          (this.age / this.life) * settings.warningAlpha
        );
        break;
      default:
        console.error(
          `Ease type "${this.ease}" for PointWarning does not exist`
        );
    }
  }
}

export class Source extends Droplet {
  constructor(
    scene,
    {
      type = "droplet",
      output, // must be argument list
      ending = {},
      endingAmount = 0,
      amount = 1, //can be array
      interval = 5,
      motion,
      r = 10,
      color = 0x0080ff,
      life = motion.duration,
      decorative = false,
      delay = 0,
      times = 999999,

      other = {}
    }
  ) {
    super(scene, {
      motion: motion,
      r: r,
      color: color,
      life: life,
      decorative: decorative,
      delay: delay,

      autodelete: false,
      other: other
    });
    this.type = type;

    this.motionFunction = output.motion;
    this.colorFunction = output.color;
    this.rFunction = output.r;
    this.output = output;
    this.output.motion = null;
    this.output.color = null;
    this.output.r = null;

    this.endingMotion = ending.motion;
    this.endingColor = ending.color;
    this.endingR = ending.r;
    this.ending = ending;
    this.ending.motion = null;
    this.ending.color = null;
    this.ending.r = null;
    this.endingAmount = endingAmount;

    this.amountArray = amount instanceof Array ? amount : [amount];
    this.amountCounter = 0;
    this.interval = interval;
    this.t = 0;
    this.times = 0;
    this.totalTimes = times;
    this.ended = false;
  }

  generate(scene, dt=1) {
    this.t += dt;
    if (this.t < this.interval || this.times >= this.totalTimes) {
      return [];
    }
    //console.log(this.age.toString() + this.life.toString());
    if (this.age >= this.life && this.endingAmount > 0 && !this.ended) {
      let returnArray = [];
      let args = structuredClone(this.ending);
      let rand = Math.random();
      for (let i = 0; i < this.endingAmount; i++) {
        args.motion = this.endingMotion(this.x, this.y, i, this.endingAmount, rand);
        args.r = typeof this.endingR === "function" ? this.endingR(i, this.endingAmount) : this.endingR;
        args.color = typeof this.endingColor === "function" ? this.endingColor(i, this.endingAmount) : this.endingColor;
        switch (this.type) {
          case "droplet":
            returnArray.push(new Droplet(scene, args));
            break;
          case "source": // highly advised against
            returnArray.push(new Source(scene, args));
            break;
          default:
            console.error(`Droplet type "${this.type}" does not exist`);
        }
      }
      this.setDelete = true;
      return returnArray;
    }
    this.t = 0;
    this.times++;
    this.amount = this.amountArray[this.amountCounter];
    this.amountCounter =
      this.amountCounter + 1 === this.amountArray.length
        ? 0
        : this.amountCounter + 1;
    let returnArray = [];
    let args = structuredClone(this.output);
    let rand = Math.random();
    for (let i = 0; i < this.amount; i++) {
      args.motion = this.motionFunction(this.x, this.y, i, this.amount, rand, this.times);
      args.r = typeof this.rFunction === "function" ? this.rFunction(i, this.amount, this.times) : this.rFunction;
      args.color = typeof this.colorFunction === "function" ? this.colorFunction(i, this.amount, this.times) : this.colorFunction;
      switch (this.type) {
        case "droplet":
          returnArray.push(new Droplet(scene, args));
          break;
        case "source": // highly advised against
          returnArray.push(new Source(scene, args));
          break;
        default:
          console.error(`Droplet type "${this.type}" does not exist`);
      }
    }
    return returnArray;
  }
}
