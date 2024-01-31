import scene0 from "./scenes/scene0.js"

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 600},
            debug: false,
        }
    },
    scene: [scene0]
}

new Phaser.Game(config)