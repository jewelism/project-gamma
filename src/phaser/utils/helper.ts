import { UI } from "@/phaser/constants";
import { Unit } from "@/phaser/objects/Unit";

export const createFlashFn = () => {
  return (char, tintColor = 0xff0000) => {
    char.setTint(tintColor);
    char.scene.time.delayedCall(150, () => {
      char.clearTint();
    });
  };
};

export const isOutOfRange = (unit, target) => {
  const distance = Phaser.Math.Distance.Between(
    unit.x,
    unit.y,
    (target as any).x,
    (target as any).y
  );
  return distance > unit.attackRange;
};

export const getAllEnemyInRange = (scene, unit) => {
  return scene.enemies.getChildren().filter((enemy) => {
    return !isOutOfRange(unit, enemy);
  });
};

export const getRandomEnemyInRange = (scene, unit: Unit) => {
  const targets = getAllEnemyInRange(scene, unit);
  if (targets.length === 0) {
    return;
  }
  const target = targets[Phaser.Math.Between(0, targets.length - 1)];
  if (!target || target?.isDestroyed()) {
    return;
  }
  if (isOutOfRange(unit, target)) {
    return;
  }
  return target;
};

export const getEnemyRandomDirectionXY = (scene: Phaser.Scene) => {
  const direction = Phaser.Math.RND.integerInRange(0, 3);
  let x: number, y: number;
  const bottomRange =
    Phaser.Math.RND.integerInRange(0, scene.cameras.main.worldView.bottom) -
    UI.height;
  if (direction === 0) {
    x = Phaser.Math.RND.integerInRange(0, scene.cameras.main.worldView.right);
    y = scene.cameras.main.worldView.top - 50;
  } else if (direction === 1) {
    x = scene.cameras.main.worldView.right + 50;
    y = bottomRange;
  } else if (direction === 2) {
    x = Phaser.Math.RND.integerInRange(0, scene.cameras.main.worldView.right);
    y = scene.cameras.main.worldView.bottom + 50 - UI.height;
  } else if (direction === 3) {
    x = scene.cameras.main.worldView.left - 50;
    y = bottomRange;
  }
  return [x, y];
};

export const getBetweenAroundInfo = (scene: Phaser.Scene, count) => {
  const gameWidth = scene.scale.gameSize.width;
  const rectWidth = (gameWidth - count * 20) / count;
  const spacing = (gameWidth - rectWidth * count) / (count + 1);
  return {
    rectWidth,
    getX: (index: number) => spacing + (index % count) * (rectWidth + spacing),
    getLine: (index: number) => Math.floor(index / count),
  };
};
