import { UI } from "@/phaser/constants";
import { UPGRADE_V2 } from "@/phaser/constants/upgrade";
import { createTitleText } from "@/phaser/phaserUtils/titleText";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { createFlashFn } from "@/phaser/utils/helper";

export class Bunker extends Phaser.GameObjects.Container {
  sprite: Phaser.Physics.Arcade.Sprite;
  shooterGaugeBar: GaugeBar;
  hpBar: GaugeBar;
  soldiers: Phaser.GameObjects.Group;
  soldierMaxCount = 10;
  hpRegen = 0;

  constructor(scene) {
    super(
      scene,
      Number(scene.game.config.width) / 2,
      Number(scene.game.config.height) / 2 - UI.height / 2
    );

    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, "bunker");
    this.soldiers = new Phaser.GameObjects.Group(scene);
    this.hpBar = new GaugeBar(this.scene, {
      max: UPGRADE_V2.util.upgradeBunker.current.value * 10,
      width: 120,
      height: 16,
      showText: true,
    }).setPosition(0, -60);
    this.shooterGaugeBar = new GaugeBar(this.scene, {
      max: this.soldierMaxCount,
      current: this.soldiers.getChildren().length,
      color: 0x000000,
    }).setPosition(0, 20);

    this.add([this.sprite, this.hpBar, this.shooterGaugeBar]);
    scene.physics.add.existing(this, true);
    scene.add.existing(this);
    (this.body as any).setCircle(30);

    this.hpRegenPerSec();
  }
  protected preUpdate(_time: number, _delta: number): void {}
  isDestroyed() {
    return !this.active || this.hpBar.current.value <= 0;
  }
  decreaseHealth(damage: number) {
    this.hpBar.current.value -= damage;
    createFlashFn()(this.sprite);
    if (!this.isDestroyed()) {
      return;
    }
    this.scene.scene.pause();
    this.setAlpha(0.1);
    createTitleText(
      this.scene,
      "Game Over",
      Number(this.scene.game.config.height) / 2
    );
    this.scene.time.delayedCall(300, () => {
      const onKeydown = () => {
        this.scene.scene.start("StartScene");
      };
      this.scene.input.keyboard.on("keydown", onKeydown);
      this.scene.input.on("pointerdown", onKeydown);
    });
    this.destroy();
  }
  upgrade() {
    this.hpRegen += 1;
    this.hpBar.max.value += 10;
    this.hpBar.current.value += 10;
    this.shooterGaugeBar.max.value += 1;
  }
  hpRegenPerSec() {
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.isDestroyed()) {
          return;
        }
        if (this.hpBar.current.value >= this.hpBar.max.value) {
          return;
        }
        this.hpBar.current.value += this.hpRegen;
      },
      loop: true,
    });
  }
}
