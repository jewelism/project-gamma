import * as Phaser from "phaser";

import { StartScene } from "@/phaser/scenes/StartScene";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { InGameUIScene } from "@/phaser/scenes/ui/InGameUIScene";
import { InGamePauseScene } from "@/phaser/scenes/InGamePauseScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "project alpha",
  url: "jewelism.github.io",
  type: Phaser.WEBGL,
  // type: Phaser.CANVAS,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    width: 375 * 1.5,
    height: 667 * 1.5,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  // parent: "body",
  render: { pixelArt: true, antialias: false },
  dom: {
    createContainer: true,
  },
  scene: [
    // StartScene,
    InGameScene,
    InGameUIScene,
    InGamePauseScene,
  ],
  backgroundColor: "#222",
  // fps: {
  //   target: 10,
  //   forceSetTimeOut: true,
  // },
};

export const createPhaser = () => new Phaser.Game(config);
