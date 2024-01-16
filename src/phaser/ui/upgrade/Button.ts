import { TEXT_STYLE } from "@/phaser/constants";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { ToolTip } from "@/phaser/ui/ToolTip";

export class Button extends Phaser.GameObjects.Container {
  grade: Phaser.GameObjects.Text;
  progress: GaugeBar;

  constructor(
    scene: Phaser.Scene,
    {
      x,
      y,
      width,
      height,
      spriteKey,
      hoverText,
      shortcutText,
      enableGrade = false,
      progressTime = 5,
      onClick,
    }
  ) {
    super(scene, x, y);
    const tooltip = new ToolTip(scene, { x, y, hoverText });

    const onKeyDown = () => {
      if (!onClick) {
        return;
      }
      button.setAlpha(0.4);
      icon.setAlpha(0.4);
      onClick();
    };
    const onKeyUp = () => {
      button.setAlpha(1);
      icon.setAlpha(1);
    };
    4;
    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height)
      .setStrokeStyle(2, 0x0000ff, 1)
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        tooltip.setVisible(true);
        onKeyDown();
      })
      .on("pointerup", onKeyUp)
      .on("pointerover", () => {
        tooltip.setVisible(true);
      })
      .on("pointerout", () => {
        onKeyUp();
        tooltip.setVisible(false);
      });
    const icon = new Phaser.GameObjects.Sprite(
      scene,
      button.width / 2,
      button.height / 2,
      spriteKey
    );
    const shortcut = new Phaser.GameObjects.Text(
      scene,
      10,
      10,
      shortcutText,
      TEXT_STYLE
    ).setOrigin(0.5, 0.5);
    this.grade = new Phaser.GameObjects.Text(
      scene,
      button.width - 10,
      button.height - 10,
      "1",
      TEXT_STYLE
    ).setOrigin(0.5, 0.5);
    this.progress = new GaugeBar(scene, {
      max: progressTime,
      value: 0,
      width: button.width,
      height: 5,
      color: 0x00ffff,
    })
      .setPosition(button.width / 2, button.height)
      .setAlpha(0);
    this.setProgressTime(progressTime);

    this.add([button, icon, shortcut]);
    enableGrade && this.add(this.grade);
    this.add(this.progress);
    scene.add.existing(this);

    scene.input.keyboard
      .addKey(Phaser.Input.Keyboard.KeyCodes[shortcutText])
      .on("down", onKeyDown)
      .on("up", onKeyUp);
  }
  setGrade(grade: number) {
    this.grade.setText(`${grade}`);
  }
  setProgressTime(time: number) {
    this.progress.max = time;
    this.progress.setAlpha(1);
    const timerEvent = this.scene.time.addEvent({
      delay: 1000, // 1초마다 실행
      callback: () => {
        this.progress.increase(1);
        if (this.progress.value >= this.progress.max) {
          timerEvent.remove();
          this.progress.setAlpha(0);
          this.emit(`upgrade_${this.name}`);
        }
      },
      loop: true, // 이벤트를 계속 반복
    });
  }
}
