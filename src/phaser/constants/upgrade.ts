import { removeAlphabets, removeExceptAlphabets } from "@/phaser/utils";
import { computed, signal } from "@preact/signals-core";

export const getUnitGradeById = (id: string): number[] => {
  return removeAlphabets(id).split("_").map(Number);
};
export const getUpgradeTabName = (id: string) => {
  if (Object.keys(UPGRADE_V2.util).includes(id)) {
    return "util";
  }
  return removeExceptAlphabets(id);
};
function createAttackDamage(id: string) {
  const [gradeStart, gradeEnd] = getUnitGradeById(id);
  const cost = signal(gradeStart ** 4 + gradeStart * 20);
  return {
    [id]: {
      current: signal(0),
      max: 20,
      cost,
      get desc() {
        return computed(() => `(${cost.value}G) ★${gradeStart}~${gradeEnd}`);
      },
      spriteKey: "sword1",
    },
  };
}
function createAddUnit(id: string) {
  // function createAddUnit(id: string, shortcutText: string) {
  const [gradeStart, gradeEnd] = getUnitGradeById(id);
  const cost = signal(gradeStart ** 4 + gradeStart * 20);
  return {
    [id]: {
      cost,
      get desc() {
        if (gradeEnd) {
          return computed(() => `(${cost.value}G) ★${gradeStart}~★${gradeEnd}`);
        }
        return computed(() => `(${cost.value}G) ★${gradeStart}`);
      },
      // shortcutText,
      spriteKey: "sword1",
    },
  };
}
const addUnit = Array.from({ length: 15 }, (_, i) => `addUnit${i + 1}`).reduce(
  (acc, key) => {
    return { ...acc, ...createAddUnit(key) };
  },
  {}
);
const attackDamage = Array.from(
  { length: 5 },
  (_, i) => `attackDamage${i + 1}_${(i + 1) * 3}`
).reduce((acc, key) => {
  return { ...acc, ...createAttackDamage(key) };
}, {});

export const UPGRADE_V2 = {
  addUnit,
  attackDamage,
  util: {
    // TODO: 보스만들기. 보스잡고 얻은 별로 할수있는거 만들기.
    // 게임 끝나고 메뉴에서 별도 보상 업그레이드?
    gamble: {
      current: signal(1),
      max: 100,
      get cost() {
        return computed(() => this.current * 50);
      },
      get rewardMin() {
        return computed(() => Math.round(this.cost / 20));
      },
      get rewardMax() {
        return computed(() => this.cost * 2);
      },
      get reward() {
        return computed(() =>
          Phaser.Math.Between(this.rewardMin, this.rewardMax)
        );
      },
      get time() {
        return computed(() => 1);
      },
      get desc() {
        return computed(
          () => `(${this.cost}G) (${this.rewardMin}~${this.rewardMax}G) gamble`
        );
      },
      shortcutText: "C",
      spriteKey: "sword1",
    },
    income: {
      current: signal(1),
      get percent() {
        return computed(() => this.current * 0.5);
      },
      get max() {
        return computed(() => 50);
      },
      costPercent: 10,
      get time() {
        return computed(() => 60);
      },
      get desc() {
        return computed(
          () =>
            `(${this.costPercent}%G, ${this.time}sec) income +0.5% (${this.percent}%)`
        );
      },
      shortcutText: "X",
      spriteKey: "book1",
    },
    upgradeBunker: {
      current: signal(1),
      max: 15,
      get cost() {
        return computed(() => this.current * 10);
      },
      get time() {
        return computed(() => (this.current.value / 10) * 5);
      },
      get desc() {
        return computed(
          () => `(${this.cost}G, ${this.time}sec) upgrade bunker`
        );
      },
      shortcutText: "Z",
      spriteKey: "defence1",
    },
    summonBoss: {
      current: signal(1),
      max: 100,
      get reward() {
        return computed(() => (this.current * 2) ** 2 + 1000);
      },
      get desc() {
        return computed(() => `(${this.reward}G) summon boss`);
      },
      get time() {
        return computed(() => 0.2);
      },
      shortcutText: "V",
      spriteKey: "boss1",
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
