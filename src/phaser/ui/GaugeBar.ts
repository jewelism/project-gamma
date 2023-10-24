import { ToolTip } from "@/phaser/ui/ToolTip";

export const GaugeBarConfig = {
  width: 80,
  height: 16,
};
export class GaugeBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  p: number;
  max: number;
  constructor(
    scene: Phaser.Scene,
    { x, y, max, value }: { x: number; y: number; max: number; value: number }
  ) {
    this.bar = new Phaser.GameObjects.Graphics(scene)
      .setDepth(100)
      .setAlpha(0.3);

    this.x = x;
    this.y = y;
    this.value = value;
    this.max = max;
    this.p = 76 / this.max;

    // const tooltip = new ToolTip(scene, { x, y, hoverText: "asdfasdfas" });

    // this.bar
    //   .setInteractive()
    //   .on("pointerover", () => {
    //     // event not working
    //     console.log("pointerover");
    //     tooltip.setVisible(true);
    //   })
    //   .on("pointerout", () => {
    //     // event not working
    //     console.log("pointerout");
    //     tooltip.setVisible(false);
    //   });
    this.draw();
    scene.add.existing(this.bar);
  }

  decrease(amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return this.value === 0;
  }

  draw() {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(
      this.x,
      this.y,
      GaugeBarConfig.width,
      GaugeBarConfig.height
    );

    //  Health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(
      this.x + 2,
      this.y + 2,
      GaugeBarConfig.width - 4,
      GaugeBarConfig.height - 4
    );

    this.bar.fillStyle(0xfff);

    this.bar.fillRect(
      this.x + 2,
      this.y + 2,
      Math.floor(this.p * this.value),
      12
    );
    return this.bar;
  }
}
