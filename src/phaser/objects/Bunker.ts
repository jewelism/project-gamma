import { GAME } from "@/phaser/constants";
import { Missile } from "@/phaser/objects/Missile";
import { UI } from "@/phaser/scenes/InGameScene";

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
          this.shoot();
          this.attackTimer = null;
        }
      );
    }
  }
  shoot() {
    if ((this.scene as any).enemies?.getChildren().length === 0) {
      return;
    }
    const closestEnemy = this.scene.physics.closest(
      this,
      (this.scene as any).enemies.getChildren()
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

    (this.scene as any).missiles.add(missile);
  }
}
