import { UPGRADE_V2 } from "@/phaser/constants/upgrade";

export function setStorageData() {
  const attackSpeed = Number(localStorage.getItem("attackSpeed"));
  UPGRADE_V2.star.attackSpeed.current.value = attackSpeed;
}
