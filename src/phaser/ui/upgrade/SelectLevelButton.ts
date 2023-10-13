export class SelectLevelButton extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, { x, y, text, onClick }) {
    super(scene, x, y);
    const button = new Phaser.GameObjects.Rectangle(scene, 60, 7.5, 120, 25);
    button.setStrokeStyle(2, 0x0000ff, 1);
    const buttonText = new Phaser.GameObjects.Text(scene, 0, 0, text, {
      fontSize: "15px",
      color: "#ffffff",
      align: "center",
    });
    Phaser.Display.Align.In.Center(buttonText, button);

    button.setInteractive();
    button.on("pointerdown", onClick);

    this.add(button);
    this.add(buttonText);

    scene.add.existing(this);
  }
}
