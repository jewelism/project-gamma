import { InGameScene } from "@/phaser/scenes/InGameScene";
import { convertSecondsToMinSec } from "@/phaser/utils";
import { Button } from "@/phaser/ui/upgrade/Button";
import {
  UPGRADE_V2,
  getSoldierGradeById,
  getUpgradeTabName,
} from "@/phaser/constants/upgrade";
import { Soldier } from "@/phaser/objects/Soldier";
import { EaseText } from "@/phaser/ui/EaseText";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";
import { UIAssetLoader } from "@/phaser/scenes/ui/UIAssetLoader";
import { effect } from "@preact/signals-core";
import { CreateLeftTopUI } from "@/phaser/scenes/ui/CreateLeftTopUI";
import {
  createBottomTap,
  createBottomWrap,
} from "@/phaser/scenes/ui/CreateBottomUI";
import { createAddSoldierButtons } from "@/phaser/scenes/ui/CreateUpgradeButton";

export const UPGRADE_BUTTON = {
  height: 50,
  paddingBottom: 10,
};
export class InGameUIScene extends Phaser.Scene {
  uiContainer: Phaser.GameObjects.Container;
  uiEventBus: Phaser.Events.EventEmitter;
  tapContainer: Phaser.GameObjects.Container;
  upgradeButtonContainer: Phaser.GameObjects.Container;
  buttonGroup: {
    attackDamage: Phaser.GameObjects.Group;
    addSoldier: Phaser.GameObjects.Group;
    util: Phaser.GameObjects.Group;
    unit: Phaser.GameObjects.Group;
  } = {} as any;

  constructor() {
    super("InGameUIScene");
    this.uiEventBus = new Phaser.Events.EventEmitter();
  }
  create() {
    this.bindEventBus();
    new CreateLeftTopUI().createResourceState(this);
    createBottomWrap.bind(this)(this);
    createBottomTap.bind(this)(this);
    createAddSoldierButtons.bind(this)(this);
    this.createDamageButtons(this);
    this.createUtilButtons(this);
    this.createUnitButtons(this);
    this.uiEventBus.emit("tab", "addSoldier");
    // this.createTimer(1, () => {
    //   console.log("game over");
    // });
  }
  bindEventBus() {
    this.uiEventBus.on(`upgradeComplete`, (id: string) => {
      const InGameScene = this.scene.get("InGameScene") as InGameScene;
      const { resourceStates } = InGameScene;
      const upgradeObj = UPGRADE_V2[getUpgradeTabName(id)][id];
      id === "income"
        ? resourceStates.decreaseByPercent(resourceStates.income)
        : resourceStates.decreaseByUpgrade({
            gold: upgradeObj.cost,
          });
      if (id.startsWith("income")) {
        this.increaseIncome();
      }
      if (id.startsWith("attackDamage")) {
        this.increaseAttackDamage({ id });
      }
      if (id.startsWith("upgradeBunker")) {
        upgradeObj.current.value += 1;
        InGameScene.bunker.upgrade();
      }
      // TODO: 업그레이드 완료 사운드 재생
    });
    this.uiEventBus.on("tab", (id: string) => {
      Object.values(this.buttonGroup).forEach((group) => {
        group.getChildren().forEach((button: Button) => {
          button.setEnable(false);
        });
      });
      this.buttonGroup[id].getChildren().forEach((button: Button) => {
        if (id.startsWith("unit") && button.text.rightTopNumber.value <= 0) {
          return;
        }
        button.setEnable(true);
      });
    });
  }

  createDamageButtons(scene: Phaser.Scene) {
    const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 2);
    const mapUpgradeButton = (
      [id, { spriteKey, desc, shortcutText }],
      index
    ) => {
      const line = getLine(index);

      const button = new Button(scene, {
        x: getX(index),
        y: line * UPGRADE_BUTTON.height + UPGRADE_BUTTON.paddingBottom * line,
        width: rectWidth,
        height: UPGRADE_BUTTON.height,
        spriteKey,
        leftBottomText: desc,
        shortcut: shortcutText,
        onClick: (progressClick) => {
          if (!this.canUpgrade({ tab: "attackDamage", id })) {
            return;
          }
          progressClick();
        },
      })
        .setName(id)
        .setEnable(false);
      effect(() => {
        button.text.leftBottomText.value = UPGRADE_V2.attackDamage[id].desc;
      });
      return button;
    };
    this.buttonGroup.attackDamage = new Phaser.GameObjects.Group(
      scene,
      Object.entries(UPGRADE_V2.attackDamage).map(mapUpgradeButton)
    );
    this.upgradeButtonContainer.add(
      this.buttonGroup.attackDamage.getChildren()
    );
  }
  createUtilButtons(scene: Phaser.Scene) {
    const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 2);
    const mapUpgradeButton = (
      [id, { spriteKey, desc, shortcutText, time }],
      index
    ) => {
      const line = getLine(index);

      const button = new Button(scene, {
        x: getX(index),
        y: line * UPGRADE_BUTTON.height + UPGRADE_BUTTON.paddingBottom * line,
        width: rectWidth,
        height: UPGRADE_BUTTON.height,
        spriteKey,
        leftBottomText: desc,
        shortcut: shortcutText,
        progressTime: time,
        onClick: (progressClick) => {
          if (!this.canUpgrade({ tab: "util", id })) {
            return;
          }
          // this.increaseSoldier({ id, button });
          progressClick();
        },
      })
        .setName(id)
        .setEnable(false);
      return button;
    };
    this.buttonGroup.util = new Phaser.GameObjects.Group(
      scene,
      Object.entries(UPGRADE_V2.util).map(mapUpgradeButton)
    );
    this.upgradeButtonContainer.add(this.buttonGroup.util.getChildren());
  }
  createUnitButtons(scene: Phaser.Scene) {
    const inGameScene = this.scene.get("InGameScene") as InGameScene;
    const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 3);

    const length = 18;
    const unitButtons = Array.from({ length }, (_, index) => {
      const line = getLine(index);
      const grade = index + 1;
      const price = grade * 5;
      const button = new Button(scene, {
        x: getX(index),
        y: line * UPGRADE_BUTTON.height + UPGRADE_BUTTON.paddingBottom * line,
        width: rectWidth,
        height: UPGRADE_BUTTON.height,
        spriteKey: "star",
        leftTopText: `★${grade}`,
        leftBottomText: `(+${price}G) sell ★${grade}`,
        allowZero: true,
        onClick: () => {
          const soldier = inGameScene.bunker.soldiers
            .getChildren()
            .find((sol: Soldier) => sol.grade === grade);
          if (!soldier) {
            return;
          }
          inGameScene.bunker.soldiers.remove(soldier);
          soldier.destroy();
          inGameScene.bunker.shooterGaugeBar.current.value -= 1;
          this.buttonGroup.unit
            .getMatching("name", `grade${grade}`)
            .forEach((button: Button) => {
              button.text.rightTopNumber.value -= 1;
            });
          inGameScene.resourceStates.gold.increase(price);
        },
      })
        .setName(`grade${grade}`)
        .setEnable(false);
      return button;
    });
    this.upgradeButtonContainer.add(unitButtons);
    this.buttonGroup.unit = new Phaser.GameObjects.Group(scene, unitButtons);
  }
  increaseAttackDamage({ id }) {
    const InGameScene = this.scene.get("InGameScene") as InGameScene;

    const [gradeStart, gradeEnd] = getSoldierGradeById(id);
    InGameScene.bunker.soldiers.getChildren().forEach((soldier: Soldier) => {
      if (soldier.grade >= gradeStart && soldier.grade <= gradeEnd) {
        soldier.damage += soldier.grade;
      }
    });
    const upgradeObj = UPGRADE_V2.attackDamage[id];
    upgradeObj.current.value += 1;
    upgradeObj.cost.value += gradeStart * 10;
  }
  increaseIncome() {
    const InGameScene = this.scene.get("InGameScene") as InGameScene;
    InGameScene.resourceStates.income += 0.05;
  }
  canUpgrade({ tab, id }) {
    const InGameScene = this.scene.get("InGameScene") as InGameScene;
    const { resourceStates } = InGameScene;
    if (
      resourceStates.gold.value.value < UPGRADE_V2[tab][id].cost ||
      UPGRADE_V2[tab][id].value >= UPGRADE_V2[tab][id].max
    ) {
      // TODO: 업그레이드 불가능한 경우 버저를 울린다.
      return false;
    }
    return true;
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
  preload() {
    new UIAssetLoader(this.load).preload();
  }
}
