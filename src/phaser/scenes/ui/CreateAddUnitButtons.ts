import { UPGRADE_V2, getUnitGradeById } from "@/phaser/constants/upgrade";
import { Unit } from "@/phaser/objects/Unit";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { EaseText } from "@/phaser/ui/EaseText";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";
import { effect } from "@preact/signals-core";

export function createAddUnitButtons(scene: Phaser.Scene) {
  const { rectWidth, getLine, getX } = getBetweenAroundInfo(scene, 3);
  const mapUpgradeButton = ([id, { spriteKey, desc }], index) => {
    const line = getLine(index);
    const button = new Button(scene, {
      x: getX(index),
      y: line * UPGRADE_BUTTON.height + UPGRADE_BUTTON.paddingBottom * line,
      width: rectWidth,
      height: UPGRADE_BUTTON.height,
      spriteKey,
      leftBottomText: desc,
      // shortcut: shortcutText,
      onClick: (progressClick) => {
        const unit = increaseUnit.bind(this)({ id });
        if (unit) {
          progressClick();
          effect(() => {
            console.log("unit.damage.value", unit.damage.value);

            button.text.rightTopNumber.value = unit.damage.value;
          });
        }
      },
    })
      .setName(id)
      .setEnable(false);
    return button;
  };

  this.buttonGroup.addUnit = new Phaser.GameObjects.Group(
    scene,
    Object.entries(UPGRADE_V2.addUnit).map(mapUpgradeButton)
  );
  this.upgradeButtonContainer.add(this.buttonGroup.addUnit.getChildren());
}

function increaseUnit({ id }) {
  const InGameScene = this.scene.get("InGameScene") as InGameScene;
  if (
    InGameScene.bunker.units.getChildren().length >=
    InGameScene.bunker.shooterGaugeBar.max.value
  ) {
    return false;
  }
  InGameScene.resourceStates.decreaseByUpgrade({
    gold: UPGRADE_V2.addUnit[id].cost.value,
  });
  const [gradeStart, gradeEnd] = getUnitGradeById(id);
  let grade = Phaser.Math.Between(gradeStart, gradeEnd);
  !gradeEnd && (grade = gradeStart);

  const unit = new Unit(InGameScene, {
    owner: InGameScene.bunker,
    grade,
  });
  InGameScene.bunker.units.add(unit);
  InGameScene.bunker.shooterGaugeBar.current.value += 1;
  new EaseText(InGameScene, {
    ...InGameScene.bunker.centerXY(),
    text: `+★${grade}`,
    color: "#ff0000",
    duration: 3000,
  }).setFontSize(20);
  increaseUnitStateButton.bind(this)(grade);
  return unit;
}
function increaseUnitStateButton(grade: number) {
  const button = this.buttonGroup.unit
    .getChildren()
    .find(({ name }) => name === `grade${grade}`) as Button;
  button.text.rightTopNumber.value += 1;
}
