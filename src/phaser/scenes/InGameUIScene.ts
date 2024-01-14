import { InGameScene } from "@/phaser/scenes/InGameScene";
import { ResourceState } from "@/phaser/ui/ResourceState";
import { IconButton } from "@/phaser/ui/IconButton";
import { getUpgradeMax, updateUpgradeUIText } from "@/phaser/utils/helper";
import { INIT_PLAYER_STATE_LIST, UI } from "@/phaser/constants";
import { convertSecondsToMinSec } from "@/phaser/utils";
import { Button } from "@/phaser/ui/upgrade/Button";

export class InGameUIScene extends Phaser.Scene {
  upgradeUI: Phaser.GameObjects.Container;
  buttonElements: Phaser.GameObjects.DOMElement[];
  stateElement: Phaser.GameObjects.DOMElement;

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
      gold: new ResourceState(this, { x, y: 35, texture: "goldBar" }),
      star: new ResourceState(this, { x, y: 60, texture: "star" }),
      decreaseByUpgrade({ gold, star }) {
        this.gold.decrease(gold);
        this.star.decrease(star);
      },
    };
    this.createUI(this);
    this.createTimer(1, () => {
      console.log("game over");
    });
  }
  createUI(scene: Phaser.Scene) {
    const uiContainer = scene.add.container(
      0,
      Number(scene.scale.gameSize.height) - UI.height
    );
    const uiWrap = scene.add
      .rectangle(0, 0, Number(scene.scale.gameSize.width), UI.height)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setFillStyle(0x00ff00);
    // const button = new SelectLevelButton(scene, 100, 100, 1);
    const buttons = [
      {
        id: "addSoldier",
        spriteKey: "sword1",
        desc: "add new random attacker +1",
        shortcutText: "A",
      },
      {
        id: "attackSpeed",
        spriteKey: "sword1",
        desc: "increase attack speed 1%",
        shortcutText: "S",
      },
      {
        id: "attackDamage",
        spriteKey: "sword1",
        desc: "increase attack damage 1%",
        shortcutText: "D",
      },
      {
        id: "upgradeBunker",
        spriteKey: "defence1",
        desc: "upgrade bunker",
        shortcutText: "F",
      },
      {
        id: "income",
        spriteKey: "book1",
        desc: "increase income +0.5%",
        shortcutText: "G",
      },
    ]
      .reverse()
      .map(({ id, spriteKey, desc, shortcutText }, index) => {
        const button = new Button(scene, {
          x: Number(scene.game.config.width) - 50 * (index + 1),
          y: 0,
          width: 50,
          height: 50,
          spriteKey,
          hoverText: desc,
          shortcutText,
          onClick: () => {
            this.events.emit("upgrade", id);
          },
        });
        return button;
      });
    uiContainer.add([uiWrap, ...buttons]).setDepth(9999);
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
  createUpgradeUI(scene: Phaser.Scene) {
    this.upgradeUI = scene.add.container(0, 0).setVisible(false);

    this.buttonElements = INIT_PLAYER_STATE_LIST.map(
      ({ id, spriteKey, shortcutText, desc }, index) => {
        const element = new Phaser.GameObjects.DOMElement(
          scene,
          300,
          (index + 1) * 50
        )
          .setOrigin(0, 0)
          .createFromCache("upgrade")
          .addListener("click")
          .setName(id);

        const inGameScene = this.scene.get("InGameScene") as InGameScene;
        const gold = inGameScene.bunker.getUpgradeCost(id);

        updateUpgradeUIText(element, {
          spriteKey,
          shortcutText,
          desc,
          gold,
        });

        const buttonEl = element.getChildByID("button");
        const onKeyDown = () => {
          buttonEl.classList.add("keydown");
          this.upgrade(id);
        };
        const onKeyUp = () => {
          buttonEl.classList.remove("keydown");
        };
        buttonEl.addEventListener("pointerdown", onKeyDown);
        buttonEl.addEventListener("pointerup", onKeyUp);
        buttonEl.addEventListener("pointerout", onKeyUp);
        scene.input.keyboard
          .addKey(Phaser.Input.Keyboard.KeyCodes[shortcutText])
          .on("down", onKeyDown)
          .on("up", onKeyUp);
        return element;
      }
    );

    const uiWrap = scene.add
      .rectangle(
        0,
        0,
        Number(scene.game.config.width),
        Number(scene.game.config.height)
      )
      .setOrigin(0)
      .setScrollFactor(0)
      .setFillStyle(0x000000, 0.7);

    this.createPlayerStateUI(this);
    this.upgradeUI
      .add([uiWrap, this.stateElement, ...this.buttonElements])
      .setDepth(9997);
  }
  canUpgrade(id: string) {
    const inGameScene = this.scene.get("InGameScene") as InGameScene;
    if (inGameScene.bunker[id] >= getUpgradeMax(id)) {
      return { canUpgrade: false, cost: { tree: 0, rock: 0, gold: 0 } };
    }
    const gold = inGameScene.bunker.getUpgradeCost(id);
    const { gold: goldState } = inGameScene.resourceStates;
    return {
      canUpgrade: goldState.resourceAmount >= gold,
      gold,
    };
  }
  upgrade(id: string) {
    const inGameScene = this.scene.get("InGameScene") as InGameScene;
    const { canUpgrade, gold } = this.canUpgrade(id);
    // if (!canUpgrade) {
    //   return;
    // }
    inGameScene.resourceStates.decreaseByUpgrade({ gold });
    inGameScene.bunker[id] += 1;
    this.updatePlayerStateUI(id);
    this.buttonElements.forEach((element) => {
      const { name } = element;
      const gold = inGameScene.bunker.getUpgradeCost(name);
      updateUpgradeUIText(element, {
        ...INIT_PLAYER_STATE_LIST.find(({ id }) => id === name),
        gold,
      });
    });
  }
  createPlayerStateUI(scene: Phaser.Scene) {
    this.stateElement = new Phaser.GameObjects.DOMElement(scene, 50, 50)
      .setOrigin(0)
      .createFromCache("player_state");
    INIT_PLAYER_STATE_LIST.forEach(({ id }) => {
      this.updatePlayerStateUI(id);
      this.stateElement.getChildByID(`${id}-max`).textContent = String(
        getUpgradeMax(id)
      );
    });
  }
  updatePlayerStateUI(id: string) {
    const inGameScene = this.scene.get("InGameScene") as InGameScene;
    this.stateElement.getChildByID(id).textContent = inGameScene.bunker[id];
  }
}
