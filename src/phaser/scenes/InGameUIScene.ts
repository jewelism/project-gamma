import { InGameScene } from "@/phaser/scenes/InGameScene";
import { ResourceState } from "@/phaser/ui/ResourceState";
import { UI } from "@/phaser/constants";
import { convertSecondsToMinSec } from "@/phaser/utils";
import { Button } from "@/phaser/ui/upgrade/Button";
import { UPGRADE, getAttackDamageGradeById } from "@/phaser/constants/upgrade";
import { AttackerInBunker } from "@/phaser/objects/AttackerInBunker";
import { EaseText } from "@/phaser/ui/EaseText";

export class InGameUIScene extends Phaser.Scene {
  uiContainer: Phaser.GameObjects.Container;
  constructor() {
    super("InGameUIScene");
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
        10
      ),
      star: new ResourceState(this, { x, y: 60, texture: "star" }),
      decreaseByUpgrade({ gold, star }) {
        gold && this.gold.decrease(gold);
        star && this.star.decrease(star);
      },
    };
    this.createUI(this);
    InGameScene.bunker.soldiers
      .getChildren()
      .forEach((soldier: AttackerInBunker, index) => {
        this.addAttackersStateUI(this, soldier, index);
      });
    this.createTimer(1, () => {
      console.log("game over");
    });
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

    const buttons = Object.entries(UPGRADE)
      .reverse()
      .map(([id, { spriteKey, desc, shortcutText }], index) => {
        const button = new Button(scene, {
          x: Number(scene.game.config.width) - 50 * (index + 1),
          y: 0,
          width: 50,
          height: 50,
          spriteKey,
          tooltipText: desc,
          enableGrade: true,
          shortcutText,
          onClick: () => {
            const InGameScene = this.scene.get("InGameScene") as InGameScene;
            const { resourceStates } = InGameScene;
            if (
              resourceStates.gold.value < UPGRADE[id].cost ||
              UPGRADE[id].value >= UPGRADE[id].max
            ) {
              // TODO: 업그레이드 불가능한 경우 버저를 울린다.
              return;
            }
            resourceStates.decreaseByUpgrade({ gold: UPGRADE[id].cost });
            UPGRADE[id].value += 1;
            // TODO: 실제 업그레이드에 해당하는 로직을 실행, (데미지면 데미지를 진짜 늘려야함)
            // id 기반으로 분기처리를 하고, 별도 함수로 분리?
            if (id === "addSoldier") {
              const grade = Phaser.Math.Between(1, 3);
              const soldier = new AttackerInBunker(InGameScene, {
                owner: InGameScene.bunker,
                grade,
              });
              InGameScene.bunker.soldiers.add(soldier);
              UPGRADE[id].cost += 5;
              button.setTooltipText(UPGRADE[id].desc);
              InGameScene.bunker.shooterGaugeBar.increase(1);
              new EaseText(InGameScene, {
                x: InGameScene.bunker.x - InGameScene.bunker.width,
                y: InGameScene.bunker.y - InGameScene.bunker.height,
                text: `+ grade ${grade}`,
                color: "#ff0000",
                duration: 3000,
              });
              this.addAttackersStateUI(
                this,
                soldier,
                InGameScene.bunker.soldiers.getChildren().length - 1
              );
            }
            if (id.startsWith("attackDamage")) {
              const [gradeStart, gradeEnd] = getAttackDamageGradeById(id);
              InGameScene.bunker.soldiers
                .getChildren()
                .forEach((soldier: AttackerInBunker) => {
                  if (
                    soldier.grade >= gradeStart &&
                    soldier.grade <= gradeEnd
                  ) {
                    soldier.damage += soldier.grade;
                  }
                });
            }
            // TODO: 업그레이드 완료 사운드 재생
            button.emit("upgradeComplete", id);
          },
        }).setName(id);
        return button;
      });
    this.uiContainer.add([uiWrap, ...buttons]).setDepth(9999);
  }
  addAttackersStateUI(scene: Phaser.Scene, soldier: AttackerInBunker, index) {
    const inGameScene = this.scene.get("InGameScene") as InGameScene;

    const button = new Button(scene, {
      x: 50 * index,
      y: 0, // TODO: x 좌표가 다 차면 y 좌표를 내려야함
      width: 50,
      height: 50,
      spriteKey: "star",
      tooltipText: "remove this soldier",
      enableGrade: false,
      shortcutText: `${soldier.grade}`,
      onClick: () => {
        inGameScene.bunker.soldiers.remove(soldier);
      },
    });
    this.uiContainer.add(button);
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
