import { UPGRADE_V2, getUpgradeTabName } from "@/phaser/constants/upgrade";
import { Boss } from "@/phaser/objects/Boss";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

export function createStarTabButtons(scene: Phaser.Scene) {
  const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 1);
  const mapUpgradeButton = (
    [id, { current, spriteKey, desc, shortcutText, time }]: [
      keyof typeof UPGRADE_V2.star,
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
        const resourceStates = (scene.scene.get("InGameScene") as InGameScene)
          .resourceStates;
        resourceStates.decreaseByUpgrade({
          star: UPGRADE_V2[getUpgradeTabName(id)][id].cost,
        });
        current.value += 1;
        localStorage.setItem(id, String(current));
        progressClick();
      },
    })
      .setName(id)
      .setEnable(false);
    return button;
  };
  this.buttonGroup.star = new Phaser.GameObjects.Group(
    scene,
    Object.entries(UPGRADE_V2.star).map(mapUpgradeButton)
  );
  this.upgradeButtonContainer.add(this.buttonGroup.star.getChildren());
}
