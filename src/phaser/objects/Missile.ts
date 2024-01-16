import { GAME } from "@/phaser/constants";
import { AttackerInBunker } from "@/phaser/objects/AttackerInBunker";

export class Missile extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 750;
  closestEnemy: Phaser.GameObjects.GameObject;
  shooter: AttackerInBunker;

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
    if (!this.closestEnemy) {
      this.destroy();
      return;
    }
    if ((this.closestEnemy as any).isDestroyed()) {
      this.destroy();
      this.shooter.shootToClosestEnemy();
      return;
    }
    this.scene.physics.moveToObject(
      this,
      this.closestEnemy,
      GAME.speed * Missile.SPEED
    );
  }
}
