import Phaser from "phaser";

import Stage from "../../stage.js";

import * as Droplets from "../../droplets/droplet.js";
import * as Motion from "../../droplets/motion.js";
import {Patterns} from "../../droplets/patterns.js";

import {Utils, Graphics} from "../../common.js";

export default class CyberMeteoroid extends Stage {
    constructor() {
        super("Cyber Meteoroid");

        // Stage-specific variables
		this.title = "Cyber Meteoroid"; // Title of stage
		this.artist = "Sakuzyo"; // Artist of track for stage (usually Sakuzyo lol)
		this.subtitle = "Never give up..."; // Subtitle (displayed under title)
		this.songDuration = "3:07"; // Duration of song, display only
        this.difficulty = 3; // Difficulty (1-10, sometimes 11, rarely 12)
		this.tempo = 145; // Starting tempo of track (in beats per minute BPM)
		this.offset = 0; // How long to wait after starting music: increase if droplets are too early, decrease if droplets are too late
		this.wait = 0; // How long to wait for music to start (may be obsolete)
		this.timeSignature = 4; // How many beats in each measure
		this.songPath = "assets/music/chapter1/CyberMeteoroid.mp3"; // Music file path location
		this.saveLoc = ["", ""]; // Save file location
		this.effects = false; // If true, initialize effects map
		this.startingBackgroundColor = "#1e1e46"; // self explanatory
    }

    buildBeatmap() {

    }
}