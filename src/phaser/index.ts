import * as Phaser from "phaser";

import { StartScene } from "@/phaser/scenes/StartScene";
import { InGameScene } from "@/phaser/scenes/InGameScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "project alpha",
  url: "jewelism.github.io",
  type: Phaser.WEBGL,
  // type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  // parent: "body",
  render: { pixelArt: true, antialias: false },
  scene: [
    // StartScene,
    InGameScene,
  ],
  backgroundColor: "#222",
  // fps: {
  //   target: 10,
  //   forceSetTimeOut: true,
  // },
};

export const createPhaser = () => new Phaser.Game(config);
