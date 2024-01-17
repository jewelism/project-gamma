import { removeAlphabets } from "@/phaser/utils";

export const getAttackDamageGradeById = (id: string) => {
  return removeAlphabets(id).split("_").map(Number);
};
function createAttackDamage(id: string, shortcutText: string) {
  const [gradeStart, gradeEnd] = getAttackDamageGradeById(id);
  const cost = gradeStart * 10;
  return {
    [id]: {
      value: 1,
      max: 20,
      cost,
      get desc() {
        return `(${cost}G) increase grade${gradeStart}~${gradeEnd} attack damage (+grade★)`;
      },
      shortcutText,
      spriteKey: "sword1",
    },
  };
}
function createAddSoldier(id: string, shortcutText: string) {
  const [gradeStart, gradeEnd] = getAttackDamageGradeById(id);
  const cost = gradeStart * 10;
  return {
    [id]: {
      value: 1,
      max: 10,
      cost,
      get desc() {
        return `(${cost}G) add ${gradeStart}~${gradeEnd}★ attacker`;
      },
      shortcutText,
      spriteKey: "sword1",
    },
  };
}
export const UPGRADE = {
  ...createAttackDamage("attackDamage1_3", "Q"),
  ...createAttackDamage("attackDamage4_6", "W"),
  ...createAttackDamage("attackDamage7_9", "E"),
  ...createAddSoldier("addSoldier1_3", "A"),
  ...createAddSoldier("addSoldier4_6", "S"),
  ...createAddSoldier("addSoldier7_9", "D"),
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
