import { InGameScene } from "@/phaser/scenes/InGameScene";
import { convertSecondsToMinSec } from "@/phaser/utils";
import { Button } from "@/phaser/ui/upgrade/Button";
import {
  UPGRADE_V2,
  getUnitGradeById,
  getUpgradeTabName,
} from "@/phaser/constants/upgrade";
import { Unit } from "@/phaser/objects/Unit";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";
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
    this.uiEventBus.emit("tab", "addUnit");
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
        ? resourceStates.decreaseByPercent(upgradeObj.costPercent)
        : resourceStates.decreaseByUpgrade({
            gold: upgradeObj.cost,
          });
      if (id.startsWith("income")) {
        upgradeObj.current.value += 1;
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
