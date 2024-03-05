import { GAME } from "@/phaser/constants";
import { getPhaseData } from "@/phaser/constants/phase";
import { Bunker } from "@/phaser/objects/Bunker";
import { Enemy } from "@/phaser/objects/Enemy";
import { InGameUIScene } from "@/phaser/scenes/ui/InGameUIScene";
import { EaseText } from "@/phaser/ui/EaseText";
import { ResourceStatesType } from "@/phaser/ui/ResourceState";
import { getEnemyRandomDirectionXY } from "@/phaser/utils/helper";

export class InGameScene extends Phaser.Scene {
  eventBus: Phaser.Events.EventEmitter;
  bunker: Bunker;
  enemies: Phaser.Physics.Arcade.Group;
  enemyTimer: Phaser.Time.TimerEvent;
  resourceStates: ResourceStatesType;
  bgm:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;

  create() {
    this.bgm = this.sound.add("bgm1");
    this.bgm.volume = 0.5;
    // this.bgm.play({ loop: true });
    this.scene.launch("InGameUIScene");
    // createTitleText(this, "Select Level", 100);
    this.createMap(this);

    this.bunker = new Bunker(this);

    this.enemies = this.physics.add.group();
    this.createEnemy();
    this.createIncome();
  }
  createMap(scene: Phaser.Scene) {
    const map = scene.make.tilemap({
      key: "map",
    });
    const terrianTiles = map.addTilesetImage("Terrian", "Terrian");
    map.createLayer("bg", terrianTiles);
  }
  createEnemy() {
    let index = 0;
    let count = 0;
    const phaseData = getPhaseData();

    new EaseText(this, {
      ...this.bunker.centerXY(),
      text: "Phase 1",
      color: "#619196",
      duration: 5000,
    }).setFontSize(20);
    this.enemyTimer = this.time.addEvent({
      delay: 900 / GAME.speed,
      callback: () => {
        if (index >= phaseData.length) {
          return;
        }
        if (this.bunker.hpBar.current.value === 0) {
          return;
        }
        const { phase, spriteKey, frameNo } = phaseData[index];
        const [x, y] = getEnemyRandomDirectionXY(this);
        const enemy = new Enemy(this, {
          x,
          y,
          grade: phase,
          spriteKey,
          frameNo,
        });
        this.enemies.add(enemy);
        count++;
        if (count === phaseData[index].count) {
          index++;
          count = 0;
          this.enemyTimer.paused = true;
          const inGameUIScene = this.scene.get(
            "InGameUIScene"
          ) as InGameUIScene;
          inGameUIScene.createTimer(1 / 6, () => {
            new EaseText(this, {
              ...this.bunker.centerXY(),
              text: `Phase ${index + 1}`,
              color: "#619196",
              duration: 2000,
            }).setFontSize(20);
            this.enemyTimer.paused = false;
          });
        }
      },
      loop: true,
      callbackScope: this,
    });
  }
  createIncome() {
    let index = 0;
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        index++;
        if (!!index && index % 5 === 0) {
          const amount = this.resourceStates.increaseByIncome();
          if (!amount) {
            return;
          }
          new EaseText(this, {
            ...this.bunker.centerXY(),
            text: `+${amount} income`,
            color: "#619196",
            duration: 2500,
          }).setFontSize(18);
        }
      },
      loop: true,
      callbackScope: this,
    });
  }
  constructor() {
    super("InGameScene");
    this.eventBus = new Phaser.Events.EventEmitter();
  }
  preload() {
    this.load.audio("bgm1", "assets/audio/bgm1.mp3");
    this.load.tilemapTiledJSON("map", "assets/tiled/map.json");
    this.load.image("Terrian", "assets/tiled/Tile1.0.1/Terrian.png");
    this.load.image("bunker", "assets/bunker_100x100.png");
    this.load.image("missile", "assets/bullet_8x8.png");
    this.load.spritesheet("pixel_animals", "assets/pixel_animals.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }
}
