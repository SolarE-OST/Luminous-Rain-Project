import Phaser from "phaser";

import Menu from "./menu_utils.js";

class MainMenu extends Phaser.Scene {
  constructor() {
    super("Main Menu");

    Object.assign(this, Menu);
  }

  preload() {}

  create() {
    this.titleText = this.glowingText(450, 120, "Luminous Rain", 100, "#f0f076", 3);
  }

  update() {}
}

export default MainMenu;
