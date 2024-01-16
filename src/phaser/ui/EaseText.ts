export class EaseText extends Phaser.GameObjects.Text {
  duration: number;
  constructor(
    scene: Phaser.Scene,
    {
      x,
      y,
      text,
      color,
      duration = 1500,
    }: { x: number; y: number; text: string; color: string; duration?: number }
  ) {
    super(scene, x, y, text, {
      fontSize: "14px",
      color,
    });

    this.duration = duration;

    scene.add.existing(this);
    this.easeOut();
  }
  easeOut() {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 50,
      alpha: 0,
      duration: this.duration,
      ease: "Power2",
      onComplete: () => {
        this.destroy();
      },
    });
  }
}
