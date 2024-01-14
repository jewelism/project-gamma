const BAR = {
  WIDTH: 70,
  HEIGHT: 6,
};

export class GaugeBar extends Phaser.GameObjects.Graphics {
  max: number;
  value: number;

  // TODO: 컬러 셋팅할수있도록 변경
  constructor(scene, { max, value }: { max: number; value?: number }) {
    super(scene);

    this.max = max;
    this.value = value ? value : max;

    scene.add.existing(this);
    this.updateBar(this.value);
  }
  updateBar(value: number) {
    this.clear();
    this.fillStyle(0xff0000, 1);
    const width = (value / this.max) * BAR.WIDTH;

    const ownerBarGapY = 10;

    this.fillRect(-BAR.WIDTH / 2, ownerBarGapY, width, BAR.HEIGHT);
    this.strokeRect(-BAR.WIDTH / 2, ownerBarGapY, BAR.WIDTH, BAR.HEIGHT);
    this.strokePath();
  }
  increase(value: number) {
    this.value += value;
    this.updateBar(this.value);
  }
  decrease(value: number) {
    this.value -= value;
    this.updateBar(this.value);
  }
}
