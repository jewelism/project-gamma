import { ToolTip } from "@/phaser/ui/ToolTip";

export class Button extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    { x, y, width, height, spriteKey, hoverText, onClick }
  ) {
    super(scene, x, y);
    const tooltip = new ToolTip(scene, { x, y, hoverText });

    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height)
      .setStrokeStyle(2, 0x0000ff, 1)
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        tooltip.setVisible(true);
        button.setAlpha(0.4);
        icon.setAlpha(0.4);
        onClick();
      })
      .on("pointerup", () => {
        button.setAlpha(1);
        icon.setAlpha(1);
      })
      .on("pointerover", () => {
        tooltip.setVisible(true);
      })
      .on("pointerout", () => {
        button.setAlpha(1);
        icon.setAlpha(1);
        tooltip.setVisible(false);
      });
    const icon = new Phaser.GameObjects.Sprite(
      scene,
      button.width / 2,
      button.height / 2,
      spriteKey
    );

    this.add([button, icon]);
    scene.add.existing(this);
  }
}
