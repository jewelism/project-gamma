import { Unit } from "@/phaser/objects/Unit";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

export function createUnitsTabButtons(scene: Phaser.Scene) {
  const inGameScene = this.scene.get("InGameScene") as InGameScene;
  const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 3);

  const length = 15;
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
        const unit = inGameScene.bunker.units
          .getChildren()
          .find((el: Unit) => el.grade === grade);
        if (!unit) {
          return;
        }
        inGameScene.bunker.units.remove(unit);
        unit.destroy();
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
