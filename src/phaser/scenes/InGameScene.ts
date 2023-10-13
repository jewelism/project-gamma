// import { createTitleText } from "@/phaser/phaserUtils/titleText";
import { HealthBar, HealthBarConfig } from "@/phaser/ui/HealthBar";
import { Button } from "@/phaser/ui/upgrade/Button";

const uiHeight = 200;
export class InGameScene extends Phaser.Scene {
  healthBar: HealthBar;
  constructor() {
    super("InGameScene");
  }
  preload() {
    this.load.image("bunker", "assets/bunker_100x100.png");
    this.load.spritesheet("pixel_animals", "assets/pixel_animals.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
  create() {
    // createTitleText(this, "Select Level", 100);
    this.createUI(this);
    this.createBunker(this);
  }
  createBunker(scene: Phaser.Scene) {
    const bunkerSprite = scene.add.sprite(0, 0, "bunker");
    this.healthBar = new HealthBar(
      scene,
      bunkerSprite.x - HealthBarConfig.width / 2,
      bunkerSprite.y - 40,
      100
    );
    scene.add.container(
      Number(scene.game.config.width) / 2,
      Number(scene.game.config.height) / 2 - uiHeight / 2,
      [bunkerSprite, this.healthBar.bar]
    );
  }
  createUI(scene: Phaser.Scene) {
    const uiContainer = scene.add.container(
      0,
      Number(scene.game.config.height) - uiHeight
    );
    const uiWrap = scene.add
      .rectangle(
        0,
        0,
        // Number(scene.game.config.height) - height,
        Number(scene.game.config.width),
        uiHeight
      )
      .setOrigin(0, 0)
      .setDepth(100)
      .setScrollFactor(0)
      .setFillStyle(0x00ff00, 0.2);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    const buttons = [
      { id: "addSoldier", desc: "add new random attacker +1" },
      { id: "attackDamage", desc: "increase attack damage 1%" },
      { id: "attackSpeed", desc: "increase attack speed 1%" },
      { id: "income", desc: "increase income +0.5%" },
      { id: "upgradeBunker", desc: "upgrade bunker" },
    ].map(({ id, desc }, index) => {
      const button = new Button(scene, {
        x: Number(scene.game.config.width) - 50 * (index + 1),
        y: 0,
        width: 50,
        height: 50,
        hoverText: desc,
        onClick: () => {
          console.log("click", this, button, id);
          this.events.emit("upgrade", id);
        },
      });
      return button;
    });
    uiContainer.add([uiWrap, ...buttons]);
  }
  createMap(scene: Phaser.Scene, mapKey: string) {
    const map = scene.make.tilemap({
      key: mapKey,
    });
    const jew_pastel_lineTiles = map.addTilesetImage(
      "jew_pastel_line",
      "jew_pastel_line"
    );
    const collision_layer = map.createLayer("bg_collision", [
      jew_pastel_lineTiles,
    ]);
    collision_layer.setCollisionByExclusion([-1]);

    const bunkerSpawnPoints = map.findObject("BunkerSpawn", ({ name }) => {
      return name.includes("BunkerSpawn");
    });
  }
}
