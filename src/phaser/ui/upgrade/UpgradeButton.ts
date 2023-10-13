import { getUIStyle } from "@/phaser/constants";

export class UpgradeButton extends Phaser.GameObjects.Container {
  buttonText: Phaser.GameObjects.Text;
  template: string;
  constructor(scene: Phaser.Scene, { x, y, template, onClick }) {
    super(scene, x, y);
    this.template = template;
    const button = new Phaser.GameObjects.Rectangle(scene, 60, 7.5, 120, 25);
    button.setStrokeStyle(2, 0x0000ff, 1);
    this.buttonText = new Phaser.GameObjects.Text(
      scene,
      0,
      0,
      `${template}1($2)`,
      getUIStyle()
    );
    button.setInteractive();
    button.on("pointerdown", onClick);
    this.add(button);
    this.add(this.buttonText);

    scene.add.existing(this);
  }
  public setText(text: string) {
    this.buttonText.setText(text);
  }
  public setValue(value, cost) {
    this.buttonText.setText(`${this.template}${value}(${cost})`);
  }
}
