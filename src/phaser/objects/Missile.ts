import { GAME } from "@/phaser/constants";
import { Soldier } from "@/phaser/objects/Soldier";

export class Missile extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 750;
  closestEnemy: Phaser.GameObjects.GameObject;
  shooter: Soldier;

  constructor(scene, { shooter }) {
    super(scene, shooter.x, shooter.y, "missile");

    this.shooter = shooter;

    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // scene.m_beamSound.play();
    this.closestEnemy = this.scene.physics.closest(
      this,
      (this.scene as any).enemies.getChildren()
    );
  }
  protected preUpdate(_time: number, _delta: number): void {
    this.moveToClosestEnemy();
  }
  moveToClosestEnemy() {
    if (!this.closestEnemy || (this.closestEnemy as any).isDestroyed()) {
      this.destroy();
      return;
    }
    if (
      this.shooter.attackRange <
      Phaser.Math.Distance.Between(
        this.x,
        this.y,
        (this.closestEnemy as any).x,
        (this.closestEnemy as any).y
      )
    ) {
      this.destroy();
      return;
    }
    this.scene.physics.moveToObject(
      this,
      this.closestEnemy,
      GAME.speed * Missile.SPEED
    );
  }
}
