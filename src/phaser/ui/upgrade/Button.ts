import { getUIStyle } from "@/phaser/constants";

export class Button extends Phaser.GameObjects.Container {
  buttonText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, { x, y, text, onClick }) {
    super(scene, x, y);

    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, 100, 100);
    button.setStrokeStyle(2, 0x0000ff, 1);
    this.buttonText = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      text,
      getUIStyle()
    );
    button.setInteractive();
    button.on("pointerdown", onClick);
    this.add(button);
    this.add(this.buttonText);

    scene.add.existing(this);
  }
}
