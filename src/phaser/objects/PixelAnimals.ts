export class PixelAnimals extends Phaser.Physics.Arcade.Sprite {
  attackTimer: Phaser.Time.TimerEvent;
  attackRange: number = 100;
  attackSpeed: number = 300;
  damage: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  moveSpeed: number = 150;
  frameNo: number;
  moveTimer: Phaser.Time.TimerEvent;
  moveMode: string;

  constructor(scene, { x, y, frameNo, moveMode = "upDown" }) {
    super(scene, x, y, "pixel_animals", frameNo);
    this.damage = 1;
    this.moveMode = moveMode;
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
      .setCircle(4, 3, 4)
      .setDepth(9)
      .setCollideWorldBounds(true);

    // this.setImmovable(true);
  }
  preUpdate() {
    const delay = 700;
    this.moveMode === "upDown"
      ? this.upDownMove(delay)
      : this.randomMove(delay);
  }
  upDownMove(delay: number) {
    if (this.moveTimer) {
      return;
    }
    this.moveTimer = this.scene.time.delayedCall(delay, () => {
      const maxY = 160;
      this.setVelocityY(this.y >= maxY ? -this.moveSpeed : this.moveSpeed);
      if (this.y >= maxY) {
        this.setFlipX(true);
        this.anims.play(`pixel_animals_move${this.frameNo}`, true);
      } else {
        this.setFlipX(false);
        this.anims.play(`pixel_animals_move${this.frameNo}`, true);
      }
      this.moveTimer = null;
    });
  }
  randomMove(delay) {
    if (this.moveTimer) {
      return;
    }
    this.moveTimer = this.scene.time.delayedCall(delay, () => {
      const randomVelocity = Phaser.Math.RandomXY(
        new Phaser.Math.Vector2(),
        this.moveSpeed
      );
      this.setVelocity(randomVelocity.x, randomVelocity.y);
      if (randomVelocity.x > 0) {
        this.setFlipX(true);
        this.anims.play(`pixel_animals_move${this.frameNo}`, true);
      } else {
        this.setFlipX(false);
        this.anims.play(`pixel_animals_move${this.frameNo}`, true);
      }
      this.moveTimer = null;
    });
  }
}
