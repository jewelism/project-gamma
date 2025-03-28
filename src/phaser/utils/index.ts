export const convertSecondsToMinSec = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};
export function removeAlphabets(str) {
  return str.replace(/[a-zA-Z]/g, "");
}
export const removeExceptAlphabets = (str) => {
  return str.replace(/[^a-zA-Z]/g, "");
};
