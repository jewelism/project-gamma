import { removeAlphabets } from "@/phaser/utils";

export const getSoldierGradeById = (id: string): number[] => {
  return removeAlphabets(id).split("_").map(Number);
};
function createAttackDamage(id: string, shortcutText: string) {
  const [gradeStart, gradeEnd] = getSoldierGradeById(id);
  const cost = gradeStart * 10;
  return {
    [id]: {
      value: 1,
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
      value: 1,
      cost,
      get desc() {
        return `(${cost}G) add ★${gradeStart}~★${gradeEnd}`;
      },
      shortcutText,
      spriteKey: "sword1",
    },
  };
}
export const UPGRADE = {
  ...createAddSoldier("addSoldier13_18", "E"),
  ...createAddSoldier("addSoldier7_12", "W"),
  ...createAddSoldier("addSoldier1_6", "Q"),
  ...createAttackDamage("attackDamage7_9", "D"),
  ...createAttackDamage("attackDamage4_6", "S"),
  ...createAttackDamage("attackDamage1_3", "A"),
  summonBoss: {
    value: 1,
    max: 15,
    get desc() {
      return `summon boss`;
    },
    shortcutText: "C",
    spriteKey: "defence1",
  },
  income: {
    value: 1,
    max: 10,
    cost: 0,
    time: 120,
    get desc() {
      return `(10%, ${this.time}sec) increase income +0.5%`;
    },
    shortcutText: "X",
    spriteKey: "book1",
  },
  upgradeBunker: {
    value: 1,
    max: 15,
    cost: 100,
    time: 120,
    get desc() {
      return `(${this.cost}G, ${this.time}sec) upgrade bunker +10HP`;
    },
    shortcutText: "Z",
    spriteKey: "defence1",
  },
  // attackSpeed: {
  //   value: 1,
  //   max: 10,
  //   cost: 10,
  //   get desc() {
  //     return `(${this.cost}G) increase attack speed 1%`;
  //   },
  //   shortcutText: "S",
  //   spriteKey: "sword1",
  // },
};
