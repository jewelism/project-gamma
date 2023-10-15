export class Missile extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 500;
  closestEnemy: Phaser.GameObjects.GameObject;

  constructor(scene, { shooter }) {
    super(scene, shooter.x, shooter.y, "missile");

    scene.missiles.add(this);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    // scene.m_beamSound.play();
    // this.closestEnemy = this.scene.physics.closest(
    //   this,
    //   (this.scene as any).enemies.getChildren()
    // );
  }
  // protected preUpdate(_time: number, _delta: number): void {
  //   this.moveToClosestEnemy();
  // }
  // moveToClosestEnemy() {
  //   if (
  //     !this.closestEnemy
  //     //  || (this.closestEnemy as any).isDestroyed()
  //   ) {
  //     this.destroy();
  //     return;
  //   }
  //   this.scene.physics.moveToObject(
  //     this,
  //     this.closestEnemy,
  //     GAME.speed * Missile.SPEED
  //   );
  // }
}
