import { UPGRADE_V2, getUpgradeTabName } from "@/phaser/constants/upgrade";
import { Boss } from "@/phaser/objects/Boss";
import { Enemy } from "@/phaser/objects/Enemy";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

export function createUtilButtons(scene: Phaser.Scene) {
  const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 1);
  const mapUpgradeButton = (
    [id, { current, spriteKey, desc, shortcutText, time }]: [
      keyof typeof UPGRADE_V2.util,
      any
    ],
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
        if (button.progressInUse) {
          return;
        }
        if (id !== "income") {
          const resourceStates = (scene.scene.get("InGameScene") as InGameScene)
            .resourceStates;
          resourceStates.decreaseByUpgrade({
            gold: UPGRADE_V2[getUpgradeTabName(id)][id].cost,
          });
        }
        if (id === "summonBoss") {
          const inGameScene = scene.scene.get("InGameScene") as InGameScene;
          const boss = new Boss(inGameScene, {
            x: 300,
            y: -200,
            grade: current ** 2,
            spriteKey: "pixel_animals",
            frameNo: current * 2,
          });
          (boss as Enemy).hpBar.showText = true;
          inGameScene.enemies.add(boss);
        }
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
