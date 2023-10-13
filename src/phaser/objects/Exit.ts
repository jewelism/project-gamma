export class Exit extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, { x, y }) {
    super(scene, x, y, "exit");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.setOrigin(0, 0);
  }
  block() {
    this.disableBody();
    this.setAlpha(0.3);
  }
  open() {
    this.enableBody();
    this.setAlpha(1);
  }
}
