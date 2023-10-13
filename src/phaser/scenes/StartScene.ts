import { createTitleText } from "@/phaser/phaserUtils/titleText";

export class StartScene extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("StartScene");
  }
  preload() {}
  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    const title = createTitleText(this, "Escape from jewelry");

    const pressAnyKeyText = this.add
      .text(title.x, title.y + 500, "press any key", {
        fontSize: "20px",
        color: "#fff",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: pressAnyKeyText,
      alpha: 0,
      duration: 600,
      ease: "Power2",
      yoyo: true,
      repeat: -1,
    });
    const onKeydown = () => {
      this.scene.start("SelectLevelScene");
    };
    this.input.keyboard.on("keydown", onKeydown);
    this.input.on("pointerdown", onKeydown);
  }
}
