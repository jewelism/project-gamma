// import { createTitleText } from "@/phaser/phaserUtils/titleText";
import { GAME } from "@/phaser/constants";
import { getPhaseData } from "@/phaser/constants/phase";
import { Bunker } from "@/phaser/objects/Bunker";
import { Enemy } from "@/phaser/objects/Enemy";
import { Missile } from "@/phaser/objects/Missile";
import { EaseText } from "@/phaser/ui/EaseText";
import { ResourceState } from "@/phaser/ui/ResourceState";
import { getEnemyRandomDirectionXY } from "@/phaser/utils/helper";

export class InGameScene extends Phaser.Scene {
  eventBus: Phaser.Events.EventEmitter;
  bunker: Bunker;
  enemies: Phaser.Physics.Arcade.Group;
  timer: Phaser.Time.TimerEvent;
  missiles: Phaser.Physics.Arcade.Group;
  resourceStates: {
    income: number;
    gold: ResourceState;
    star: ResourceState;
    increaseByIncome: () => number;
    decreaseByUpgrade: (payload: { gold?: number; star?: number }) => void;
    decreaseByPercent: (percent: number) => void;
  };

  constructor() {
    super("InGameScene");
    this.eventBus = new Phaser.Events.EventEmitter();
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
  }
  create() {
    this.scene.launch("InGameUIScene");
    // createTitleText(this, "Select Level", 100);
    this.createMap(this);

    this.bunker = new Bunker(this);

    this.enemies = this.physics.add.group();
    this.missiles = this.physics.add.group();
    this.createEnemy();
    this.createIncome();

    this.physics.add.overlap(
      this.enemies,
      this.missiles,
      (_enemy, _missile) => {
        const enemy = _enemy as Enemy;
        const missile = _missile as Missile;
        missile.destroy();
        enemy.decreaseHp(missile.shooter.damage, () => {
          new EaseText(this, {
            x: (enemy as any).x,
            y: (enemy as any).y,
            text: "+1",
            color: "#619196",
          });
          this.resourceStates.gold.increase(1);
        });
      }
    );
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
      delay: 900 / GAME.speed,
      callback: () => {
        if (index >= phaseData.length) {
          return;
        }
        if (this.bunker.hpBar.current.value === 0) {
          return;
        }
        const { phase, hp, spriteKey, frameNo } = phaseData[index];
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
          this.resourceStates.increaseByIncome();
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
            x: this.bunker.x + 50,
            y: this.bunker.y,
            text: `+${amount} income`,
            color: "#619196",
            duration: 2500,
          }).setFontSize(18);
          console.log("increase income");
        }
      },
      loop: true,
      callbackScope: this,
    });
  }
}
