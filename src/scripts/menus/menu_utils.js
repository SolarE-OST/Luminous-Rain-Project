import Phaser from "phaser";

let Menu = {
  
  glowingText(x, y, text, size, color = "#f0f076", glowStrength = 1, blur = 20, scrollFactor = 0.1) {
    let textArray = [];
    for (let i = 0; i < glowStrength; i++) {
      //change title text glow strength
      textArray[i] = this.add.text(x, y, text, {
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
        .setScrollFactor(scrollFactor);
    }

    return textArray;
  },

};

export default Menu;