import { TEXT_STYLE } from "@/phaser/constants";
import { InGameUIScene } from "@/phaser/scenes/ui/InGameUIScene";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { Signal, effect, signal } from "@preact/signals-core";

const BUTTON_COLOR = {
  blue: {
    line: 0x6aa5ff,
    shadow: 0x0006ff,
  },
};

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
  disabled: Signal<boolean> = signal(false);

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
      color = "blue",
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
      color?: keyof typeof BUTTON_COLOR;
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
      if (this.disabled.value) {
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
          this.progressInUse = true;
          this.setProgressTime(progressTime);
          this.createProgress({ progressTime, button });
          this.add(this.progress);
        }
      });
    };
    const onKeyUp = () => {
      if (this.disabled.value) {
        return;
      }
      button.setAlpha(1);
      icon.setAlpha(1);
    };

    const button = new Phaser.GameObjects.Graphics(scene)
      .lineStyle(2, BUTTON_COLOR[color].line)
      .fillRoundedRect(0, 0, width, height, 5)
      .strokePath()
      .setInteractive()
      .on("pointerdown", () => {
        onKeyDown();
      })
      .on("pointerup", () => onKeyUp())
      .on("pointerout", () => {
        onKeyUp();
      });

    let shadow = new Phaser.GameObjects.Graphics(scene)
      .lineStyle(4, BUTTON_COLOR[color].shadow, 0.2)
      .fillRoundedRect(button.x, button.y, width, height, 5)
      .strokePath();
    const icon = new Phaser.GameObjects.Sprite(
      scene,
      width / 2,
      height / 2,
      spriteKey
    );

    this.add([button, shadow, icon]);
    scene.add.existing(this);

    Object.entries(this.text).forEach(([key, sig]) => {
      let x = 5;
      let y = 10;
      if (key.toLowerCase().includes("right")) {
        x = width - 20;
      }
      if (key.toLowerCase().includes("bottom")) {
        y = height - 10;
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
      effect(() => {
        button.setAlpha(this.disabled.value ? 0.2 : 1);
        text.setAlpha(this.disabled.value ? 0.2 : 1);
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
        width / 2,
        height / 2 + 10
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
      color: 0xffadad,
    }).setPosition(button.width / 2, button.height / 2 + 10);
    return this.progress;
  }
  setProgressTime(time: number) {
    this.progress.max.value = time;
    this.progress.setAlpha(1);
    const timerEvent = this.scene.time.addEvent({
      delay: 1000, // 1초마다 실행
      callback: () => {
        this.progress.current.value += 1;
        if (this.progress.current.value >= this.progress.max.value) {
          (this.scene as InGameUIScene).uiEventBus.emit(
            "upgradeProgressDone",
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
