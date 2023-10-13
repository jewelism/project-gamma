import { createTitleText } from "@/phaser/phaserUtils/titleText";

export class InGameScene extends Phaser.Scene {
  constructor() {
    super("InGameScene");
  }
  preload() {}
  create() {
    createTitleText(this, "Select Level", 100);
    this.createUI(this);
  }
  createUI(scene: Phaser.Scene) {
    const height = 200;
    const uiWrap = scene.add
      .rectangle(
        0,
        Number(scene.game.config.height) - height,
        Number(scene.game.config.width),
        height
      )
      .setOrigin(0, 0)
      .setDepth(100)
      .setScrollFactor(0)
      .setFillStyle(0x00ff00, 0.2);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    // const uiContainer = scene.add.container(0, 0).add(uiWrap);
  }
}
