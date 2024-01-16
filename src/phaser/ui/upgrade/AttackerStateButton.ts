import { Button } from "@/phaser/ui/upgrade/Button";

export class AttackerStateButton extends Button {
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
  }
}
