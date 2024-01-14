export const getUpgradeMax = (id: string): number => {
  const max = {
    attackDamage: 500,
    attackSpeed: 200,
    defence: 1000,
    moveSpeed: 300,
    hp: 10000,
  };
  return max[id];
};

export const updateUpgradeUIText = (
  element: Phaser.GameObjects.DOMElement,
  payload: {
    spriteKey: string;
    shortcutText: string;
    desc: string;
    gold?: number;
    star?: number;
  }
) => {
  element.getChildByID("upgrade-icon").classList.add(payload.spriteKey);
  ["shortcutText", "desc", "gold", "star"].forEach((id) => {
    if (!payload[id]) {
      return;
    }
    element.getChildByID(id).textContent = String(payload[id]);
  });
};

export const createFlashFn = () => {
  return (char, tintColor = 0xff0000) => {
    char.setTint(tintColor);
    char.scene.time.delayedCall(150, () => {
      char.clearTint();
    });
  };
};
