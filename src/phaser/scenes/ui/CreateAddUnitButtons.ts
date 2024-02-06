import { UPGRADE_V2, getUnitGradeById } from "@/phaser/constants/upgrade";
import { Unit } from "@/phaser/objects/Unit";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { UPGRADE_BUTTON } from "@/phaser/scenes/ui/InGameUIScene";
import { EaseText } from "@/phaser/ui/EaseText";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

export function createAddUnitButtons(scene: Phaser.Scene) {
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
        if (!this.canUpgrade({ tab: "addUnit", id })) {
          return;
        }
        increaseUnit.bind(this)({ id }) && progressClick();
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
  const [gradeStart, gradeEnd] = getUnitGradeById(id);
  const grade = Phaser.Math.Between(gradeStart, gradeEnd);
  const unit = new Unit(InGameScene, {
    owner: InGameScene.bunker,
    grade,
  });
  InGameScene.bunker.units.add(unit);
  InGameScene.bunker.shooterGaugeBar.current.value += 1;
  new EaseText(InGameScene, {
    x: InGameScene.bunker.x - 30,
    y: InGameScene.bunker.y - 50,
    text: `+★${grade}`,
    color: "#ff0000",
    duration: 3000,
  }).setFontSize(20);
  increaseUnitStateButton.bind(this)(grade);
  return true;
}
function increaseUnitStateButton(grade: number) {
  const button = this.buttonGroup.unit
    .getChildren()
    .find(({ name }) => name === `grade${grade}`) as Button;
  button.text.rightTopNumber.value += 1;
}
