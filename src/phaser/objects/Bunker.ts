import { GAME, INIT, UI } from "@/phaser/constants";
import { Missile } from "@/phaser/objects/Missile";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { createFlashFn } from "@/phaser/utils/helper";

export class Bunker extends Phaser.GameObjects.Container {
  attackRange: number = 300;
  attackSpeed: number = 1000;
  damage: number;
  attackTimer: Phaser.Time.TimerEvent;
  sprite: Phaser.Physics.Arcade.Sprite;
  shooterGaugeBar: GaugeBar;
  hpBar: GaugeBar;

  constructor(scene) {
    super(
      scene,
      Number(scene.game.config.width) / 2,
      Number(scene.game.config.height) / 2 - UI.height / 2
    );

    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, "bunker");
    this.hpBar = new GaugeBar(this.scene, { max: INIT.health }).setPosition(
      0,
      -40
    );
    this.shooterGaugeBar = new GaugeBar(this.scene, {
      max: INIT.soliderCountMax,
      value: INIT.soliderCount,
    }).setPosition(0, 20);

    this.add([this.sprite, this.hpBar, this.shooterGaugeBar]);
    scene.physics.add.existing(this, true);
    scene.add.existing(this);
  }
  protected preUpdate(_time: number, _delta: number): void {
    if (!this.attackTimer && this.hpBar.value > 0) {
      this.attackTimer = this.scene.time.delayedCall(
        this.attackSpeed / GAME.speed,
        () => {
          this.shootToClosestEnemy();
          this.attackTimer = null;
        }
      );
    }
  }
  isDestroyed() {
    return !this.active || this.hpBar.value <= 0;
  }
  shootToClosestEnemy() {
    const scene = this.scene as InGameScene;
    if (scene.enemies?.getChildren().length === 0) {
      return;
    }
    const closestEnemy = this.scene.physics.closest(
      this,
      scene.enemies.getChildren()
    );
    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      (closestEnemy as any).x,
      (closestEnemy as any).y
    );
    if (distance > this.attackRange) {
      return;
    }
    const missile = new Missile(this.scene, {
      shooter: this,
    })
      .setX(this.x)
      .setY(this.y);

    scene.missiles.add(missile);
  }
  decreaseHealth(damage: number) {
    this.hpBar.decrease(damage);
    createFlashFn()(this.sprite);
  }
  getUpgradeCost(id) {
    return 100;
  }
}
