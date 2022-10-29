import Phaser from "phaser";

import { MusicScenes, Graphics } from "./common.js";

import * as settings from "./constants.js";

import * as Droplets from "./droplets/droplet.js";
import * as Patterns from "./droplets/patterns.js";

export default class Stage extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.levelName = key; // Internal name of stage
    this.beatMap = []; // Array containing each pattern corresponding to beats (the actual "chart")
    this.timeMap = []; // Array containing each game object corresponding to frame time (used to run the stage in sequence)

    // Stage-specific variables
    this.title = ""; // Title of stage
    this.artist = ""; // Artist of track for stage (usually Sakuzyo lol)
    this.subtitle = ""; // Subtitle (displayed under title)
    this.songDuration = "0:00"; // Duration of song, display only
    this.difficulty = 0; // Difficulty (1-10, sometimes 11+)
    this.tempo = 120; // Starting tempo of track (in beats per minute BPM)
    this.offset = 0; // How long to wait after starting music: decrease if bullets are too early, increase if bullets are too late
    this.wait = 0; // How long to wait for music to start (may be obsolete)
    this.timeSignature = 4; // How many beats in each measure
    this.songPath = "assets/music/menu/0f.mp3"; // Music file path location
    this.saveLoc = ["", ""]; // Save file location
    this.effects = false; // If true, initialize effects map
    this.startingBackgroundColor = "#1e1e46"; // self explanatory

    Object.assign(this, MusicScenes);
    Object.assign(this, Graphics);
  }

  /**
   * @desc Returns number of frames given number of beats with the music's tempo
   * @param {*} beats Number of beats
   */
  getTime(beats) {
    return Math.round((beats / this.tempo) * 60 * 60);
  }

  preload() {
    this.load.image("glow particle", "assets/particle.png");
    this.load.audio("graze", "assets/sfx/graze.wav");
    this.load.audio("hit", "assets/sfx/hit.wav");
    this.load.audio("life", "assets/sfx/extend.wav");
    this.load.audio("bgm", this.songPath);
  }

  /**
   * @desc Create loading circle before stage is loaded
   */
  loadingCircle() {
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
    /*
		this.loadingText = [];
		for (let i = 0; i < 3; i++) {
			this.loadingText[i] = this.add
				.text(300, 200, "Loading...", {
					fontSize: 50,
					align: "center",
					color: "#f0f076",
					stroke: "#f0f076",
					strokeThickness: 3,
					padding: {
						x: 20,
						y: 20
					}
				})
				.setShadow(0, 0, "#f0f076", 20)
				.setOrigin(0.5, 0.5);
		}*/
    this.loadingText = this.glowingText(300, 200, "Loading...", 50);
  }

  /**
   * @desc Initialize instance variables
   */
  initVariables() {
    this.wait += 100;
    //this.t = -this.wait;
    this.t = -this.offset;
    this.pt = 0;
    this.waiting = false;
    this.score = 0;
    this.lives = 5;
    this.iframes = 0;
    this.grazeMultiplier = 1;

    this.playerColor = this.col(window.save.player.color);
  }

  /**
   * @desc Initialize GUI display
   */
  initGUI() {
    this.guiBackground = this.add
      .rectangle(750, 300, 300, 600, 0)
      .setDepth(100);
    this.guiTitle = this.glowingText(
      750,
      50,
      this.title,
      400 / Math.max(10, this.title.length)
    ).setDepth(101);
    this.guiArtist = this.glowingText(750, 80, this.artist, 20).setDepth(101);
    this.guiScoreLabel = this.glowingText(750, 150, "Score:", 36).setDepth(101);
    this.guiScore = this.glowingText(
      750,
      200,
      "0000000",
      50,
      "#f0f076",
      1
    ).setDepth(101);
    this.guiGrazeMultiLabel = this.glowingText(
      750,
      450,
      "Graze Multiplier:",
      26
    ).setDepth(101);
    this.guiGrazeMulti = this.glowingText(
      750,
      500,
      "x1.00",
      40,
      "#f0f076",
      1
    ).setDepth(101);

    this.guiHearts = [
      this.heart(650, 250, 36),
      this.heart(700, 250, 36),
      this.heart(750, 250, 36),
      this.heart(800, 250, 36),
      this.heart(850, 250, 36)
    ];
  }

  /**
   * @desc Initialize player
   */
  initPlayer() {
    this.player = this.physics.add.group();

    this.playerGlow = this.add.pointlight(
      300,
      400,
      this.playerColor,
      10,
      0.1,
      0.09
    );
    this.playerOutline = this.add.ellipse(300, 400, 13, 13, this.playerColor);
    this.playerCenter = this.add.ellipse(300, 400, 10, 10, this.playerColor);
    this.playerHitbox = this.add.ellipse(
      300,
      400,
      settings.hitboxRadius,
      settings.hitboxRadius,
      this.playerColor,
      0.4
    );
    this.playerGraze = this.add.ellipse(
      300,
      400,
      settings.grazeRadius,
      settings.grazeRadius,
      0,
      0
    );

    this.player.add(this.playerGlow);
    this.player.add(this.playerOutline);
    this.player.add(this.playerCenter);
    this.player.add(this.playerHitbox);
    this.player.add(this.playerGraze);
  }

  /**
   * @desc Initialize controls
   */
  initControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.shift = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
  }

  /**
   * @desc Initialize game objects (layers, groups, etc.)
   */
  initGameObjects() {
    this.glow = this.add.layer();
    this.activeDroplets = [];
    this.collidingDroplets = this.physics.add.group();
  }

  initCollisions() {
    // Droplet hits
    this.physics.add.overlap(
      this.collidingDroplets,
      this.player.getChildren()[3],
      (player, droplet) => {
        if (this.iframes === 0) {
          droplet.parentDroplet.setDelete = true;
          this.playerHit(droplet);
        }
      }
    );

    //Droplet grazes
    this.grazeLines = this.add.group();
    this.physics.add.overlap(
      this.collidingDroplets,
      this.player.getChildren(4),
      (player, droplet) => {
        if (
          this.iframes === 0 &&
          !droplet.parentDroplet.grazed &&
          !droplet.parentDroplet.decorative &&
          droplet.parentDroplet.delay === -1
        ) {
          droplet.parentDroplet.grazed = true;
          let x1 = this.player.getChildren()[0].x;
          let y1 = this.player.getChildren()[0].y;
          let x2 = droplet.x;
          let y2 = droplet.y;
          let origin = [(x1 + x2) / 2, (y1 + y2) / 2];
          let grazeLine = this.add
            .line(
              origin[0],
              origin[1],
              Math.max(0, x1 - x2),
              Math.max(0, y1 - y2),
              Math.max(0, x2 - x1),
              Math.max(0, y2 - y1),
              0xf0f076,
              0.8
            )
            .setLineWidth(3);
          grazeLine.setDelete = false;
          this.grazeLines.add(grazeLine);
          this.grazeSound.play();
        }
      }
    );
  }

  playerHit(d) {
    this.grazeMulti = 1;
    this.iframes = 180;
    if (settings.invincible) {
      this.lives--;
      this.hitSound.play();
      for (let guiHeart of this.guiHearts) {
        guiHeart.visible = false;
        guiHeart.glow.visible = false;
      }
      for (let i = 0; i < this.lives; i++) {
        this.guiHearts[i].visible = true;
        this.guiHearts[i].glow.visible = true;
      }
      if (this.lives <= 0) {
        //end level
      }
    }
  }

  /**
   * @desc Contains the beat map, to be used in subclass stages
   */
  buildBeatmap() {
    this.beatmap = [];
  }

  /**
   * @desc Generate the droplet time map from the beat map
   */
  generateTimemap() {
    this.timemap = [];
    for (let i = 0; i < this.beatmap.length; i++) {
      let measure = this.beatmap[i];
      let measureTimestamp = this.getTime((i + 1) * this.timeSignature);
      for (let beat of measure) {
        let timestamp =
          measureTimestamp +
          this.getTime(beat[0] - 1) +
          //this.offset +
          beat[1].offset;
        this.timemap.push([timestamp, beat[1]]);
      }
    }
    this.timemap = this.timemap.sort((a, b) => a[0] - b[0]);
    this.timemap.push([999999999, "idk"]);
  }

  create() {
    // loading circle (may implement progress bar later)
    this.glowParticle = this.add.particles("glow particle");
    //this.loadingCircle();

    // initialize sound effects
    this.grazeSound = this.sound.add("graze");
    this.hitSound = this.sound.add("hit");
    this.lifeSound = this.sound.add("life");
    this.grazeSound.volume = settings.soundEffectVolume;
    this.hitSound.volume = settings.soundEffectVolume;
    this.lifeSound.volume = settings.soundEffectVolume;

    // init all the game stuff
    this.initVariables();
    this.initGUI();
    this.initMusic("bgm");
    this.initPlayer();
    this.initControls();
    this.initGameObjects();
    this.initCollisions();

    this.buildBeatmap();
    this.generateTimemap();

    /*
		this.test = new Droplets.Droplet(this, {
			motion: new Motion.Kinematic({
				x: 500,
				y: 400,
				vx: -2,
				vy: -5,
				duration: 100
			})
		});
		*/

    this.patternTest = new Patterns.Explode({
      x: 300,
      y: 100,
      num: 200,
      speed: 10,
      speedRange: 1
    });
    this.dropletArrayTest = [];

    // fade in transition
    this.cameras.main.setBackgroundColor(this.startingBackgroundColor);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  /**
   * @desc Update player position
   */
  updatePlayer() {
    let trueSpeed;
    if (this.shift.isDown) {
      trueSpeed = settings.playerSpeed * 0.5;
    } else {
      trueSpeed = settings.playerSpeed;
    }

    if (this.cursors.left.isDown && this.playerCenter.x > 13) {
      this.player.setVelocityX(-trueSpeed);
    } else if (this.cursors.right.isDown && this.playerCenter.x < 600 - 13) {
      this.player.setVelocityX(trueSpeed);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.playerCenter.y > 13) {
      this.player.setVelocityY(-trueSpeed);
    } else if (this.cursors.down.isDown && this.playerCenter.y < 600 - 13) {
      this.player.setVelocityY(trueSpeed);
    } else {
      this.player.setVelocityY(0);
    }

    if (this.iframes > 0) {
      this.iframes--;
      if (this.iframes % 10 < 5) {
        for (let child of this.player.getChildren()) {
          child.visible = true;
        }
      } else {
        for (let child of this.player.getChildren()) {
          child.visible = false;
        }
      }
    } else {
      for (let child of this.player.getChildren()) {
        child.visible = true;
      }
    }

    this.player.getChildren()[0].radius = 20 * this.flicker + 10;
    this.player.getChildren()[0].intensity = 0.1 * this.flicker + 0.1;
    this.player.getChildren()[2].fillColor = Phaser.Display.Color.GetColor(
      Phaser.Math.Interpolation.Linear(
        [30, save.player.color[0]],
        this.flicker * 0.3 + 0.7
      ),
      Phaser.Math.Interpolation.Linear(
        [30, save.player.color[1]],
        this.flicker * 0.3 + 0.7
      ),
      Phaser.Math.Interpolation.Linear(
        [70, save.player.color[2]],
        this.flicker * 0.3 + 0.7
      )
    );

    for (let grazeLine of this.grazeLines.getChildren()) {
      if (grazeLine.canDelete) {
        this.grazeLines.remove(grazeLine, true, true);
      } else {
        grazeLine.canDelete = true;
      }
    }
  }

  tickDroplets() {
    let simultaneous = true;
    if (this.timemap.length > 1) {
      while (simultaneous) {
        if (this.t >= this.timemap[0][0]) {
          this.activeDroplets = this.activeDroplets.concat(
            this.timemap[0][1].generate(this)
          );
          this.timemap.shift();
        /*
        } else if (this.t > this.timemap[0][0]) {
          // Remove droplets that have already passed
          this.timemap.shift();
          */
        } else {
          simultaneous = false;
        }
      }
    }
  }

  moveDroplets(dt=1) {
    for (let d of this.activeDroplets) {
      d.move(dt);
      if (d instanceof Droplets.Source) {
        this.activeDroplets = this.activeDroplets.concat(d.generate(this, dt));
      }
      if (d.setDelete) {
        for (let displayElement in d.display) {
          d.display[displayElement].destroy();
        }
        this.activeDroplets = this.activeDroplets.filter((x) => x !== d);
      }
    }
  }

  startMusic() {
    /*
    if (this.songLoaded && !this.waiting && !this.audioPlaying) {
      this.waiting = true;
      this.loadingCircle.stop();
      this.tweens
        .add({
          targets: this.loadingText.getChildren(),
          alpha: 0,
          ease: "Quintic.easeOut",
          duration: 300,
          delay: 0,
          repeat: 0
        })
        .on("complete", () => {
          for (let singleText of this.loadingText.getChildren()) {
            singleText.destroy();
          }
          this.loadingText = null;
          this.loadingCircle = null;
        });
    }*/

    if (this.wait <= 0 && !this.music.isPlaying) {
      this.music.play();
      this.waiting = false;
    } else if (this.wait > 0) {
      this.waiting = true;
    }
    /*
			if (this.wait != null && settings.startTime + options.startTime < this.wait) {
				this.audioContext.suspend();
			}*/

    /*for (let singleText of this.loadingText) {
				singleText.destroy();
			}*/
  }
  /*
	startMusic() {
		if (this.songLoaded && !this.waiting && !this.audioPlaying) {
            this.waiting = true;
            this.loadingCircle.stop();
            this.tweens.add({
                targets: this.loadingText.getChildren(),
                alpha: 0,
                ease: "Quintic.easeOut",
                duration: 300,
                delay: 0,
                repeat: 0
              }).on("complete", () => {
              for (let singleText of this.loadingText.getChildren()) {
                singleText.destroy();
              }
              this.loadingText = null;
              this.loadingCircle = null;
            });
		}
		
		if (this.wait <= 0 && !this.audioPlaying) {
            //console.log("song playing");
            this.music.sourceNode.buffer = this.song;
            //console.log(this.music.sourceNode);
            this.music.sourceNode.start(0);
            this.music.gainNode.gain.value = settings.musicVolume;
            this.waiting = false;
            /*
            if (this.wait != null && settings.startTime + options.startTime < this.wait) {
              this.audioContext.suspend();
            }
            
            this.audioPlaying = true;
            
            /*for (let singleText of this.loadingText) {
              singleText.destroy();
            }
        }
	}
	

	updateMusic() {
		if (this.t % (settings.songRefreshRate * 60) === settings.songRefreshRate * 60 - 1 && this.t >= 0) {
            this.music.sourceNode.stop();
            this.music.sourceNode = this.audioContext.createBufferSource();
            this.music.sourceNode.connect(this.music.gainNode);
            this.music.gainNode.connect(this.audioContext.destination);
            this.music.sourceNode.connect(this.music.analyserNode);
            this.music.sourceNode.buffer = this.song;
            this.music.sourceNode.start(0, this.t / 60);
            this.music.gainNode.gain.value = settings.musicVolume;
            this.music.gainNode.gain.value = 0.1;
            //this.startedMultiplying = true;
        }
	}
	*/

  update() {
    //this.updateMusic();

    if (this.songLoaded) {
      //console.log(this.music.seek);
    }
    if (this.waiting) {
      this.wait--;
    } else if (this.songLoaded) {
      this.t = this.music.seek * 60 - this.offset;
    }
/*
    if (this.t % 60 < 1.2) {
      this.sound.detune = Math.random() * 600 - 300
    }*/
    //console.log(this.t.toString() + " " + this.music.seek.toString());

    this.startMusic();

    this.setFlicker();
    //this.flicker = Math.max(0.3, (1 - ((this.t + this.offset) % this.getTime(1)) / this.getTime(1)) * 0.4 + 0.5);

    for (let guiHeart of this.guiHearts) {
      guiHeart.glow.intensity = 0.2 + this.flicker * 0.2;
      guiHeart.glow.attenuation = 0.06 + this.flicker * 0.02;
    }

    this.tickDroplets();
    this.moveDroplets((this.t - this.pt));
    this.pt = this.t;

    this.updatePlayer();
  }
}
