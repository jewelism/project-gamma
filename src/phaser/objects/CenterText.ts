export class CenterText extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, { text }: { text: string }) {
    super(scene, scene.cameras.main.centerX, scene.cameras.main.centerY);

    const title = scene.add.rectangle(0, 0, 400, 200).setOrigin(0.5, 0.5);
    const txt = scene.add
      .text(0, 0, text, {
        fontSize: "32px",
        color: "#fff",
        align: "center",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5)
      .setDepth(9999);
    this.add([title, txt]);
    scene.add.existing(this);
  }
}
