import { GAME } from "@/phaser/constants";
import { Bunker } from "@/phaser/objects/Bunker";
import { Missile } from "@/phaser/objects/Missile";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import {
  getAllEnemyInRange,
  getRandomEnemyInRange,
  isOutOfRange,
} from "@/phaser/utils/helper";

export class Soldier extends Phaser.GameObjects.Zone {
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
    this.attackRange = 100 + this.grade * 10;
    this.attackSpeed = 1000 - this.grade * 100;

    scene.add.existing(this);

    this.drawAttackRange(); // for debug
  }
  preUpdate(_time: number, _delta: number): void {
    this.shoot();
  }
  shoot() {
    if (!(!this.attackTimer && this.owner.hpBar.value > 0)) {
      return;
    }
    const scene = this.scene as InGameScene;
    if (!scene || scene.enemies?.getChildren().length === 0) {
      return;
    }
    const target = getRandomEnemyInRange(scene, this);
    if (!target) {
      return;
    }
    this.createMissile();
    this.attackTimer = this.scene.time.delayedCall(
      this.attackSpeed / GAME.speed,
      () => {
        this.createMissile();
        this.attackTimer = null;
      }
    );
  }
  createMissile() {
    const scene = this.scene as InGameScene;

    const missile = new Missile(this.scene, {
      shooter: this,
    })
      .setX(this.x)
      .setY(this.y);
    scene.missiles.add(missile);
  }
  drawAttackRange() {
    const graphics = this.scene.add.graphics({
      lineStyle: { width: 2, color: 0xff0000 },
      fillStyle: { color: 0xff0000, alpha: 0.5 },
    });
    graphics.strokeCircle(this.x, this.y, this.attackRange);
  }
}
