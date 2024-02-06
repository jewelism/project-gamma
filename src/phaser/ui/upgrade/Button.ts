import { TEXT_STYLE } from "@/phaser/constants";
import { InGameUIScene } from "@/phaser/scenes/ui/InGameUIScene";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { Signal, effect, signal } from "@preact/signals-core";

export class Button extends Phaser.GameObjects.Container {
  progress: GaugeBar;
  text: {
    leftTopText: Signal<string>;
    rightTopNumber: Signal<number>;
    leftBottomText: Signal<string>;
    rightBottomText: Signal<string>;
  } = {
    leftTopText: signal(""),
    rightTopNumber: signal(0),
    leftBottomText: signal(""),
    rightBottomText: signal(""),
  };
  progressInUse: boolean = false;

  constructor(
    scene: Phaser.Scene,
    {
      x,
      y,
      width,
      height,
      spriteKey,
      shortcut,
      leftTopText = "",
      rightTopNumber = 0,
      leftBottomText = "",
      rightBottomText = "",
      allowZero = false,
      progressTime = 0,
      onClick,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
      spriteKey: string;
      shortcut?: string;
      leftTopText?: string;
      rightTopNumber?: number;
      leftBottomText?: string;
      rightBottomText?: string;
      allowZero?: boolean;
      progressTime?: number;
      onClick?: (progressClick: () => void) => void;
    }
  ) {
    super(scene, x, y);

    this.text.leftTopText = signal(shortcut ? shortcut : leftTopText);
    this.text.rightTopNumber = signal(rightTopNumber);
    this.text.leftBottomText = signal(leftBottomText);
    this.text.rightBottomText = signal(rightBottomText);

    const onKeyDown = () => {
      if (!onClick) {
        return;
      }
      if (!this.active) {
        return;
      }
      onClick(() => {
        if (this.progressInUse) {
          return;
        }
        button.setAlpha(0.4);
        icon.setAlpha(0.4);
        if (progressTime) {
          console.log("progressTime", progressTime);

          this.setProgressTime(progressTime);
          this.createProgress({ progressTime, button });
          this.add(this.progress);
        } else {
          (scene as InGameUIScene).uiEventBus.emit(
            `upgradeComplete`,
            this.name
          );
        }
      });
    };
    const onKeyUp = () => {
      button.setAlpha(1);
      icon.setAlpha(1);
    };
    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height)
      .setStrokeStyle(2, 0x0000ff, 1)
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        onKeyDown();
      })
      .on("pointerup", onKeyUp)
      .on("pointerout", () => {
        onKeyUp();
      });
    const icon = new Phaser.GameObjects.Sprite(
      scene,
      button.width / 2,
      button.height / 2,
      spriteKey
    );

    this.add([button, icon]);
    scene.add.existing(this);

    Object.entries(this.text).forEach(([key, sig]) => {
      let x = 5;
      let y = 10;
      if (key.toLowerCase().includes("right")) {
        x = button.width - 20;
      }
      if (key.toLowerCase().includes("bottom")) {
        y = button.height - 10;
      }
      const text = new Phaser.GameObjects.Text(
        scene,
        x,
        y,
        String(sig.value ? sig.value : ""),
        {
          ...TEXT_STYLE,
          ...(key === "rightTopNumber" && {
            align: "right",
          }),
        }
      ).setOrigin(0, 0.5);
      this.add(text);
      effect(() => {
        if (!allowZero && ["0", 0].includes(sig.value)) {
          return;
        }
        text.setText(String(sig.value));
      });
    });

    effect(() => {
      if (!allowZero) {
        return;
      }
      if (this.text.rightTopNumber.value) {
        return;
      }
      this.setEnable(false);
    });

    if (progressTime) {
      this.createProgress({ progressTime, button }).setPosition(
        button.width / 2,
        button.height / 2 + 10
      );
    }

    if (shortcut) {
      scene.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes[shortcut])
        .on("down", onKeyDown)
        .on("up", onKeyUp);
    }
  }
  setEnable(bool: boolean) {
    this.setActive(bool);
    this.setVisible(bool);
    return this;
  }
  createProgress({ progressTime, button }) {
    this.progress = new GaugeBar(this.scene, {
      max: progressTime,
      current: 0,
      width: button.width,
      height: 5,
      color: 0x00ffff,
    }).setPosition(button.width / 2, button.height / 2 + 10);
    return this.progress;
  }
  setProgressTime(time: number) {
    this.progress.max.value = time;
    this.progress.setAlpha(1);
    this.progressInUse = true;
    const timerEvent = this.scene.time.addEvent({
      delay: 1000, // 1초마다 실행
      callback: () => {
        this.progress.current.value += 1;
        if (this.progress.current.value >= this.progress.max.value) {
          (this.scene as InGameUIScene).uiEventBus.emit(
            `upgradeComplete`,
            this.name
          );
          this.progressInUse = false;
          this.remove(this.progress);
          this.progress.destroy();
          timerEvent.remove();
        }
      },
      loop: true, // 이벤트를 계속 반복
    });
    return this;
  }
}
