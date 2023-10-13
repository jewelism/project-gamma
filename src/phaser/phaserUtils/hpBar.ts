export function createHpBar(scene) {
  const hpBar = scene.add.graphics();
  hpBar.fillStyle(0xff0000, 1);
  hpBar.fillRect(-10, -10, 30, 5);
  hpBar.setDepth(100);

  return hpBar;
}

export function updateHpBar({ hpBar, maxHp, hp }) {
  hpBar.clear();
  hpBar.fillStyle(0xff0000, 1);
  hpBar.fillRect(-10, -10, 30 * (hp / maxHp), 5);
}
