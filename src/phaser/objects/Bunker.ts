import { GAME, UI } from "@/phaser/constants";
import { Missile } from "@/phaser/objects/Missile";
import { InGameScene } from "@/phaser/scenes/InGameScene";

export class Bunker extends Phaser.Physics.Arcade.Sprite {
  attackRange: number = 300;
  attackSpeed: number = 1000;
  damage: number;
  attackTimer: Phaser.Time.TimerEvent;

  constructor(scene) {
    super(
      scene,
      Number(scene.game.config.width) / 2,
      Number(scene.game.config.height) / 2 - UI.height / 2,
      "bunker"
    );
    scene.physics.add.existing(this, true);
    scene.add.existing(this);
  }
  protected preUpdate(_time: number, _delta: number): void {
    if (!this.attackTimer && (this.scene as any).healthBar.value > 0) {
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
    return !this.active || (this.scene as InGameScene).healthBar.value <= 0;
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
  flash() {
    this.setTint(0xff0000);
    this.scene.time.delayedCall(
      100,
      () => {
        this.clearTint();
      },
      [],
      this
    );
  }
  getUpgradeCost(id) {
    return 100;
  }
}
