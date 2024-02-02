export class UIAssetLoader {
  load: Phaser.Loader.LoaderPlugin;
  constructor(load) {
    this.load = load;
  }
  preload() {
    this.load.spritesheet("sword1", "assets/ui/upgrade_icon32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
    });
    this.load.spritesheet("defence1", "assets/ui/upgrade_icon32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 3,
    });
    this.load.spritesheet("book1", "assets/ui/upgrade_icon32x32.png", {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 6,
    });
    this.load.spritesheet("star", "assets/jew_pastel_item.png", {
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 1,
    });
    this.load.spritesheet(
      "goldBar",
      "assets/Stones_ores_gems_without_grass_x16.png",
      {
        frameWidth: 16,
        frameHeight: 16,
        startFrame: 27,
      }
    );
  }
}
