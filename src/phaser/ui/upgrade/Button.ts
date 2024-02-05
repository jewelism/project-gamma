import { TEXT_STYLE } from "@/phaser/constants";
import { InGameUIScene } from "@/phaser/scenes/ui/InGameUIScene";
import { GaugeBar } from "@/phaser/ui/GaugeBar";
import { ToolTip } from "@/phaser/ui/ToolTip";
import { effect, signal } from "@preact/signals-core";

export class Button extends Phaser.GameObjects.Container {
  progress: GaugeBar;
  tooltip: ToolTip;
  shortcutText: Phaser.GameObjects.Text;
  countText: Phaser.GameObjects.Text;
  currentCount = signal(0);

  constructor(
    scene: Phaser.Scene,
    {
      x,
      y,
      width,
      height,
      spriteKey,
      tooltipText = "",
      shortcutText,
      enableCountText = false,
      progressTime = 0,
      onClick,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
      spriteKey: string;
      tooltipText?: string;
      shortcutText?: string;
      enableCountText?: boolean;
      progressTime?: number;
      onClick?: (progressClick: () => void) => void;
    }
  ) {
    super(scene, x, y);
    this.tooltip = new ToolTip(scene, { x, y, hoverText: tooltipText });
    if (!tooltipText) {
      this.tooltip.setAlpha(0);
    }

    const onKeyDown = () => {
      if (!onClick) {
        return;
      }
      if (!this.active) {
        return;
      }
      onClick(() => {
        button.setAlpha(0.4);
        icon.setAlpha(0.4);
        if (progressTime) {
          this.setProgressTime(progressTime);
          this.add(this.progress);
          console.log("progressTime", progressTime);
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
    4;
    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height)
      .setStrokeStyle(2, 0x0000ff, 1)
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        this.tooltip.setVisible(true);
        onKeyDown();
      })
      .on("pointerup", onKeyUp)
      .on("pointerover", () => {
        this.tooltip.setVisible(true);
      })
      .on("pointerout", () => {
        onKeyUp();
        this.tooltip.setVisible(false);
      });
    const icon = new Phaser.GameObjects.Sprite(
      scene,
      button.width / 2,
      button.height / 2,
      spriteKey
    );

    this.add([button, icon]);
    scene.add.existing(this);

    if (enableCountText) {
      this.countText = new Phaser.GameObjects.Text(
        scene,
        button.width - 10,
        button.height - 10,
        String(this.currentCount.value),
        TEXT_STYLE
      ).setOrigin(0.5, 0.5);
      this.add(this.countText);
    }

    effect(() => {
      if (!this.currentCount.value) {
        return;
      }
      this.countText.setText(String(this.currentCount.value));
    });

    if (progressTime) {
      this.progress = new GaugeBar(scene, {
        max: progressTime,
        current: 0,
        width: button.width,
        height: 5,
        color: 0x00ffff,
      }).setPosition(button.width / 2, button.height / 2 + 10);
    }

    if (shortcutText) {
      this.shortcutText = new Phaser.GameObjects.Text(
        scene,
        10,
        10,
        shortcutText,
        TEXT_STYLE
      ).setOrigin(0.5, 0.5);
      this.add(this.shortcutText);
      scene.input.keyboard
        .addKey(Phaser.Input.Keyboard.KeyCodes[shortcutText])
        .on("down", onKeyDown)
        .on("up", onKeyUp);
    }
  }
  setEnable(bool: boolean) {
    this.setActive(bool);
    this.setVisible(bool);
    return this;
  }
  setTooltipText(text: string) {
    this.tooltip.buttonText.setText(text);
  }
  setCountText(grade: string | number) {
    return this.countText.setText(String(grade));
  }
  increaseCountText(amount: number = 1) {
    return this.setCountText(Number(this.countText.text) + amount);
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
            `upgradeComplete`,
            this.name
          );
          this.remove(this.progress);
          this.progress.destroy();
          timerEvent.remove();
        }
      },
      loop: true, // 이벤트를 계속 반복
    });
  }
}
