import { removeAlphabets, removeExceptAlphabets } from "@/phaser/utils";
import { effect, signal } from "@preact/signals-core";

export const getUnitGradeById = (id: string): number[] => {
  return removeAlphabets(id).split("_").map(Number);
};
export const getUpgradeTabName = (id: string) => {
  const lowId = id.toLowerCase();
  if (lowId.includes("bunker") || lowId.includes("income")) {
    return "util";
  }
  return removeExceptAlphabets(id);
};
function createAttackDamage(id: string, shortcutText: string) {
  const [gradeStart, gradeEnd] = getUnitGradeById(id);
  const cost = signal(gradeStart * 10);
  return {
    [id]: {
      current: signal(1),
      max: 20,
      cost,
      get desc() {
        return `(${cost}G) ★${gradeStart}~★${gradeEnd} (+grade★)`;
      },
      shortcutText,
      spriteKey: "sword1",
    },
  };
}
function createAddUnit(id: string, shortcutText: string) {
  const [gradeStart, gradeEnd] = getUnitGradeById(id);
  const cost = gradeStart * 20;
  return {
    [id]: {
      cost,
      get desc() {
        return `(${cost}G) ★${gradeStart}~★${gradeEnd}`;
      },
      shortcutText,
      spriteKey: "sword1",
    },
  };
}
export const UPGRADE_V2 = {
  addUnit: {
    ...createAddUnit("addUnit1_6", "A"),
    ...createAddUnit("addUnit7_12", "S"),
    ...createAddUnit("addUnit13_18", "D"),
  },
  attackDamage: {
    ...createAttackDamage("attackDamage1_3", "F"),
    ...createAttackDamage("attackDamage4_6", "G"),
    ...createAttackDamage("attackDamage7_9", "H"),
  },
  util: {
    income: {
      current: signal(1),
      max: 50,
      cost: 0,
      time: 120,
      get desc() {
        return `(10%G, ${this.time}sec) income +0.5%`;
      },
      shortcutText: "X",
      spriteKey: "book1",
    },
    upgradeBunker: {
      current: signal(1),
      max: 15,
      cost: 10,
      time: 5,
      get desc() {
        return `(${this.cost}G, ${this.time}sec) upgrade bunker`;
      },
      shortcutText: "Z",
      spriteKey: "defence1",
    },
  },
};

export const TAP_BUTTON_LIST = [
  {
    id: "addUnit",
    shortcutText: "Q",
    desc: "add unit",
    texture: "sword1",
  },
  {
    id: "attackDamage",
    shortcutText: "W",
    desc: "damage",
    texture: "sword1",
  },
  { id: "util", shortcutText: "E", desc: "util", texture: "" },
  {
    id: "unit",
    shortcutText: "R",
    desc: "units",
    texture: "sword1",
  },
];

effect(() => {
  console.log("UPGRADE_V2 effect");
});
