import { GAME } from "@/phaser/constants";
import { Soldier } from "@/phaser/objects/Soldier";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { getRandomEnemyInRange, isOutOfRange } from "@/phaser/utils/helper";

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
      (this.scene as InGameScene).enemies.getChildren()
    );
    this.closestEnemy = getRandomEnemyInRange(scene, this.shooter);
    this.setDepth(98);
    (this.scene as InGameScene).bunker.setDepth(99);
  }
  protected preUpdate(_time: number, _delta: number): void {
    this.moveToEnemy();
  }
  moveToEnemy() {
    if (!this.closestEnemy) {
      this.destroy();
      return;
    }
    if ((this.closestEnemy as any).isDestroyed()) {
      this.destroy();
      return;
    }
    if (isOutOfRange(this.shooter, this.closestEnemy)) {
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
