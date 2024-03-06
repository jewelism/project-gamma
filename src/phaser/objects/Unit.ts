import { GAME } from "@/phaser/constants";
import { UPGRADE_V2 } from "@/phaser/constants/upgrade";
import { Bunker } from "@/phaser/objects/Bunker";
import { Enemy } from "@/phaser/objects/Enemy";
import { Missile } from "@/phaser/objects/Missile";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { EaseText } from "@/phaser/ui/EaseText";
import { getRandomEnemyInRange } from "@/phaser/utils/helper";
import { effect } from "@preact/signals-core";

export class Unit extends Phaser.GameObjects.Zone {
  owner: Bunker;
  grade: number;

  damage: number;
  attackRange: number;
  attackSpeed: number;

  attackTimer: Phaser.Time.TimerEvent;
  attackRangeGraphics: Phaser.GameObjects.Graphics;
  missiles: Phaser.Physics.Arcade.Group;

  constructor(
    scene: Phaser.Scene,
    { owner, grade }: { owner: Bunker; grade: number }
  ) {
    super(scene, owner.x, owner.y);

    this.owner = owner;
    this.grade = grade;

    this.damage = 2 * this.grade;
    this.attackRange = 100 + this.grade * 10;
    this.attackSpeed = 2000 - this.grade * 10;

    this.missiles = this.scene.physics.add.group();
    this.scene.physics.add.overlap(
      (this.scene as InGameScene).enemies,
      this.missiles,
      (_enemy, _missile) => {
        const enemy = _enemy as Enemy;
        const missile = _missile as Missile;
        missile.destroy();
        enemy.decreaseHp(missile.shooter.damage, () => {
          new EaseText(this.scene, {
            x: (enemy as any).x,
            y: (enemy as any).y,
            text: `+${enemy.maxHp}`,
            color: "#619196",
          });
          (this.scene as InGameScene).resourceStates.gold.increase(enemy.maxHp);
        });
      }
    );

    scene.add.existing(this);

    this.scene.game.config.physics.arcade?.debug && this.drawAttackRange();
    console.log(UPGRADE_V2.attackDamage);

    effect(() => {
      const gradeStart = Math.ceil(this.grade / 3);
      const { current } =
        UPGRADE_V2.attackDamage[`attackDamage${gradeStart}_${gradeStart + 2}`];
      this.damage += current.value * this.grade;
    });
  }
  preUpdate(_time: number, _delta: number): void {
    this.shoot();
  }
  shoot() {
    if (!(!this.attackTimer && this.owner.hpBar.current.value > 0)) {
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
        this.attackTimer = null;
      }
    );
  }
  createMissile() {
    const scene = this.scene as InGameScene;

    const missile = new Missile(scene, {
      shooter: this,
    });
    this.missiles.add(missile);
  }
  drawAttackRange() {
    this.attackRangeGraphics = this.scene.add.graphics({
      lineStyle: { width: 2, color: 0xff0000 },
      fillStyle: { color: 0xff0000, alpha: 0.5 },
    });
    this.attackRangeGraphics.strokeCircle(this.x, this.y, this.attackRange);
  }
  destroy(fromScene?: boolean): void {
    this.attackTimer?.destroy();
    this.attackRangeGraphics?.destroy();
    super.destroy(fromScene);
  }
}
