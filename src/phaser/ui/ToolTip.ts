export class ToolTip extends Phaser.GameObjects.Container {
  buttonText: Phaser.GameObjects.Text;
  constructor(
    scene: Phaser.Scene,
    { x, y, hoverText }: { x: number; y: number; hoverText: string }
  ) {
    super(scene, x, y);
    const textPadding = 20;
    this.buttonText = new Phaser.GameObjects.Text(
      scene,
      textPadding / 2,
      textPadding / 2 / 2,
      hoverText,
      {
        fontSize: "12px",
        color: "#ffffff",
        align: "center",
      }
    ).setOrigin(0);
    const textWrap = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      this.buttonText.displayWidth + textPadding,
      this.buttonText.displayHeight + textPadding / 2
    )
      .setFillStyle(0x0000ff, 0.5)
      .setOrigin(0);

    this.add([textWrap, this.buttonText])
      .setX(
        this.scene.cameras.main.worldView.centerX -
          this.buttonText.displayWidth / 2
      )
      .setY(
        this.scene.cameras.main.worldView.bottom -
          this.buttonText.displayHeight -
          30
      )
      .setVisible(false)
      .setDepth(9999);
    scene.add.existing(this);
  }
}
