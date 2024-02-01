import { Button } from "@/phaser/ui/upgrade/Button";

export class SoldierStateButton extends Button {
  button: Button;

  constructor(
    scene: Phaser.Scene,
    {
      x,
      y,
      width,
      height,
      spriteKey,
      tooltipText,
      gradeText,
      onClick,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
      spriteKey: string;
      tooltipText: string;
      gradeText?: string;
      onClick?: () => void;
    }
  ) {
    super(scene, {
      x,
      y,
      width,
      height,
      spriteKey,
      tooltipText,
      shortcutText: gradeText,
      enableCountText: true,
      onClick,
    });
    this.shortcutText.setOrigin(0).setX(5).setY(5);
  }
  decreaseCountText(amount: number = 1) {
    const current = Number(this.countText.text);
    if (current <= 0) {
      return this;
    }
    const count = current - amount;
    if (!count) {
      this.setAlpha(0);
    }
    return this.setCountText(count ? count : "");
  }
}
