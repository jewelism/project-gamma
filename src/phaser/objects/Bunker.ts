import { UI } from "@/phaser/scenes/InGameScene";

export class Bunker extends Phaser.Physics.Arcade.Sprite {
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
  // shoot() {
  //   if ((this.scene as any).enemies?.getChildren().length === 0) {
  //     return;
  //   }
  //   const closestEnemy = this.scene.physics.closest(
  //     this,
  //     (this.scene as PlayScene).enemies.getChildren()
  //   );
  //   const distance = Phaser.Math.Distance.Between(
  //     this.x,
  //     this.y,
  //     (closestEnemy as Enemy).x,
  //     (closestEnemy as Enemy).y
  //   );
  //   if (distance > this.attackRange) {
  //     return;
  //   }
  //   this.createMissile();
  // }
}
