import { Exit } from "@/phaser/objects/Exit";
import { Player } from "@/phaser/objects/Player";

export function createMap(scene: Phaser.Scene, { mapKey }: { mapKey: string }) {
  const map = scene.make.tilemap({
    key: mapKey,
  });
  const jew_pastel_lineTiles = map.addTilesetImage(
    "jew_pastel_line",
    "jew_pastel_line"
  );
  const collision_layer = map.createLayer("bg_collision", [
    jew_pastel_lineTiles,
  ]);
  collision_layer.setCollisionByExclusion([-1]);

  const playerSpawnPoints = map.findObject("PlayerSpawn", ({ name }) => {
    return name.includes("PlayerSpawn");
  });
  const exitPoint = map.findObject("Exit", ({ name }) => {
    return name === "Exit";
  });

  const exit = new Exit(scene, {
    x: exitPoint.x,
    y: exitPoint.y,
  });

  scene.cameras.main
    .setBounds(0, 0, map.heightInPixels, map.widthInPixels)
    .setZoom(2);

  return {
    map,
    jew_pastel_lineTiles,
    collision_layer,
    playerSpawnPoints,
    exit,
  };
}

export function createMap1to6(
  scene: Phaser.Scene,
  { mapKey, nextSceneKey }: { mapKey: string; nextSceneKey: string }
) {
  const {
    map,
    jew_pastel_lineTiles,
    collision_layer,
    playerSpawnPoints,
    exit,
  } = createMap(scene, { mapKey });

  const player = new Player(scene, {
    x: playerSpawnPoints.x,
    y: playerSpawnPoints.y,
  });

  scene.physics.add.collider(player, collision_layer);
  scene.physics.add.overlap(player, exit, () => {
    scene.scene.start(nextSceneKey);
  });

  return { map, jew_pastel_lineTiles, collision_layer, player, exit };
}

export function preloadBaseAssets(
  scene: Phaser.Scene,
  { mapName, path }: { mapName: string; path: string }
) {
  scene.load.tilemapTiledJSON(mapName, path);
  scene.load.image("jew_pastel_line", "assets/jew_pastel_line.png");
  scene.load.spritesheet("exit", "assets/jew_pastel_line.png", {
    frameWidth: 16,
    frameHeight: 16,
    startFrame: 51,
    endFrame: 51,
  });
  scene.load.spritesheet("player", "assets/Char2/Char2_idle_16px.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  scene.load.spritesheet("star", "assets/jew_pastel_item.png", {
    frameWidth: 16,
    frameHeight: 16,
    startFrame: 0,
    endFrame: 1,
  });
  scene.load.spritesheet("pixel_animals", "assets/pixel_animals.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
}
