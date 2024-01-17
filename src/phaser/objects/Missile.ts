import { GAME } from "@/phaser/constants";
import { Soldier } from "@/phaser/objects/Soldier";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { isOutOfRange } from "@/phaser/utils/helper";

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
    this.setDepth(98);
    (this.scene as InGameScene).bunker.setDepth(99);
  }
  protected preUpdate(_time: number, _delta: number): void {
    this.moveToEnemy();
  }
  moveToEnemy() {
    if (!this.closestEnemy || (this.closestEnemy as any).isDestroyed()) {
      this.shooter.attackTimer = null;
      this.destroy();
      return;
    }
    if (isOutOfRange(this.shooter, this.closestEnemy)) {
      this.shooter.attackTimer = null;
      this.destroy();
      console.log("missile destroy by range");
      return;
    }
    this.scene.physics.moveToObject(
      this,
      this.closestEnemy,
      GAME.speed * Missile.SPEED
    );
  }
}
