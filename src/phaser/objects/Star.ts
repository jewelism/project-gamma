export class Star extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, { x, y }) {
    super(scene, x, y, "star");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.setOrigin(0, 0).setScale(0.8).setCircle(5, 3, 4);
    this.anims.create({
      key: `star`,
      frames: this.anims.generateFrameNames("star", {
        frames: [0, 1],
      }),
      frameRate: 2,
    });
  }
  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.anims.play(`star`, true);
  }
}
