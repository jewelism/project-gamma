import { Counter } from "@/phaser/objects/counter/Counter";

export class StarCounter extends Counter {
  value: number = 0;

  static getTemplate(value: number) {
    return `☆ / ${value}`;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, totalStars: number) {
    super(scene, {
      x,
      y,
      template: StarCounter.getTemplate(totalStars),
    });
    this.value = totalStars;
  }
  setValue(value: number) {
    this.setText(StarCounter.getTemplate(value));
  }
  decrease() {
    this.value -= 1;
    this.setValue(this.value);
  }
}
