export class PixelAnimal extends Phaser.Physics.Arcade.Sprite {
  attackTimer: Phaser.Time.TimerEvent;
  attackRange: number = 100;
  attackSpeed: number = 300;
  damage: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  moveSpeed: number = 150;
  frameNo: number;
  moveTimer: Phaser.Time.TimerEvent;

  constructor(scene, { x, y, frameNo }) {
    super(scene, x, y, "pixel_animals", frameNo);
    this.damage = 1;
    this.anims.create({
      key: `pixel_animals_move${frameNo}`,
      frames: this.anims.generateFrameNames("pixel_animals", {
        frames: [frameNo, frameNo + 1],
      }),
    });

    this.frameNo = frameNo;
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    scene.physics.add.existing(this);

    this.setOrigin(0, 0)
      .setScale(2)
      .setCircle(4, 3, 4)
      .setDepth(9)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    // this.setImmovable(true);
  }
  preUpdate() {
    this.moveToBunker();
  }
  moveToBunker() {
    // this.setVelocity(0, 0);
    this.anims.play(`pixel_animals_move${this.frameNo}`, true);
    this.scene.physics.moveToObject(
      this,
      (this.scene as any).bunker,
      this.moveSpeed
    );
  }
}
