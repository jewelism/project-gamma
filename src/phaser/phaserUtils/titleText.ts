import Phaser from "phaser";

export function createTitleText(scene: Phaser.Scene, text: string, y?: number) {
  const title = scene.add.rectangle(0, 0, 400, 200).setOrigin(0.5, 0.5);
  Phaser.Display.Align.In.TopCenter(
    title,
    scene.add.zone(0, 0, scene.scale.width, scene.scale.height).setOrigin(0, 0)
  );
  scene.add
    .text(title.x, y ? y : title.y + 100, text, {
      fontSize: "32px",
      color: "#fff",
      align: "center",
    })
    .setOrigin(0.5, 0.5);
  return title;
}
