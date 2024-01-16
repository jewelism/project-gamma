export class GaugeBar extends Phaser.GameObjects.Graphics {
  max: number;
  value: number;
  width: number;
  height: number;
  color: number;
  lineColor: number;

  constructor(
    scene,
    {
      max,
      value,
      width = 70,
      height = 6,
      color = 0xff0000,
      lineColor = 0x000000,
    }: {
      max: number;
      value?: number;
      width?: number;
      height?: number;
      color?: number;
      lineColor?: number;
    }
  ) {
    super(scene);

    this.max = max;
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineColor = lineColor;
    this.value = value !== undefined ? value : max;

    this.updateBar(this.value);
  }
  updateBar(value: number) {
    this.clear();
    this.fillStyle(this.color, 1);
    const valueWidth = (value / this.max) * this.width;

    const ownerBarGapY = 10;

    this.fillRect(-this.width / 2, ownerBarGapY, valueWidth, this.height);
    this.lineStyle(1, this.lineColor);
    this.strokeRect(-this.width / 2, ownerBarGapY, this.width, this.height);
    this.strokePath();
  }
  increase(value: number) {
    if (this.value >= this.max) {
      return;
    }
    if (this.value + value > this.max) {
      this.value = this.max;
    } else {
      this.value += value;
    }
    this.updateBar(this.value);
  }
  decrease(value: number) {
    if (this.value <= 0) {
      return;
    }
    if (this.value - value < 0) {
      this.value = 0;
    } else {
      this.value -= value;
    }
    this.updateBar(this.value);
  }
}
