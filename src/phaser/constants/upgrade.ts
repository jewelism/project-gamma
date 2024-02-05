import { removeAlphabets, removeExceptAlphabets } from "@/phaser/utils";
import { effect, signal } from "@preact/signals-core";

export const getSoldierGradeById = (id: string): number[] => {
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
  const [gradeStart, gradeEnd] = getSoldierGradeById(id);
  const cost = gradeStart * 10;
  return {
    [id]: {
      current: signal(1),
      max: 20,
      cost,
      get desc() {
        return `(${cost}G) ★${gradeStart}~★${gradeEnd} attack damage (+grade★)`;
      },
      shortcutText,
      spriteKey: "sword1",
    },
  };
}
function createAddSoldier(id: string, shortcutText: string) {
  const [gradeStart, gradeEnd] = getSoldierGradeById(id);
  const cost = gradeStart * 20;
  return {
    [id]: {
      cost,
      get desc() {
        return `(${cost}G) add ★${gradeStart}~★${gradeEnd}`;
      },
      shortcutText,
      spriteKey: "sword1",
    },
  };
}
export const UPGRADE_V2 = {
  addSoldier: {
    ...createAddSoldier("addSoldier1_6", "Q"),
    ...createAddSoldier("addSoldier7_12", "W"),
    ...createAddSoldier("addSoldier13_18", "E"),
  },
  attackDamage: {
    ...createAttackDamage("attackDamage1_3", "A"),
    ...createAttackDamage("attackDamage4_6", "S"),
    ...createAttackDamage("attackDamage7_9", "D"),
  },
  util: {
    income: {
      current: signal(1),
      max: 50,
      cost: 0,
      time: 120,
      get desc() {
        return `(10%G, ${this.time}sec) increase income +0.5%`;
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
        return `(${this.cost}G, ${this.time}sec) upgrade bunker +10HP +1Regen`;
      },
      shortcutText: "Z",
      spriteKey: "defence1",
    },
  },
};

effect(() => {
  console.log("UPGRADE_V2 effect");
});
