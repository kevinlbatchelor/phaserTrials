import Scene from "./scene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    pixelArt: false,
    backgroundColor: "#1d212d",
    scene: Scene,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1000 }
        }
    }
};

const game = new Phaser.Game(config);
