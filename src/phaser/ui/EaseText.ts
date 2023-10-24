export class EaseText extends Phaser.GameObjects.Text {
  constructor(
    scene: Phaser.Scene,
    { x, y, text, color }: { x: number; y: number; text: string; color: string }
  ) {
    super(scene, x, y, text, {
      fontSize: "14px",
      color,
    });

    scene.add.existing(this);
    this.easeOut();
  }
  easeOut() {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 50,
      alpha: 0,
      duration: 1500,
      ease: "Power2",
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
