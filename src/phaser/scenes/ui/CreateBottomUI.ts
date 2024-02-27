import { UI } from "@/phaser/constants";
import { TAP_BUTTON_LIST } from "@/phaser/constants/upgrade";
import { Button } from "@/phaser/ui/upgrade/Button";
import { getBetweenAroundInfo } from "@/phaser/utils/helper";

const TAP_BUTTON = {
  height: 50,
  paddingBottom: 20,
};
export function createBottomWrap(scene: Phaser.Scene) {
  this.uiContainer = scene.add
    .container(0, Number(scene.scale.gameSize.height) - UI.height)
    .setDepth(9999);
  const background = scene.add
    .rectangle(0, 0, Number(scene.scale.gameSize.width) + 2, UI.height)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setFillStyle(0xffffff);
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
export function createBottomTap(scene: Phaser.Scene) {
  const { rectWidth, getX } = getBetweenAroundInfo(
    scene,
    TAP_BUTTON_LIST.length
  );
  TAP_BUTTON_LIST.forEach(({ id, shortcutText, desc, texture }, index) => {
    const x = getX(index);
    const button = new Button(scene, {
      x,
      y: 10,
      width: rectWidth,
      height: 50,
      spriteKey: texture,
      shortcut: shortcutText,
      leftBottomText: desc,
      onClick: () => {
        this.uiEventBus.emit("tab", id);
      },
    });
    this.tapContainer.add(button);
  });
  // TODO: 탭 아래 버튼들 영역 스크롤 가능하게 만들기
}
