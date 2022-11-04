import Phaser from "phaser";

import * as settings from "./constants.js";

/*
export let MusicScenes = {
    /**
     * @desc gets the song given the path and sets object properties, used in preload()
     * @param {*} url song path
     
    async getSong(url) {
        this.songLoaded = false;
        this.audioContext = new window.AudioContext();
        //this.load.audio(this.levelName, this.songPath);
        this.song = await this.loadSong(url);
        this.songDuration = this.song.duration;
        this.songLoaded = true;
    },

    /**
     * @desc internally request audio file, used in getSong()
     * @param {} url song path
     
    async loadSong(url) {
        let request = new XMLHttpRequest();
        let audcont = this.audioContext;
        let audioBuffer = new Promise((resolve) => {
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            // When loaded, decode the data and play the sound
            request.onload = function () {
                //console.log(this);
                audcont.decodeAudioData(
                    request.response,
                    function (buffer) {
                        //console.log("Song loaded");
                        resolve(buffer);
                    },
                    (e) => console.log(e)
                );
            };
            request.send();
        });
        return audioBuffer;
    },

    /**
     * @desc initialize WebAudioAPI sound nodes for flickering, used in create()
     
    initSound() {
        this.music = {};
        this.music.sourceNode = this.audioContext.createBufferSource();
        this.music.analyserNode = this.audioContext.createAnalyser();
        this.music.gainNode = this.audioContext.createGain();
        this.music.javascriptNode = this.audioContext.createScriptProcessor(
            1024,
            1,
            1
        ); //change 1024?
        this.music.amplitudeArray = new Uint8Array(
            this.music.analyserNode.frequencyBinCount
        );
        this.music.sourceNode.connect(this.music.gainNode);
        this.music.gainNode.connect(this.audioContext.destination);
        this.music.sourceNode.connect(this.music.analyserNode);
        this.music.analyserNode.connect(this.music.javascriptNode);
        this.music.javascriptNode.connect(this.audioContext.destination);

        this.ampPrevArray = new Array(settings.flickerSmoothLen).fill(0);
        //this.ampPrevArray = new Array(5).fill(0);

    },

    /**
     * @desc calculate flicker value, used in update()
     
    setFlicker() {
        if (this.audioPlaying) {
            this.music.analyserNode.getByteTimeDomainData(this.music.amplitudeArray);
            this.ampVal = Math.max(...this.music.amplitudeArray);
            let ampSmooth = this.ampPrevArray.reduce((a, b) => (a + b)) / settings.flickerSmoothLen;
            //let ampSmooth = this.ampPrevArray.reduce((a, b) => (a + b)) / 5;
            this.flicker = ((ampSmooth - 128) / 128) * 0.8 + 0.2;
            this.ampPrevArray.shift();
            this.ampPrevArray.push(this.ampVal);
        } else {
            this.flicker = 0.0;
        }
    }
};
*/

export let MusicScenes = {
  initMusic(key) {
    this.music = this.sound.add(key);
    this.music.volume = settings.musicVolume;

    this.musicAnalyzer = this.sound.context.createAnalyser();
    //this.musicScriptProcessor = this.sound.context.createScriptProcessor(1024, 1, 1);
    this.musicAnalyzer.fftSize = 1024;
    this.music.volumeNode.connect(this.musicAnalyzer);
    //this.musicAnalyzer.connect(this.musicScriptProcessor);
    //this.musicScriptProcessor.connect(this.sound.context.destination);
    this.musicAnalyzer.connect(this.sound.context.destination);

    this.musicAmplitudeArray = new Uint8Array(
      this.musicAnalyzer.frequencyBinCount
    );
    this.ampPrevArray = new Array(settings.flickerSmoothLen).fill(0);
    this.songLoaded = true;
  },

  setFlicker() {
    if (this.music.isPlaying) {
      this.musicAnalyzer.getByteTimeDomainData(this.musicAmplitudeArray);
      this.ampVal = Math.max(...this.musicAmplitudeArray);
      let ampSmooth =
        this.ampPrevArray.reduce((a, b) => a + b) / settings.flickerSmoothLen;
      //let ampSmooth = this.ampPrevArray.reduce((a, b) => (a + b)) / 5;
      //this.flicker = ((ampSmooth - 128) / 128) * 0.8 + 0.2;
      this.flicker = ((ampSmooth - 128) / 128 / settings.musicVolume) * 0.8 + 0.2;
      this.ampPrevArray.shift();
      this.ampPrevArray.push(this.ampVal);
      //console.log(this.flicker);
    } else {
      this.flicker = 0.2;
    }
  },
  
  sceneTransition(key, stopMusic = true, music = {}) {
    return () => {
      /*
      if (!this.music.isPlaying) {
        return;
      }*/
      if (this.transitioning) {
        return;
      } else {
        this.transitioning = true;
      }
      this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
        if (stopMusic) {
          this.music.volume = (1 - t) * settings.musicVolume;
        }
      });
      this.songLoaded = false;
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        if (stopMusic && this.music.isPlaying) {
          this.music.stop();
          this.sound.removeByKey("music");
        }
        this.scene.stop();
        //console.log(musicData.sound);
        this.scene.start(key, music);
	  })
    }
  }
};

export let Graphics = {
  col: (c) => Phaser.Display.Color.GetColor(...c),

  colNum: (c) => {
    let i = Phaser.Display.Color.ObjectToColor(c);
    return Phaser.Display.Color.GetColor(i.red, i.green, i.blue);
  },

  // creates glowing txt
  glowingText(
    x,
    y,
    text,
    size,
    color = "#f0f076",
    glowStrength = 3,
    blur = 20,
    scrollFactor = 0.1
  ) {
    let textArray = this.add.group();
    for (let i = 0; i < glowStrength; i++) {
      //change title text glow strength
      textArray.add(
        this.add
          .text(x, y, text, {
            fontSize: size,
            align: "center",
            color: color,
            stroke: color,
            strokeThickness: 1,
            padding: {
              x: 60,
              y: 60
            }
          })
          .setShadow(0, 0, color, blur)
          .setOrigin(0.5, 0.5)
          .setScrollFactor(scrollFactor)
      );
    }

    return textArray;
  },

  heart(x, y, size) {
    let heartGraphics = this.add.graphics();
    let heartPath = new Phaser.Curves.Path(x, y);
    heartGraphics.setDepth(104);
    heartGraphics.fillStyle(0xcc0000, 1);
    heartGraphics.lineStyle(5, 0xff0000, 1);
    //heartPath.cubicBezierTo(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    heartPath.cubicBezierTo(
      x,
      y + size,
      x - size / 2,
      y - size / 2,
      x - size,
      y + size / 3
    );
    heartPath.draw(heartGraphics);
    heartGraphics.fillPath();
    heartPath = new Phaser.Curves.Path(x, y);
    //heartPath.cubicBezierTo(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    //heartPath.cubicBezierTo(x, y + size, x + size, y + size / 3, x + size / 2, y - size / 2);
    heartPath.cubicBezierTo(
      x,
      y + size,
      x + size / 2,
      y - size / 2,
      x + size,
      y + size / 3
    );
    heartPath.draw(heartGraphics);
    heartGraphics.fillPath();
    heartGraphics.glow = this.add
      .pointlight(x, y + size / 3, 0xff0000, size * 1.5, 0.3, 0.07)
      .setDepth(101);
    return heartGraphics;
  },

  button({
    x, 
    y, 
    w, 
    h, 
    text, 
    callback, 
    fontSize = h - 24, 
    unlocked = true,
    xscale = 1,
    align = "center",
    onHover = () => this.add.group(),
    scrollFactor=0.1}) {
    let buttonFrame = this.add.rectangle(x, y, w, h, 0x646496).setStrokeStyle(10, 0x505082).setScrollFactor(scrollFactor);
    /*
    let buttonFrame = this.graphics.fillRoundedRect(x - w / 2, y - h / 2, w, h, 20);
    let buttonOutline = this.graphics.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 20);
    */
    let buttonText = this.add.text(x, y, text, {
      fontSize: fontSize,
      align: align,
      color: "#f0f076",
      stroke: "#505082",
      strokeThickness: 10,
    }).setOrigin(0.5, 0.5).setScrollFactor(scrollFactor).setScale(xscale, 1);
    if (align === "left") {
      buttonText.setOrigin(0, 0.5);
      buttonText.setX(x - w / 2 + 12);
    }
    if (!unlocked) {
      buttonFrame.setAlpha(0.4);
      buttonFrame.setStrokeStyle();
      buttonText.setAlpha(0.4);
    } else {
      buttonText.setShadow(0, 0, "#f0f076", 20);
      buttonFrame.setInteractive({
        useHandCursor: true,
      })
        .on("pointerover", () => {
        buttonFrame.scale = 1.1;
        buttonText.setScale(1.1 * xscale, 1.1);
        this.currentHover = onHover();
        this.select.play();
        if (align === "left") {
          buttonText.setX(x - w / 2 * 1.1 + 12);
        }
      })
        .on("pointerout", () => {
        buttonFrame.scale = 1;
        buttonText.setScale(xscale, 1);
        this.currentHover.destroy(true);
        if (align === "left") {
          buttonText.setX(x - w / 2 + 12);
        }
      })
        .on("pointerdown", () => {
          buttonFrame.scale = 0.9;
          buttonText.setScale(0.9 * xscale, 0.9);
          if (align === "left") {
            buttonText.setX(x - w / 2 * 0.9 + 12);
          }
      })
        .on("pointerup", () => {
          buttonFrame.scale = 1;
          buttonText.setScale(xscale, 1);
          if (align === "left") {
            buttonText.setX(x - w / 2 + 12);
          }
          this.ok.play();
          callback();
      });
    }
    
    let buttonGroup = this.add.group();
    buttonGroup.add(buttonFrame);
    buttonGroup.add(buttonText);
    return buttonGroup;
  },

  makeTooltip(x, y, data, sf) {
    this.tooltip = this.add.group();
  },

  rainfall(scrollFactorFactor = 1) {
    this.bbBack = this.add.particles("glow particle").setDepth(-100);
    this.bbFront = this.add.particles("glow particle").setDepth(100);

    this.luminousRainfall = [
      this.bbBack.createEmitter({
        x: {min: -50, max: 950},
        y: -30,
        lifespan: 4000,
        speedX: 0,
        accelerationX: 0,
        quantity: 1,
        frequency: 90,
        //tint: {min: 0x000000, max: 0xffffff},
        blendMode: "ADD",
        bounds: {x: -50, y: -50, w: 1000, h: 557},
        collideBottom: true,
        bounce: {min: 0.2, max: 0.3},
        speedY: {min: 80, max: 100},
        accelerationY: {min: 150, max: 200},
        scale: 0.08
      }).setScrollFactor(0.02 * scrollFactorFactor),
      this.bbBack.createEmitter({
        x: {min: -50, max: 950},
        y: -30,
        lifespan: 4000,
        speedX: 0,
        accelerationX: 0,
        quantity: 1,
        frequency: 90,
        //tint: {min: 0x000000, max: 0xffffff},
        blendMode: "ADD",
        bounds: {x: -50, y: -50, w: 1000, h: 587},
        collideBottom: true,
        bounce: {min: 0.2, max: 0.3},
        speedY: {min: 100, max: 200},
        accelerationY: {min: 200, max: 250},
        scale: 0.1
      }).setScrollFactor(0.05 * scrollFactorFactor),
      this.bbFront.createEmitter({
        x: {min: -50, max: 950},
        y: -30,
        lifespan: 4000,
        speedX: 0,
        accelerationX: 0,
        quantity: 1,
        frequency: 90,
        //tint: {min: 0x000000, max: 0xffffff},
        blendMode: "ADD",
        bounds: {x: -50, y: -50, w: 1000, h: 617},
        collideBottom: true,
        bounce: {min: 0.2, max: 0.3},
        speedY: {min: 200, max: 300},
        accelerationY: {min: 250, max: 300},
        scale: 0.15
      }).setScrollFactor(0.2 * scrollFactorFactor),
      this.bbFront.createEmitter({
        x: {min: -50, max: 950},
        y: -30,
        lifespan: 4000,
        speedX: 0,
        accelerationX: 0,
        quantity: 1,
        frequency: 90,
        //tint: {min: 0x000000, max: 0xffffff},
        blendMode: "ADD",
        bounds: {x: -50, y: -50, w: 1000, h: 647},
        collideBottom: true,
        bounce: {min: 0.2, max: 0.3},
        speedY: {min: 300, max: 400},
        accelerationY: {min: 300, max: 350},
        scale: 0.2
      }).setScrollFactor(0.4 * scrollFactorFactor),
    ];
    
    for (let rainEmitter of this.luminousRainfall) {
      rainEmitter.setTint((p, k, t) => {
        let colorRand = Utils.mulberry32(p.x)();
        return Utils.hueToInt(t + colorRand);
        //return this.hueToInt(Math.max(0, Math.min(1, 1.4 * (t))));
      });
      rainEmitter.setAlpha((p, k, t) => {
        if (t > 0.6) {
          return (1 - t) / 0.8;
        } else {
          return 0.5
        }
      });
    }
  }
};

export let Utils = {
  random: (a, b) => Math.random() * (b - a) + a,
  pi2: Math.PI * 2,
  vec: (m, f) => [m * Math.cos(f * 2 * Math.PI), m * Math.sin(f * 2 * Math.PI)],

  hueToInt(h) {
    let newCol = Phaser.Display.Color.HSLToColor(h, 1, 0.5);
    let newColRep = Phaser.Display.Color.GetColor(newCol.r, newCol.g, newCol.b);
    return newColRep;
  },
  
  intToHue(i) {
    let newCol = Phaser.Display.Color.IntegerToRGB(i);
    let newColRep = Phaser.Display.Color.RGBToHSV(newCol.r, newCol.g, newCol.b);
    return newColRep.h;
  },
  
  mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  },
};
