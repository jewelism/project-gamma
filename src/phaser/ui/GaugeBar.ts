import { type Signal, signal, effect } from "@preact/signals-core";

export class GaugeBar extends Phaser.GameObjects.Container {
  color: number;
  lineColor: number;
  showText: boolean;
  bar: Phaser.GameObjects.Graphics;
  max: Signal<number>;
  current: Signal<number>;
  hpText: Phaser.GameObjects.Text;

  constructor(
    scene,
    {
      max,
      current,
      width = 70,
      height = 6,
      color = 0xff0000,
      lineColor = 0x000000,
      showText = false,
    }: {
      max: number;
      current?: number;
      width?: number;
      height?: number;
      color?: number;
      lineColor?: number;
      showText?: boolean;
    }
  ) {
    super(scene);

    this.max = signal(max);
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineColor = lineColor;
    this.current = signal(current !== undefined ? current : max);
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.showText = showText;

    this.add(this.bar);
    if (this.showText) {
      this.createHpText();
    }
    this.updateBar(this.current.value);

    effect(() => {
      if (this.current.value >= this.max.value) {
        this.current.value = this.max.value;
      }
      if (this.current.value <= 0) {
        this.current.value = 0;
      }
      this.updateBar(this.current.value);
      if (this.showText) {
        this.hpText.setText(`${this.current.value}/${this.max.value}`);
      }
    });
  }
  updateBar(value: number) {
    this.bar.clear();
    this.bar.fillStyle(this.color, 1);
    const valueWidth = (value / this.max.value) * this.width;
    const ownerBarGapY = 10;

    this.bar.fillRect(-this.width / 2, ownerBarGapY, valueWidth, this.height);
    this.bar.lineStyle(1, this.lineColor);
    this.bar.strokeRect(-this.width / 2, ownerBarGapY, this.width, this.height);
    this.bar.strokePath().setDepth(9998);
  }
  createHpText() {
    this.hpText = new Phaser.GameObjects.Text(
      this.scene,
      this.x,
      this.y + 18,
      `${this.current.value}/${this.max.value}`,
      {
        fontSize: "12px",
        color: "#ffffff",
      }
    )
      .setOrigin(0.5)
      .setDepth(this.depth + 1);
    this.add(this.hpText);
  }
}
