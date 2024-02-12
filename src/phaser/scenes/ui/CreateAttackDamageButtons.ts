import { UPGRADE_V2, getUnitGradeById } from "@/phaser/constants/upgrade";
import { Unit } from "@/phaser/objects/Unit";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

export function createAttackDamageButtons(scene: Phaser.Scene) {
  const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 2);
  const mapUpgradeButton = ([id, { spriteKey, desc, shortcutText }], index) => {
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
        const InGameScene = this.scene.get("InGameScene") as InGameScene;
        InGameScene.resourceStates.decreaseByUpgrade({
          gold: UPGRADE_V2.attackDamage[id].cost.value,
        });
        progressClick();
        button.text.rightTopNumber.value += 1;
        increaseAttackDamage.bind(this)({ id });
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

function increaseAttackDamage({ id }) {
  const InGameScene = this.scene.get("InGameScene") as InGameScene;
  const [gradeStart, gradeEnd] = getUnitGradeById(id);
  InGameScene.bunker.units.getChildren().forEach((unit: Unit) => {
    if (unit.grade >= gradeStart && unit.grade <= gradeEnd) {
      unit.damage += unit.grade;
    }
  });
  const upgradeObj = UPGRADE_V2.attackDamage[id];
  upgradeObj.current.value += 1;
  upgradeObj.cost.value += gradeStart * 10;
}
