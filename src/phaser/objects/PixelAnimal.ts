export class PixelAnimal extends Phaser.Physics.Arcade.Sprite {
  moveSpeed: number = 150;
  frameNo: number;
  hp: number;

  constructor(scene, { x, y, hp, frameNo }) {
    super(scene, x, y, "pixel_animals", frameNo);
    this.anims.create({
      key: `pixel_animals_move${frameNo}`,
      frames: this.anims.generateFrameNames("pixel_animals", {
        frames: [frameNo, frameNo + 1],
      }),
    });

    this.frameNo = frameNo;
    this.hp = hp;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.physics.add.existing(this);

    this.setScale(2).setDepth(9).setCollideWorldBounds(true);

    // this.setImmovable(true);
  }
  preUpdate() {
    this.moveToBunker();
  }
  isDestroyed() {
    return !this.active;
  }
  moveToBunker() {
    if (!(this.scene as any).bunker.scene) {
      this.setVelocity(0, 0);
      return;
    }
    this.anims.play(`pixel_animals_move${this.frameNo}`, true);
    this.scene.physics.moveToObject(
      this,
      (this.scene as any).bunker,
      this.moveSpeed
    );
  }
}
