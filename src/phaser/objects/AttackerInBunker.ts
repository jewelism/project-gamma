import { GAME } from "@/phaser/constants";
import { Bunker } from "@/phaser/objects/Bunker";
import { Missile } from "@/phaser/objects/Missile";
import { InGameScene } from "@/phaser/scenes/InGameScene";

export class AttackerInBunker extends Phaser.GameObjects.Zone {
  owner: Bunker;
  grade: number;

  damage: number;
  attackRange: number;
  attackSpeed: number;

  attackTimer: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    { owner, grade }: { owner: Bunker; grade: number }
  ) {
    super(scene, owner.x, owner.y);

    this.owner = owner;
    this.grade = grade;

    this.damage = 1 * this.grade;
    this.attackRange = 100 + this.grade * 50;
    this.attackSpeed = 1000 - this.grade * 100;

    scene.add.existing(this);
  }
  preUpdate(_time: number, _delta: number): void {
    if (!this.attackTimer && this.owner.hpBar.value > 0) {
      this.attackTimer = this.scene.time.delayedCall(
        this.attackSpeed / GAME.speed,
        () => {
          this.shootToClosestEnemy();
          this.attackTimer = null;
        }
      );
    }
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
}
