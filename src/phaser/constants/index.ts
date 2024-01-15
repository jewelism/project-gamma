export const GAME = {
  speed: 1,
};

export const UI = {
  height: 100,
};
export const INIT = {
  health: 20,
  money: 10,
  income: 1,
  soldierCount: 2,
  soldierCountMax: 5,
};

export const INIT_PLAYER_STATE_LIST = [
  {
    id: "attackDamage",
    spriteKey: "sword1",
    shortcutText: "A",
    desc: "attack damage +1",
  },
  {
    id: "attackSpeed",
    spriteKey: "fist",
    shortcutText: "S",
    desc: "attack speed +1%",
  },
  {
    id: "moveSpeed",
    spriteKey: "boots",
    shortcutText: "D",
    desc: "move speed +1%",
  },
  {
    id: "defence",
    spriteKey: "defence1",
    shortcutText: "F",
    desc: "defence +1",
  },
  { id: "hp", spriteKey: "boots", shortcutText: "G", desc: "hp +1%" },
];

export const TEXT_STYLE = {
  fontSize: 14,
  fontStyle: "bold",
  color: "#000000",
  stroke: "#ffffff",
  strokeThickness: 2, // 테두리 두께
};
