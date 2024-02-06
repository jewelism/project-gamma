import { UPGRADE_V2 } from "@/phaser/constants/upgrade";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

export function createUtilButtons(scene: Phaser.Scene) {
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
        button.text.rightTopNumber.value += 1;
        // this.increaseUnit({ id, button });
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
