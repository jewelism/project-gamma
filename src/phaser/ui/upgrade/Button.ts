import { getUIStyle } from "@/phaser/constants";

export class Button extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    { x, y, width, height, hoverText, onClick }
  ) {
    super(scene, x, y);
    const textWrap = new Phaser.GameObjects.Rectangle(scene, 0, 0, 100, 30)
      .setFillStyle(0x0000ff, 0.5)
      .setOrigin(0, 0);
    const buttonText = new Phaser.GameObjects.Text(scene, 5, 5, hoverText, {
      fontSize: "12px",
      color: "#ffffff",
    }).setOrigin(0, 0);
    const textContainer = scene.add
      .container(-50, -50, [textWrap, buttonText])
      .setVisible(false);

    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height)
      .setStrokeStyle(2, 0x0000ff, 1)
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", onClick)
      .on("pointerover", () => {
        textContainer.setVisible(true);
      })
      .on("pointerout", () => {
        textContainer.setVisible(false);
      });

    this.add([button, textContainer]);
    scene.add.existing(this);
  }
}
