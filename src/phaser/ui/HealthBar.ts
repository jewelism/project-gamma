export const HealthBarConfig = {
  width: 80,
  height: 16,
};
export class HealthBar {
  bar: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  value: number;
  p: number;
  constructor(scene: Phaser.Scene, x: number, y: number, maxHealth: number) {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = maxHealth;
    this.p = 76 / 100;

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
      HealthBarConfig.width,
      HealthBarConfig.height
    );

    //  Health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(
      this.x + 2,
      this.y + 2,
      HealthBarConfig.width - 4,
      HealthBarConfig.height - 4
    );

    if (this.value < 30) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    this.bar.fillRect(
      this.x + 2,
      this.y + 2,
      Math.floor(this.p * this.value),
      12
    );
  }
}
