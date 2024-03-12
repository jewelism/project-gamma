import { UPGRADE_V2, getUnitGradeById } from "@/phaser/constants/upgrade";
import { Unit } from "@/phaser/objects/Unit";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

export function createAttackDamageButtons(scene: Phaser.Scene) {
  const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 1);
  const mapUpgradeButton = ([id, { spriteKey, desc }], index) => {
    const line = getLine(index);
    const button = new Button(scene, {
      x: getX(index),
      y: line * UPGRADE_BUTTON.height + UPGRADE_BUTTON.paddingBottom * line,
      width: rectWidth,
      height: UPGRADE_BUTTON.height,
      spriteKey,
      leftBottomText: desc,
      onClick: (progressClick) => {
        const InGameScene = this.scene.get("InGameScene") as InGameScene;

        const upgradeObj = UPGRADE_V2.attackDamage[id];
        if (upgradeObj.current.value >= upgradeObj.max) {
          button.disabled.value = true;
          return;
        }

        InGameScene.resourceStates.decreaseByUpgrade({
          gold: upgradeObj.cost.value,
        });
        progressClick();
        button.text.rightTopNumber.value += 1;
        upgradeObj.current.value += 1;
        upgradeObj.cost.value *= 2;
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
  this.upgradeButtonContainer.add(this.buttonGroup.attackDamage.getChildren());
}
