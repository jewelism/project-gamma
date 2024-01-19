import { InGameScene } from "@/phaser/scenes/InGameScene";
import { EaseText } from "@/phaser/ui/EaseText";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { createFlashFn, isOutOfRange } from "@/phaser/utils/helper";

export class Enemy extends Phaser.GameObjects.Container {
  static MOVE_SPEED_RANK = 25;
  attackRange: number = 100;
  attackSpeed: number = 100;
  attackDamage: number = 100;
  defence: number = 100;
  moveSpeed: number = 50;
  maxHp: number;
  hp: number = 100;
  sprite: Phaser.Physics.Arcade.Sprite;
  frameNo: number;
  spriteKey: string;
  direction: string;
  hpBar: GaugeBar;
  grade: number;

  constructor(scene: Phaser.Scene, { x, y, hp, grade, spriteKey, frameNo }) {
    super(scene, x, y);
    this.sprite = new Phaser.Physics.Arcade.Sprite(
      scene,
      0,
      0,
      spriteKey,
      frameNo
    )
      .setScale(2)
      .setDepth(9);
    this.hp = hp;
    this.maxHp = hp;
    this.grade = grade;
    this.frameNo = frameNo;
    this.spriteKey = spriteKey;

    this.setSize(this.sprite.width, this.sprite.height);

    this.hpBar = new GaugeBar(scene, { max: this.maxHp });
    this.sprite.anims.create({
      key: `${spriteKey}_move${frameNo}`,
      frames: this.sprite.anims.generateFrameNames(spriteKey, {
        frames: [frameNo, frameNo + 1],
      }),
      frameRate: this.moveSpeed / Enemy.MOVE_SPEED_RANK,
    });
    scene.physics.world.enable(this);

    this.add([this.hpBar, this.sprite]);
    scene.add.existing(this);
  }
  preUpdate() {
    this.moveToBunker();
  }
  isDestroyed() {
    return !this.active || this.hp <= 0;
  }
  isDamaged() {
    return this.hp < this.maxHp;
  }
  getAttackSpeedMs() {
    return (250 - this.attackSpeed) * 10;
  }
  decreaseHp(amount: number, destroyFn?: () => void) {
    if (this.isDestroyed()) {
      return;
    }
    this.hp -= amount;
    this.hpBar.updateBar(this.hp);
    createFlashFn()(this.sprite);

    // 데미지표시
    // new EaseText(this.scene, {
    //   x: this.x,
    //   y: this.y,
    //   text: `${amount}`,
    //   color: "#ff0000",
    // });
    if (this.hp <= 0) {
      destroyFn?.();
      this.destroy();
    }
  }
  flipSpriteByDirection() {
    if (this.body.velocity.x > 0) {
      this.sprite.setFlipX(true);
      return;
    }
    this.sprite.setFlipX(false);
  }
  moveToBunker() {
    const { bunker } = this.scene as InGameScene;
    if (!bunker.scene || !isOutOfRange(this, bunker)) {
      (this.body as any).setVelocity(0);
      return;
    }
    this.sprite.anims.play(`pixel_animals_move${this.frameNo}`, true);
    this.scene.physics.moveToObject(this, bunker, this.moveSpeed);
    this.flipSpriteByDirection();
  }
}
