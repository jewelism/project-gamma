import { InGameScene } from "@/phaser/scenes/InGameScene";
import { convertSecondsToMinSec } from "@/phaser/utils";
import { Button } from "@/phaser/ui/upgrade/Button";
import { UPGRADE_V2, getUpgradeTabName } from "@/phaser/constants/upgrade";
import { UIAssetLoader } from "@/phaser/scenes/ui/UIAssetLoader";
import { effect } from "@preact/signals-core";
import { CreateLeftTopUI } from "@/phaser/scenes/ui/CreateLeftTopUI";
import {
  createBottomTap,
  createBottomWrap,
} from "@/phaser/scenes/ui/CreateBottomUI";
import { createAddUnitButtons } from "@/phaser/scenes/ui/CreateAddUnitButtons";
import { createUnitsTabButtons } from "@/phaser/scenes/ui/CreateUnitsTabButtons";
import { createAttackDamageButtons } from "@/phaser/scenes/ui/CreateAttackDamageButtons";
import { createUtilButtons } from "@/phaser/scenes/ui/CreateUtilButtons";
import { EaseText } from "@/phaser/ui/EaseText";
import { createStarTabButtons } from "@/phaser/scenes/ui/CreateStarTabButtons";
import { setStorageData } from "@/phaser/scenes/ui/SetStorageData";

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
    addUnit: Phaser.GameObjects.Group;
    util: Phaser.GameObjects.Group;
    unit: Phaser.GameObjects.Group;
    star: Phaser.GameObjects.Group;
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
    createAddUnitButtons.bind(this)(this);
    createAttackDamageButtons.bind(this)(this);
    createUtilButtons.bind(this)(this);
    createUnitsTabButtons.bind(this)(this);
    createStarTabButtons.bind(this)(this);
    setStorageData();
    this.uiEventBus.emit("tab", "addUnit");

    effect(() => {
      const { resourceStates } = this.scene.get("InGameScene") as InGameScene;
      resourceStates.gold.value.value;
      Object.values(this.buttonGroup).forEach((group) => {
        group.getChildren().forEach((button: Button) => {
          if (button.name.startsWith("grade")) {
            return;
          }
          const tabName = getUpgradeTabName(button.name);
          const cost = UPGRADE_V2[tabName][button.name].cost?.value;
          button.disabled.value = resourceStates.gold.value.value < cost;
          if (tabName === "star") {
            button.disabled.value = resourceStates.star.value.value < cost;
          }
        });
      });
    });
  }
  bindEventBus() {
    // progress time이 있는 업그레이드가 완료되었을때 실행됨
    this.uiEventBus.on("upgradeProgressDone", (id: string) => {
      const InGameScene = this.scene.get("InGameScene") as InGameScene;
      const { resourceStates } = InGameScene;
      const upgradeObj = UPGRADE_V2[getUpgradeTabName(id)][id];
      upgradeObj.current.value += 1;
      (
        this.upgradeButtonContainer.getByName(id) as Button
      ).text.rightTopNumber.value += 1;
      if (id === "income") {
        const amount = resourceStates.decreaseByPercent(upgradeObj.costPercent);
        new EaseText(this, {
          ...InGameScene.bunker.centerXY(),
          text: `income upgrade -${amount}G`,
          color: "#619196",
          duration: 2000,
        }).setFontSize(20);
      }
      if (id.startsWith("upgradeBunker")) {
        InGameScene.bunker.upgrade();
      }
      if (id === "gamble") {
        const reward = Number(UPGRADE_V2.util.gamble.reward);
        resourceStates.gold.increase(reward);
        new EaseText(this, {
          ...InGameScene.bunker.centerXY(),
          text: `gamble +${reward}G`,
          color: "#619196",
          duration: 2000,
        }).setFontSize(20);
      }
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
