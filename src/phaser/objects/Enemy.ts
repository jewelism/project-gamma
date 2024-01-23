import { GAME } from "@/phaser/constants";
import { Bunker } from "@/phaser/objects/Bunker";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { createFlashFn, isOutOfRange } from "@/phaser/utils/helper";

export class Enemy extends Phaser.GameObjects.Container {
  static MOVE_SPEED_RANK = 25;
  attackRange: number = 100;
  attackSpeed: number = 1000;
  attackDamage: number = 1;
  moveSpeed: number = 50;
  maxHp: number;
  hp: number = 100;
  sprite: Phaser.Physics.Arcade.Sprite;
  frameNo: number;
  spriteKey: string;
  hpBar: GaugeBar;
  grade: number;
  attackTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, { x, y, grade, spriteKey, frameNo }) {
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
    this.grade = grade;
    this.hp = grade * 2;
    this.maxHp = grade * 2;

    this.attackRange = 50 + grade * 3;
    this.attackSpeed = 3000 - grade * 10;
    this.attackDamage = grade * 2;
    this.moveSpeed = 50 + grade * 3;

    this.frameNo = frameNo;
    this.spriteKey = spriteKey;

    this.setSize(this.sprite.width + 5, this.sprite.height + 5);

    this.hpBar = new GaugeBar(scene, {
      max: this.maxHp,
      width: 25,
    }).setPosition(0, -30);
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
    this.shoot();
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
  shoot() {
    if (this.attackTimer || this.isDestroyed()) {
      return;
    }
    const scene = this.scene as InGameScene;
    if (!scene || scene.bunker.isDestroyed()) {
      return;
    }
    if (isOutOfRange(this, scene.bunker)) {
      return;
    }
    this.createMissile();
    this.attackTimer = this.scene.time.delayedCall(
      this.attackSpeed / GAME.speed,
      () => {
        this.attackTimer = null;
      }
    );
  }
  createMissile() {
    const scene = this.scene as InGameScene;
    const enemyMissile = new EnemyMissile(scene, {
      shooter: this,
    });
    scene.physics.add.overlap(
      enemyMissile,
      scene.bunker,
      (_missile, _bunker) => {
        const bunker = _bunker as Bunker;
        bunker.decreaseHealth(this.attackDamage);
        _missile.destroy();
      }
    );
  }
}

export class EnemyMissile extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 750;
  shooter: Enemy;
  target: Bunker;

  constructor(scene, { shooter }) {
    super(scene, shooter.x, shooter.y, "missile");

    this.shooter = shooter;
    this.x = shooter.x;
    this.y = shooter.y;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // scene.m_beamSound.play();

    this.target = (scene as InGameScene).bunker;
  }
  protected preUpdate(_time: number, _delta: number): void {
    this.moveToTarget();
  }
  moveToTarget() {
    if (!this.scene || !this.shooter || !this.target) {
      this.destroy();
      return;
    }
    if (this.target.isDestroyed()) {
      this.destroy();
      return;
    }
    this.scene.physics.moveToObject(
      this,
      this.target,
      GAME.speed * EnemyMissile.SPEED
    );
  }
}
