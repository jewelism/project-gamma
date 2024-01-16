import { UI } from "@/phaser/constants";
import { UPGRADE } from "@/phaser/constants/upgrade";
import { AttackerInBunker } from "@/phaser/objects/AttackerInBunker";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { createFlashFn } from "@/phaser/utils/helper";

export class Bunker extends Phaser.GameObjects.Container {
  sprite: Phaser.Physics.Arcade.Sprite;
  shooterGaugeBar: GaugeBar;
  hpBar: GaugeBar;
  soldiers: Phaser.GameObjects.Group;

  constructor(scene) {
    super(
      scene,
      Number(scene.game.config.width) / 2,
      Number(scene.game.config.height) / 2 - UI.height / 2
    );

    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, "bunker");
    this.hpBar = new GaugeBar(this.scene, {
      max: UPGRADE.upgradeBunker.value * 10,
    }).setPosition(0, -40);
    this.shooterGaugeBar = new GaugeBar(this.scene, {
      max: UPGRADE.addSoldier.max,
      value: UPGRADE.addSoldier.value,
      color: 0x000000,
    }).setPosition(0, 20);

    this.soldiers = new Phaser.GameObjects.Group(scene);

    this.add([this.sprite, this.hpBar, this.shooterGaugeBar]);
    scene.physics.add.existing(this, true);
    scene.add.existing(this);
  }
  protected preUpdate(_time: number, _delta: number): void {}
  isDestroyed() {
    return !this.active || this.hpBar.value <= 0;
  }
  decreaseHealth(damage: number) {
    this.hpBar.decrease(damage);
    createFlashFn()(this.sprite);
  }
}
