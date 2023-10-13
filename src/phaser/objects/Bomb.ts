// not working

export class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, { x, y }) {
    super(scene, x, y, "explosion", 0);
    // this.anims.create({
    //   key: "bombing",
    //   frames: ,
    //   frameRate: 5,
    // });
    this.anims.create({
      key: "bombing",
      frames: scene.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 6,
      }),
      frameRate: 30,
    });
    this.setScale(0.75);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // scene.physics.world.enableBody(this);
    // scene.m_beamSound.play();
  }
  preUpdate() {
    this.anims.play("bombing");
  }
}
