import { UI } from "@/phaser/constants";
import { UPGRADE_V2 } from "@/phaser/constants/upgrade";
import { CenterText } from "@/phaser/objects/CenterText";
import { InGamePauseScene } from "@/phaser/scenes/InGamePauseScene";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { createFlashFn } from "@/phaser/utils/helper";
import { batch } from "@preact/signals-core";

export class Bunker extends Phaser.GameObjects.Container {
  sprite: Phaser.Physics.Arcade.Sprite;
  shooterGaugeBar: GaugeBar;
  hpBar: GaugeBar;
  units: Phaser.GameObjects.Group;
  hpRegen = 0;

  constructor(scene) {
    super(
      scene,
      Number(scene.game.config.width) / 2,
      Number(scene.game.config.height) / 2 - UI.height / 2
    );

    this.sprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, "bunker");
    this.units = new Phaser.GameObjects.Group(scene);
    this.hpBar = new GaugeBar(this.scene, {
      max: UPGRADE_V2.util.upgradeBunker.current.value * 30,
      width: 120,
      height: 16,
      showText: true,
    }).setPosition(0, -60);
    this.shooterGaugeBar = new GaugeBar(this.scene, {
      max: 10,
      current: this.units.getChildren().length,
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
    this.setAlpha(0.1);
    new CenterText(this.scene, { text: "Game Over" });
    this.scene.scene.pause();
    this.scene.scene.get("InGameUIScene").scene.pause();
    const InGamePauseScene = this.scene.scene.get(
      "InGamePauseScene"
    ) as InGamePauseScene;
    InGamePauseScene.gameover.value = true;
    (this.scene as InGameScene).bgm.stop();
    InGamePauseScene.time.delayedCall(100, () => {
      const onKeydown = () => {
        InGamePauseScene.scene.start("StartScene");
      };
      InGamePauseScene.input.keyboard.on("keydown", onKeydown);
      InGamePauseScene.input.on("pointerdown", onKeydown);
      this.setAlpha(0);
    });
  }
  upgrade() {
    batch(() => {
      this.hpRegen += 1;
      this.hpBar.max.value += 20;
      this.hpBar.current.value += 20;
      this.shooterGaugeBar.max.value += 1;
    });
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
  centerXY() {
    return { x: this.x, y: this.y - 100 };
  }
}
