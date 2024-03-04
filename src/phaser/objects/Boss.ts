import { Enemy } from "@/phaser/objects/Enemy";

export class Boss extends Phaser.GameObjects.GameObject {
  constructor(scene: Phaser.Scene, { x, y, spriteKey, frameNo, grade }) {
    super(scene, "sprite");
    const enemy = new Enemy(scene, {
      x,
      y,
      grade: grade * 2,
      spriteKey,
      frameNo,
    }).setScale(3);
    enemy.attackRange = 200;
    scene.add.existing(enemy);
    return enemy;
  }
}
