import Phaser from "phaser";

import MainMenu from "./scripts/menus/main_menu.js";
import Tracklist from "./scripts/menus/tracklist.js";

import Stage from "./scripts/stage.js";

import * as stageIndex from "./scripts/stages/stage_index.js";
import Test from "./scripts/stages/test.js";

//import * as DropletPlugins from "./scripts/droplets/droplet_plugins.js";

const config = {
    type: Phaser.WEBGL,
    width: 900,
    height: 600,
    resolution: window.devicePixelRatio,
    backgroundColor: "#000",
    parent: "phaser-example",
    physics: {
        default: "arcade",
        arcade: {
          //gravity: { y: 200 },
            enableBody: true
        }
    },
    /*
    fps: {
        target: 30,
        forceSetTimeOut: true,
    },
    
    /*
    plugins: {
        global: [
            { key: 'DropletPlugin', plugin: DropletPlugins.DropletPlugin, start: true }
        ]
    },
    */
    /*
    scene: [
        MainMenu,
        LevelSelect,
        GameOver,
        Cleared,
        Options,
        Pause,
        
        BPMRT,
        
        Glow,
        
        // story 1
        LostMemory,
        Magicatz,
        Altale,
        Kronos,
        Reprologue,
        CyberMeteoroid,
    ],
    */
    scene: [
        //Test,
        MainMenu,
        Tracklist,
        stageIndex.S1_1,
    ]
};

//console.clear();
const g = new Phaser.Game(config);

window.addEventListener("blur", e => {
    console.log("stop");
})

//const fpsLogger = setInterval(() => {console.log(g.loop.actualFps)}, 1000);
