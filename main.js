import Phaser from "phaser";

import MainMenu from "./src/scripts/menus/main_menu.js";


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
      target: 60,
      forceSetTimeOut: true,
  },
  */

  plugins: {
    global: []
  },

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
  scene: [MainMenu]
};

//console.clear();
const g = new Phaser.Game(config);

//const fpsLogger = setInterval(() => {console.log(g.loop.actualFps)}, 1000);
