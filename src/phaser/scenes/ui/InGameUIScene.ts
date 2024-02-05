import { InGameScene } from "@/phaser/scenes/InGameScene";
import { ResourceState } from "@/phaser/ui/ResourceState";
import { UI } from "@/phaser/constants";
import { convertSecondsToMinSec } from "@/phaser/utils";
import { Button } from "@/phaser/ui/upgrade/Button";
import {
  UPGRADE_V2,
  getSoldierGradeById,
  getUpgradeTabName,
} from "@/phaser/constants/upgrade";
import { Soldier } from "@/phaser/objects/Soldier";
import { EaseText } from "@/phaser/ui/EaseText";
import { SoldierStateButton } from "@/phaser/ui/upgrade/SoldierStateButton";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";
import { UIAssetLoader } from "@/phaser/scenes/ui/UIAssetLoader";

const TAP_BUTTON = {
  height: 50,
  paddingBottom: 20,
};
const UPGRADE_BUTTON = {
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
    attackerState: Phaser.GameObjects.Group;
  } = {} as any;

  constructor() {
    super("InGameUIScene");
    this.uiEventBus = new Phaser.Events.EventEmitter();
  }
  create() {
    this.bindEventBus();
    this.createResourceState();
    this.createBottomWrap(this);
    this.createBottomTap(this);
    this.createAddButtons(this);
    this.createDamageButtons(this);
    this.createUtilButtons(this);
    this.createUnitButtons(this);
    this.uiEventBus.emit(`tap`, "addSoldier");
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
        upgradeObj.current.value += 1;
      }
      if (id.startsWith("upgradeBunker")) {
        upgradeObj.current.value += 1;
        InGameScene.bunker.upgrade();
      }
      // TODO: 업그레이드 완료 사운드 재생
    });
    this.uiEventBus.on(`tap`, (id: string) => {
      Object.values(this.buttonGroup).forEach((group) => {
        group.getChildren().forEach((button: Button) => {
          button.setEnable(false);
        });
      });
      this.buttonGroup[id].getChildren().forEach((button: Button) => {
        if (
          id.startsWith("attackerState") &&
          Number(button.countText.text) <= 0
        ) {
          return;
        }
        button.setEnable(true);
      });
    });
  }
  createResourceState() {
    const x = this.scale.gameSize.width - 50;
    const InGameScene = this.scene.get("InGameScene") as InGameScene;
    InGameScene.resourceStates = {
      gold: new ResourceState(this, { x, y: 35, texture: "goldBar" }).increase(
        100
      ),
      star: new ResourceState(this, { x, y: 60, texture: "star" }),
      income: 0,
      increaseByIncome() {
        const amount = Math.floor(this.gold.value * this.income);
        this.gold.increase(amount);
        return amount;
      },
      decreaseByUpgrade({ gold, star }) {
        gold && this.gold.decrease(gold);
        star && this.star.decrease(star);
      },
      decreaseByPercent(percent: number) {
        this.gold.decrease(Math.floor(this.gold.value * percent));
      },
    };
  }
  createBottomWrap(scene: Phaser.Scene) {
    this.uiContainer = scene.add
      .container(0, Number(scene.scale.gameSize.height) - UI.height)
      .setDepth(9999);
    const background = scene.add
      .rectangle(0, 0, Number(scene.scale.gameSize.width), UI.height)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setFillStyle(0x00ffff)
      .setAlpha(0.5);
    this.tapContainer = scene.add.container(0, 0);
    this.upgradeButtonContainer = scene.add.container(
      0,
      TAP_BUTTON.height + TAP_BUTTON.paddingBottom
    );
    this.uiContainer.add([
      background,
      this.tapContainer,
      this.upgradeButtonContainer,
    ]);
  }
  createBottomTap(scene: Phaser.Scene) {
    const buttons = [
      { id: "addSoldier", shortcutText: "Z", texture: "sword1" },
      { id: "attackDamage", shortcutText: "X", texture: "sword1" },
      { id: "util", shortcutText: "C", texture: "" },
      { id: "attackerState", shortcutText: "V", texture: "sword1" },
    ];
    const { rectWidth, getX } = getBetweenAroundInfo(scene, buttons.length);

    buttons.forEach(({ id, shortcutText, texture }, index) => {
      const x = getX(index);
      const button = new Button(scene, {
        x,
        y: 10,
        width: rectWidth,
        height: 50,
        spriteKey: texture,
        shortcutText,
        onClick: () => {
          this.uiEventBus.emit(`tap`, id);
        },
      });
      this.tapContainer.add(button);
    });
  }
  createAddButtons(scene: Phaser.Scene) {
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
        tooltipText: desc,
        shortcutText,
        onClick: (progressClick) => {
          if (!this.canUpgrade({ tab: "addSoldier", id })) {
            return;
          }
          this.increaseSoldier({ id });
          progressClick();
        },
      })
        .setName(id)
        .setEnable(false);
      return button;
    };

    this.buttonGroup.addSoldier = new Phaser.GameObjects.Group(
      scene,
      Object.entries(UPGRADE_V2.addSoldier).map(mapUpgradeButton)
    );
    this.upgradeButtonContainer.add(this.buttonGroup.addSoldier.getChildren());
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
        tooltipText: desc,
        shortcutText,
        onClick: (progressClick) => {
          if (!this.canUpgrade({ tab: "attackDamage", id })) {
            return;
          }
          this.increaseAttackDamage({ id });
          progressClick();
        },
      })
        .setName(id)
        .setEnable(false);
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
        tooltipText: desc,
        shortcutText,
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
    const attackerStateButtons = Array.from({ length }, (_, index) => {
      const line = getLine(index);
      const grade = index + 1;
      const price = grade * 5;
      const button = new SoldierStateButton(scene, {
        x: getX(index),
        y: line * UPGRADE_BUTTON.height + UPGRADE_BUTTON.paddingBottom * line,
        width: rectWidth,
        height: UPGRADE_BUTTON.height,
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
          inGameScene.bunker.shooterGaugeBar.current.value -= 1;
          this.buttonGroup.attackerState
            .getMatching("name", `grade${grade}`)
            .forEach((button: SoldierStateButton) => {
              button.decreaseCountText();
            });
          inGameScene.resourceStates.gold.increase(price);
        },
      })
        .setName(`grade${grade}`)
        .setEnable(false);
      return button;
    });
    this.upgradeButtonContainer.add(attackerStateButtons);
    this.buttonGroup.attackerState = new Phaser.GameObjects.Group(
      scene,
      attackerStateButtons
    );
  }
  increaseSoldier({ id }) {
    const InGameScene = this.scene.get("InGameScene") as InGameScene;
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
    InGameScene.bunker.shooterGaugeBar.current.value += 1;
    new EaseText(InGameScene, {
      x: InGameScene.bunker.x - 30,
      y: InGameScene.bunker.y - 50,
      text: `+★${grade}`,
      color: "#ff0000",
      duration: 3000,
    }).setFontSize(20);
    this.increaseAttackersStateButton(grade);
  }
  increaseAttackersStateButton(grade: number) {
    const button = this.buttonGroup.attackerState
      .getChildren()
      .find(({ name }) => name === `grade${grade}`) as SoldierStateButton;
    button.currentCount.value += 1;
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
    upgradeObj.cost += gradeStart * 10;
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
