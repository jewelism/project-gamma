import { CenterText } from "@/phaser/objects/CenterText";
import { signal } from "@preact/signals-core";

export class InGamePauseScene extends Phaser.Scene {
  gameover = signal(false);

  constructor() {
    super("InGamePauseScene");
  }
  create() {
    this.createPause();
  }
  createPause() {
    let isPaused = false;
    let text = new CenterText(this, { text: "PAUSE" }).setAlpha(0);
    const onKeyDown = () => {
      if (this.gameover.value) {
        return;
      }
      if (isPaused) {
        isPaused = false;
        this.scene.get("InGameScene").scene.resume();
        this.scene.get("InGameUIScene").scene.resume();
        text.setAlpha(0);
        return;
      }
      isPaused = true;
      this.scene.get("InGameScene").scene.pause();
      this.scene.get("InGameUIScene").scene.pause();
      text.setAlpha(1);
    };
    this.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on("down", onKeyDown);
  }
}
