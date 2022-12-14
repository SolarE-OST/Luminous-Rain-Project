import Phaser from "phaser";

import MainMenu from "./scripts/menus/main_menu.js";
import Tracklist from "./scripts/menus/tracklist.js";
import Loading from "./scripts/menus/loading.js";
import Pause from "./scripts/menus/pause.js";

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
    scene: [
        //Test,
        MainMenu,
        Tracklist,
        Loading,
        Pause,
        stageIndex.C1_1,
        stageIndex.C1_2,
        stageIndex.C1_3,
        stageIndex.C1_4,
        stageIndex.C1_5,
        stageIndex.C1_B,
    ]
};

//console.clear();
const g = new Phaser.Game(config);

window.addEventListener("blur", e => {
    console.log("stop");
})

//const fpsLogger = setInterval(() => {console.log(g.loop.actualFps)}, 1000);
