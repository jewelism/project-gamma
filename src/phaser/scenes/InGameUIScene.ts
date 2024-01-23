import { InGameScene } from "@/phaser/scenes/InGameScene";
import { ResourceState } from "@/phaser/ui/ResourceState";
import { UI } from "@/phaser/constants";
import { convertSecondsToMinSec } from "@/phaser/utils";
import { Button } from "@/phaser/ui/upgrade/Button";
import { UPGRADE, getSoldierGradeById } from "@/phaser/constants/upgrade";
import { Soldier } from "@/phaser/objects/Soldier";
import { EaseText } from "@/phaser/ui/EaseText";
import { SoldierStateButton } from "@/phaser/ui/upgrade/SoldierStateButton";

export class InGameUIScene extends Phaser.Scene {
  uiContainer: Phaser.GameObjects.Container;
  attackerStateButtonGroup: Phaser.GameObjects.Group;
  uiEventBus: Phaser.Events.EventEmitter;

  constructor() {
    super("InGameUIScene");
    this.uiEventBus = new Phaser.Events.EventEmitter();
  }
  preload() {
    this.load.spritesheet("sword1", "assets/ui/upgrade_icon32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
    });
    this.load.spritesheet("defence1", "assets/ui/upgrade_icon32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 3,
    });
    this.load.spritesheet("book1", "assets/ui/upgrade_icon32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 6,
    });
    this.load.spritesheet("star", "assets/jew_pastel_item.png", {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 1,
    });
    this.load.spritesheet(
      "goldBar",
      "assets/Stones_ores_gems_without_grass_x16.png",
      {
        frameWidth: 16,
        frameHeight: 16,
        startFrame: 27,
      }
    );
  }
  create() {
    const x = this.scale.gameSize.width - 50;
    const InGameScene = this.scene.get("InGameScene") as InGameScene;
    InGameScene.resourceStates = {
      gold: new ResourceState(this, { x, y: 35, texture: "goldBar" }).increase(
        60
      ),
      star: new ResourceState(this, { x, y: 60, texture: "star" }),
      decreaseByUpgrade({ gold, star }) {
        gold && this.gold.decrease(gold);
        star && this.star.decrease(star);
      },
    };
    this.createUI(this);
    this.createAttackersStateButton(this);

    // this.createTimer(1, () => {
    //   console.log("game over");
    // });
  }
  createUI(scene: Phaser.Scene) {
    this.uiContainer = scene.add.container(
      0,
      Number(scene.scale.gameSize.height) - UI.height
    );
    const uiWrap = scene.add
      .rectangle(0, 0, Number(scene.scale.gameSize.width), UI.height)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setFillStyle(0x00ff00)
      .setAlpha(0.5);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    this.uiEventBus.on(`upgradeComplete`, (id: string) => {
      if (id.startsWith("attackDamage")) {
        UPGRADE[id].value += 1;
      }
      const InGameScene = this.scene.get("InGameScene") as InGameScene;
      const { resourceStates } = InGameScene;
      resourceStates.decreaseByUpgrade({
        gold:
          id === "income"
            ? Math.floor(resourceStates.gold.value / 10)
            : UPGRADE[id].cost,
      });
    });
    const mapUpgradeButton =
      (line = 0) =>
      ([id, { spriteKey, desc, shortcutText, ...rest }], index) => {
        const button = new Button(scene, {
          x: Number(scene.game.config.width) - 50 * (index + 1),
          y: line * 50,
          width: 50,
          height: 50,
          spriteKey,
          tooltipText: desc,
          enableCountText: true,
          progressTime: rest?.time,
          shortcutText,
          onClick: (fn) => {
            const InGameScene = this.scene.get("InGameScene") as InGameScene;
            const { resourceStates } = InGameScene;

            if (
              resourceStates.gold.value < UPGRADE[id].cost ||
              UPGRADE[id].value >= UPGRADE[id].max
            ) {
              // TODO: 업그레이드 불가능한 경우 버저를 울린다.
              return;
            }
            // TODO: 실제 업그레이드에 해당하는 로직을 실행, (데미지면 데미지를 진짜 늘려야함)
            // id 기반으로 분기처리를 하고, 별도 함수로 분리?
            if (id.startsWith("addSoldier")) {
              if (
                InGameScene.bunker.soldiers.getChildren().length >=
                InGameScene.bunker.soldierMaxCount
              ) {
                return;
              }
              const [gradeStart, gradeEnd] = getSoldierGradeById(id);
              const grade = Phaser.Math.Between(gradeStart, gradeEnd);
              const soldier = new Soldier(InGameScene, {
                owner: InGameScene.bunker,
                grade,
              });
              InGameScene.bunker.soldiers.add(soldier);
              button.setTooltipText(UPGRADE[id].desc);
              InGameScene.bunker.shooterGaugeBar.increase(1);
              new EaseText(InGameScene, {
                x: InGameScene.bunker.x - 30,
                y: InGameScene.bunker.y - 50,
                text: `+★${grade}`,
                color: "#ff0000",
                duration: 3000,
              }).setFontSize(20);
              this.increaseAttackersStateButton(grade);
            }
            if (id.startsWith("attackDamage")) {
              const [gradeStart, gradeEnd] = getSoldierGradeById(id);
              InGameScene.bunker.soldiers
                .getChildren()
                .forEach((soldier: Soldier) => {
                  if (
                    soldier.grade >= gradeStart &&
                    soldier.grade <= gradeEnd
                  ) {
                    soldier.damage += soldier.grade;
                  }
                });
              button.increaseCountText();
            }
            // TODO: 업그레이드 완료 사운드 재생
            fn();
          },
        }).setName(id);
        return button;
      };
    const upButtons = Object.entries(UPGRADE);

    const buttons = [
      ...upButtons.slice(0, 3).map(mapUpgradeButton()),
      ...upButtons.slice(3, 6).map(mapUpgradeButton(1)),
      ...upButtons.slice(6).map(mapUpgradeButton(2)),
    ];
    this.uiContainer.add([uiWrap, ...buttons]).setDepth(9999);
  }
  increaseAttackersStateButton(grade: number) {
    const button = this.attackerStateButtonGroup
      .getChildren()
      .find(({ name }) => name === `grade${grade}`) as SoldierStateButton;
    button.increaseCountText();
    button.setAlpha(1);
  }
  createAttackersStateButton(scene: Phaser.Scene) {
    const inGameScene = this.scene.get("InGameScene") as InGameScene;
    const length = 18;
    const attackerStateButtons = Array.from({ length }, (_, index) => {
      const grade = index + 1;
      const price = grade * 5;
      const button = new SoldierStateButton(scene, {
        x: 50 * (index % (length / 3)),
        y: index >= length / 3 ? (index >= 12 ? 100 : 50) : 0,
        width: 50,
        height: 50,
        spriteKey: "star",
        tooltipText: `sell ★${grade} (${price}G)`,
        gradeText: `★${grade}`,
        onClick: () => {
          const soldier = inGameScene.bunker.soldiers
            .getChildren()
            .find((sol: Soldier) => sol.grade === grade);
          if (!soldier) {
            return;
          }
          inGameScene.bunker.soldiers.remove(soldier);
          soldier.destroy();
          inGameScene.bunker.shooterGaugeBar.decrease(1);
          this.attackerStateButtonGroup
            .getMatching("name", `grade${grade}`)
            .forEach((button: SoldierStateButton) => {
              button.decreaseCountText();
            });
          inGameScene.resourceStates.gold.increase(price);
        },
      })
        .setName(`grade${grade}`)
        .setAlpha(0);
      this.uiContainer.add(button);
      return button;
    });
    this.attackerStateButtonGroup = new Phaser.GameObjects.Group(
      scene,
      attackerStateButtons
    );
  }
  createTimer(min: number, callback: () => void) {
    let remainingTime = min * 60;

    const inGameScene = this.scene.get("InGameScene") as InGameScene;

    const remainingTimeText = this.add
      .text(
        this.cameras.main.centerX,
        30,
        convertSecondsToMinSec(remainingTime),
        {
          fontSize: "20px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5, 0)
      .setScrollFactor(0);

    const timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (inGameScene.bunker.isDestroyed()) {
          return;
        }
        remainingTime--;
        remainingTimeText.setText(convertSecondsToMinSec(remainingTime));
        if (remainingTime < 0) {
          callback();
          remainingTimeText.destroy();
          timer.destroy();
        }
      },
      loop: true,
    });
  }
}
