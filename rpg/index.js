import sceneTwo from './sceneTwo.js'
import sceneOne from './sceneOne.js'

window.onload = function () {
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scene: [sceneOne, sceneTwo]
    };

     new Phaser.Game(config);
    window.focus();
};