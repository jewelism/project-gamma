import { createTitleText } from "@/phaser/phaserUtils/titleText";
import { Button } from "@/phaser/ui/upgrade/Button";

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
    const uiContainer = scene.add.container(
      0,
      Number(scene.game.config.height) - height
    );
    const uiWrap = scene.add
      .rectangle(
        0,
        0,
        // Number(scene.game.config.height) - height,
        Number(scene.game.config.width),
        height
      )
      .setOrigin(0, 0)
      .setDepth(100)
      .setScrollFactor(0)
      .setFillStyle(0x00ff00, 0.2);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    const buttons = [
      { id: "addSoldier", desc: "add new random attacker +1" },
      { id: "attackDamage", desc: "increase attack damage 1%" },
      { id: "attackSpeed", desc: "increase attack speed 1%" },
      { id: "income", desc: "increase income +0.5%" },
      { id: "upgradeBunker", desc: "upgrade bunker" },
    ].map(({ desc }, index) => {
      return new Button(scene, {
        x: Number(scene.game.config.width) - 50 * (index + 1),
        y: 0,
        width: 50,
        height: 50,
        hoverText: desc,
        onClick: () => {},
      });
    });
    uiContainer.add([uiWrap, ...buttons]);
  }
}
