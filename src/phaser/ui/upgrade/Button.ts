import { getUIStyle } from "@/phaser/constants";

export class Button extends Phaser.GameObjects.Container {
  constructor(
    scene: Phaser.Scene,
    { x, y, width, height, hoverText, onClick }
  ) {
    super(scene, x, y);
    const textPadding = 20;
    const buttonText = new Phaser.GameObjects.Text(
      scene,
      textPadding / 2,
      textPadding / 2 / 2,
      hoverText,
      {
        fontSize: "12px",
        color: "#ffffff",
        align: "center",
      }
    ).setOrigin(0);
    const textWrap = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      buttonText.displayWidth + textPadding,
      buttonText.displayHeight + textPadding / 2
    )
      .setFillStyle(0x0000ff, 0.5)
      .setOrigin(0);
    const textContainer = scene.add
      .container(-150, -50, [textWrap, buttonText])
      .setVisible(false);

    // const sprite = scene.add.sprite(100, 100, 'village').setInteractive()
    // sprite.setOrigin(0, 0).setScale(0.1)

    // sprite.on('pointerover', () => {
    //     // Some options, you could add position, stylings etc
    //     const tooltip = { text: 'This is a nice village sdfsdfasdfasdfasdfasdf' }

    //     const tooltipX = sprite.getRightCenter().x - 20
    //     const tooltipY = sprite.y - 20
    //     const textPadding = 20

    //     const text = this.add.text(textPadding, textPadding, tooltip.text, { color: '#000' })
    //     const background = this.add.rectangle(0, 0, text.displayWidth + (textPadding * 2), text.displayHeight + (textPadding * 2), 0xffffff).setOrigin(0, 0)
    //     this.tooltipContainer = this.add.container(tooltipX, tooltipY)
    //     this.tooltipContainer.add(background)
    //     this.tooltipContainer.add(text)
    // })

    const button = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height)
      .setStrokeStyle(2, 0x0000ff, 1)
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerdown", () => {
        button.setAlpha(0.2);
        onClick();
      })
      .on("pointerup", () => {
        button.setAlpha(1);
      })
      .on("pointerover", () => {
        textContainer.setVisible(true);
      })
      .on("pointerout", () => {
        textContainer.setVisible(false);
      });

    this.add([button, textContainer]);
    scene.add.existing(this);
  }
}
