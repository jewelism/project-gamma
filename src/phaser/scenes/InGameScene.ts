// import { createTitleText } from "@/phaser/phaserUtils/titleText";
import { GAME, INIT, UI } from "@/phaser/constants";
import { getPhaseData } from "@/phaser/constants/phase";
import { Bunker } from "@/phaser/objects/Bunker";
import { PixelAnimal } from "@/phaser/objects/PixelAnimal";
import { createTitleText } from "@/phaser/phaserUtils/titleText";
import { EaseText } from "@/phaser/ui/EaseText";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { HealthBar, HealthBarConfig } from "@/phaser/ui/HealthBar";
import { Button } from "@/phaser/ui/upgrade/Button";

export class InGameScene extends Phaser.Scene {
  healthBar: HealthBar;
  bunker: Bunker;
  enemies: Phaser.Physics.Arcade.Group;
  timer: Phaser.Time.TimerEvent;
  missiles: Phaser.Physics.Arcade.Group;
  gaugeBar: GaugeBar;

  constructor() {
    super("InGameScene");
  }
  preload() {
    this.load.tilemapTiledJSON("map", "assets/tiled/map.json");
    this.load.image("Terrian", "assets/tiled/Tile1.0.1/Terrian.png");
    this.load.image("bunker", "assets/bunker_100x100.png");
    this.load.image("missile", "assets/bullet_8x8.png");
    this.load.spritesheet("pixel_animals", "assets/pixel_animals.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("sword1", "assets/upgrade_icon.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
    });
    this.load.spritesheet("defence1", "assets/upgrade_icon.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 3,
    });
    this.load.spritesheet("book1", "assets/upgrade_icon.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 6,
    });
  }
  create() {
    // createTitleText(this, "Select Level", 100);
    this.createUI(this);
    this.createMap(this);

    this.bunker = new Bunker(this);

    this.gaugeBar = new GaugeBar(this, {
      x: this.bunker.x - HealthBarConfig.width / 2,
      y: this.bunker.y + 40,
      max: INIT.soliderCountMax,
      value: INIT.soliderCount,
    });
    this.healthBar = new HealthBar(
      this,
      this.bunker.x - HealthBarConfig.width / 2,
      this.bunker.y - 40,
      INIT.health
    );
    this.enemies = this.physics.add.group();
    this.missiles = this.physics.add.group();
    this.createEnemy();

    this.physics.add.collider(this.enemies, this.missiles, (enemy, missile) => {
      missile.destroy();
      enemy.destroy();
      new EaseText(this, {
        x: (enemy as any).x,
        y: (enemy as any).y,
        text: "+1",
        color: "#84b4c8",
      });
    });
    this.physics.add.collider(this.enemies, this.bunker, (_bunker, enemy) => {
      enemy.destroy();
      this.healthBar.decrease(1);

      if (this.healthBar.value === 0) {
        this.bunker.setAlpha(0.1);

        createTitleText(this, "Game Over", Number(this.game.config.height) / 2);
        this.time.delayedCall(500, () => {
          const onKeydown = () => {
            this.scene.start("StartScene");
          };
          this.input.keyboard.on("keydown", onKeydown);
          this.input.on("pointerdown", onKeydown);
        });
        // this.healthBar.bar.destroy();
        // overlay game over
        // this.scene.start("StartScene");
        return;
      }

      this.bunker.flash();
      new EaseText(this, {
        x: (enemy as any).x,
        y: (enemy as any).y,
        text: "boom!",
        color: "#ff0000",
      });
    });
  }
  createUI(scene: Phaser.Scene) {
    const uiContainer = scene.add.container(
      0,
      Number(scene.game.config.height) - UI.height
    );
    const uiWrap = scene.add
      .rectangle(
        0,
        0,
        // Number(scene.game.config.height) - height,
        Number(scene.game.config.width),
        UI.height
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setFillStyle(0x00ff00);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    const buttons = [
      { id: "income", spriteKey: "book1", desc: "increase income +0.5%" },
      { id: "addSoldier", spriteKey: "", desc: "add new random attacker +1" },
      { id: "attackSpeed", spriteKey: "", desc: "increase attack speed 1%" },
      {
        id: "attackDamage",
        spriteKey: "sword1",
        desc: "increase attack damage 1%",
      },
      { id: "upgradeBunker", spriteKey: "defence1", desc: "upgrade bunker" },
    ].map(({ id, spriteKey, desc }, index) => {
      const button = new Button(scene, {
        x: Number(scene.game.config.width) - 50 * (index + 1),
        y: 0,
        width: 50,
        height: 50,
        spriteKey,
        hoverText: desc,
        onClick: () => {
          this.events.emit("upgrade", id);
        },
      });
      return button;
    });
    uiContainer.add([uiWrap, ...buttons]).setDepth(9999);
  }
  createMap(scene: Phaser.Scene) {
    const map = scene.make.tilemap({
      key: "map",
    });
    const terrianTiles = map.addTilesetImage("Terrian", "Terrian");
    map.createLayer("bg", terrianTiles);
  }
  createEnemy() {
    const phaseData = getPhaseData();
    let index = 0;
    let count = 0;

    this.timer = this.time.addEvent({
      delay: 100 / GAME.speed,
      callback: () => {
        if (this.healthBar.value === 0) {
          return;
        }
        const { phase, hp, spriteKey, frameNo } = phaseData[index];
        const direction = Phaser.Math.RND.integerInRange(0, 3);
        let x, y;
        if (direction === 0) {
          x = Phaser.Math.RND.integerInRange(
            0,
            this.cameras.main.worldView.right
          );
          y = this.cameras.main.worldView.top - 50;
        } else if (direction === 1) {
          x = this.cameras.main.worldView.right + 50;
          y = Phaser.Math.RND.integerInRange(
            0,
            this.cameras.main.worldView.bottom
          );
        } else if (direction === 2) {
          x = Phaser.Math.RND.integerInRange(
            0,
            this.cameras.main.worldView.right
          );
          y = this.cameras.main.worldView.bottom + 50;
        } else if (direction === 3) {
          x = this.cameras.main.worldView.left - 50;
          y = Phaser.Math.RND.integerInRange(
            0,
            this.cameras.main.worldView.bottom
          );
        }

        const pixelAnimal = new PixelAnimal(this, {
          x,
          y,
          hp,
          frameNo,
        });
        this.enemies.add(pixelAnimal);
        count++;
      },
      loop: true,
      callbackScope: this,
    });
  }
}
