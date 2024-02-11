import { TEXT_STYLE } from "@/phaser/constants";
import { effect, signal } from "@preact/signals-core";

export class ResourceState extends Phaser.GameObjects.Container {
  value = signal(0);
  backgroundColor: Phaser.GameObjects.Rectangle;
  iconImage: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    { x, y, texture }: { x: number; y: number; texture: string }
  ) {
    super(scene, x, y);

    this.text = new Phaser.GameObjects.Text(scene, 0, 0, "0", {
      ...TEXT_STYLE,
      fontSize: 12,
    });
    this.iconImage = new Phaser.GameObjects.Image(scene, -25, -3, texture)
      .setDisplaySize(20, 20)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(9999);
    this.backgroundColor = new Phaser.GameObjects.Rectangle(
      scene,
      -25,
      -3,
      20,
      20,
      0xffffff
    )
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(9997);
    this.setScrollFactor(0)
      .setDepth(9998)
      .setName(texture)
      .add([this.text, this.backgroundColor, this.iconImage]);
    scene.add.existing(this);

    effect(() => {
      this.text.setText(String(this.value));
    });
  }
  increase(amount: number) {
    this.value.value += amount;
    return this;
  }
  decrease(amount: number) {
    this.value.value -= amount;
    return this;
  }
  setXAll(x: number) {
    this.setX(x);
  }
}
