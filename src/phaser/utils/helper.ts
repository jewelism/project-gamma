import { Soldier } from "@/phaser/objects/Soldier";

export const createFlashFn = () => {
  return (char, tintColor = 0xff0000) => {
    char.setTint(tintColor);
    char.scene.time.delayedCall(150, () => {
      char.clearTint();
    });
  };
};

export const isOutOfRange = (soldier, target) => {
  const distance = Phaser.Math.Distance.Between(
    soldier.x,
    soldier.y,
    (target as any).x,
    (target as any).y
  );
  return distance > soldier.attackRange;
};

export const getAllEnemyInRange = (scene, soldier) => {
  return scene.enemies.getChildren().filter((enemy) => {
    return !isOutOfRange(soldier, enemy);
  });
};

export const getRandomEnemyInRange = (scene, soldier: Soldier) => {
  const targets = getAllEnemyInRange(scene, soldier);
  if (targets.length === 0) {
    return;
  }
  const target = targets[Phaser.Math.Between(0, targets.length - 1)];
  if (!target || target?.isDestroyed()) {
    return;
  }
  if (isOutOfRange(soldier, target)) {
    return;
  }
  return target;
};
