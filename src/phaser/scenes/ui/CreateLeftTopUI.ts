import { UPGRADE_V2 } from "@/phaser/constants/upgrade";
import { InGameScene } from "@/phaser/scenes/InGameScene";
import { ResourceState } from "@/phaser/ui/ResourceState";

export class CreateLeftTopUI {
  createResourceState(scene) {
    // const x = scene.scale.gameSize.width - 50;
    const x = 35;
    const InGameScene = scene.scene.get("InGameScene") as InGameScene;
    InGameScene.resourceStates = {
      gold: new ResourceState(scene, { x, y: 35, texture: "goldBar" }).increase(
        200
      ),
      star: new ResourceState(scene, { x, y: 60, texture: "star" }),
      increaseByIncome() {
        const amount = Math.floor(
          this.gold.value * (UPGRADE_V2.util.income.percent.value / 100)
        );
        this.gold.increase(amount);
        return amount;
      },
      decreaseByUpgrade({ gold, star }) {
        gold && this.gold.decrease(gold);
        star && this.star.decrease(star);
      },
      decreaseByPercent(percent: number) {
        const amount = Math.floor(this.gold.value * percent);
        this.gold.decrease(Math.floor(this.gold.value * percent));
        return amount;
      },
    };
  }
}
