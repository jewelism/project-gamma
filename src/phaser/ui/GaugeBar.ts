export class GaugeBar extends Phaser.GameObjects.Container {
  max: number;
  value: number;
  color: number;
  lineColor: number;
  showText: boolean;
  bar: Phaser.GameObjects.Graphics;
  hpText: Phaser.GameObjects.Text;

  constructor(
    scene,
    {
      max,
      value,
      width = 70,
      height = 6,
      color = 0xff0000,
      lineColor = 0x000000,
      showText = false,
    }: {
      max: number;
      value?: number;
      width?: number;
      height?: number;
      color?: number;
      lineColor?: number;
      showText?: boolean;
    }
  ) {
    super(scene);

    this.max = max;
    this.width = width;
    this.height = height;
    this.color = color;
    this.lineColor = lineColor;
    this.value = value !== undefined ? value : max;
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.showText = showText;

    this.add(this.bar);
    if (this.showText) {
      this.showHpText();
    }
    this.updateBar(this.value);
  }
  updateBar(value: number) {
    this.bar.clear();
    this.bar.fillStyle(this.color, 1);
    const valueWidth = (value / this.max) * this.width;
    const ownerBarGapY = 10;

    this.bar.fillRect(-this.width / 2, ownerBarGapY, valueWidth, this.height);
    this.bar.lineStyle(1, this.lineColor);
    this.bar.strokeRect(-this.width / 2, ownerBarGapY, this.width, this.height);
    this.bar.strokePath().setDepth(9998);
    if (this.showText) {
      this.updateText();
    }
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
  showHpText() {
    this.hpText = new Phaser.GameObjects.Text(
      this.scene,
      this.x,
      this.y + 18,
      `${this.value}/${this.max}`,
      {
        fontSize: "12px",
        color: "#ffffff",
      }
    )
      .setOrigin(0.5)
      .setDepth(this.depth + 1);
    this.add(this.hpText);
  }
  updateText() {
    this.hpText.setText(`${this.value}/${this.max}`);
  }
}
